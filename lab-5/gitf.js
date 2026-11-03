import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const directionalLight = new THREE.DirectionalLight(0xffffff ,2.5)
directionalLight.position.set(5, 8, 4)
scene.add(directionalLight)

const loader = new GLTFLoader();
loader.load('Mazda RX-7 by IvOfficial - SnIoWlh7S2.glb', (gltf) => {
  gltf.scene.rotation.y = Math.PI;
  scene.add(gltf.scene);
  let MeshCount = 0;
  let TotalVertices = 0;
  let TotalFaces = 0;
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      MeshCount ++;
      const geometry = child.geometry
      const position = geometry.getAttribute('position')
      const index = geometry.index
      const vertices = position.count
      const faces = index.count / 3
      TotalVertices += vertices
      TotalFaces += faces
      console.log('Mesh', child.name)
      console.log('Vertices', vertices)
      console.log('Faces', faces)
    }
  })
  console.log('Total Mesh', MeshCount)
  console.log('Total Vertices', TotalVertices)
  console.log('Total Faces', TotalFaces)
})

function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
}
animate();
