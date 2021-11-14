import { RectAreaLight } from "three";

export class RelativeDragControls {

    draggables;
    dragPlane;
    camera;
    #domElement;
    #hoveredObject = null;
    #heldObject = null;

    #boundMouseEvents = {
        move: null,
        down: null,
        up: null,
    };

    constructor(draggables, camera, dragPlane, domElement) {
        this.draggables = draggables;
        this.camera = camera;
        this.dragPlane = dragPlane;
        this.#domElement = domElement;
        this.activate();
    }

    /**
     * Activates the events for mouse movement and clicking
     */
    activate() {
        this.#domElement.addEventListener('pointermove', this.#boundMouseEvents.move = this.#onMouseMove.bind(this));
        this.#domElement.addEventListener('pointerup', this.#boundMouseEvents.up = this.#onMouseUp.bind(this));
        this.#domElement.addEventListener('pointerdown', this.#boundMouseEvents.down = this.#onMouseDown.bind(this));
    }

    /**
     * Deactivates the events for mouse movement and clicking
     */
    deactivate() {
        this.#domElement.removeEventListener('pointermove', this.#boundMouseEvents.move);
        this.#domElement.removeEventListener('pointerdown', this.#boundMouseEvents.down);
        this.#domElement.removeEventListener('pointerup', this.#boundMouseEvents.up);
    }

    dragRelativeTo(plane) {
        this.dragPlane = plane;
    }

    #onMouseMove(event){
        const rendererRect = this.#domElement.getBoundingClientRect();
        let pointerRelativeX = (event.clientX - rendererRect.left) / rendererRect.width * 2 - 1;
        let pointerRelativeY = (event.clientY - rendererRect.top) / rendererRect.height * 2 - 1;
        console.log(pointerRelativeX + ", " + pointerRelativeY);
    }

    #onMouseDown(event){
        console.log("mouse down!");
    }
    #onMouseUp(event){
        console.log("mouse up!");
    }

}