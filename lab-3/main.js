// Challange:
// Add the Sun's rotation on its own axis.
// Add a second planet with its own moon so the scene graph branches.

import * as THREE from "three"
import { OrbitControls, ThreeMFLoader } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  100
);
camera.position.set(6, 5, 8)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const control = new OrbitControls(camera, renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
pointLight.position.set(0, 0, 0);
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({color: 0xFCE570});
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 24),
  new THREE.MeshStandardMaterial({ color:0x75c518, emissive: 0xE8431c, emissiveIntensity:0.6 })
);
earth.position.x = 5;
earthOrbit.add(earth)

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 32, 24),
  new THREE.MeshStandardMaterial({color:0x134661})
)
moon.position.x = 1.8;
moonOrbit.add(moon)

const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit)
// marsOrbit.add(new THREE.AxisHelper(5))
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.8,32,24),
  new THREE.MeshStandardMaterial({color:0xbb3e04})
)
mars.position.x = 10
marsOrbit.add(mars)

const phobosObrit = new THREE.Object3D();
mars.add(phobosObrit)
const phobos = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 32, 24),
  new THREE.MeshStandardMaterial({color:0x134661})
)
phobos.position.x = 1.8
phobosObrit.add(phobos)

function animate() {
  requestAnimationFrame(animate)
  control.update();
  earthOrbit.rotation.y += 0.01;
  moonOrbit.rotation.y += 0.05;

  marsOrbit.rotation.y += 0.006
  mars.rotation.y += 0.03
  phobosObrit.rotation.y+=0.06
  earth.rotation.y += 0.05;
  sun.rotation.y += 0.003;
  renderer.render(scene, camera);
}
animate();
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight)
})
