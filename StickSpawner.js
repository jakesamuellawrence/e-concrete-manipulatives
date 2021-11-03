import { CylinderGeometry, Euler, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Vector3 } from "three";

export class StickSpawner {
    position;
    stickParameters = {
        color: 0xffff00,
        radius: 0.1,
        height: 2,
        radialSegments: 64,
        defaultRotation: new Vector3(Math.PI/2, 0, 0),
    }
    #scene;
    
    /**
     * Constructs a new spawner
     * 
     * @param {Scene} scene The scene to add the newly constructed sticks to
     */
    constructor(scene, position=new Vector3(0, 0, 0)) {
        this.#scene = scene;
        this.position = position;
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
        let mat = new MeshPhongMaterial({color: this.stickParameters.color});
        let stick = new Mesh(geo, mat);
        stick.position.set(this.position.x, this.position.y, this.position.z);
        stick.setRotationFromEuler(new Euler(
            this.stickParameters.defaultRotation.x,
            this.stickParameters.defaultRotation.y, 
            this.stickParameters.defaultRotation.z
        ));
        this.#scene.add(stick);
        return stick;
    }
}