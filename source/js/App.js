import * as Converter from "number-to-words"
import { Camera, Color, Object3D, Scene, WebGLRenderer } from "three";
import { EffectComposer } from "three-outlinepass";
import { RelativeDragControls } from "./RelativeDragControls";
import { SelectionControls } from "./SelectionControls";
import { StickSpawner } from "./StickSpawner";

/**
 * Made into class instead of simple JS object so that it plays nice with auto-complete
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

    setSticksInABundle(value) {
        this.sticksInABundle = value;
        if (document) {
            document.getElementById("sticksInABundle").innerText = Converter.toWords(this.sticksInABundle);
        }
    }

    setStickColour(colour) {
        this.stickColour = colour;
        this.stickSpawner.stickParameters.colour = colour;
        if (document) {
            document.getElementById("colourPicker").value = this.stickColour;
        }
    }

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

        this.updateSticksInTotal();
        return stick;
    }

    spawnSticks(n) {
        let sticks = []
        for (let i = 0; i < n; i++) {
            sticks.push(this.spawnStick());
        }
        return sticks;
    }

    moreSticksInABundle() {
        if (this.sticksInABundle == 2) {
            this.sticksInABundle += 1
            document.getElementById("fewerSticksInABundle").style.display = "block";
        } else if (this.sticksInABundle == 11) {
            this.sticksInABundle += 1;
            document.getElementById("moreSticksInABundle").style.display = "none";
        } else if (this.sticksInABundle < 11) {
            this.sticksInABundle += 1;
        }
        document.getElementById("sticksInABundle").innerText = Converter.toWords(this.sticksInABundle);
    }

    fewerSticksInABundle() {
        if (this.sticksInABundle == 12) {
            this.sticksInABundle -= 1
            document.getElementById("moreSticksInABundle").style.display = "block";
        } else if (this.sticksInABundle == 3) {
            this.sticksInABundle -= 1;
            document.getElementById("fewerSticksInABundle").style.display = "none";
        } else if (this.sticksInABundle > 3) {
            this.sticksInABundle -= 1;
        }
        document.getElementById("sticksInABundle").innerText = Converter.toWords(this.sticksInABundle);
    }

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
}