import './style.css';

import * as THREE from 'three';

import {
  DragControls
} from 'three/examples/jsm/controls/DragControls.js';

import {StickSpawner} from './StickSpawner';
import { Plane, PlaneBufferGeometry, Vector3 } from 'three';
import { RelativeDragControls } from './RelativeDragControls';


//setup
var baseURL = window.location.origin;

var cubeColour = "#964B00";
var colourPicker;

function colourUpdate(event){
  cubeColour = event.target.value;
  stickSpawner.stickParameters.color = cubeColour;
}

colourPicker = document.querySelector("#colourPicker");
colourPicker.addEventListener("input", colourUpdate, false);
colourPicker.select();

//URL Parsing
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if(/^[0-9A-F]{6}$/i.test(urlParams.getAll('c'))){ //if c parameter valid hex colour
  cubeColour = "#" + urlParams.getAll('c');
  document.getElementById("colourPicker").value = cubeColour;
}

//3D setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cv1'),
});

renderer.setClearColor("#66aff5", 1);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 8, 4);
camera.lookAt(new Vector3(0, 0, 0));

const light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
light.position.set(0, 8, 0);
light.target.position.set(0, 0, 0);
light.lookAt(light.target.position);
scene.add(light);
scene.add(light.target);

const planeSize = 400;
const textureLoader = new THREE.TextureLoader();
// texture from: https://3djungle.net/textures/smooth/870/
const texture = textureLoader.load('resources/images/wood_texture.jpg'); 
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
scene.add(tableTop);


const stickSpawner = new StickSpawner(scene, new Vector3(-5, 0.2, 0));

const draggableList = [];
const movementPlane = new Plane(new Vector3(0, 1, 0), -stickSpawner.stickParameters.radius);
const controls = new RelativeDragControls(draggableList, camera, movementPlane, renderer.domElement);
controls.onHover = function(object) {
  object.material.emissive.set(0x222222);
}
controls.onUnhover = function(object) {
  object.material.emissive.set(0x000000);
}

stickSpawner.stickParameters.color = cubeColour;
spawnStick();

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}


function constructLink(){
  alert("Use this URL to keep your settings:\n" + baseURL + "?c=" +cubeColour.replace("#",''));
}

document.getElementById("getLink").onclick = constructLink;

document.getElementById("newStick").onclick = spawnStick;

document.getElementById("horizontal").onchange = function() {
  stickSpawner.stickParameters.defaultRotation = new Vector3(Math.PI/2, 0, 0);
};
document.getElementById("upright").onchange = function() {
  stickSpawner.stickParameters.defaultRotation = new Vector3(0, 0, 0);
}

function spawnStick() {
  stickSpawner.position.setX(stickSpawner.position.x + 0.5);
  const stick = stickSpawner.spawn();
  draggableList.push(stick);
}

animate();
