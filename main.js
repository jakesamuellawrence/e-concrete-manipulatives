import './style.css';

import * as THREE from 'three';

import {
  DragControls
} from 'three/examples/jsm/controls/DragControls.js';

import {StickSpawner} from './StickSpawner';
import { Vector3 } from 'three';


//setup
var baseURL = window.location.origin;

var cubeColour = "#FF0066";
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cv1'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 5, 3);
camera.lookAt(new Vector3(0, 0, 0));

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 2, 4);
light.target.position.set(0, 0, 0);
light.lookAt(light.target.position);
scene.add(light);
scene.add(light.target);

const planeSize = 400;
const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const tableTop = new THREE.Mesh(planeGeo, planeMat);
tableTop.rotation.x = Math.PI * -.5;
scene.add(tableTop);

const draggableList = [];
const controls = new DragControls(draggableList, camera, renderer.domElement);

controls.addEventListener('dragstart', function ( event ) {
  
} );

controls.addEventListener('drag', function ( event ) {
  
} );

controls.addEventListener('dragend', function ( event ) {
  
} );

const stickSpawner = new StickSpawner(scene, new Vector3(-5, 0.2, 0));
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

function spawnStick() {
  stickSpawner.position.setX(stickSpawner.position.x + 0.5);
  const stick = stickSpawner.spawn();
  draggableList.push(stick);
}

animate();
