if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 1. SCENE SETUP 
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f172a, 0.015); 

function getLayoutConfig() {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    // Dynamic Grid Columns based on screen size
    const cols = isMobile ? 1 : (isTablet ? 2 : 3);
    
    return {
        isMobile: isMobile,
        cameraZ: isMobile ? 22 : 18, 
        // MASSIVE LAPTOP SCALING
        laptopScale: isMobile ? 1.2 : 1.7, 
        laptopY: isMobile ? -0.8 : -1.5, 
        
        // Grid Card Dimensions
        cardW: isMobile ? 4.5 : 5.0,
        cardH: isMobile ? 2.4 : 2.8,
        gapX: isMobile ? 0 : 5.5,
        gapY: isMobile ? 2.8 : 3.3,
        cols: cols
    };
}
let config = getLayoutConfig();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, config.cameraZ);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. STUDIO LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.5); 
keyLight.position.set(0, 10, 8); 
keyLight.castShadow = true;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0); 
rimLight.position.set(-5, -5, -5);
scene.add(rimLight);

// 3. THE MASSIVE MACBOOK (Space Grey)
const laptopGroup = new THREE.Group();
scene.add(laptopGroup);

const spaceGreyMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x64748b, metalness: 0.8, roughness: 0.2, clearcoat: 0.4 
});

const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 2.6, 1, 1, 15), spaceGreyMat);
base.receiveShadow = true; base.castShadow = true; laptopGroup.add(base);

const trackpadMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.2 });
const trackpad = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.85), trackpadMat);
trackpad.rotation.x = -Math.PI / 2; trackpad.position.set(0, 0.062, 0.82); base.add(trackpad);

function createPitchBlackKeyboard() {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512; const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, 1024, 512); 
    
    const rows = [
        ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
        ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'del'],
        ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
        ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'enter'],
        ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
        ['fn', '^', 'opt', 'cmd', ' ', 'cmd', 'opt', '<', 'v', '>']
    ];

    ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
    rows.forEach((row, rIdx) => {
        row.forEach((key, kIdx) => {
            const keyW = key === ' ' ? 300 : (key.length > 2 ? 85 : 60);
            const x = 100 + kIdx * 65 + (key === ' ' ? 50 : 0);
            const y = 50 + rIdx * 70;
            ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.roundRect(x, y, keyW - 5, 60, 6); ctx.fill(); 
            ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(key, x + keyW/2 - 2, y + 35);
        });
    });
    return new THREE.CanvasTexture(canvas);
}

const keyboard = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.3), new THREE.MeshStandardMaterial({ map: createPitchBlackKeyboard(), roughness: 0.8 }));
keyboard.rotation.x = -Math.PI / 2; keyboard.position.set(0, 0.061, -0.28); base.add(keyboard);

const hinge = new THREE.Group();
hinge.position.set(0, 0.06, -1.3); base.add(hinge);

const lid = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.04), spaceGreyMat);
lid.position.set(0, 1.3, 0); lid.castShadow = true; hinge.add(lid);

const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), new THREE.MeshStandardMaterial({ color: 0x000000 }));
bezel.position.set(0, 1.3, 0.021); hinge.add(bezel);

function createMacDesktopUI() {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 640; const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);

    // Deep macOS Gradient Wallpaper
    const grad = ctx.createLinearGradient(0, 0, 1024, 640);
    grad.addColorStop(0, '#1e1b4b'); grad.addColorStop(0.5, '#7e22ce'); grad.addColorStop(1, '#ea580c'); 
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1024, 640);

    // Top Menu Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; ctx.fillRect(0, 0, 1024, 28);
    ctx.fillStyle = '#ffffff'; ctx.font = '500 14px -apple-system, sans-serif';
    ctx.fillText('   Adil Firoz Khan', 20, 19);
    ctx.font = '400 14px -apple-system, sans-serif'; ctx.fillText('File   Edit   View   Window   Help', 180, 19);
    ctx.fillText('Wi-Fi  100% 🔋   Tue 9:41 AM', 800, 19);
    
    // Dock
    const dockW = 380; const dockH = 65; const dockX = (1024 - dockW) / 2; const dockY = 640 - dockH - 10;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; ctx.beginPath(); ctx.roundRect(dockX, dockY, dockW, dockH, 20); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    colors.forEach((color, i) => {
        ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(dockX + 20 + (i * 70), dockY + 10, 45, 45, 12); ctx.fill();
    });

    // MASSIVE Photo Booth Window
    const pbW = 800; const pbH = 480; const pbX = (1024 - pbW) / 2; const pbY = 45;
    ctx.fillStyle = '#1e1e1e'; ctx.beginPath(); ctx.roundRect(pbX, pbY, pbW, pbH, 12); ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15;
    
    // Title Bar
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#2d2d2d';
    ctx.beginPath(); ctx.roundRect(pbX, pbY, pbW, 36, {tl: 12, tr: 12, bl: 0, br: 0}); ctx.fill();
    ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(pbX + 20, pbY + 18, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(pbX + 40, pbY + 18, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(pbX + 60, pbY + 18, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#aaaaaa'; ctx.font = '500 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Photo Booth', pbX + pbW/2, pbY + 23);

    // Large Viewport Background
    const viewX = pbX + 20; const viewY = pbY + 50; const viewW = pbW - 40; const viewH = pbH - 120;
    ctx.fillStyle = '#000000'; ctx.fillRect(viewX, viewY, viewW, viewH);

    // Load Random Placeholder Image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&h=500&q=80";
    img.onload = () => {
        ctx.drawImage(img, viewX, viewY, viewW, viewH);
        
        // Huge Red Shutter Button
        ctx.fillStyle = '#333333'; ctx.beginPath(); ctx.arc(pbX + pbW/2, pbY + pbH - 35, 28, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(pbX + pbW/2, pbY + pbH - 35, 22, 0, Math.PI*2); ctx.fill();
        tex.needsUpdate = true;
    };
    return tex;
}

const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); 
const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), screenMat);
screen.position.set(0, 1.3, 0.022); hinge.add(screen);

const screenGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.0, transmission: 1.0, transparent: true, opacity: 0.15 }));
screenGlass.position.set(0, 1.3, 0.025); hinge.add(screenGlass);


// 4. THE SPATIAL GRID (Apple Vision Pro Style)
const portfolioData = [
    { title: "Tapless Lounge", cat: "PROJECT", color: "#38bdf8" },
    { title: "Adhikar", cat: "PROJECT", color: "#a855f7" },
    { title: "Prism AI", cat: "PROJECT", color: "#10b981" },
    { title: "Clarity", cat: "PROJECT", color: "#f59e0b" },
    { title: "Bulk QR Gen", cat: "PROJECT", color: "#6366f1" },
    { title: "Setup Tour", cat: "ARCHIVE", color: "#ec4899" },
    { title: "Hackathon '25", cat: "ARCHIVE", color: "#14b8a6" },
    { title: "Weaving Threads", cat: "BOOK", color: "#f43f5e" },
    { title: "Bytes of Time", cat: "BOOK", color: "#8b5cf6" }
];

const gridGroup = new THREE.Group();
scene.add(gridGroup);
const cards = [];

function createGlassCardTexture(data, index) {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512; const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(10, 10, 1004, 492, 30); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = data.color; ctx.beginPath(); ctx.roundRect(10, 10, 20, 492, {tl: 30, bl: 30, tr: 0, br: 0}); ctx.fill();

    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 85px -apple-system, sans-serif'; ctx.fillText(data.title, 80, 280);
    ctx.fillStyle = data.color; ctx.font = 'bold 35px monospace'; ctx.fillText(`> ${data.cat}`, 80, 160);
    
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.font = 'bold 320px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(`0${index+1}`, 960, 420);
    return new THREE.CanvasTexture(canvas);
}

// Generate the puzzle pieces
portfolioData.forEach((item, i) => {
    const tex = createGlassCardTexture(item, i);
    const mat = new THREE.MeshPhysicalMaterial({ 
        map: tex, roughness: 0.1, metalness: 0.3, transmission: 0.5, transparent: true 
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(config.cardW, config.cardH), mat);
    
    // Calculate the perfect grid position
    const col = i % config.cols;
    const row = Math.floor(i / config.cols);
    const xOffset = (config.cols - 1) / 2;
    
    const targetX = (col - xOffset) * config.gapX;
    const targetY = -row * config.gapY;
    
    // Start scattered deep in space and invisible
    mesh.position.set(
        targetX + (Math.random() - 0.5) * 30, 
        targetY - 50, 
        -60 - Math.random() * 30
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.material.opacity = 0; // Start hidden
    
    // Store target for GSAP
    mesh.userData = { x: targetX, y: targetY, z: 0 };
    
    gridGroup.add(mesh);
    cards.push(mesh);
});

function applyInitialLayout() {
    hinge.rotation.x = Math.PI / 2; 
    laptopGroup.position.set(0, config.laptopY, 0);
    laptopGroup.scale.set(config.laptopScale, config.laptopScale, config.laptopScale);
    gridGroup.position.set(0, 0, 0);
    camera.position.set(0, 0, config.cameraZ);
}
applyInitialLayout();

// 5. GSAP SCROLL ANIMATION (Exploded to Assembled)
gsap.registerPlugin(ScrollTrigger);
let mainTl;

function initAnimation() {
    if(mainTl) mainTl.kill(); 

    mainTl = gsap.timeline({
        scrollTrigger: { trigger: ".content", start: "top top", end: "+=600%", scrub: 1 }
    });

    // 1. Laptop Opens & Pauses
    mainTl.to(hinge.rotation, { x: -0.15, duration: 1 }, 0);
    mainTl.call(() => { screenMat.map = createMacDesktopUI(); screenMat.needsUpdate = true; screenMat.color.setHex(0xffffff); }, null, 0.4);
    
    // 2. Laptop drops down into the abyss
    mainTl.to(laptopGroup.position, { y: -20, z: -10, duration: 1.5, ease: "power2.inOut" }, 2.5);
    mainTl.to(laptopGroup.rotation, { x: 0.5, duration: 1.5, ease: "power2.inOut" }, 2.5);

    // 3. The Grid Assembles! Cards fly in from deep space and snap perfectly into a wall.
    cards.forEach((card, index) => {
        mainTl.to(card.position, {
            x: card.userData.x, y: card.userData.y, z: card.userData.z, 
            duration: 2.5, ease: "power3.out"
        }, 3.0 + (index * 0.05)); // Stagger effect
        
        mainTl.to(card.rotation, {
            x: 0, y: 0, z: 0, 
            duration: 2.5, ease: "power3.out"
        }, 3.0 + (index * 0.05));

        mainTl.to(card.material, { opacity: 1, duration: 1 }, 3.0 + (index * 0.05));
    });

    // 4. Pan the entire grid up as you scroll so you can see all rows!
    const maxRow = Math.floor((portfolioData.length - 1) / config.cols);
    const scrollDistance = maxRow * config.gapY;
    if(scrollDistance > 0) {
        // Gently pan the camera down the grid
        mainTl.to(gridGroup.position, {
            y: scrollDistance + 1, 
            duration: maxRow * 1.5, 
            ease: "none"
        }, 5.5);
    }
}
initAnimation();

// 6. RENDER LOOP
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    if(laptopGroup.position.y > -5) {
        laptopGroup.position.y = config.laptopY + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    if(Math.abs(window.innerWidth - document.documentElement.clientWidth) > 20) {
        config = getLayoutConfig(); 
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // On resize, we reload the page to perfectly recalculate the grid puzzle logic
        window.location.reload(); 
    }
});