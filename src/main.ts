import * as THREE from 'three';

// Global variables
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let sphere: THREE.Mesh;
let stars: THREE.Points;
let starGeo: THREE.BufferGeometry;
let analyser: THREE.AudioAnalyser | null = null;
let sound: THREE.Audio;
let animationId: number;

// 1. DYNAMIC UI SETUP (No more HTML dependency!)
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'file-upload';
fileInput.accept = 'audio/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

const controls = document.createElement('div');
Object.assign(controls.style, {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    display: 'flex', flexDirection: 'column', gap: '20px', zIndex: '10', alignItems: 'center'
});
document.body.appendChild(controls);

const uploadBtn = document.createElement('button');
uploadBtn.innerText = 'CHOOSE YOUR TRACK';
applyButtonStyle(uploadBtn);
controls.appendChild(uploadBtn);

const stopBtn = document.createElement('button');
stopBtn.innerText = 'STOP';
applyButtonStyle(stopBtn);
stopBtn.style.display = 'none';
controls.appendChild(stopBtn);

function applyButtonStyle(el: HTMLButtonElement) {
    Object.assign(el.style, {
        padding: '15px 30px', background: 'rgba(255,255,255,0.1)', color: '#fff', 
        border: '1px solid #fff', cursor: 'pointer', letterSpacing: '2px',
        borderRadius: '4px', backdropFilter: 'blur(5px)', width: '250px',
        fontFamily: 'monospace'
    });
}

// 2. EVENT LISTENERS
uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const url = URL.createObjectURL(file);
        initExperience(url);
    }
});

stopBtn.addEventListener('click', stopExperience);

// 3. INITIALIZE 3D & AUDIO
function initExperience(audioUrl: string): void {
    uploadBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    controls.style.bottom = '90%';

    if (!scene) {
        setupThreeJS();
    }

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(audioUrl, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
        analyser = new THREE.AudioAnalyser(sound, 32);
        animate();
    });
}

function setupThreeJS(): void {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 4);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const starCount = 6000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 600;
    starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 }));
    scene.add(stars);

    const listener = new THREE.AudioListener();
    camera.add(listener);
    sound = new THREE.Audio(listener);
}

function stopExperience(): void {
    if (sound && sound.isPlaying) sound.stop();
    cancelAnimationFrame(animationId);
    stopBtn.style.display = 'none';
    uploadBtn.style.display = 'block';
    uploadBtn.innerText = 'CHOOSE NEW TRACK';
    controls.style.top = '50%';
}

function animate(): void {
    animationId = requestAnimationFrame(animate);
   if (analyser) {
    const data = analyser.getAverageFrequency();
    const shake = data / 2500; // Subtle shake
    camera.position.x = Math.sin(Date.now() * 0.01) * shake;
    camera.position.y = Math.cos(Date.now() * 0.01) * shake;
}
    if (analyser && sphere) {
        const data = analyser.getAverageFrequency();
        const scale = 1 + (data / 80);
        sphere.scale.set(scale, scale, scale);
        sphere.rotation.y += 0.005 + (data / 1000);

        const positions = starGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += 0.2 + (data / 40);
            if (positions[i + 2] > 5) positions[i + 2] = -500;
        }
        starGeo.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});