import { CylinderGeometry, Euler, Mesh, MeshLambertMaterial, Vector3 } from "three";

export class StickSpawner {
    position;
    stickParameters = {
        color: 0xffff00,
        radius: 0.03,
        height: 0.4,
        radialSegments: 64,
        defaultRotation: new Vector3(Math.PI/2, 0, 0),
    }
    #scene;
    
    /**
     * Constructs a new spawner
     * 
     * @param {Scene} scene The scene to add the newly constructed sticks to
     */
    constructor(scene, position=new Vector3(0, 0, 0), color) {
        this.#scene = scene;
        this.position = position;
        this.stickParameters.color = color;
    }

    /**
     * spawns a stick at the spawner's current position and adds it to the registered scene
     * 
     * @returns {Mesh} the created stick
     */
    spawn() {
        let geo = new CylinderGeometry(
            this.stickParameters.radius, this.stickParameters.radius, this.stickParameters.height, this.stickParameters.radialSegments
        );
        let mat = new MeshLambertMaterial({color: this.stickParameters.color});
        let stick = new Mesh(geo, mat);
        stick.position.set(this.position.x, this.position.y, this.position.z);
        stick.setRotationFromEuler(new Euler(
            this.stickParameters.defaultRotation.x,
            this.stickParameters.defaultRotation.y, 
            this.stickParameters.defaultRotation.z
        ));
        stick.userData.draggable = true;
        this.#scene.add(stick);
        return stick;
    }
}