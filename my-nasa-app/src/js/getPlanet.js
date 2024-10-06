import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';
import earth from '../images/textures/earth.png'
import mercury from '../images/textures/mercury.png'
import venus from '../images/textures/venus.png'
import mars from '../images/textures/mars.png'
import saturn from '../images/textures/saturn.png'
import neptune from '../images/textures/neptune.png'
import jupiter from '../images/textures/jupiter.png'
import uranus from '../images/textures/uranus.png'
import moon from '../images/textures/moon.png'

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
  uranus
}

function getPlanet({ children = [], distance = 0, img = '', size = 1 }) {
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = Math.random() * Math.PI * 2;

    const texturePath = textureMap[img];

    // const path = `./src/images/textures/${img}`;
    // const path = {img}
    // console.log(path)
    
    const map = texLoader.load(texturePath, () =>{ console.log('loaded properly')  }, undefined, (error)=>{console.error('error loading')});
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

    const rate = Math.random() * 1 - 1.0;
    orbitGroup.userData.update = (t) => {
      orbitGroup.rotation.y = t * rate;
      children.forEach((child) => {
        child.userData.update?.(t);
      });
    };
    orbitGroup.add(planet);
    return orbitGroup;
  }

  export default getPlanet;