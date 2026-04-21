// 1. SCENE SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xfbfbfd, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. STUDIO LIGHTING (Balanced for Space Grey)
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.SpotLight(0xffffff, 1.8);
keyLight.position.set(5, 10, 5);
keyLight.castShadow = true;
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xffffff, 0.7);
rimLight.position.set(-5, 2, 4);
scene.add(rimLight);

// 3. THE SPACE GREY M1 AIR
const laptopGroup = new THREE.Group();
scene.add(laptopGroup);

// --- NEW: AUTHENTIC SPACE GREY MATERIAL ---
const spaceGrayMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x3b3b3b, // Deep matte charcoal
    metalness: 0.9, 
    roughness: 0.28, 
    clearcoat: 0.2,
    clearcoatRoughness: 0.1
});

// A. Wedge Base
const baseGeom = new THREE.BoxGeometry(3.6, 0.12, 2.6, 1, 1, 15);
const pos = baseGeom.attributes.position;
for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    if (z > 0) pos.setY(i, pos.getY(i) * (1 - (z/1.3) * 0.9)); 
}
baseGeom.computeVertexNormals();
const base = new THREE.Mesh(baseGeom, spaceGrayMat);
base.receiveShadow = true;
laptopGroup.add(base);

// --- NEW: THE TRACKPAD (Matching your photo) ---
const trackpadGeom = new THREE.PlaneGeometry(1.3, 0.85);
const trackpadMat = new THREE.MeshStandardMaterial({ 
    color: 0x333333, 
    roughness: 0.4,
    metalness: 0.1
});
const trackpad = new THREE.Mesh(trackpadGeom, trackpadMat);
trackpad.rotation.x = -Math.PI / 2;
trackpad.position.set(0, 0.062, 0.82); 
base.add(trackpad);

// --- NEW: HIGH-DETAIL KEYBOARD (Matching Apple Layout) ---
function createAppleKeyboardTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Keyboard Bed
    ctx.fillStyle = '#111111'; 
    ctx.fillRect(0, 0, 1024, 512);
    
    // Speaker Grills (Dots on the sides)
    ctx.fillStyle = '#1a1a1a';
    for(let i=0; i<300; i++) {
        ctx.fillRect(10 + Math.random()*70, 40 + Math.random()*400, 1.5, 1.5);
        ctx.fillRect(940 + Math.random()*70, 40 + Math.random()*400, 1.5, 1.5);
    }

    const rows = [
        ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
        ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'del'],
        ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
        ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'enter'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
        ['fn', '^', 'opt', 'cmd', ' ', 'cmd', 'opt', '<', 'v', '>']
    ];

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';

    rows.forEach((row, rIdx) => {
        row.forEach((key, kIdx) => {
            const keyW = key === ' ' ? 300 : (key.length > 2 ? 85 : 60);
            const x = 100 + kIdx * 65 + (key === ' ' ? 50 : 0);
            const y = 50 + rIdx * 70;
            
            // Key Cap
            ctx.fillStyle = '#1e1e1e';
            ctx.beginPath();
            ctx.roundRect(x, y, keyW - 5, 60, 6);
            ctx.fill();
            
            // Key Legend (Text)
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(key, x + keyW/2 - 2, y + 35);
        });
    });
    return new THREE.CanvasTexture(canvas);
}

const keyboard = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 1.3),
    new THREE.MeshStandardMaterial({ map: createAppleKeyboardTexture() })
);
keyboard.rotation.x = -Math.PI / 2;
keyboard.position.set(0, 0.061, -0.28);
base.add(keyboard);

// B. Hinge & Lid
const hinge = new THREE.Group();
hinge.position.set(0, 0.06, -1.3);
base.add(hinge);

const lid = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.05), spaceGrayMat);
lid.position.set(0, 1.3, 0); 
lid.castShadow = true;
hinge.add(lid);

// C. Bezel & Screen (STABLE RECTANGLES)
const bezel = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 2.5), 
    new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1 })
);
bezel.position.set(0, 1.3, 0.026);
hinge.add(bezel);

function createRetinaUI() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 840;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, 1200, 840);
    ctx.textAlign = 'center'; 
    ctx.fillStyle = '#1d1d1f';
    ctx.font = 'bold 90px sans-serif'; 
    ctx.fillText("HELLO, I AM ADIL", 600, 380);
    ctx.fillStyle = '#0071e3'; 
    ctx.font = '500 50px sans-serif'; 
    ctx.fillText("WEB DEVELOPER", 600, 480);
    return new THREE.CanvasTexture(canvas);
}

const screenMat = new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0, roughness: 0.1, clearcoat: 1.0 });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), screenMat);
screen.position.set(0, 1.3, 0.028);
hinge.add(screen);

// 4. ANIMATION LOGIC (UNCHANGED)
gsap.registerPlugin(ScrollTrigger);
hinge.rotation.x = Math.PI / 2; // CLOSED

const updateLayout = () => {
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.5 : 0.9;
    laptopGroup.scale.set(scale, scale, scale);
    laptopGroup.position.set(isMobile ? 0 : 2, isMobile ? -1 : -0.5, 0);
    laptopGroup.rotation.y = isMobile ? 0 : -0.4;
};
updateLayout();

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
    }
});

tl.to(hinge.rotation, { x: -0.1, duration: 2 }, 0)
  .to(laptopGroup.position, { x: 0, y: -0.2, z: 4, duration: 2 }, 0) 
  .to(laptopGroup.rotation, { y: 0, x: 0.1, duration: 2 }, 0);

tl.call(() => {
    screenMat.map = createRetinaUI();
    screenMat.opacity = 1;
    screenMat.needsUpdate = true;
}, null, 1.2);

tl.to({}, { duration: 1 }); 

tl.to(laptopGroup.position, { y: 15, z: -10, duration: 3, ease: "power2.in" }, "+=0.5");
tl.to(laptopGroup.rotation, { x: 0.8, y: -1.5, duration: 3 }, "-=3");

// 5. RENDER LOOP
function animate() {
    requestAnimationFrame(animate);
    if(tl.scrollTrigger.progress < 0.05) {
        laptopGroup.position.y += Math.sin(Date.now() * 0.002) * 0.0005;
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateLayout();
});

animate();