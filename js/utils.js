import * as THREE from 'three';
import { Object3D } from 'three';
import darkShrubTexture from "../resources/images/bg_shrub_dark.svg";

/**
 * Constructs a link to preserve settings
 * 
 * @param {string} objectColour The hex string representing the set colour
 */
export function constructLink(objectColour){
    alert("Use this URL to keep your settings:\n" + window.location.origin + "?c=" +objectColour.replace("#",''));
}

export function setup(scene, camera, renderer){
    renderer.setClearColor("#97E4D8", 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(20, 10, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
    light.position.set(20, 10, 10);
    light.target.position.set(0, 0, 0);
    light.lookAt(light.target.position);
    scene.add(light);
    scene.add(light.target);

    const planeSize = 3;
    const textureLoader = new THREE.TextureLoader();
    //texture.wrapS = THREE.RepeatWrapping;
    //texture.wrapT = THREE.RepeatWrapping;
    //const repeats = planeSize / 2;
    //texture.repeat.set(repeats, repeats);

    //const planeGeo = new THREE.PlaneGeometry(4, 2.5);
    const planeGeo = new THREE.CircleGeometry(2.5, 64); //radius, segments. more segments give a cleaner curve but theoretically worse performance
    const planeMat = new THREE.MeshBasicMaterial({color: 0x26A44C});
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotation.x = -Math.PI / 2;
    ground.rotation.z = -Math.PI * 1.14;
    ground.position.x = 1.25;
    ground.position.z = ground.position.x/2; //This is because camera position is also a 2:1 ratio
    ground.userData.draggable = false;
    ground.userData.tableTop = true;
    scene.add(ground);
    

    const darkBushMap = textureLoader.load(darkShrubTexture);
    const darkShrubMaterial = new THREE.SpriteMaterial( { map: darkBushMap } );

    const bushSprite1 = new THREE.Sprite(darkShrubMaterial);
    bushSprite1.center.set(0.5,0)
    bushSprite1.scale.set(0.6,0.5,0.6);
    bushSprite1.position.set(-1.6,-0.25,0);
    scene.add(bushSprite1);

    const bushSprite2 = new THREE.Sprite(darkShrubMaterial);
    bushSprite2.center.set(0.5,0)
    bushSprite2.scale.set(0.6,0.5,0.6);
    bushSprite2.position.set(-0.6,-0.08,-1.2);
    scene.add(bushSprite2);

}

/**
 * Follows the trail of parents until it finds the largest non-scene
 * group that the given object is a child of
 * 
 * @param {Object3D} object the object to find the group of
 * @returns the largest non-scene object that the given object is a child of
 */
 export function getLargestGroup(object) {
    if (object == null) return null;
    while (object.parent != null &&
           (object.parent.type == "Object3D" ||
            object.parent.type == "Group")) {
        object = object.parent;
    }
    return object
};

/**
 * Sets the highlight colour of all the children of the given object
 */
export function setEmissiveAllChildren(root, value) {
    if (root.material != null && root.material.emissive != null) {
        root.material.emissive.set(value);
    }
    if (root.children) {
        for (let child of root.children) {
            setEmissiveAllChildren(child, value);
        }
    }
}

//Functions below this line are for dev/debug, and should not be required in production

export function changeDimension(dimension, amount, camera, console){
    if (dimension == "x"){
        camera.position.setX(camera.position.x + amount);
        console.log('x: %d',camera.position.x);
    }else if (dimension == "y"){
        camera.position.setY(camera.position.y + amount);
        console.log('y: %d',camera.position.y);
    }else if (dimension == "z"){
        camera.position.setZ(camera.position.z + amount);
        console.log('z: %d',camera.position.z);
    }
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
}

export function removeObjects(object, scene, draggableList){
    if (object.children.length > 0){
        for (let child of object.children) {
          removeObjects(child, scene, draggableList);
        }
    }else {
        draggableList.splice(draggableList.indexOf(object), 1);
      }
}
