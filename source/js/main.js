import '/source/style.css';
import * as THREE from 'three';
import {StickSpawner} from '/source/js/StickSpawner';
import {constructLink, changeDimension, setup, setEmissiveAllChildren, removeObjects} from '/source/js/utils';
import { Plane, PlaneBufferGeometry, Vector3 } from 'three';
import { RelativeDragControls } from '/source/js/RelativeDragControls';
import { Object3D, Group } from 'three';
import * as converter from 'number-to-words';
import { SelectionControls } from '/source/js/SelectionControls';
import { EffectComposer, OutlinePass, RenderPass } from 'three-outlinepass';
import { Vector2 } from 'three';
import { centerLookup, positionLookup, radiusLookup } from '/source/js/BundleLookup';
import { ShaderPass } from 'three-outlinepass';
import FXAAShader from 'three-shaders/shaders/FXAAShader';

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
const [scene, camera, renderer, composer] = setup();

const stickSpawner = new StickSpawner(scene, new Vector3(0, 0.2, 0.7),objectColour);

const draggableList = [];
const movementPlane = new Plane(new Vector3(0, 1, 0), -stickSpawner.stickParameters.radius);
const dragControls = new RelativeDragControls(draggableList, camera, movementPlane, renderer.domElement);
dragControls.onHover = function(object) {
  setEmissiveAllChildren(object, 0x222222);
  document.body.style.cursor = "pointer";
}
dragControls.onUnhover = function(object) {
  setEmissiveAllChildren(object, 0x000000);
  document.body.style.cursor = "default";
}
dragControls.onDragStart = function(object){
  document.body.style.cursor = "grabbing";
}
dragControls.onDragEnd = function(object) {
  document.body.style.cursor = "pointer";
}

const selectControls = new SelectionControls(draggableList, camera, renderer.domElement);
selectControls.onSelect = function(object) {
  if (object.outlinePass) {
    object.outlinePass.enabled = true;
  } else {
    const outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), scene, camera, [object]);
    outlinePass.renderToScreen = true;
    composer.addPass(outlinePass);
    object.outlinePass = outlinePass;
  }
};
selectControls.onDeselect = function(object) {
  if (object.outlinePass) {
    object.outlinePass.enabled = false;
  }
};

stickSpawner.stickParameters.color = objectColour;
let stick = spawnStick();

function animate(){
  requestAnimationFrame(animate);
  // renderer.render(scene, camera);
  composer.render(scene, camera);
}

// Make the buttons do their jobs
document.getElementById("getLink").addEventListener('click', function(){constructLink(objectColour);})
document.getElementById("addStick").onclick = spawnStick;
document.getElementById("add10Sticks").onclick = spawn10Sticks;
document.getElementById("moreSticksInABundle").onclick = moreSticksInABundle;
document.getElementById("fewerSticksInABundle").onclick = fewerSticksInABundle;

document.getElementById("bundleButton").onclick = function() {
  if (selectControls.currentlySelected.length == 0) {
    return window.alert("Nothing is selected. Please click on some sticks to select them.");
  }
  let allSameOrder = selectControls.currentlySelected.every((object) => object.order == selectControls.currentlySelected[0].order);
  if (!allSameOrder) {
    return window.alert("You cannot bundle different types of things.");
  }
  if (selectControls.currentlySelected.length > sticksInABundle) {
    return window.alert("You have selected too many things.");
  } else if (selectControls.currentlySelected.length < sticksInABundle) {
    return window.alert("You have not selected enough things.");
  }
  bundle();
}

document.getElementById("removeButton").onclick = function() {
  if (confirm("This will delete all selected sticks and bundles. Are you sure?")) {
    for (let object of selectControls.currentlySelected){
      removeObjects(object, scene, draggableList);
      scene.remove(object);
    }
    while (selectControls.currentlySelected.length > 0) {
      selectControls.deselect(selectControls.currentlySelected);
    }
    updateSticksInTotal(draggableList, document);
    }
  }

function moreSticksInABundle() {
  if(sticksInABundle == 2){
    sticksInABundle += 1
    document.getElementById("fewerSticksInABundle").style.display = "block";
  }else if (sticksInABundle == 11){
    sticksInABundle += 1
    document.getElementById("moreSticksInABundle").style.display = "none";
  }else if (sticksInABundle < 11){
    sticksInABundle += 1
  }
  document.getElementById("sticksInABundle").innerText = converter.toWords(sticksInABundle);
}

function fewerSticksInABundle() {
  if(sticksInABundle == 12){
    sticksInABundle -= 1
    document.getElementById("moreSticksInABundle").style.display = "block";
  }else if (sticksInABundle == 3){
    sticksInABundle -= 1
    document.getElementById("fewerSticksInABundle").style.display = "none";
  }else if (sticksInABundle > 3){
    sticksInABundle -= 1
  }
  document.getElementById("sticksInABundle").innerText = converter.toWords(sticksInABundle);
}

function spawnStick() {
  const stick = stickSpawner.spawn();
  draggableList.push(stick);
  stick.order = 0;
  stick.radius = stickSpawner.stickParameters.radius;

  if (stickSpawner.position.x > 2) {
    stickSpawner.position.setX(-1);
    stickSpawner.position.setZ(stickSpawner.position.z - 0.5);
  } else {
    stickSpawner.position.setX(stickSpawner.position.x + 0.2);
  }
  
  updateSticksInTotal(draggableList, document);
  return stick;
}

function updateSticksInTotal(draggableList, document){
  if(draggableList.length == 1){
    document.getElementById("areInTotal").innerText = "There is";
    document.getElementById("sticksInTotal").innerText = "stick in total";
  }else{
    document.getElementById("areInTotal").innerText = "There are";
    document.getElementById("sticksInTotal").innerText = "sticks in total";
  }
  document.getElementById("numberInTotal").innerText = converter.toWords(draggableList.length);
}

function spawn10Sticks() {
  for (let i=0;i<10;i++){
    spawnStick();
  }
}

function bundle() {
  let bundle = new Group();
  bundle.order = selectControls.currentlySelected[0].order + 1;
  let sticksLookup = sticksInABundle;
  var torusColour; 
  // if (sticksInABundle == 2 && bundle.order % 2 == 0) {
  //   sticksLookup = 0;
  // } else if (sticksInABundle == 2) {
  //   sticksLookup = 2;
  // }
  bundle.radius = radiusLookup[sticksLookup](selectControls.currentlySelected[0].radius);
  let bundleCenter = centerLookup[sticksLookup](selectControls.currentlySelected[0].radius,
                                                   selectControls.currentlySelected[0].position.x,
                                                   selectControls.currentlySelected[0].position.y);
  bundle.position.set(
    bundleCenter.x,
    bundleCenter.y,
    selectControls.currentlySelected[0].position.z
  )

  const positions = positionLookup[sticksLookup](selectControls.currentlySelected[0].radius,
                                                    selectControls.currentlySelected[0].position.x,
                                                    selectControls.currentlySelected[0].position.y);

  // first order has yellow band, second order has orange band and anything beyond that order has red band                                               
  if (bundle.order == 1) {
    torusColour = 0xffff00;
  }
  else if (bundle.order == 2) {
    torusColour = 0xff9900;
  }
  else {
    torusColour = 0xff0000;
  }
  const torus = new THREE.Mesh( new THREE.TorusGeometry( bundle.radius, 0.005, 16, 100 ), new THREE.MeshBasicMaterial( { color: torusColour } ) );
  torus.position.copy(bundle.position);
  bundle.attach(torus);

  for (let i = 1; i < selectControls.currentlySelected.length; i++) {
    selectControls.currentlySelected[i].position.set(
      positions[i-1].x,
      positions[i-1].y,
      selectControls.currentlySelected[0].position.z
    );
  }

  while(selectControls.currentlySelected.length > 0) {
    bundle.attach(selectControls.currentlySelected[0]);
    selectControls.deselect(selectControls.currentlySelected[0])
  }

  scene.add(bundle);
}




animate();
