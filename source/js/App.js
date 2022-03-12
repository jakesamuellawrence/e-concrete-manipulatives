import * as Converter from "number-to-words"
import * as BundleUtils from "./BundleUtils";
import * as Utils from "./Utils";
import { Vector3 } from "three";
import { Camera, Color, Object3D, Scene, WebGLRenderer } from "three";
import { EffectComposer } from "three-outlinepass";
import { RelativeDragControls } from "./RelativeDragControls";
import { SelectionControls } from "./SelectionControls";
import { StickSpawner } from "./StickSpawner";
import { Box3 } from "three";

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
    /** @type {Array<Vector3>} */
    possibleStickPositions = this.calculatePossibleStickPositions(45);


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
     * Spawns a stick into the scene and returns it
     * 
     * Checks all the stick spawn locations in possibleStickPositions to see if there's space spawn it.
     * If there isn't space at any location, spawns the stick at a random one
     * @returns {Object3D} the created stick
     */
    spawnStick() {
        // Create stick
        const stick = this.stickSpawner.spawn();
        this.sticksInScene.push(stick);
        stick.order = 0;
        stick.radius = this.stickSpawner.stickParameters.radius;
        
        // Check positions to see if there's space for it
        let foundPos = true; 
        for (let positionToCheck of this.possibleStickPositions) {
            foundPos = true; // assume the stick is in the right place unless proven otherwise
            stick.position.copy(positionToCheck);
            let toSpawnBounds = new Box3().setFromObject(stick);

            for (let otherStick of this.sticksInScene) {
                let otherBounds = new Box3().setFromObject(otherStick);
                if (otherStick != stick && toSpawnBounds.intersectsBox(otherBounds)) {
                    foundPos = false;
                    break;
                }
            }

            if (foundPos) break;
        }

        // If no spawn position had space, pick a random one and add a small random offset
        if (!foundPos) {
            let position = Utils.randomElementFromArray(this.possibleStickPositions).clone();
            let offset = Utils.randomVector(0, 0.5).setY(0);
            stick.position.copy(position.add(offset));
        }

        return stick;
    }

    /** 
     * Sets up the list of potential stick spawn locations and returns it
     * 
     * @param {number} n the number of locations to generate
     * @returns {Array<Object3D>} the generated list
    */
    calculatePossibleStickPositions(n) {
        let currentPos = new Vector3(-0.4, 0.3, 0.7);
        let arrayOfPositions = [];
        let rowCount = 1;

        for (let i = 0; i <= n; i++) {
            if (rowCount < 3 && currentPos.x > 2.4) {
                currentPos.setX(currentPos.x - 3 + (rowCount) * 0.2);
                currentPos.setZ(currentPos.z - 1.08 + (rowCount) * 0.04);
                rowCount = rowCount + 1;
            }
            else if (rowCount == 3 && currentPos.x > 1.4 && currentPos.z > 0.1) {
                currentPos.setX(0.2);
                currentPos.setZ(-0.62);
            }
            else {
                //this is the spacing b/w consecutive sticks
                currentPos.setX(currentPos.x + 0.2);
                //this is the slope
                currentPos.setZ(currentPos.z + 0.04);
            }
            arrayOfPositions[i] = new Vector3(currentPos.x, currentPos.y, currentPos.z);
            currentPos = arrayOfPositions[i].clone();
        }
        return arrayOfPositions;
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