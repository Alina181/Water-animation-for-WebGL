import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky';

// Сцена и камера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(30, 30, 100);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Орбитальные управления
const controls = new OrbitControls(camera, renderer.domElement);

// Сфера неба
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

// Вода
const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/waternormals.jpg',
    texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  alpha: 1.0,
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
  fog: scene.fog !== undefined
});
water.rotation.x = -Math.PI / 2;
scene.add(water);

// Круглый объект (сфера) - исправленная версия
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xff0000,
  roughness: 0.1,
  metalness: 0.5
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 3, 0); // Поднимаем сферу выше, чтобы она была видна
scene.add(sphere);

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(100, 100, 50);
scene.add(directionalLight);

const sun = new THREE.Vector3();
sun.set(100, 100, 100);
sky.material.uniforms['sunPosition'].value.copy(sun);
water.material.uniforms['sunDirection'].value.copy(sun).normalize();

// Анимация
function animate() {
  requestAnimationFrame(animate);
  water.material.uniforms['time'].value += 1.0 / 60.0;
  
  // Анимация сферы - плавает на поверхности
  sphere.position.y = 3 + Math.sin(Date.now() * 0.001) * 0.5;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Ресайз окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});