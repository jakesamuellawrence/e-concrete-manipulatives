import './style.css';
import * as THREE from 'three';
import {StickSpawner} from './js/StickSpawner';
import {constructLink, changeDimension, setup, setEmissiveAllChildren} from './js/utils';
import { Plane, PlaneBufferGeometry, Vector3 } from 'three';
import { RelativeDragControls } from './js/RelativeDragControls';
import { Object3D } from 'three';
import { Group } from 'three';

//setup
var baseURL = window.location.origin;

//setting up colour
let objectColour = "#8f5d46";

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


const stickSpawner = new StickSpawner(scene, new Vector3(-1, 0.2, 0));

const draggableList = [];
const movementPlane = new Plane(new Vector3(0, 1, 0), -stickSpawner.stickParameters.radius);
const controls = new RelativeDragControls(draggableList, camera, movementPlane, renderer.domElement);
controls.onHover = function(object) {
  // object.material.emissive.set(0x222222);
  setEmissiveAllChildren(object, 0x222222)
}
controls.onUnhover = function(object) {
  // object.material.emissive.set(0x000000);
  setEmissiveAllChildren(object, 0x000000)
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
document.getElementById("newStick").onclick = spawnStick;
document.getElementById("addxDimension").onclick = function(){changeDimension("x", 1, camera, console);}
document.getElementById("minusxDimension").onclick = function(){changeDimension("x", -1, camera, console);}
document.getElementById("addyDimension").onclick = function(){changeDimension("y", 1, camera, console);}
document.getElementById("minusyDimension").onclick = function(){changeDimension("y", -1, camera, console);}
document.getElementById("addzDimension").onclick = function(){changeDimension("z", 1, camera, console);}
document.getElementById("minuszDimension").onclick = function(){changeDimension("z", -1, camera, console);}


function spawnStick() {
  stickSpawner.position.setX(stickSpawner.position.x + 0.2);
  const stick = stickSpawner.spawn();
  draggableList.push(stick);
  return stick;
}



animate();
