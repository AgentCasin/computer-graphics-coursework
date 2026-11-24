import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 5, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)
scene.background = new THREE.Color(0x111111);
scene.add(new THREE.GridHelper(20, 20))
scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const sun = new THREE.DirectionalLight(0xffffff, 2.5)
sun.position.set(4, 6, 5)
scene.add(sun)

const pickables = [];
const colors = [
  0xFF5733, // Orange-Red
  0x33FF57, // Green
  0x3357FF, // Blue
  0xF033FF  // Purple
];

for (let i = 0; i < 4; i++){
  let geometry;
  const size = 0.8 + Math.random() * 0.4;

  if (i === 0) geometry = new THREE.BoxGeometry(1, 1, 1);
  else if (i === 1) geometry = new THREE.SphereGeometry(0.5, 32, 16);
  else if (i === 2) geometry = new THREE.ConeGeometry(size, size * 1.5, 32);
  else geometry = new THREE.TorusGeometry(size, size * 0.5, 16, 32);


  const material = new THREE.MeshStandardMaterial({ color: colors[i], roughness:0.3+Math.random()*0.4 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(-4 + i * 3, 0.5, 0)
  scene.add(mesh)
  pickables.push(mesh)
}
const pointer = new THREE.Vector2()
function updatePointers(event) {
  const rect = renderer.domElement.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top
  const W = rect.width
  const H = rect.height
  pointer.x = (2 *px) / W - 1
  pointer.y = 1 - (2 * py) / H
}

let selected = null;
let dragging = false;
const rayCaster = new THREE.Raycaster()
renderer.domElement.addEventListener('pointerdown', (event) => {
  updatePointers(event)
  rayCaster.setFromCamera(pointer, camera)
  const hits = rayCaster.intersectObjects(pickables)
  // remove the highlight from previous object
  if (selected) {
    selected.material.emissive.setHex(0x000000)
  }
  selected = hits.length > 0 ? hits[0].object : null;
  // select the newly clicked object
  if (selected) {
    selected.material.emissive.setHex(0x882200)
    dragging = true
    control.enabled = false
  }
})

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const intersection =new THREE.Vector3();

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) {
    return
  }
  updatePointers(event)
  rayCaster.setFromCamera(pointer, camera)
  if (rayCaster.ray.intersectPlane(plane, intersection)) {
    selected.position.x = intersection.x
    selected.position.z = intersection.z
  }
})
renderer.domElement.addEventListener('pointerup', (event) => {
  dragging = false;
  control.enabled = true
})

const initialStates = pickables.map((obj) => ({
  position: obj.position.clone(),
  scale: obj.scale.clone()
}));

const gui = new GUI()
gui.add({
  reset() {
    for (let i = 0; i < pickables.length; i++){
      pickables[i].position.copy(initialStates[i].position);
      pickables[i].scale.copy(initialStates[i].scale)
    }
  }
}, 'reset').name('Reset positions')

const bgFolder = gui.addFolder('Background');
bgFolder.addColor(scene, 'background').name('Color').onChange(() => {
  renderer, setClearColor(scene.background);
});
bgFolder.open();

function animate() {
  requestAnimationFrame(animate)
  control.update()
  renderer.render(scene, camera)
}
animate()
