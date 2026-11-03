import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('./textures/Onyx006_1K-JPG_Color.jpg');
const normalTexture = textureLoader.load('./textures/Onyx006_1K-JPG_NormalGL.jpg');
const roughnessTexture = textureLoader.load('./textures/Onyx006_1K-JPG_Roughness.jpg')

const textureMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,
  normalMap: normalTexture,
  roughnessMap: roughnessTexture
})

const control = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const directionalLight = new THREE.DirectionalLight(0xffffff ,2.5)
directionalLight.position.set(5, 8, 4)
scene.add(directionalLight)

const positions = new Float32Array([
  0, 1.5, 0, // vertex 0
  0, -1.5, 0, // vertex 1
  1, 0, 0, // vertex 2
  0, 0, 1, // vertex 3
  -1, 0, 0, // vertex 4
  0, 0, -1, // vertex 5
])

const index = [
  0, 3, 2, // f1
  0, 4, 3, // f2
  0, 5, 4, // f3
  0, 2, 5, // f4
  1, 2, 3, // f5
  1, 3, 4, // f6
  1, 4, 5, // f7
  1, 5, 2, // f8
]

const uvs = new Float32Array([
  0.5, 0.0,   // vertex 0 (top): center-top of the texture
  0.5, 1.0,   // vertex 1 (bottom): center-bottom of the texture
  1.0, 0.5,   // vertex 2 (right): right-center of the texture
  0.0, 0.5,   // vertex 3 (front): left-center of the texture
  0.0, 0.5,   // vertex 4 (left): same as front (for symmetry)
  1.0, 0.5    // vertex 5 (back): same as right (for symmetry)
]);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
geometry.setIndex(index)
geometry.computeVertexNormals();

geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

const mesh = new THREE.Mesh(geometry,textureMaterial)

scene.add(mesh);

const nonindexed = geometry.toNonIndexed();
nonindexed.computeVertexNormals();
console.log('Indexed Geometry: Vertices', geometry.attributes.position.count, 'Faces', index.length / 3);
console.log('Non-Indexed Geometry: Vertices', nonindexed.attributes.position.count, 'Faces', index.length / 3);

window.addEventListener('keydown', (c) => {
  if (c.key === 'f') {
      mesh.geometry = mesh.geometry === geometry ? nonindexed : geometry;
  }
})


function animate() {
  requestAnimationFrame(animate);
  control.update();
  mesh.rotation.y -= 0.005;
  renderer.render(scene, camera);
}
animate();
