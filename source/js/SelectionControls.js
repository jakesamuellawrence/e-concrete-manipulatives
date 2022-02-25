import { Raycaster } from "three";
import { Camera } from "three";
import { Object3D } from "three";
import { Vector3 } from "three";
import { getLargestGroup } from "./Utils";

export class SelectionControls {

    currentlySelected = [];

    #selectables;
    #domElement;
    #camera;
    #maxClickTime = 200;
    #mouseDownTime = 0;

    #boundMouseEvents = {
        down: null,
        up: null
    }

    /**
     * 
     * @param {Object3D[]} selectables the list of objects that can be selected and deselected
     * @param {Camera} camera camera used to cast rays in order to detect which object was clicked on
     * @param {HTMLCanvasElement} domElement the canvas element of the renderer
     */
    constructor(selectables, camera, domElement) {
        this.#selectables = selectables;
        this.#camera = camera
        this.#domElement = domElement;
        this.activate();
    }

    /**
     * Activates the events for mouse movement and clicking
     */
     activate() {
        this.#domElement.addEventListener('pointerup', this.#boundMouseEvents.up = this.#onMouseUp.bind(this));
        this.#domElement.addEventListener('pointerdown', this.#boundMouseEvents.down = this.#onMouseDown.bind(this));
    }

    /**
     * Deactivates the events for mouse movement and clicking
     */
    deactivate() {
        this.#domElement.removeEventListener('pointerdown', this.#boundMouseEvents.down);
        this.#domElement.removeEventListener('pointerup', this.#boundMouseEvents.up);
    }

    /**
     * gets the bounding box of the renderer and uses that to calculate the normalised
     * mouse coordinates, both in range [-1, 1] with (0, 0) being the centre of the renderer
     * 
     * @param event the event containing the raw mouse position
     * @returns an object with fields x and y corresponding to the x and y positions of the mouse
     */
    #getRelativeMousePosition(event) {
        const rendererRect = this.#domElement.getBoundingClientRect();
        const pointerRelativeX = (event.clientX - rendererRect.left) / rendererRect.width * 2 - 1;
        const pointerRelativeY = - (event.clientY - rendererRect.top) / rendererRect.height * 2 + 1;
        return {x: pointerRelativeX, y: pointerRelativeY};
    }

    /**
     * Set the time the mouse was pressed
     * 
     * called whenever the mouse is pressed
     */
    #onMouseDown(event) {
        this.#mouseDownTime = event.timeStamp;
    }

    /**
     * If the mouse was only pressed for a short amount of time,
     * cast a ray to detect what was clicked on. If it was a 
     * selectable object, get the largest bundle that object belongs
     * to and add it to the currently selected list, and call the
     * relevant callback.
     */
    #onMouseUp(event) {
        if (event.timeStamp - this.#mouseDownTime <= this.#maxClickTime) {
            const mousePos = this.#getRelativeMousePosition(event);
            const raycaster = new Raycaster();
            raycaster.setFromCamera(mousePos, this.#camera);

            const intersections = raycaster.intersectObjects(this.#selectables);
            let intersectedObject = null;
            if (intersections.length != 0) intersectedObject = getLargestGroup(intersections[0].object);

            if (intersectedObject) {
                let index = this.currentlySelected.indexOf(intersectedObject);
                if (index != -1) {
                    this.deselect(intersectedObject);
                }
                else {
                    this.select(intersectedObject);
                }
            }
        }
    }

    /**
     * Adds the object to the list of selected objects and calls the onSelect callback
     * 
     * @param {Object3D} object The object to be selected
     */
    select(object) {
        this.currentlySelected.push(object);
        this.onSelect(object);
    }

    /**
     * removes the object from the list of selected objects and calls the onDeselect callback
     * 
     * @param {Object3D} object The object to be deselected
     */
    deselect(object) {
        this.currentlySelected.splice(this.currentlySelected.indexOf(object), 1);
        this.onDeselect(object)
    }

    /**
     * Called when an unselected object is selected
     * 
     * @param {Object3D} object the object that's been selected
     */
    onSelect(object){}

    /**
     * Called when a selected object is unselected
     * 
     * @param {Object3D} object the object that's been unselected
     */
    onDeselect(object){}

}