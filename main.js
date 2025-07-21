// Import Three.js and GLTFLoader as modules directly from CDN URLs
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene-container').appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// --- Starfield Background ---
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}
createStarfield();

// --- Earth Model (Placeholder) ---
let earth;
function createEarth() {
    // Placeholder: Sphere for Earth
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.3, roughness: 0.7 }); // Blue sphere
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
}
createEarth();

// --- Satellite Model (Placeholder with clickable parts) ---
let satelliteGroup;
let orbitGroup; // Parent group for satellite to control its orbit around Earth

function createSatellite() {
    satelliteGroup = new THREE.Group();

    // Placeholder: Satellite Body (Main Cube)
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    satelliteGroup.add(body);

    // Placeholder: Solar Panel 1 (Wing 1) - Clickable for "About Me"
    const panelGeometry = new THREE.BoxGeometry(0.1, 2, 1);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.8, roughness: 0.2 }); // Green
    const solarPanel1 = new THREE.Mesh(panelGeometry, panelMaterial);
    solarPanel1.position.set(-0.8, 0, 0); // Position relative to body
    solarPanel1.name = 'solarPanel1'; // Important for raycasting
    satelliteGroup.add(solarPanel1);

    // Placeholder: Solar Panel 2 (Wing 2) - Clickable for "Clients"
    const solarPanel2 = new THREE.Mesh(panelGeometry, panelMaterial);
    solarPanel2.position.set(0.8, 0, 0); // Position relative to body
    solarPanel2.name = 'solarPanel2'; // Important for raycasting
    satelliteGroup.add(solarPanel2);

    // Placeholder: Antenna - Clickable for "Contact Me"
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1.5, 16);
    const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.6, roughness: 0.4 }); // Yellow
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, 0.75, 0); // Position on top of body
    antenna.name = 'antenna'; // Important for raycasting
    satelliteGroup.add(antenna);

    // Placeholder: Screen - Clickable for "Projects"
    const screenGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.05);
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff, metalness: 0.1, roughness: 0.9 }); // Magenta
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 0.5); // Position on front of body
    screen.name = 'screen'; // Important for raycasting
    satelliteGroup.add(screen);

    // Create a parent group for the satellite to control its orbit around Earth
    orbitGroup = new THREE.Group();
    orbitGroup.add(satelliteGroup);
    scene.add(orbitGroup);

    // Position the satellite group relative to its orbit group (distance from Earth)
    satelliteGroup.position.set(10, 0, 0); // Satellite is 10 units away from Earth's center
}
createSatellite();

// --- Camera Position ---
camera.position.set(0, 15, 20); // Adjust camera to see Earth and satellite
camera.lookAt(earth.position);

// --- GLTFLoader for future model imports ---
const loader = new GLTFLoader(); // Use the imported GLTFLoader

// Load Earth Model from the assets folder
loader.load(
    './earth-cartoon.glb', // Corrected Earth model path
    function (gltf) {
        // Remove placeholder Earth
        scene.remove(earth);
        earth = gltf.scene; // The loaded scene contains your Earth model
        scene.add(earth);
        // Adjust position/scale if needed.
        // Example: earth.scale.set(5, 5, 5);
        // Example: earth.position.set(0, 0, 0);
    },
    undefined, // Progress callback (optional)
    function (error) {
        console.error('An error occurred while loading the Earth model:', error);
    }
);

// Load Satellite Model from the assets folder
loader.load(
    './assets/satelajt.glb', // Corrected Satellite model path
    function (gltf) {
        // Remove placeholder satellite parts
        orbitGroup.remove(satelliteGroup); // Remove the entire placeholder group

        // The loaded GLTF scene is your new satellite group
        satelliteGroup = gltf.scene;

        // IMPORTANT: Re-assign names for raycasting using the exact names from your Blender export.
        const screenMesh = satelliteGroup.getObjectByName('Button');
        if (screenMesh) {
            screenMesh.name = 'screen'; // This name must match the one in your switch statement
        }
        const antennaMesh = satelliteGroup.getObjectByName('Antena');
        if (antennaMesh) {
            antennaMesh.name = 'antenna';
        }
        const solarPanel1Mesh = satelliteGroup.getObjectByName('Paneli1');
        if (solarPanel1Mesh) {
            solarPanel1Mesh.name = 'solarPanel1';
        }
        const solarPanel2Mesh = satelliteGroup.getObjectByName('Paneli2');
        if (solarPanel2Mesh) {
            solarPanel2Mesh.name = 'solarPanel2';
        }

        // Add the loaded model to the orbit group
        orbitGroup.add(satelliteGroup);

        // Adjust position/scale if needed.
        // The satelliteGroup's position is relative to its orbitGroup.
        // Ensure it's still 10 units away from the Earth's center if that's your desired orbit radius.
        satelliteGroup.position.set(10, 0, 0);
        // Example: satelliteGroup.scale.set(0.5, 0.5, 0.5);
    },
    undefined, // Progress callback (optional)
    function (error) {
        console.error('An error occurred while loading the Satellite model:', error);
    }
);

// --- Raycasting for Interactions ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the ray from the satellite group's children
    // true means it will check all descendants of the satelliteGroup
    const intersects = raycaster.intersectObjects(satelliteGroup.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked:', clickedObject.name);

        // Open corresponding overlay based on clicked object's name
        switch (clickedObject.name) {
            case 'screen':
                showOverlay('projects-overlay');
                break;
            case 'antenna':
                showOverlay('contact-overlay');
                break;
            case 'solarPanel1':
                showOverlay('about-overlay');
                break;
            case 'solarPanel2':
                showOverlay('clients-overlay');
                break;
            default:
                // Clicked on satellite body or other non-interactive part
                break;
        }
    }
}
window.addEventListener('click', onMouseClick, false);

// --- Mouse Scroll for Satellite Orbit ---
function onMouseWheel(event) {
    // Adjust orbit speed based on scroll direction
    // event.deltaY is positive when scrolling down, negative when scrolling up
    orbitGroup.rotation.y += event.deltaY * 0.001; // Slower rotation
}
window.addEventListener('wheel', onMouseWheel, false);

// --- UI Overlay Management ---
const overlays = {
    'projects-overlay': document.getElementById('projects-overlay'),
    'contact-overlay': document.getElementById('contact-overlay'),
    'about-overlay': document.getElementById('about-overlay'),
    'clients-overlay': document.getElementById('clients-overlay')
};

// Add event listeners to all close buttons
document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const overlay = event.target.closest('.overlay');
        if (overlay) {
            hideOverlay(overlay.id);
        }
    });
});

function showOverlay(id) {
    if (overlays[id]) {
        overlays[id].classList.remove('hidden');
    }
}

function hideOverlay(id) {
    if (overlays[id]) {
        overlays[id].classList.add('hidden');
    }
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth for a subtle effect
    // Only rotate if the earth object is still the placeholder or if your loaded GLB has a rotation point
    if (earth && earth.isMesh) { // Check if it's a direct mesh (placeholder)
         earth.rotation.y += 0.001;
    } else if (earth && earth.isGroup) { // If it's a loaded GLTF scene (group)
        earth.rotation.y += 0.001;
    }


    // Rotate the satellite itself slightly to make it look dynamic
    // Only rotate if the satelliteGroup object is still the placeholder or if your loaded GLB has a rotation point
    if (satelliteGroup && satelliteGroup.isGroup) {
        satelliteGroup.rotation.y += 0.002;
        satelliteGroup.rotation.x = Math.sin(Date.now() * 0.0001) * 0.05; // Slight wobble
    }

    renderer.render(scene, camera);
}
animate(); // Start the animation loop

// --- Handle Window Resizing ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);