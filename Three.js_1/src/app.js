import './style.scss'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    FirstPersonControls
} from 'three/examples/jsm/controls/FirstPersonControls.js';
import {
    PointerLockControls
} from 'three/examples/jsm/controls/PointerLockControls.js';
import {
    DoubleSide
} from 'three'


/**
 * Base
 */

//Debug
const gui = new dat.GUI()

const canvas = document.querySelector('canvas')

//SCENE 
const scene = new THREE.Scene()

/**
 * Settings
 */
let folderFox = gui.addFolder(`Fox`)

/**
 * Models
 */

const gltfLoader = new GLTFLoader()
let mixer = null

gltfLoader.load(
    'Fox/glTF/Fox.gltf',
    (gltf) => {
        let animationNumber = 0
        let a = 0

        let model = gltf.scene;

        mixer = new THREE.AnimationMixer(model)

        mixer.clipAction(gltf.animations[1]).play()

        //Shadows
        updateShadows(model)
        model.scale.set(0.025, 0.025, 0.025)
        model.rotation.y = 180
        model.position.set(0, -4, 0)

        scene.add(model)
    },
)

//update materials for shadows
const updateShadows = (model) => {
    model.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });
}

/**
 * TEXTURES
 */
const cubeTextures = new THREE.CubeTextureLoader()
const environmentMap = cubeTextures.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

scene.fog = new THREE.Fog('black', 10, 20);

/**
 * CUBE
 */
function createcub(material = 0, randomNum2 = 0) {
    let materials = [
        new THREE.LineBasicMaterial({
            color: 'pink', 
            linecap:'square'
        }),
        new THREE.PointsMaterial({
            color: 'blue'
        }),
        new THREE.SpriteMaterial({
            color: 'green'
        }),
        new THREE.MeshStandardMaterial({
            color: 'black', 
            metalness:1
        }),
        new THREE.MeshBasicMaterial({
            color: 'lightblue'
        }),
        new THREE.MeshPhongMaterial({
            color: 'orange'
        }),
        new THREE.MeshLambertMaterial({
            color: "purple"
        }),
        new THREE.MeshNormalMaterial({

        }),
        new THREE.ShaderMaterial(),
        new THREE.MeshPhysicalMaterial({
            roughness:1,
        }),
        new THREE.ShadowMaterial()
    ]
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(1),
        materials[material]
    )
    cube.position.set(Math.sin(randomNum2)+4, Math.cos(randomNum2), randomNum2)
    scene.add(cube)
    cube.add( sound2 );

}


/**
 * Light
 */

const hemisphereLight = new THREE.HemisphereLight('#87CEEB', '#f9d0d3', 0.5)
scene.add(hemisphereLight)

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-15, 4, -3);
pointLight.castShadow = true
scene.add(pointLight)

gui.add(pointLight.position, 'x').max(50).min(-50).name('Position light - x')
gui.add(pointLight.position, 'z').max(50).min(-50).name('Position light - z')

//HELPER//
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
//scene.add( pointLightHelper );


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
})


//Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 1, 1)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.listenToKeyEvents(window); // optional

controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

controls.minDistance = 3;
controls.maxDistance = 100;

controls.maxPolarAngle = Math.PI / 2;

controls.keys = {
    LEFT: 'ArrowRight', //left arrow
    UP: 'ArrowDown', // up arrow
    RIGHT: 'ArrowLeft', // right arrow
    BOTTOM: 'ArrowUp' // down arrow
}

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

const controlsWalk = new FirstPersonControls(camera, renderer.domElement);
controlsWalk.movementSpeed = 1;
controlsWalk.lookSpeed = 0.01;
controlsWalk.activeLook = false




/**
 * AUDIO
 */
function playAudio() {
    const listener = new THREE.AudioListener();
    scene.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/sound/bird.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.1);
        gui.add(sound, 'play')
    });
}

playAudio()

var raycaster, mouse = {
    x: 0,
    y: 0
};
raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('dblclick', raycast, false);


const listener2 = new THREE.AudioListener();
camera.add( listener2 );

// create the PositionalAudio object (passing in the listener)
const sound2 = new THREE.PositionalAudio( listener2 );

// load a sound and set it as the PositionalAudio object's buffer
const audioLoader2 = new THREE.AudioLoader();
audioLoader2.load( '/sound/hit.mp3', function( buffer ) {
	sound2.setBuffer( buffer );
	sound2.setRefDistance( 20 );
	//sound2.play();
});

// finally add the sound to the mesh



function raycast(e) {

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children);

    let randomNum = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
    let randomNum2 = Math.random() * 10 -1 
    createcub(randomNum, randomNum2)

    console.log('num'+randomNum)
    sound2.play()
    for (let i = 0; i < intersects.length; i++) {

        //intersects[ i ].object.material.color.set( 0x00ff00 )
        console.log(randomNum)
    }

}
createcub()

/**
 * Animate
 */

const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //animation
    if (mixer) {
        mixer.update(deltaTime)
    }

    controls.update()
    //controlsWalk.update(deltaTime)
    renderer.render(scene, camera)


    window.requestAnimationFrame(tick)
}

tick()