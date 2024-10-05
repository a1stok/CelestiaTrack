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

camera.position.set(0, 1, 5); // Adjust these values as needed
camera.lookAt(0, 1, 0); // Make sure the camera is looking at the center of your model

let mixer;

loader.load(
	// resource URL
	'objects/sun/the_sun.glb',
	// called when the resource is loaded
	function ( gltf ) {
		// mixer = new THREE.AnimationMixer( gltf.scene );
		// var action = mixer.clipAction( gltf.animations[ 0 ] );
		// action.play();
		const model = gltf.scene;
		scene.add( model );
		// scene.add( gltf.scene );
		mixer = new THREE.AnimationMixer(model);

		// Check for animations in the loaded model
		gltf.animations.forEach((clip) => {
			mixer.clipAction(clip).play(); // Play the animation
		});

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




renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

// const geometry = new THREE.BoxGeometry( 0.5, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


// renderer.render( scene, camera );


function animate() {
    requestAnimationFrame(animate);

    // Update the mixer if it exists
    if (mixer) {
        mixer.update(0.01); // Update the animation
    }

    renderer.render(scene, camera);
}

animate();