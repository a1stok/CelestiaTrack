import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});
document.body.appendChild( renderer.domElement );
const loader = new GLTFLoader();

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

camera.position.set(0, 5, 10);
camera.lookAt(scene.position); //add this line

loader.load(
	// resource URL
	'objects/sun/the_sun.glb',
	// called when the resource is loaded
	function ( gltf ) {
		// mixer = new THREE.AnimationMixer( gltf.scene );
		// var action = mixer.clipAction( gltf.animations[ 0 ] );
		// action.play();
	
		scene.add( gltf.scene );
		// scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log(error );

	}
);

// loader.load( 'objects/planets/mercury/Mercury_1_4878.glb', function ( gltf ) {
// loader.load( 'objects/sun/the_sun/scene.gltf', function ( gltf ) {

// 	scene.add( gltf.scene );
//     console.log('ok')
//     gltf.animations; // Array<THREE.AnimationClip>
// 		gltf.scene; // THREE.Group
// 		gltf.scenes; // Array<THREE.Group>
// 		gltf.cameras; // Array<THREE.Camera>
// 		gltf.asset; // Object

// }, undefined, function ( error ) {

// 	console.error( error );

// } );




renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

// const geometry = new THREE.BoxGeometry( 0.5, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


renderer.render( scene, camera );



// animate()



function animate() {
    requestAnimationFrame(animate)
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
	console.log('asdas')

}

// animate()