import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getSun from "../src/js/getSun.js";
import getNebula from "../src/js/getNebula.js";
import getStarfield from "../src/js/getStarfield.js";
import getPlanet from "../src/js/getPlanet";




const w = window.innerWidth*.5;
const h = window.innerHeight*.5;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 4);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
// scene.overrideMaterial = wireMat;

function createOrbit(radius) {
  const geometry = new THREE.CircleGeometry(radius, 10); // 100 segments for smoothness
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
  const orbit = new THREE.LineLoop(geometry, material);
  orbit.rotation.x = Math.PI / 2; // Rotate to lay flat on the XY plane
  return orbit;
}

//Create Orbit
function createOrbitEllipse(semiMajorAxis, eccentricity, inclination, longitudeOfAscendingNode, argumentOfPeriapsis, numPoints = 100) {
  const points = [];
  const a = semiMajorAxis;  // Semi-major axis
  const e = eccentricity;   // Eccentricity
  const i = inclination;    // Inclination in radians
  const Ω = longitudeOfAscendingNode; // Longitude of ascending node in radians
  const ω = argumentOfPeriapsis; // Argument of periapsis in radians

  for (let t = 0; t < numPoints; t++) {
      const M = (t / (numPoints-1)) * 2 * Math.PI;  // Mean anomaly

      // Solve Kepler's equation for eccentric anomaly
      let E = M;
      for (let j = 0; j < 10; j++) {
          E = M + e * Math.sin(E);  // Iterative approximation
      }

      const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));

      // Distance from the focus (Sun) to the orbiting body
      const r = a * (1 - e * Math.cos(E));

      // Position in the plane of the orbit
      const xOrbitalPlane = r * Math.cos(trueAnomaly);
      const yOrbitalPlane = r * Math.sin(trueAnomaly);

      // Apply rotation to account for the inclination, argument of periapsis, and longitude of ascending node
      const x = xOrbitalPlane * (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i)) -
                yOrbitalPlane * (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i));

      const y = xOrbitalPlane * (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i)) +
                yOrbitalPlane * (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i));

      const z = xOrbitalPlane * Math.sin(ω) * Math.sin(i) + yOrbitalPlane * Math.cos(ω) * Math.sin(i);

      // Add the point to the array
      points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

function createOrbitLine(points) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });  // White orbit line
  return new THREE.Line(geometry, material);
}

function addOrbitsToScene() {
  // Mercury's orbit parameters
  const mercuryOrbitPoints = createOrbitEllipse(
      8.32145129, // Semi-major axis in meters (1 AU)
      0.20563593,            // Eccentricity
      7.00497902 * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      77.45779628 * (Math.PI / 180), // Argument of periapsis in radians
      252.25032350                     // Number of points for smooth orbit
  );
  const mercuryOrbit = createOrbitLine(mercuryOrbitPoints);
  scene.add(mercuryOrbit);

  // Venus's orbit parameters
  const venusOrbitPoints = createOrbitEllipse(
      15.5495061, // Semi-major axis in meters (1 AU)
      0.00677672,            // Eccentricity
      3.39467605 * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      131.60246718 * (Math.PI / 180), // Argument of periapsis in radians
      181.97909950                     // Number of points for smooth orbit
  );
  const venusOrbit = createOrbitLine(venusOrbitPoints);
  scene.add(venusOrbit);

  // Earth's orbit parameters
  const earthOrbitPoints = createOrbitEllipse(
      21.497, // Semi-major axis in meters (1 AU)
      0.01671123,            // Eccentricity
      -0.00001531 * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      102.93768193 * (Math.PI / 180), // Argument of periapsis in radians
      100                     // Number of points for smooth orbit
  );

  const earthOrbit = createOrbitLine(earthOrbitPoints);
  scene.add(earthOrbit);
}


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enableZoom = false;
controls.dampingFactor = 0.03;
const useAnimatedCamera = true;
function initScene(data) {
  const { objs } = data;
  const solarSystem = new THREE.Group();
  solarSystem.userData.update = (t) => {
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t);
    });
  };
  scene.add(solarSystem);

  const sun = getSun();
  solarSystem.add(sun);

  const mercury = getPlanet({ size: 0.1, distance: 1.25, img: 'mercury' });
  solarSystem.add(mercury);
  // solarSystem.add(createOrbit(10))


  const venus = getPlanet({ size: 0.2, distance: 1.65, img: 'venus' });
  solarSystem.add(venus);

  const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon' });
  const earth = getPlanet({ children: [moon], size: 0.225, distance: 2.0, img: 'earth' });
  solarSystem.add(earth);

  const mars = getPlanet({ size: 0.15, distance: 2.25, img: 'mars' });
  solarSystem.add(mars);

  // const asteroidBelt = getAsteroidBelt(objs);
  // solarSystem.add(asteroidBelt);

  const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter' });
  solarSystem.add(jupiter);

  const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
  const sRingMat = new THREE.MeshStandardMaterial();
  const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
  saturnRing.scale.z = 0.1;
  saturnRing.rotation.x = Math.PI * 0.5;
  const saturn = getPlanet({ children: [saturnRing], size: 0.35, distance: 3.25, img: 'saturn' });
  solarSystem.add(saturn);

  const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
  const uRingMat = new THREE.MeshStandardMaterial();
  const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
  uranusRing.scale.z = 0.1;
  const uranus = getPlanet({ children: [uranusRing], size: 0.3, distance: 3.75, img: 'uranus' });
  solarSystem.add(uranus);

  const neptune = getPlanet({ size: 0.3, distance: 4.25, img: 'neptune' });
  solarSystem.add(neptune);

  // const elipticLines = getElipticLines();
  // solarSystem.add(elipticLines);

  addOrbitsToScene();

  const starfield = getStarfield({ numStars: 500, size: 0.35 });
  scene.add(starfield);

  const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
  dirLight.position.set(0, 1, 0);
  scene.add(dirLight);

  // const nebula = getNebula({
  //   hue: 0.6,
  //   numSprites: 10,
  //   opacity: 0.2,
  //   radius: 40,
  //   size: 80,
  //   z: -50.5,
  // });
  // scene.add(nebula);

  // const anotherNebula = getNebula({
  //   hue: 0.0,
  //   numSprites: 10,
  //   opacity: 0.2,
  //   radius: 40,
  //   size: 80,
  //   z: 50.5,
  // });
  // scene.add(anotherNebula);

  const cameraDistance = 5;
  function animate(t = 0) {
    const time = t * 0.0002;
    requestAnimationFrame(animate);
    solarSystem.userData.update(time);
    renderer.render(scene, camera);
    if (
      // useAnimatedCamera
      1==2
    ) {
      camera.position.x = Math.cos(time * 0.75) * cameraDistance;
      camera.position.y = Math.cos(time * 0.75);
      camera.position.z = Math.sin(time * 0.75) * cameraDistance;
      camera.lookAt(0, 0, 0);
    } else {
      controls.update();
    }
  }

  animate();
}

const sceneData = {
  objs: [],
};
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
const objs = ['Rock1', 'Rock2', 'Rock3'];
objs.forEach((name) => {
  let path = `./rocks/${name}.obj`;
  loader.load(path, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        sceneData.objs.push(child);
      }
    });
  });
});


function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);


// export function initializeApp(){


//   const w = window.innerWidth * 0.5;
//   const h = window.innerHeight *.5;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
//   camera.position.set(0, 2.5, 4);
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(w, h);
//   // renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   // renderer.outputColorSpace = THREE.SRGBColorSpace;
//   document.body.appendChild(renderer.domElement);
  
//   // const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
//   // scene.overrideMaterial = wireMat;
  
//   function createOrbit(radius) {
//     const geometry = new THREE.CircleGeometry(radius, 10); // 100 segments for smoothness
//     const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
//     const orbit = new THREE.LineLoop(geometry, material);
//     orbit.rotation.x = Math.PI / 2; // Rotate to lay flat on the XY plane
//     return orbit;
//   }
  
  
//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.enableZoom = false;
//   controls.dampingFactor = 0.03;
//   const useAnimatedCamera = true;
//   function initScene(data) {
//     const { objs } = data;
//     const solarSystem = new THREE.Group();
//     solarSystem.userData.update = (t) => {
//       solarSystem.children.forEach((child) => {
//         child.userData.update?.(t);
//       });
//     };
//     scene.add(solarSystem);
  
//     const sun = getSun();
//     solarSystem.add(sun);
  
//     const mercury = getPlanet({ size: 0.1, distance: 1.25, img: 'mercury.png' });
//     solarSystem.add(mercury);
//     // solarSystem.add(createOrbit(10))
  
  
//     const venus = getPlanet({ size: 0.2, distance: 1.65, img: 'venus.png' });
//     solarSystem.add(venus);
  
//     const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon.png' });
//     const earth = getPlanet({ children: [moon], size: 0.225, distance: 2.0, img: 'earth.png' });
//     solarSystem.add(earth);
  
//     const mars = getPlanet({ size: 0.15, distance: 2.25, img: 'mars.png' });
//     solarSystem.add(mars);
  
//     // const asteroidBelt = getAsteroidBelt(objs);
//     // solarSystem.add(asteroidBelt);
  
//     const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter.png' });
//     solarSystem.add(jupiter);
  
//     const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
//     const sRingMat = new THREE.MeshStandardMaterial();
//     const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
//     saturnRing.scale.z = 0.1;
//     saturnRing.rotation.x = Math.PI * 0.5;
//     const saturn = getPlanet({ children: [saturnRing], size: 0.35, distance: 3.25, img: 'saturn.png' });
//     solarSystem.add(saturn);
  
//     const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
//     const uRingMat = new THREE.MeshStandardMaterial();
//     const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
//     uranusRing.scale.z = 0.1;
//     const uranus = getPlanet({ children: [uranusRing], size: 0.3, distance: 3.75, img: 'uranus.png' });
//     solarSystem.add(uranus);
  
//     const neptune = getPlanet({ size: 0.3, distance: 4.25, img: 'neptune.png' });
//     solarSystem.add(neptune);
  
//     // const elipticLines = getElipticLines();
//     // solarSystem.add(elipticLines);
  
//     const starfield = getStarfield({ numStars: 500, size: 0.35 });
//     scene.add(starfield);
  
//     const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
//     dirLight.position.set(0, 1, 0);
//     scene.add(dirLight);
  
//     // const nebula = getNebula({
//     //   hue: 0.6,
//     //   numSprites: 10,
//     //   opacity: 0.2,
//     //   radius: 40,
//     //   size: 80,
//     //   z: -50.5,
//     // });
//     // scene.add(nebula);
  
//     // const anotherNebula = getNebula({
//     //   hue: 0.0,
//     //   numSprites: 10,
//     //   opacity: 0.2,
//     //   radius: 40,
//     //   size: 80,
//     //   z: 50.5,
//     // });
//     // scene.add(anotherNebula);
  
//     const cameraDistance = 5;
//     function animate(t = 0) {
//       const time = t * 0.0002;
//       requestAnimationFrame(animate);
//       solarSystem.userData.update(time);
//       renderer.render(scene, camera);

//         controls.update();

//     }
  
//     animate();
//   }
  
//   const sceneData = {
//     objs: [],
//   };
//   const manager = new THREE.LoadingManager();
//   manager.onLoad = () => initScene(sceneData);
//   const loader = new OBJLoader(manager);
//   const objs = ['Rock1', 'Rock2', 'Rock3'];
//   objs.forEach((name) => {
//     let path = `./rocks/${name}.obj`;
//     loader.load(path, (obj) => {
//       obj.traverse((child) => {
//         if (child.isMesh) {
//           sceneData.objs.push(child);
//         }
//       });
//     });
//   });
  
  
//   function handleWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   }
//   window.addEventListener('resize', handleWindowResize, false);
// }


