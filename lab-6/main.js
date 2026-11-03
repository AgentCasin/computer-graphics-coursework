import * as THREE from 'three'
import { PLYLoader, ThreeMFLoader } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const aspect = window.innerWidth / window.innerHeight

const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 100)
perspective.position.set(20, 2, 10)
perspective.lookAt(0, 0, 0)
scene.add(perspective)

const size = 8
const orthographic = new THREE.OrthographicCamera(
  -size * aspect,
  size * aspect,
  size,
  -size,
  0.1,
  100
)
orthographic.position.set(20, 2, 10)
orthographic.lookAt(0, 0, 0)

const cameras = [perspective, orthographic]
let current = 0

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambient = new THREE.AmbientLight(0xffffff,0.35)
const directional = new THREE.DirectionalLight(0xffffff, 2.5)
scene.add(ambient, directional)
console.log('Active: Prespective')
addEventListener('keydown', (c) => {
  if (c.code === 'Space') {
    c.preventDefault()
    current = current + 1
    if (current >= cameras.length) {
      current = 0
    }
    console.log("Acive:", current === 0 ? "PerspectiveCamera":"OrthographicCamera")
  }
})

const depths = [3, 5, 7];
const colors = [0xff0000cc, 0x00ff00cc, 0x0000ffcc]

new PLYLoader().load('models/3D.ply', (geo) => {
  geo.center()
  const meshes = []
  depths.forEach((depth, index) => {
    const material = new THREE.MeshStandardMaterial({ color: colors[index], roughness: 0.5 })
    const mesh = new THREE.Mesh(geo, material)
    mesh.scale.setScalar(0.02)
    mesh.rotation.z = Math.PI
    mesh.position.z = depth
    scene.add(mesh)
    meshes.push(mesh)
  })
})



function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, cameras[current])
}
animate()
