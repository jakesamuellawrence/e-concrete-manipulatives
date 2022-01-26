import * as THREE from 'three';
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
