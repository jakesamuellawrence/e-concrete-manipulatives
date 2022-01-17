import * as THREE from 'three';
import floorTextureURL from "../resources/images/grass_texture.png";

/**
     * Constructs a link to preserve settings
     * 
     * @param {string} objectColour The hex string representing the set colour
     */
export function constructLink(objectColour){
    return window.location.origin + "?c=" +objectColour.replace("#",'');
}

export function setup(scene, camera, renderer){
    renderer.setClearColor("#66aff5", 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(21, 12, 12);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
    light.position.set(0, 8, 4);
    light.target.position.set(0, 0, 0);
    light.lookAt(light.target.position);
    scene.add(light);
    scene.add(light.target);

    const planeSize = 400;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(floorTextureURL); 
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
    });
    const tableTop = new THREE.Mesh(planeGeo, planeMat);
    tableTop.rotation.x = -Math.PI / 2;
    tableTop.rotation.z = -Math.PI / 2;
    tableTop.userData.draggable = false;
    tableTop.userData.tableTop = true;
    scene.add(tableTop);
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