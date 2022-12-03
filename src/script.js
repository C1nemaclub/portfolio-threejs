import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { Pane } from 'tweakpane';
import fragmentShader from '../src/shaders/fragmentShader.glsl';
import vertexShader from '../src/shaders/vertexShader.glsl';
import cameraToPosition from '../src/CameraController/CameraController.js';
//Debug
const pane = new Pane();
const debugObject = {
  cameraRY: 0,
  cameraRX: 0,
  cameraRZ: 0,
  cameraPX: 0,
  cameraPY: 0,
  cameraPZ: 0,
  focalLength: 30,
  FOV: 8,
  clearColor: '#000000',
};

const hitSound = new Audio('/music/ost.mp3');

const playHitSound = () => {
  hitSound.play();
};

/**
 * Loaders
 */
const progress = document.querySelector('.progress');
const loadingBarElement = document.querySelector('.loading-bar');
const loadingScreen = document.querySelector('.loading-screen');
const navBar = document.querySelector('nav');

const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
      });
      // Update loadingBarElement
      loadingBarElement.classList.add('ended');
      progress.classList.add('ended');
      loadingScreen.classList.add('ended');
      loadingBarElement.style.transform = '';
      //playHitSound();
    }, 500);
    window.setTimeout(() => {
      navBar.classList.add('selected');
    }, 4000);
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    const progressPercentage = (progressRatio * 100).toFixed(0);
    progress.textContent = `${progressPercentage}%`;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);

const gltfLoader = new GLTFLoader(loadingManager);

const textureLoader = new THREE.TextureLoader();
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.96, 0.96, 0.86, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

//Particles

const galaxyConfig = {
  outsideColor: '#fcff07',
  insideColor: '#00e2ff',
  branches: 6,
  spin: 1,
  randomness: 1,
  randomnessPower: 13.5,
  count: 10000,
  radius: 11,
};

let material = null;
let geometry = null;
let points = null;

function generateGalaxy() {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  const positions = new Float32Array(galaxyConfig.count * 3);
  const colors = new Float32Array(galaxyConfig.count * 3);
  const scales = new Float32Array(galaxyConfig.count);
  const randomness = new Float32Array(galaxyConfig.count * 3);

  const insideColor = new THREE.Color(galaxyConfig.insideColor);

  const outsideColor = new THREE.Color(galaxyConfig.outsideColor);
  geometry = new THREE.BufferGeometry();

  for (let i = 0; i < galaxyConfig.count; i++) {
    let i3 = i * 3;
    const radius = Math.random() * galaxyConfig.radius;

    const spinAngle = radius * galaxyConfig.spin;
    const branchAngle =
      ((i % galaxyConfig.branches) / galaxyConfig.branches) * Math.PI * 2;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0.0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    //Randomness
    const randomX =
      Math.pow(Math.random(), galaxyConfig.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      galaxyConfig.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), galaxyConfig.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      galaxyConfig.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), galaxyConfig.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      galaxyConfig.randomness *
      radius;

    // positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    // positions[i3 + 1] = randomY + offsetY;
    // positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    randomness[i3 + 0] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    //Color
    const mixedColor = insideColor.clone();

    mixedColor.lerp(outsideColor, radius / galaxyConfig.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    //Scale
    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute(
    'aRandomness',
    new THREE.BufferAttribute(randomness, 3)
  );

  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    fragmentShader,
    vertexShader,
    uniforms: {
      uSize: { value: 30 * renderer.getPixelRatio() },
      uTime: { value: 0 },
    },
  });

  points = new THREE.Points(geometry, material);
  points.frustrumCulled = false;
  scene.add(points);
}

const Galaxy = pane.addFolder({
  title: 'Galaxy',
});

Galaxy.addInput(galaxyConfig, 'count', {
  min: 0,
  max: 50000,
  step: 1,
}).on('change', () => {
  generateGalaxy();
});

Galaxy.addInput(galaxyConfig, 'radius', {
  min: 0,
  max: 20,
  step: 1,
}).on('change', () => {
  generateGalaxy();
});

Galaxy.addInput(galaxyConfig, 'randomnessPower', {
  min: 0,
  max: 20,
  step: 0.01,
}).on('change', () => {
  generateGalaxy();
});

Galaxy.addInput(galaxyConfig, 'randomness', {
  min: 0,
  max: 1,
  step: 0.001,
}).on('change', () => {
  generateGalaxy();
});

Galaxy.addInput(galaxyConfig, 'spin', {
  min: 0,
  max: 3,
  step: 0.001,
}).on('change', () => {
  generateGalaxy();
});

Galaxy.addInput(galaxyConfig, 'branches', {
  min: 0,
  max: 12,
  step: 1,
}).on('change', () => {
  generateGalaxy();
});

Galaxy.addInput(galaxyConfig, 'insideColor').on('change', () => {
  generateGalaxy();
});
Galaxy.addInput(galaxyConfig, 'outsideColor').on('change', () => {
  generateGalaxy();
});
/**
 * Textures
 */

const roomTexture = textureLoader.load('./textures/roomTexture.jpg');
const armTexture = textureLoader.load('./textures/armTexture.jpg');

roomTexture.flipY = false;
armTexture.flipY = false;

roomTexture.encoding = THREE.sRGBEncoding;
armTexture.encoding = THREE.sRGBEncoding;

//Materials

const roomMaterial = new THREE.MeshBasicMaterial({ map: roomTexture });
const armMaterial = new THREE.MeshBasicMaterial({ map: armTexture });

/**
 * Models
 */

//Room
gltfLoader.load('./models/bakedRoom.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = roomMaterial;
  });
  scene.add(gltf.scene);
});

//walls
gltfLoader.load('./models/bakedWalls.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = roomMaterial;
  });

  scene.add(gltf.scene);
});
//robot Arm and Book
let part;
let part2;
let ready = false;
gltfLoader.load('./models/arm&book.glb', (gltf) => {
  part = gltf.scene.children[0].children[0].children[0];
  part2 =
    gltf.scene.children[0].children[0].children[0].children[0].children[0]
      .children[0];
  //part.rotation.z = Math.PI / 2;
  pane.addInput(part.rotation, 'z', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.001,
  });
  gltf.scene.traverse((child) => {
    child.material = armMaterial;
  });
  scene.add(gltf.scene);
  ready = true;
});

//Screens
let screenReady = false;
let rightScreen = null;
gltfLoader.load('./models/leftScreen.glb', (gltf) => {
  gltf.scene.children[0].material.side = THREE.DoubleSide;

  scene.add(gltf.scene);
});
gltfLoader.load('./models/rightScreen.glb', (gltf) => {
  rightScreen = gltf.scene;
  scene.add(rightScreen);
  screenReady = true;
});

/**
 * Lights
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let cursor = {};
window.addEventListener('mousemove', (e) => {
  cursor.x = (e.clientX / sizes.width - 0.5) * 2;
  cursor.y = -((e.clientY / sizes.height - 0.5) * 2);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  30,
  sizes.width / sizes.height,
  0.01,
  1000
);
camera.zoom = 5;
camera.fov = 45;
debugObject.zoom = 5;
// camera.position.set(-17.61, 12.87, -1.77);
// camera.rotation.set(-2.38, -1.09, -2.44);
camera.fov = debugObject.FOV;
camera.setFocalLength(debugObject.focalLength);

camera.position.set(4.25, 8.81, 6.7);
camera.rotation.set(-1.94, -1.15, -1.97);

setTimeout(() => {
  gsap.to(camera.position, {
    x: -17.61,
    y: 12.57,
    z: -1.77,
    duration: 2,
    delay: 1,
    ease: 'slow(0.7, 0.7, false)',
  });
  gsap.to(camera.rotation, {
    x: -2.38,
    y: -1.09,
    z: -2.44,
    duration: 2,
    delay: 1,
    ease: 'slow(0.7, 0.7, false)',
  });
  gsap.to(camera, {
    zoom: 1,
    duration: 2,
    delay: 1,
    ease: 'slow(0.7, 0.7, false)',
    onUpdate: function () {
      camera.updateProjectionMatrix();
    },
  });
}, 3000);

const settings = pane.addFolder({
  title: 'Settings',
});

settings
  .addInput(debugObject, 'cameraRX', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.001,
  })
  .on('change', () => {
    camera.rotation.x = debugObject.cameraRX;
    camera.updateProjectionMatrix();
  });

// settings
//   .addInput(debugObject, 'zoom', {
//     min: 0,
//     max: 5,
//     step: 0.001,
//   })
//   .on('change', () => {
//     camera.zoom = debugObject.zoom;
//     camera.updateProjectionMatrix();
//   });

settings
  .addInput(debugObject, 'cameraRY', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.001,
  })
  .on('change', () => {
    camera.rotation.y = debugObject.cameraRY;
    camera.updateProjectionMatrix();
  });
settings
  .addInput(debugObject, 'cameraRZ', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.001,
  })
  .on('change', () => {
    camera.rotation.z = debugObject.cameraRZ;
    camera.updateProjectionMatrix();
  });

//Position
settings
  .addInput(debugObject, 'cameraPX', {
    min: -20,
    max: 20,
    step: 0.001,
  })
  .on('change', () => {
    camera.position.x = debugObject.cameraPX;
    camera.updateProjectionMatrix();
  });

settings
  .addInput(debugObject, 'cameraPY', {
    min: -20,
    max: 20,
    step: 0.001,
  })
  .on('change', () => {
    camera.updateProjectionMatrix();
    camera.position.y = debugObject.cameraPY;
  });
settings
  .addInput(debugObject, 'cameraPZ', {
    min: -20,
    max: 20,
    step: 0.001,
  })
  .on('change', () => {
    camera.updateProjectionMatrix();
    camera.position.z = debugObject.cameraPZ;
  });

settings
  .addInput(debugObject, 'focalLength', {
    min: 0,
    max: 50,
    step: 0.001,
  })
  .on('change', () => {
    camera.setFocalLength(debugObject.focalLength);
    camera.updateProjectionMatrix();
  });
// settings
//   .addInput(camera, 'fov', {
//     min: 0,
//     max: 100,
//     step: 0.001,
//   })
//   .on('change', () => {
//     camera.updateProjectionMatrix();
//   });
scene.add(camera);


// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: false,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(debugObject.clearColor);
//renderer.setClearColor(0x000000, 0);
// renderer.setClearColor(0x000000, 1);

settings.addInput(debugObject, 'clearColor').on('change', () => {
  renderer.setClearColor(debugObject.clearColor);
});

generateGalaxy();

const ambientlights = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientlights);

//RAYCASTER

const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(cursor, camera);

//section Array
const sectionArray = [
  {
    name: 'contact',
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Vector3(1, 1, 1),
  },
  {
    name: 'projects',
    position: new THREE.Vector3(-1.01, 7.67, -2.53),
    rotation: new THREE.Vector3(-1.74, -1.45, -1.74),
  },
  {
    name: 'about',
    position: new THREE.Vector3(-1.739, 10, 3.47),
    rotation: new THREE.Vector3(-2.322, -1.571, -2.322),
  },
];
const contentSections = document.querySelectorAll('.content-section');

const navLinks = document.querySelectorAll('.navlink');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.dataset.target);
    contentSections.forEach((section) => {
      section.classList.remove('active-section');
    });
    navLinks.forEach((item) => {
      item.classList.remove('active');
    });
    link.classList.add('active');
    target.classList.add('active-section');
    let activeSection = null;
    navLinks.forEach((item) => {
      if (item.className.includes('active')) {
        activeSection = item.className.split(' ')[0];
      }
    });
    sectionArray.forEach((section) => {
      if (section.name === activeSection) {
        console.log(section);
        cameraToPosition(camera, section.position, section.rotation, testFunc);
      }
    });
  });
});

const backBtn = document.querySelector('.back-btn');


backBtn.addEventListener('click', () => {
  navLinks.forEach((item) => {
    item.classList.remove('active');
  });
  contentSections.forEach((section) => {
    section.classList.remove('active-section');
  });
  cameraToPosition(
    camera,
    new THREE.Vector3(-17.61, 12.87, -1.77),
    new THREE.Vector3(-2.38, -1.09, -2.44),
    testFunc
  );
});

function testFunc() {}

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update Arm

  raycaster.setFromCamera(cursor, camera);
  material.uniforms.uTime.value = elapsedTime;
  if (ready) {
    //part2.rotation.y = elapsedTime * 5;
    const intersects = raycaster.intersectObjects([part, part2], false);
    if (intersects.length > 0) {
      console.log(intersects[0].object.name);
    }
  }

  // Update controls
  //controls.update();
  //console.log(camera.position);
  // console.log(camera.rotation);

  geometry.verticesNeedUpdate = true;
  geometry.computeBoundingSphere();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
