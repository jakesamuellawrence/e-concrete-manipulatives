import './style.css';
import * as THREE from 'three';
import {StickSpawner} from './js/StickSpawner';
import {constructLink, changeDimension, setup, setEmissiveAllChildren} from './js/utils';
import { Plane, PlaneBufferGeometry, Vector3 } from 'three';
import { RelativeDragControls } from './js/RelativeDragControls';
import { Object3D, Group } from 'three';
import * as converter from 'number-to-words';

//setup
var baseURL = window.location.origin;
let sticksInABundle = 5;
document.getElementById("sticksInABundle").innerText = converter.toWords(sticksInABundle);

//setting up colour
let objectColour = "#8C5D41";

function colourUpdate(event){
  objectColour = event.target.value;
  stickSpawner.stickParameters.color = objectColour;
}

let colourPicker = document.querySelector("#colourPicker");
colourPicker.addEventListener("input", colourUpdate, false);
colourPicker.select();

//URL Parsing
const urlParams = new URLSearchParams(window.location.search);
if(/^[0-9A-F]{6}$/i.test(urlParams.getAll('c'))){ //if c parameter valid hex colour
  objectColour = "#" + urlParams.getAll('c');
  document.getElementById("colourPicker").value = objectColour;
}

//3D setup
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cv1'),
  antialias: true,
});

setup(scene, camera, renderer);


const stickSpawner = new StickSpawner(scene, new Vector3(-0.5, 0.2, 0.7));

const draggableList = [];
const movementPlane = new Plane(new Vector3(0, 1, 0), -stickSpawner.stickParameters.radius);
const controls = new RelativeDragControls(draggableList, camera, movementPlane, renderer.domElement);
controls.onHover = function(object) {
  // object.material.emissive.set(0x222222);
  setEmissiveAllChildren(object, 0x222222);
  document.body.style.cursor = "pointer";
}
controls.onUnhover = function(object) {
  // object.material.emissive.set(0x000000);
  setEmissiveAllChildren(object, 0x000000);
  document.body.style.cursor = "default";
}
controls.onDragStart = function(object){
  // setEmissiveAllChildren(object, 0xFFBF00);
  document.body.style.cursor = "grabbing";
}
controls.onDragEnd = function(object) {
  document.body.style.cursor = "pointer";
}



stickSpawner.stickParameters.color = objectColour;
let stick = spawnStick();
let stick2 = spawnStick();
let bundle = new Group();
bundle.attach(stick);
bundle.attach(stick2);
scene.add(bundle);

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
}

// Make the buttons do their jobs
document.getElementById("getLink").addEventListener('click', function(){constructLink(objectColour);})
document.getElementById("addStick").onclick = spawnStick;
document.getElementById("add10Sticks").onclick = spawn10Sticks;
document.getElementById("moreSticksInABundle").onclick = moreSticksInABundle;
document.getElementById("fewerSticksInABundle").onclick = fewerSticksInABundle;
document.getElementById("addxDimension").onclick = function(){changeDimension("x", 1, camera, console);}
document.getElementById("minusxDimension").onclick = function(){changeDimension("x", -1, camera, console);}
document.getElementById("addyDimension").onclick = function(){changeDimension("y", 1, camera, console);}
document.getElementById("minusyDimension").onclick = function(){changeDimension("y", -1, camera, console);}
document.getElementById("addzDimension").onclick = function(){changeDimension("z", 1, camera, console);}
document.getElementById("minuszDimension").onclick = function(){changeDimension("z", -1, camera, console);}

function moreSticksInABundle() {
  if (sticksInABundle < 12){
    sticksInABundle += 1
  }
  document.getElementById("sticksInABundle").innerText = converter.toWords(sticksInABundle);
}

function fewerSticksInABundle() {
  if (sticksInABundle > 2){
    sticksInABundle -= 1
  }
  document.getElementById("sticksInABundle").innerText = converter.toWords(sticksInABundle);
}

function spawnStick() {
  stickSpawner.position.setX(stickSpawner.position.x + 0.2);
  const stick = stickSpawner.spawn();
  draggableList.push(stick);
  
  if(draggableList.length == 1){
    document.getElementById("areInTotal").innerText = "There is";
    document.getElementById("sticksInTotal").innerText = "stick in total";
  }else{
    document.getElementById("areInTotal").innerText = "There are";
    document.getElementById("sticksInTotal").innerText = "sticks in total";
  }
  document.getElementById("numberInTotal").innerText = converter.toWords(draggableList.length);

  return stick;
}

function spawn10Sticks() {
  for (let i=0;i<10;i++){
    spawnStick();
  }
}


animate();
