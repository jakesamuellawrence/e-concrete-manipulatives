import { Camera, InstancedInterleavedBuffer, Object3D, Plane, Raycaster, RectAreaLight, Vector2, Vector3 } from "three";
import {getLargestGroup} from "./Utils";

/**
 * Allows any specified objects to be dragged around relative to a provided plane
 */
export class RelativeDragControls {

    #draggables;
    #movementPlane;
    #camera;
    #domElement;
    #hoveredObject = null;
    #heldObject = null;
    #holdOffset = new Vector3();
    #mouseIsDown = false;
    #holdTime = 50;

    #boundMouseEvents = {
        move: null,
        down: null,
        up: null,
    };

    /**
     * @param {Object3D[]} draggables the list of objects that can be dragged
     * @param {Camera} camera the camera used to cast rays from in order to detect objects
     * @param {Plane} movementPlane the {@link Plane} that dragging movement should be done along
     * @param {HTMLCanvasElement} domElement the dom element of the renderer
     */
    constructor(draggables, camera, movementPlane, domElement) {
        this.#draggables = draggables;
        this.#camera = camera;
        this.#movementPlane = movementPlane;
        this.#domElement = domElement;
        this.activate();
    }

    /**
     * Activates the events for mouse movement and clicking
     */
    activate() {
        // .bind(this) allows the functions to have the right context when called by the event
        // It creates a new instance of the function, so needs to be stored in order to un-add those events
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

    /**
     * Sets the plane that movement should be relative to
     * 
     * @param {Plane} plane the plane that movement should be relative to
     */
    dragRelativeTo(plane) {
        this.#movementPlane = plane;
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
     * If an object is being held, raycast from the mouse position to the 
     * movement plane in order to determine the new position for the held object
     * 
     * If an no object is being held, raycast to see if any of the objects in draggables
     * are under the mouse. If so, hover them. Otherwise, unhover whatever is currently
     * hovered, if anything.
     * 
     * Called whenever the mouse moves
     */
    #onMouseMove(event){
        const mousePos = this.#getRelativeMousePosition(event);

        const raycaster = new Raycaster();
        raycaster.setFromCamera(mousePos, this.#camera);
        
        if (this.#heldObject) {
            const intersection = new Vector3();
            raycaster.ray.intersectPlane(this.#movementPlane, intersection);
            this.#heldObject.position.copy(intersection.add(this.#holdOffset));
            this.onDragUpdate(this.#heldObject);
        } else {
            const intersections = raycaster.intersectObjects(this.#draggables);
            let intersectedObject = null;
            if (intersections.length != 0) intersectedObject = getLargestGroup(intersections[0].object)

            if (intersectedObject && intersectedObject != this.#hoveredObject) {
                if (this.#hoveredObject != null) {
                    this.onUnhover(this.#hoveredObject);
                }
                this.#hoveredObject = intersectedObject;
                this.onHover(this.#hoveredObject);
            } else if (this.#hoveredObject && intersectedObject == null) {
                this.onUnhover(this.#hoveredObject);
                this.#hoveredObject = null;
            }
        }
    }

    /**
     * Start a timer and once that timer has finished check if the
     * mouse is still held. If so:
     * 
     * If an object is currently hovered, hold it.
     * Calcualte the vector between the centre of the object and 
     * the mouse position on the object so that this offset can be 
     * maintained when dragging. 
     * 
     * Called whenver any pointer device is pressed
     */
    #onMouseDown(event){
        this.#mouseIsDown = true;
        if (this.#hoveredObject) {
            setTimeout(function() {
                if (this.#hoveredObject && this.#mouseIsDown) {
                    const mousePos = this.#getRelativeMousePosition(event);
                    const raycaster = new Raycaster();
                    raycaster.setFromCamera(mousePos, this.#camera);
                    const intersection = new Vector3();
                    raycaster.ray.intersectPlane(this.#movementPlane, intersection);
                    this.#holdOffset = this.#hoveredObject.position.clone().sub(intersection);
                    this.#heldObject = this.#hoveredObject;
                    this.onDragStart(this.#heldObject);
                }
            }.bind(this),
            this.#holdTime);
        }
    }

    /**
     * Record that the mouse was unpressed
     * 
     * If an object is currently being held, stop holding it.
     * 
     * Called whenever any pointer device is released
     */
    #onMouseUp(event){
        this.#mouseIsDown = false;
        if (this.#heldObject) {
            this.onDragEnd(this.#heldObject);
            this.#heldObject = null;
        }
    }

    /**
     * Called when the pointer is moved over a draggable object
     * 
     * @param {Object3D} object 
     */
    onHover(object){}

    /**
     * Called when the pointer moves off of a draggable object
     * 
     * @param {Object3D} object 
     */
    onUnhover(object){}

    /**
     * Called when an object starts being dragged
     * 
     * @param {Object3D} object
     */
    onDragStart(object){}

    /**
     * Called for every pointermove event while an object is being dragged
     * 
     * @param {Object3D} object 
     */
    onDragUpdate(object){}

    /**
     * Called when an object is released
     * 
     * @param {Object3D} object 
     */
    onDragEnd(object){}

}