import './style.css';
import * as THREE from 'three';
import {StickSpawner} from './StickSpawner';
import {constructLink, changeDimension, setup} from './utils';

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

const draggableList = [];

const stickSpawner = new StickSpawner(scene, new THREE.Vector3(-5, 0.2, 0));
stickSpawner.stickParameters.color = objectColour;
stickSpawner.position.setX(stickSpawner.position.x + 4);
spawnStick();

function animate(){
  dragObject();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
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
}

//XZ dragging
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
let draggable = null;

window.addEventListener('click', event => {
  if (draggable){
    draggable = null;
    return;
  }
  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(clickMouse, camera);
  raycaster.linePrecision = 0.1;
  const found = raycaster.intersectObjects(draggableList, true);
  if (found.length > 0 && found[0].object.userData.draggable){
    draggable = found[0].object;
  }
});

window.addEventListener('mousemove', event => {
  moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  moveMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
})

function dragObject (){
  if(draggable != null){
    raycaster.setFromCamera(moveMouse, camera);
    raycaster.linePrecision = 0.1;
    const found = raycaster.intersectObjects(scene.children);
    if (found.length > 0){
      for (let o of found){
        if(!o.object.userData.tableTop){
          continue;
        }
        draggable.position.x = o.point.x;
        draggable.position.z = o.point.z;
      }
    }
  }
}


animate();
