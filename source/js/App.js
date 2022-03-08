import * as Converter from "number-to-words"
import { Vector3 } from "three";
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
    /** @type {Array<Vector3>} */
    stickPositions = this.possibleStickPositions(45);
    /** @type {Array<Number>} */
    positionsTaken = this.defaultSticks(this.stickPositions.length);


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

        for (let i=0; i < this.positionsTaken.length; i++){
            if (this.positionsTaken[i] == 0) {
                this.stickSpawner.position.setX(this.stickPositions[i].x);
                this.stickSpawner.position.setY(this.stickPositions[i].y);
                this.stickSpawner.position.setZ(this.stickPositions[i].z);
                this.positionsTaken[i] = 1;
                break;
            }
        }
        return stick;
    }

    /** 
     * 
     * @param {number} n 
     * @returns {Array<Object3D>}
    */
    possibleStickPositions(n) {
        let arrayOfPositions = [];
        let currentPos = new Vector3(-0.4, 0.3, 0.7);
        let rows = 0;

        for (let i = 0; i < n; i++) {
            if (currentPos.x > 2.4) {
                currentPos.setX(currentPos.x - 2.8 + (rows*4)/100);
                currentPos.setZ(currentPos.z - 1.04 + (rows*8)/100);
                rows = rows + 1;
            }
            else if(rows == 2 && currentPos.x > 1.4 && currentPos.z > 0.1) {
                currentPos.setX(currentPos.x - 2.8 + (rows*10)/10);
                currentPos.setZ(currentPos.z - 1.04 + (rows*20)/100);
                rows = rows + 1;
            }
            else {
                currentPos.setX(currentPos.x + 0.2);
                currentPos.setZ(currentPos.z + 0.04);
            }
            arrayOfPositions.push(new Vector3(currentPos.x, currentPos.y, currentPos.z));
            console.log(rows);
            console.log(arrayOfPositions[i]);
        }
        return arrayOfPositions;
    }

    /**
     * 
     * @param {number} n 
     */
    defaultSticks(n) {
        console.log(n);
        let posTaken = [];
        posTaken.length = n;
        posTaken.fill(0);
        return posTaken;
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