import * as Converter from "number-to-words"
import * as Utils from "./utils";
import * as BundleUtils from "./BundleUtils";
import { Camera, Color, Object3D, Scene, WebGLRenderer } from "three";
import { EffectComposer } from "three-outlinepass";
import { RelativeDragControls } from "./RelativeDragControls";
import { SelectionControls } from "./SelectionControls";
import { StickSpawner } from "./StickSpawner";

/**
 * Class that represents the app context.
 * Holds global state variables needed by most logic of the program
 * Has simple helper functions for updating displays and spawning sticks
 */
export class App {
    /** @type {Scene} */
    scene;
    /** @type {Camera} */
    camera;
    /** @type {WebGLRenderer} */
    renderer;
    /** @type {ShaderPass} */
    shaderPass;
    /** @type {EffectComposer} */
    effectComposer;
    /** @type {Array<Object3D>} */
    sticksInScene = [];
    /** @type {RelativeDragControls} */
    dragControls;
    /** @type {SelectionControls} */
    selectControls;
    /** @type {StickSpawner} */
    stickSpawner;
    /** @type {Number} */
    sticksInABundle;
    /** @type {Color} */
    stickColour;

    /**
     * updates the value of SticksInABundle and updates the relevant display if a browser context exists
     * @param {number} value 
     */
    setSticksInABundle(value) {
        this.sticksInABundle = value;
        if (document) {
            document.getElementById("sticksInABundle").innerText = Converter.toWords(this.sticksInABundle);
        }
    }

    /**
     * sets the stickColour parameter and updates the stickSpawner's colour parameter
     * Also updates the stick colour display if a browser context exists
     * @param {Color} colour 
     */
    setStickColour(colour) {
        this.stickColour = colour;
        this.stickSpawner.stickParameters.colour = colour;
        if (document) {
            document.getElementById("colourPicker").value = this.stickColour;
        }
    }

    /**
     * Resizes render and postprocessing contexts to match the current window size
     * Also reduces the pixel ratio if the screen is high-resolution to prevent slowdown
     */
    resizeCanvas() {
        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;

        let pixelRatio = window.devicePixelRatio;
        if (screen.width * window.devicePixelRatio >= 2000
            || screen.height * window.devicePixelRatio >= 2000) {
            pixelRatio = pixelRatio * 0.5;
        }

        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(canvasWidth, canvasHeight);
        this.effectComposer.setPixelRatio(pixelRatio);
        this.effectComposer.setSize(canvasWidth, canvasHeight);
        this.shaderPass.uniforms["resolution"].value.x = 1 / (canvasWidth * pixelRatio);
        this.shaderPass.uniforms["resolution"].value.y = 1 / (canvasHeight * pixelRatio);
    }

    /**
     * creates a stick and then moves the stickSpawner to it's next position
     * @returns {Object3D} the created stick
     */
    spawnStick() {
        const stick = this.stickSpawner.spawn();
        this.sticksInScene.push(stick);
        stick.order = 0;
        stick.radius = this.stickSpawner.stickParameters.radius;

        if (this.stickSpawner.position.x > 2) {
            this.stickSpawner.position.setX(-1);
            this.stickSpawner.position.setZ(this.stickSpawner.position.z - 0.5);
        } else {
            this.stickSpawner.position.setX(this.stickSpawner.position.x + 0.2);
        }
        return stick;
    }

    /**
     * Spawns n sticks
     * Calls {@link spawnStick} n times
     * 
     * @param {number} n 
     * @returns {Array<Object3D>} a list of all the sticks that have been created
     */
    spawnSticks(n) {
        let sticks = []
        for (let i = 0; i < n; i++) {
            sticks.push(this.spawnStick());
        }
        return sticks;
    }

    /**
     * Increments sticksInABundle by 1, clamping it within the range 2-12 and
     * updates the sticksInABundle display
     */
    increaseSticksInABundle() {
        this.sticksInABundle = Math.min(this.sticksInABundle+1, 12);
    }

    /**
     * Decrements sticksInABundle by 1, clamping it within the range 2-12,
     * and updates the sticks in a bundle display
     */
    decreaseSticksInABundle() {
        this.sticksInABundle = Math.max(this.sticksInABundle-1, 2);
    }

    unbundleExistingBundles() {
        let toUnbundle = [];
        for (let stick of this.sticksInScene) {
            let biggestGroup = Utils.getLargestGroup(stick);
            if (biggestGroup != stick && !toUnbundle.includes(biggestGroup)) {
                toUnbundle.push(biggestGroup);
            }
        }
        console.log(toUnbundle);
        BundleUtils.unbundleSticks(this, toUnbundle);
    }

    areThereBundles() {
        for(let stick of this.sticksInScene) {
            if (Utils.getLargestGroup(stick).type == "Group") {
                return true;
            }
        }
        return false;
    }

    /**
     * Updates the UI display of how many sticks are in a bundle
     * hides / displays the plus or minus button
     */
    updateSticksInBundleDisplay() {
        document.getElementById("sticksInABundle").innerText = Converter.toWords(this.sticksInABundle);
        
        if (this.sticksInABundle ==  12) {
            document.getElementById("moreSticksInABundle").style.display = "none";
        } else {
            document.getElementById("moreSticksInABundle").style.display = "block";
        }

        if (this.sticksInABundle == 2) {
            document.getElementById("fewerSticksInABundle").style.display = "none";
        } else {
            document.getElementById("fewerSticksInABundle").style.display = "block";
        }
    }

    /**
     * Updates the display of the sticks in the scene to match how many sticks currently exist
     */
    updateSticksInTotal() {
        if(this.sticksInScene.length == 1){
            document.getElementById("areInTotal").innerText = "There is";
            document.getElementById("sticksInTotal").innerText = "stick in total";
        }else{
            document.getElementById("areInTotal").innerText = "There are";
            document.getElementById("sticksInTotal").innerText = "sticks in total";
        }
        document.getElementById("numberInTotal").innerText = Converter.toWords(this.sticksInScene.length);
    }

    /**
     * Shows or hides the remove, bundle, and unbundle buttons depending
     * on what's currently selected
     */
    showOrHideButtons() {
        if (this.selectControls.currentlySelected.length == 0) {
            document.getElementById("removeButton").style.display = "none";
            document.getElementById("bundleButton").style.display = "none";
        } else {
            document.getElementById("bundleButton").style.display = "block";
            document.getElementById("removeButton").style.display = "block";
        }

        if (this.selectControls.currentlySelected.some((element) => element.type == "Group")) {
            document.getElementById("unbundleButton").style.display = "block";
        } else {
            document.getElementById("unbundleButton").style.display = "none";
        }
    }
}