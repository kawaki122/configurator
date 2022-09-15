import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import './style.css'

let scene, camera, renderer, loadedModel, controls, loadManager;
let selectedType = "cornet", selectedFlavor = "Blueberry";

initialize();
animate();
loadModel();
lightUp();
handleCategoryChange();
handleFlavorChange();

function initialize() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  controls = new OrbitControls(camera, renderer.domElement);
  loadManager = new THREE.LoadingManager()

  scene.background = new THREE.Color("lightgray");

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
};



function removeModel() {
  scene.remove(loadedModel);
  loadedModel.geometry?.dispose();
  loadedModel.material?.dispose();
  loadedModel = undefined; //clear any reference for it to be able to garbage collected
}

function loadModel() {
  const loader = new GLTFLoader(loadManager);
  loader.load(`./assets/${selectedType}/${selectedFlavor}/Project Name.gltf`, (gltf) => {
    if (loadedModel) {
      removeModel();
    }

    gltf.scene.scale.set(15, 15, 15);
    gltf.scene.position.y = -1
    loadedModel = gltf.scene;

    scene.add(gltf.scene);
  })
}

function lightUp() {
  const directionalLight = new THREE.PointLight(0xffffff, 0.3)
  const directionalLight2 = new THREE.SpotLight(0xffffff, 0.3)
  const light = new THREE.AmbientLight(0x404040, 3); // soft white light

  directionalLight.position.x = 5;
  directionalLight.position.y = 10;
  directionalLight2.position.x = -5;
  directionalLight2.position.y = 5;

  scene.add(light);
  scene.add(directionalLight);
}

function handleCategoryChange() {
  const element = document.getElementById("selectIceCream");
  element.value = selectedType;
  console.log(element.onchange)
  element.addEventListener("change", (event) => {
    selectedType = event.target.value;
    loadModel()
  });
}

function handleFlavorChange() {
  const element = document.getElementById("selectFlavor");
  element.value = selectedFlavor;
  element.addEventListener("change", (event) => {
    selectedFlavor = event.target.value;
    loadModel()
  });
}

loadManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	document.getElementById("loaderId").style.display = "flex";
};

loadManager.onLoad = function ( ) {
  document.getElementById("loaderId").style.display = "none";
	console.log( 'Loading complete!');
};


// loadManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
// 	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
// };

// loadManager.onError = function ( url ) {
// 	console.log( 'There was an error loading ' + url );
// };

// function addPlane() {
//   const geometry = new THREE.CircleGeometry(50, 20);
//   const material = new THREE.MeshStandardMaterial({color: "#ffffff"});
//   const cube = new THREE.Mesh(geometry, material);
//   cube.rotateX(-(Math.PI/2))
//   cube.receiveShadow = true;
//   scene.add(cube);
// }
// function addBox() {
//   const geometry = new THREE.BoxGeometry(2, 2, 2);
//   const material = new THREE.MeshStandardMaterial({color: "#ffffff"});
//   const cube = new THREE.Mesh(geometry, material);
//   cube.castShadow = true;
//   cube.receiveShadow = true;
//   cube.position.y = 1;
//   scene.add(cube);
// }