import * as THREE from "three";
import { getFresnelMat } from "./getFresnelMat.js";
import earth from "../images/textures/earth.png";
import mercury from "../images/textures/mercury.png";
import venus from "../images/textures/venus.png";
import mars from "../images/textures/mars.png";
import saturn from "../images/textures/saturn.png";
import neptune from "../images/textures/neptune.png";
import jupiter from "../images/textures/jupiter.png";
import uranus from "../images/textures/uranus.png";
import moon from "../images/textures/moon.png";

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 6);

const textureMap = {
  earth,
  mercury,
  moon,
  venus,
  mars,
  saturn,
  neptune,
  jupiter,
  uranus,
};

function getPlanet({
  semiMajorAxis,
  eccentricity,
  inclination,
  longitudeOfAscendingNode,
  argumentOfPeriapsis,
  children = [],
  distance = 0,
  img = "",
  size = 1,
}) {
  const points = [];
  const a = semiMajorAxis; // Semi-major axis
  const e = eccentricity; // Eccentricity
  const i = inclination; // Inclination in radians
  const Ω = longitudeOfAscendingNode; // Longitude of ascending node in radians
  const ω = argumentOfPeriapsis; // Argument of periapsis in radians

  const orbitGroup = new THREE.Group();
  // orbitGroup.rotation.x = 0;

  const texturePath = textureMap[img];

  // const path = `./src/images/textures/${img}`;
  // const path = {img}
  // console.log(path)

  const map = texLoader.load(
    texturePath,
    () => {
      console.log("loaded properly");
    },
    undefined,
    (error) => {
      console.error("error loading");
    }
  );
  const planetMat = new THREE.MeshStandardMaterial({
    map,
  });
  const planet = new THREE.Mesh(geo, planetMat);
  planet.scale.setScalar(size);

  const startAngle = Math.random() * Math.PI * 2;
  planet.position.x = Math.cos(startAngle) * distance;
  planet.position.z = Math.sin(startAngle) * distance;

  const planetRimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
  const planetRimMesh = new THREE.Mesh(geo, planetRimMat);
  planetRimMesh.scale.setScalar(1.01);
  planet.add(planetRimMesh);

  children.forEach((child) => {
    child.position.x = Math.cos(startAngle) * distance;
    child.position.z = Math.sin(startAngle) * distance;
    orbitGroup.add(child);
  });

  const rate = 100 - 1.0;
  orbitGroup.userData.update = (t) => {
    // orbitGroup.rotation.y = t * rate;

    const M = ((t * rate) / (500 - 1)) * 2 * Math.PI; // Mean anomaly

    // Solve Kepler's equation for eccentric anomaly
    let E = M;
    for (let j = 0; j < 10; j++) {
      E = M + e * Math.sin(E); // Iterative approximation
    }

    const trueAnomaly =
      2 *
      Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
      );

    // Distance from the focus (Sun) to the orbiting body
    const r = a * (1 - e * Math.cos(E));

    // Position in the plane of the orbit
    const xOrbitalPlane = r * Math.cos(trueAnomaly);
    const yOrbitalPlane = r * Math.sin(trueAnomaly);

    // Apply rotation to account for the inclination, argument of periapsis, and longitude of ascending node
    planet.position.x =
      xOrbitalPlane *
        (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i)) -
      yOrbitalPlane *
        (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i));

    planet.position.y =
      xOrbitalPlane *
        (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i)) +
      yOrbitalPlane *
        (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i));

    planet.position.z =
      xOrbitalPlane * Math.sin(ω) * Math.sin(i) +
      yOrbitalPlane * Math.cos(ω) * Math.sin(i);

    children.forEach((child) => {
      child.userData.update?.(t);
    });
  };
  orbitGroup.add(planet);
  return orbitGroup;
}

export default getPlanet;