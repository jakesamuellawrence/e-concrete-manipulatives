import { InstancedInterleavedBuffer, Plane, Raycaster, RectAreaLight, Vector2, Vector3 } from "three";

export class RelativeDragControls {

    #draggables;
    #movementPlane;
    #camera;
    #domElement;
    #hoveredObject = null;
    #heldObject = null;

    #boundMouseEvents = {
        move: null,
        down: null,
        up: null,
    };

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
     * @param plane the plane that movement should be relative to
     */
    dragRelativeTo(plane) {
        this.#movementPlane = plane;
    }

    #onMouseMove(event){
        const rendererRect = this.#domElement.getBoundingClientRect();
        const pointerRelativeX = (event.clientX - rendererRect.left) / rendererRect.width * 2 - 1;
        const pointerRelativeY = - (event.clientY - rendererRect.top) / rendererRect.height * 2 + 1;

        const raycaster = new Raycaster();
        raycaster.setFromCamera({x: pointerRelativeX, y:pointerRelativeY}, this.#camera);
        
        if (this.#heldObject) {
            const intersection = new Vector3();
            raycaster.ray.intersectPlane(this.#movementPlane, intersection);
            this.#heldObject.position.copy(intersection);
        } else {
            const intersections = raycaster.intersectObjects(this.#draggables);
            if (intersections[0]) {
                this.#hoveredObject = intersections[0].object;
            } else {
                this.#hoveredObject = null;
            }
        }
    }

    #onMouseDown(event){
        console.log("mouse down!");
        if (this.#hoveredObject) {
            this.#heldObject = this.#hoveredObject;
        }
    }
    #onMouseUp(event){
        console.log("mouse up!");
        this.#heldObject = null;
    }

}