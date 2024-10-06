import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getSun from "../src/js/getSun.js";
// import getNebula from "../src/js/getNebula.js";
import getStarfield from "../src/js/getStarfield.js";
import getPlanet from "../src/js/getPlanet";


export const initializeApp = (container) => {
  const scene = new THREE.Scene();
  const w = container.clientWidth;
  const h = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 2.5, 30);
  // camera.position.z = 20=
  camera.updateProjectionMatrix()
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);

  // Append the renderer to the container
  container.appendChild(renderer.domElement);


//adds
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

const AU = 5

function addOrbitsToScene() {
  // Mercury's orbit parameters
  const mercuryOrbitPoints = createOrbitEllipse(
    0.38709927*AU, // Semi-major axis in meters (1 AU)
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
    0.72333566*5, // Semi-major axis in meters (1 AU)
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
    1.00000261*5, // Semi-major axis in meters (1 AU)
      0.01671123,            // Eccentricity
      -0.00001531 * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      102.93768193 * (Math.PI / 180), // Argument of periapsis in radians
      100                     // Number of points for smooth orbit
  );

    // mars's orbit parameters
    const marsOrbitPoints = createOrbitEllipse(
      1.52371034 *AU, // Semi-major axis in meters (1 AU)
      0.09339410,            // Eccentricity
      1.84969142 * (Math.PI / 180), // Inclination in radians
      -4.55343205 * (Math.PI / 180),  // Longitude of ascending node in radians
      -23.94362959  * (Math.PI / 180), // Argument of periapsis in radians
      49.55953891                     // Number of points for smooth orbit
  );
  const marsOrbit = createOrbitLine(marsOrbitPoints);
  scene.add(marsOrbit);

    // jupiter's orbit parameters
    const jupiterOrbitPoints = createOrbitEllipse(
      5.20288700 * AU, // Semi-major axis in meters (1 AU)
      0.04838624   ,            // Eccentricity
      1.30439695  * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      14.72847983   * (Math.PI / 180), // Argument of periapsis in radians
      100.47390909                     // Number of points for smooth orbit
  );
  const jupiterOrbit = createOrbitLine(jupiterOrbitPoints);
  scene.add(jupiterOrbit);

    // saturn's orbit parameters
    const saturnOrbitPoints = createOrbitEllipse(
      9.53667594 * AU, // Semi-major axis in meters (1 AU)
      0.05386179,            // Eccentricity
      2.48599187  * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      92.59887831  * (Math.PI / 180), // Argument of periapsis in radians
      113.66242448                    // Number of points for smooth orbit
  );
  const saturnOrbit = createOrbitLine(saturnOrbitPoints);
  scene.add(saturnOrbit);

    // uranus's orbit parameters
    const uranusOrbitPoints = createOrbitEllipse(
      19.18916464  * AU, // Semi-major axis in meters (1 AU)
      0.04725744 ,            // Eccentricity
      0.77263783       * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      170.95427630  * (Math.PI / 180), // Argument of periapsis in radians
      74.01692503            // Number of points for smooth orbit
  );
  const uranusOrbit = createOrbitLine(uranusOrbitPoints);
  scene.add(uranusOrbit);
    // neptune's orbit parameters
    const neptuneOrbitPoints = createOrbitEllipse(
      30.06992276 * AU, // Semi-major axis in meters (1 AU)
      0.00859048,            // Eccentricity
      1.77004347    * (Math.PI / 180), // Inclination in radians
      0.0 * (Math.PI / 180),  // Longitude of ascending node in radians
      44.96476227 * (Math.PI / 180), // Argument of periapsis in radians
      131.78422574                 // Number of points for smooth orbit
  );
  const neptuneOrbit = createOrbitLine(neptuneOrbitPoints);
  scene.add(neptuneOrbit);


  const earthOrbit = createOrbitLine(earthOrbitPoints);
  scene.add(earthOrbit);
}


addOrbitsToScene();











  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;

  controls.minAzimuthAngle = 0;  // Prevent rotation to the left
  controls.maxAzimuthAngle = 0;  // Prevent rotation to the right

  const solarSystem = new THREE.Group();
  solarSystem.userData.update = (t) => {
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t);
    });
  };
  scene.add(solarSystem);

  const sun = getSun();
  solarSystem.add(sun);

  const mercury = getPlanet({
    semiMajorAxis: 0.38709927      *AU, // Semi-major axis in meters (1 AU)
    eccentricity: 0.20563593, // Eccentricity
    inclination: 7.00497902 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 77.45779628 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 0.1,
    distance: 6,
    img: "mercury",
    rate: 40,
  });
  solarSystem.add(mercury);


  const venus = getPlanet({
    semiMajorAxis: 0.72333566      *5, // Semi-major axis in meters (1 AU)
    eccentricity: 0.00677672,            // Eccentricity
    inclination: 3.39467605 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 131.60246718 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 0.1,
    distance: 6,
    img: "venus",
    rate: 50,
  });
  solarSystem.add(venus);

  const earth = getPlanet({
    semiMajorAxis: 1.00000261*5, // Semi-major axis in meters (1 AU)
    eccentricity: 0.01671123,            // Eccentricity
    inclination: -0.00001531 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 100 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 0.1,
    distance: 6,
    img: "earth ",
    rate: 100,
  });
  solarSystem.add(earth);

  const mars = getPlanet({
    semiMajorAxis: 1.52371034  *5, // Semi-major axis in meters (1 AU)
    eccentricity: 0.09339410,            // Eccentricity
    inclination: 1.84969142  * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 100 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 0.1,
    distance: 6,
    img: "mars",
    rate: 100,
  });
  solarSystem.add(mars);

  const jupiter = getPlanet({
    semiMajorAxis: 5.20288700    *5, // Semi-major axis in meters (1 AU)
    eccentricity: 0.01671123,            // Eccentricity
    inclination: -0.00001531 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 100 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 0.1,
    distance: 6,
    img: "jupiter",
    rate: 100,
  });
  solarSystem.add(jupiter);

  const saturn = getPlanet({
    semiMajorAxis: 9.53667594   *AU, // Semi-major axis in meters (1 AU)
    eccentricity: 0.01671123,            // Eccentricity
    inclination: -0.00001531 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 100 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 1.1,
    distance: 6,
    img: "saturn",
    rate: 100,
  });
  solarSystem.add(saturn);

  const uranus = getPlanet({
    semiMajorAxis: 19.18916464   *AU, // Semi-major axis in meters (1 AU)
    eccentricity: 0.01671123,            // Eccentricity
    inclination: -0.00001531 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 100 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 1.1,
    distance: 6,
    img: "uranus",
    rate: 100,
  });
  solarSystem.add(uranus);

  const neptune = getPlanet({
    semiMajorAxis: 30.06992276   *AU, // Semi-major axis in meters (1 AU)
    eccentricity: 0.01671123,            // Eccentricity
    inclination: -0.00001531 * (Math.PI / 180), // Inclination in radians
    longitudeOfAscendingNode: 0.0 * (Math.PI / 180), // Longitude of ascending node in radians
    argumentOfPeriapsis: 100 * (Math.PI / 180), // Argument of periapsis in radians
    children: [], // Number of points for smooth orbit
    size: 1.1,
    distance: 6,
    img: "neptune",
    rate: 100,
  });
  solarSystem.add(neptune);
  

  // const venus = getPlanet({ size: 1.2, distance: 70, img: 'venus', planetName :'venus' });
  // solarSystem.add(venus);

  // const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon' });
  // const earth = getPlanet({ children: [moon], size: 2, distance: 95.0, img: 'earth' });
  // solarSystem.add(earth);

  // const mars = getPlanet({ size: 0.15, distance: 2.25, img: 'mars' });
  // solarSystem.add(mars);

  // const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter' });
  // solarSystem.add(jupiter);

  // const sRingGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 64);
  // const sRingMat = new THREE.MeshStandardMaterial();
  // const saturnRing = new THREE.Mesh(sRingGeo, sRingMat);
  // saturnRing.scale.z = 0.1;
  // saturnRing.rotation.x = Math.PI * 0.5;
  // const saturn = getPlanet({ children: [saturnRing], size: 0.35, distance: 3.25, img: 'saturn' });
  // solarSystem.add(saturn);

  // const uRingGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 64);
  // const uRingMat = new THREE.MeshStandardMaterial();
  // const uranusRing = new THREE.Mesh(uRingGeo, uRingMat);
  // uranusRing.scale.z = 0.1;
  // const uranus = getPlanet({ children: [uranusRing], size: 0.3, distance: 3.75, img: 'uranus' });
  // solarSystem.add(uranus);

  // const neptune = getPlanet({ size: 0.3, distance: 4.25, img: 'neptune' });
  // solarSystem.add(neptune);

  // Add starfield
  const starfield = getStarfield({ numStars: 500, size: 0.35 });
  scene.add(starfield);

  // Load OBJ models
  const sceneData = {
    objs: [],
  };
  const manager = new THREE.LoadingManager();
  manager.onLoad = () => initScene(sceneData);
  const loader = new OBJLoader(manager);
  const objs = ['Rock1', 'Rock2', 'Rock3'];
  objs.forEach((name) => {
    let path = `./rocks/${name}.obj`; // Fixed string interpolation
    loader.load(path, (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          sceneData.objs.push(child);
        }
      });
    });
  });

  function initScene(sceneData) {
    sceneData.objs.forEach(obj => {
      scene.add(obj);
    });
    // Additional scene setup can go here
  }

  const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
  dirLight.position.set(0, 1, 0);
  scene.add(dirLight);

  function animate(t = 0) {
    const time = t * 0.0002;
    requestAnimationFrame(animate);
    solarSystem.userData.update(time);
    renderer.render(scene, camera);
    controls.update();
  }

  animate();

  // Handle window resizing
  function handleWindowResize() {
    const w = container.clientWidth; // Update width on resize
    const h = container.clientHeight; // Update height on resize
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', handleWindowResize, false);
};