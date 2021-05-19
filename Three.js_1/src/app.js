import './style.scss'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { AnimationClip, AnimationMixer, DoubleSide,VectorKeyframeTrack, Mesh, Skeleton, Bone, SkeletonHelper, SkinnedMesh} from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


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

 let fonlderSpring = gui.addFolder('Spring')
/**
 * Models
 */

const gltfLoader = new GLTFLoader()
let mixer = null

gltfLoader.load(
    'Fox/glTF/Fox.gltf',
    (gltf)=>{
        let animationNumber = 0
        let a = 0

        let  model = gltf.scene;

        mixer = new THREE.AnimationMixer(model)
    
        let skelet =  new THREE.SkeletonHelper(model)
        skelet.visible = false
        scene.add(skelet)
    
        folderFox.open()

        let settings = {
            'visible': false, 
            'animation': 0,
            'deactivate all': deactivateAllActions
        }


        folderFox.add(settings, 'visible').onChange(showSkeleton).name('skeleton')

        function showSkeleton(visibility){
            skelet.visible = visibility
        }

        function deactivateAllActions(){
            let anim = gltf.animations
            
            for(let i=0; i<anim.length; i++){
                mixer.clipAction(anim[i]).stop()
               
            }
            
        
        }

        folderFox.add(settings, 'animation').onChange(getanimation).name('animation [0-2]')
        folderFox.add(settings, 'deactivate all')

        //For dat.gui model
        function getanimation(animationNumber){
            
         mixer.clipAction(gltf.animations[a]).stop()
         mixer.clipAction(gltf.animations[animationNumber]).play()
            
           a = animationNumber
        }

        //Shadows
        updateShadows(model)
        model.scale.set(0.025, 0.025, 0.025)
        model.rotation.y = 180
        model.position.set(1, 0, 0)

        scene.add(model)
    },
)

//update materials for shadows
const updateShadows = (model) =>
{
    model.traverse( function( node ) {
        if ( node.isMesh ) { node.castShadow = true; }
    } );
}

/**
 * SKELET
 */
 const bones = [];

 const body = new THREE.Bone();
 const face = new THREE.Bone();
 const handRight = new THREE.Bone();
 const legLeft = new THREE.Bone();
 const handLeft = new THREE.Bone();
 const legRight = new THREE.Bone();


body.add(face, handRight, face, handLeft, legLeft, legRight)
bones.push(body, handRight, face, handLeft, legLeft, legRight)

body.position.x = 1
face.position.y = 0.5
handRight.position.x = 1
handLeft.position.x = -1
legLeft.position.y = -2
legLeft.position.x = 0.5
legRight.position.y = -2
legRight.position.x = -0.5


 const geometry = new THREE.SphereGeometry( 0.1, 10);

// create skinned mesh and skeleton
const mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial(
    {
        wireframe:false, 
        metalness:0.5,
        roughness:0.5, 
        color:'lightblue', 
        opacity:0.5,
    }
));

const vertex1 = new THREE.Vector3();

const skinIndices1 = [];
const skinWeights1 = [];

const position1 = geometry.attributes.position

     for ( let i = 0; i < position1.count; i ++ ) {
    
        vertex1.fromBufferAttribute( position1, i );
    
        const y =  vertex1.y + 10;
    
        const skinIndex1 = Math.floor(y/10) - 1
        const skinWeight1 = (y % 10)  / 2
    
        skinIndices1.push( skinIndex1, skinIndex1 + 1, 0, 0 );
        skinWeights1.push( 1 -skinWeight1, skinWeight1, 0, 0 );
    
     }
    
     geometry.setAttribute( 'skinIndex1', new THREE.Uint16BufferAttribute( skinIndices1, 4 ) );
     geometry.setAttribute( 'skinWeight1', new THREE.Float32BufferAttribute( skinWeights1, 4 ) );

const skeleton = new THREE.Skeleton( bones );

// see example from THREE.Skeleton
const rootBone = skeleton.bones[ 0 ];
mesh.add( rootBone );

// bind the skeleton to the mesh
mesh.bind( skeleton );


//Shadow
//  mesh.receiveShadow = true
//  mesh.castShadow = true


let sk = new THREE.SkeletonHelper(mesh)
skeleton.visible = true

mesh.position.set(2, 2, -3)

//ANIMATION PERSON
const time = [3, 4, 5, 6, 7]
const values = [
   
   -1, 0, 0, 
   -1, 0.25, 0, 
   -1, 0, 0, 
   -1, -0.25, 0,
   -1, 0, 0

]
const positionFK= new VectorKeyframeTrack('.skeleton.bones[3].position', time, values)

const opcaityClip1 = new AnimationClip('move11', -1, [positionFK])


const mixer1 = new AnimationMixer(mesh)
 mixer1.clipAction(opcaityClip1).play()

//  const updateAmount = 3
// //  mixer2.update(updateAmount)
// mesh.castShadow = true
// console.log(mesh.animations)
scene.add(sk)
scene.add(mesh)

/**
 * SKELET SPRING
 */
const springBones = []

let bone1 = new THREE.Bone()
let bone2 = new THREE.Bone()
let bone3 = new THREE.Bone()
let bone4 = new THREE.Bone()

bone1.add(bone2)
bone2.add(bone3)
bone3.add(bone4)
springBones.push(bone1, bone2, bone3, bone4)

bone1.position.set(1, 0, 0)
bone2.position.set(0, 0.8, 0)
bone3.position.set(-2, 0, 0)
bone4.position.set(0, -0.8, 0)


const springGeometry = new THREE.TorusGeometry(1, 0.4, 9, 10, 3)

const springMesh = new THREE.SkinnedMesh(
    springGeometry, 
    new THREE.MeshStandardMaterial({
        skinning:true,
        //wireframe:true,
    }))


const vertex = new THREE.Vector3();

const skinIndices = [];
const skinWeights = [];

const position = springGeometry.attributes.position

     for ( let i = 0; i < position.count; i ++ ) {
    
        vertex.fromBufferAttribute( position, i );
    
        const y =  vertex.y + 10;
        const x = vertex.x ;
    
        const skinIndex = Math.floor(y/10) - 1
        const skinWeight = (y % 10)  / 2
    
        skinIndices.push( skinIndex, skinIndex + 1, 0, 0 );
        skinWeights.push( 1 -skinWeight, skinWeight, 0, 0 );
    
     }
    
     springGeometry.setAttribute( 'skinIndex', new THREE.Uint16BufferAttribute( skinIndices, 4 ) );
     springGeometry.setAttribute( 'skinWeight', new THREE.Float32BufferAttribute( skinWeights, 4 ) );
    

const skeletSpring = new THREE.Skeleton(springBones)


const rootBone1 = skeletSpring.bones[ 0 ];
springMesh.add(rootBone1)
springMesh.bind(skeletSpring)


springMesh.position.set(-1.5, 0, -2)
const skHelper = new SkeletonHelper(springMesh)
fonlderSpring.open()

fonlderSpring.add(springMesh.skeleton.bones[1].position, 'x').name('position x').max(10).min(-10)
fonlderSpring.add(springMesh.skeleton.bones[1].position, 'y').name('position y').max(10).min(-10)

skeletSpring.visible = true
const moveSpring0 = new VectorKeyframeTrack('mesh.skeleton.bones[0].position', [2, 4, 6, 8, 10], 
 [0, 0, 0, 
  -0.5, 0, 0, 
  -1, 0, 0, 
  -0.5, 0, 0, 
  0, 0, 0  
])
 const moveSpring1 = new VectorKeyframeTrack('mesh.skeleton.bones[1].position', [2, 4, 6, 8, 10], 
 [0, 1, 0, 
  -0.5, 1, 0, 
  -1, 1, 0,
  -0.5, 1, 0,
  0, 1, 0  
])
const moveSpring2 = new VectorKeyframeTrack('mesh.skeleton.bones[2].position', [2, 4, 6, 8, 10], 
[-1.5, 0, 0, 
 -1.5, 0, 0, 
 -1.5, 0, 0, 
 -1.5, 0, 0,
 -1.5, 0, 0,
])
const moveSpring3 = new VectorKeyframeTrack('mesh.skeleton.bones[3].position', [2, 4, 6, 8, 10], 
[-0.5, -1, 0, 
 0, -1, 0, 
 0, -1, 0,
 -0.5, -1, 0,
 -0.5, -1, 0,
])

const traks = [moveSpring0, moveSpring1, moveSpring2, moveSpring3]
const opcaityClip = new AnimationClip('move', -1, traks)

 const mixer2 = new AnimationMixer(springMesh)
const action = mixer2.clipAction(opcaityClip)

action.play()
//   const updateAmount = 3
//  mixer2.update(updateAmount)
  
 //console.log(opcaityClip)
// mesh.castShadow = true
// console.log(mesh.animations)
// scene.add(sk)
// scene.add(mesh)
springMesh.receiveShadow = true
springMesh.castShadow = true

scene.add(skHelper, springMesh)


/**
 * Floor
 */

 const floor = new THREE.Mesh (
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color:'lightgreen',
        metalness:0,
        roughness:0.5,
       side:DoubleSide
    }) 
)
floor.rotation.x = Math.PI * 0.5
floor.receiveShadow = true

scene.add(floor)

/**
 * Light
 */

const hemisphereLight = new THREE.HemisphereLight('#87CEEB', '#3CB371', 0.5)
scene.add(hemisphereLight)

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)

const pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
pointLight.position.set( -1, 5, 2 );
pointLight.castShadow = true
scene.add( pointLight )

gui.add(pointLight.position, 'x').max(50).min(-50).name('Position light - x')
gui.add(pointLight.position, 'z').max(50).min(-50).name('Position light - z')


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
})


//Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(-2, 1, -7)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

 const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true



/**
 * Animate
 */

const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = ()=>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //animation
    if(mixer){
        mixer.update(deltaTime)
    }

    controls.update()
    //mesh.skeleton.bones[ 0 ].position.y = Math.sin(elapsedTime)
    mixer2.update(deltaTime)
    mixer1.update(deltaTime)
    renderer.render(scene, camera)


    window.requestAnimationFrame(tick)
}

tick()

