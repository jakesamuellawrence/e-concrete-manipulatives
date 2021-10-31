import './style.css';

import * as THREE from 'three';

import {
  DragControls
} from 'three/examples/jsm/controls/DragControls.js'
import { Test } from './StickSpawner';


//setup
var baseURL = window.location.origin;

var cubeColour = "#FF0066";
var colourPicker;

function colourUpdate(event){
  cubeColour = event.target.value;
  cube1.material.color.set(event.target.value);
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

// Objects test
const messager = new Test("testy boi again");
messager.sayMessage();

//3D setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#cv1'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(50);
camera.position.setY(5);
camera.position.setX(50);
camera.setRotationFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), Math.PI/4)

const geometry = new THREE.BoxGeometry(10,10,10);
const material = new THREE.MeshPhongMaterial({color: cubeColour});
const cube1 = new THREE.Mesh(geometry, material);
cube1.position.set(0,5,0)
scene.add(cube1);

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(100, 100, 200);
light.target.position.set(0, 0, 0);
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


const controls = new DragControls([cube1], camera, renderer.domElement);

controls.addEventListener('dragstart', function ( event ) {
	
} );

controls.addEventListener('drag', function ( event ) {
	
} );

controls.addEventListener('dragend', function ( event ) {
	
} );



function animate(){
  requestAnimationFrame(animate);

  document.getElementById("coords").innerHTML = "[" + cube1.position.x.toFixed(2) + ", " + cube1.position.y.toFixed(2) + ", " + cube1.position.z.toFixed(2) + "]";
  document.getElementById("rotation-x").innerHTML = cube1.rotation.x.toFixed(2);
  document.getElementById("rotation-y").innerHTML = cube1.rotation.y.toFixed(2);
  document.getElementById("rotation-z").innerHTML = cube1.rotation.z.toFixed(2);
  renderer.render(scene, camera);
}


document.getElementById("upButton").onclick = function(){cube1.position.y += 0.4;};
document.getElementById("downButton").onclick = function(){cube1.position.y -= 0.4;};
document.getElementById("leftButton").onclick = function(){cube1.position.x -= 0.4;};
document.getElementById("rightButton").onclick = function(){cube1.position.x += 0.4;};


function constructLink(){
  alert("Use this URL to keep your settings:\n" + baseURL + "?c=" +cubeColour.replace("#",''));
}

document.getElementById("getLink").onclick = constructLink;


animate();
