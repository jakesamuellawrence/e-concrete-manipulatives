import './style.css'

import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cv1'),
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(100);
camera.position.setY(5);
camera.position.setX(100);
camera.setRotationFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), Math.PI/4)

const geometry = new THREE.BoxGeometry(10,10,10);
const material = new THREE.MeshBasicMaterial({color: 0xFF0066, wireframe: true});
const cube1 = new THREE.Mesh(geometry, material);

scene.add(cube1);

var goingUp = true;

function animate(){
  requestAnimationFrame(animate);

  if (cube1.position.y < 20 && goingUp){
    cube1.position.y += 0.2;
    cube1.position.z += 0.1;
  }else if (goingUp){
    goingUp = false;
  }else if (cube1.position.y >= 0.2){
    cube1.position.y -= 0.2;
    cube1.position.z -= 0.1;
  }else{
    goingUp = true;
  }

  cube1.rotation.y += 0.01;
  cube1.rotation.x += 0.01;

  document.getElementById("coords").innerHTML = "[" + cube1.position.x.toFixed(2) + ", " + cube1.position.y.toFixed(2) + ", " + cube1.position.z.toFixed(2) + "]";
  document.getElementById("rotation").innerHTML = cube1.rotation.y.toFixed(2);
  renderer.render(scene, camera);
}

function newColour(){
  cube1.material.color.set(Math.floor(Math.random()*16777215));
}

document.getElementById("colourButton").onclick = newColour;


animate();

//npm init vite
//cd into your project
//npm install
//npm install three



//npm run dev