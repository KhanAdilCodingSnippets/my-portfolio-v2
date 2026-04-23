// main.js - V7 (Vibrant Colors, Expanded Scroll Timing)

if (history.scrollRestoration) { history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);

// 1. SCENE SETUP (Deep Vibrant Dark Mode)
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x09090b, 0.025); // Matches Tailwind zinc-950

function getLayoutConfig() {
    const width = window.innerWidth;
    const isMobile = width < 768;
    return {
        isMobile: isMobile,
        cameraZ: isMobile ? 26 : 18, 
        laptopScale: isMobile ? 1.0 : 1.5, 
        laptopY: isMobile ? -2.0 : -3.0 
    };
}
let config = getLayoutConfig();

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, config.cameraZ);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. VIBRANT CINEMATIC LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5); 
keyLight.position.set(5, 10, 8); 
scene.add(keyLight);

// Neon Cyan Rim Light
const rimLightCyan = new THREE.DirectionalLight(0x06b6d4, 4.0); 
rimLightCyan.position.set(-5, -5, -10);
scene.add(rimLightCyan);

// Neon Fuchsia Fill Light
const rimLightPink = new THREE.DirectionalLight(0xd946ef, 3.0); 
rimLightPink.position.set(10, 5, -5);
scene.add(rimLightPink);

// 3. THE HARDWARE (Sleek Space Grey/Silver under vibrant lights)
const laptopGroup = new THREE.Group();
scene.add(laptopGroup);

const silverMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x94a3b8, metalness: 0.9, roughness: 0.2, clearcoat: 0.8 
});

const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 2.6, 1, 1, 15), silverMat);
laptopGroup.add(base);

const trackpadMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.3 });
const trackpad = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.85), trackpadMat);
trackpad.rotation.x = -Math.PI / 2; trackpad.position.set(0, 0.062, 0.82); base.add(trackpad);

function createPitchBlackKeyboard() {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512; const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, 1024, 512); 
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
            ctx.fillStyle = '#18181b'; ctx.beginPath(); ctx.roundRect(x, y, keyW - 5, 60, 6); ctx.fill(); 
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText(key, x + keyW/2 - 2, y + 35);
        });
    });
    return new THREE.CanvasTexture(canvas);
}

const keyboard = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.3), new THREE.MeshStandardMaterial({ map: createPitchBlackKeyboard(), roughness: 0.8 }));
keyboard.rotation.x = -Math.PI / 2; keyboard.position.set(0, 0.061, -0.28); base.add(keyboard);

const hinge = new THREE.Group();
hinge.position.set(0, 0.06, -1.3); base.add(hinge);

const lid = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.04), silverMat);
lid.position.set(0, 1.3, 0); hinge.add(lid);

const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), new THREE.MeshStandardMaterial({ color: 0x000000 }));
bezel.position.set(0, 1.3, 0.021); hinge.add(bezel);

const notch = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.18), new THREE.MeshBasicMaterial({ color: 0x000000 }));
notch.position.set(0, 2.45, 0.024); 
hinge.add(notch);

const logoGeometry = new THREE.CircleGeometry(0.25, 32);
const logoMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.0 });
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(0, 1.3, -0.021); 
logo.rotation.y = Math.PI; 
hinge.add(logo);

function createMacDesktopUI() {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 640; const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    
    // Vibrant Dark macOS Wallpaper
    const grad = ctx.createLinearGradient(0, 0, 1024, 640);
    grad.addColorStop(0, '#09090b'); 
    grad.addColorStop(0.5, '#4c1d95'); // Deep purple
    grad.addColorStop(1, '#083344');   // Deep cyan
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; ctx.fillRect(0, 0, 1024, 28);
    ctx.fillStyle = '#ffffff'; ctx.font = '500 14px -apple-system, sans-serif';
    ctx.fillText('   Adil Firoz Khan', 20, 19);

    const pbW = 800; const pbH = 480; const pbX = (1024 - pbW) / 2; const pbY = 60;
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
    ctx.fillStyle = '#18181b'; ctx.beginPath(); ctx.roundRect(pbX, pbY, pbW, pbH, 12); ctx.fill();
    
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#27272a';
    ctx.beginPath(); ctx.roundRect(pbX, pbY, pbW, 36, {tl: 12, tr: 12, bl: 0, br: 0}); ctx.fill();
    
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(pbX + 20, pbY + 18, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(pbX + 40, pbY + 18, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(pbX + 60, pbY + 18, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#a1a1aa'; ctx.font = '500 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Photo Booth', pbX + pbW/2, pbY + 23);

    const viewX = pbX + 20; const viewY = pbY + 50; const viewW = pbW - 40; const viewH = pbH - 120;
    ctx.fillStyle = '#000000'; ctx.fillRect(viewX, viewY, viewW, viewH);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    // ---> REPLACE WITH YOUR IMAGE URL <---
    img.src = "https://i.ibb.co/F4kM12qc/Screenshot-2026-04-23-at-9-30-49-PM.png"; 
    
    img.onload = () => {
        const imgRatio = img.width / img.height;
        const viewRatio = viewW / viewH;
        let sx, sy, sWidth, sHeight;

        if (imgRatio > viewRatio) {
            sHeight = img.height;
            sWidth = img.height * viewRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = img.width;
            sHeight = img.width / viewRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, viewX, viewY, viewW, viewH);
        
        ctx.fillStyle = '#3f3f46'; ctx.beginPath(); ctx.arc(pbX + pbW/2, pbY + pbH - 35, 28, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(pbX + pbW/2, pbY + pbH - 35, 22, 0, Math.PI*2); ctx.fill();
        tex.needsUpdate = true;
    };

    return tex;
}

const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); 
const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), screenMat);
screen.position.set(0, 1.3, 0.022); hinge.add(screen);

// Initial Positions
hinge.rotation.x = Math.PI / 2; // Start Closed
laptopGroup.position.set(0, config.laptopY, 0);
laptopGroup.scale.set(config.laptopScale, config.laptopScale, config.laptopScale);

// 4. GSAP TIMELINE (Adjusted for longer scroll)
gsap.registerPlugin(ScrollTrigger);

const mainTl = gsap.timeline({
    scrollTrigger: { 
        trigger: "#hero", 
        start: "top top", 
        end: "bottom top", 
        scrub: 1.2 
    }
});

// Boot Up happens in the first quarter of the scroll
mainTl.to(hinge.rotation, { x: -0.15, duration: 1.5, ease: "power2.out" }, 0);
mainTl.call(() => { 
    screenMat.map = createMacDesktopUI(); 
    screenMat.needsUpdate = true; 
    screenMat.color.setHex(0xffffff); 
}, null, 0.5);

// Hold position so the user can see it, then fall away in the last half of the scroll
mainTl.to(laptopGroup.position, { y: config.laptopY - 15, z: -15, duration: 2.5, ease: "power2.in" }, 2.0);
mainTl.to(laptopGroup.rotation, { x: 0.5, duration: 2.5, ease: "power2.in" }, 2.0);

// 5. RENDER LOOP 
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    if(laptopGroup.position.y > config.laptopY - 5) {
        laptopGroup.position.y = config.laptopY + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    config = getLayoutConfig(); 
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.position.z = config.cameraZ; 
    
    if(laptopGroup.position.y > config.laptopY - 5) {
        laptopGroup.scale.set(config.laptopScale, config.laptopScale, config.laptopScale);
    }
    
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});