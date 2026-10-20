import * as THREE from 'three';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(8, 6, 12);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
  })
);

ground.rotation.x = -Math.PI / 2;

const grid = new THREE.GridHelper(20, 20);
grid.position.y = 0.01;

scene.add(grid, ground);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const directional = new THREE.DirectionalLight(0xffffff, 2);

scene.add(ambient, directional);

const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

const shoulder = new THREE.Group();
shoulder.position.y = 0.3;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  baseMaterial
);
shoulder.add(shoulderJoint);

const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });
const upperArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 3, 0.7),
  armMaterial
);
upperArm.position.y = 0.5;
shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 2.4;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 32),
  baseMaterial
);
elbowJoint.position.y = 0;
elbow.add(elbowJoint);

const foreArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial);
foreArm.position.y = 1.5;
elbow.add(foreArm);

const wrist = new THREE.Group();
wrist.position.y = 3.2;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  baseMaterial
);
wrist.add(wristJoint);

const palm = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1, 0.5),
  new THREE.MeshStandardMaterial({ color: 0xffaa55 })
);
palm.position.y = 0.75;
wrist.add(palm);

const fingers = [];
const fingerGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.3);
const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });
for (let i = 0; i < 5; i++) {
  const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);

  // Position fingers in a straight line along the palm's length
  finger.position.x = -0.4 + i * 0.2;
  finger.position.y = 0.8;

  palm.add(finger);
  fingers.push(finger);
}

shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(-20);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationSteps = THREE.MathUtils.degToRad(5);
window.addEventListener('keydown', function (event) {
  const key = event.key.toLowerCase();
  if (key === 'q') {
    shoulder.rotation.z += rotationSteps;
  }
  if (key === 'a') {
    shoulder.rotation.z -= rotationSteps;
  }
  if (key === 's') {
    elbow.rotation.z += rotationSteps;
  }
  if (key === 'w') {
    elbow.rotation.z -= rotationSteps;
  }
  if (key === 'd') {
    wrist.rotation.z += rotationSteps;
  }
  if (key === 'e') {
    wrist.rotation.z -= rotationSteps;
  }
});

const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  orbitControl.update();
  renderer.render(scene, camera);
}

animate();
