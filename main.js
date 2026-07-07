import * as THREE from 'three';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('scene');

const PARTICLE_COUNT = 6000;
const PALETTE = ['#a07848', '#c8944e', '#dbb478', '#e8ca96', '#f5ece0'];

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function smoothstep(t) {
    return t * t * (3 - 2 * t);
}

/* ===== Formations: セクションごとのパーティクル配置 ===== */

// Hero: 年輪 — 2019年からの経験年数と同じ7本の同心リング
// 外周ほど粒子を多く割り当てて、リング上の密度を一定に保つ
const RING_RADII = [1.6, 2.75, 3.9, 5.05, 6.2, 7.35, 8.5];
const RING_CUM = (() => {
    const total = RING_RADII.reduce((s, r) => s + r, 0);
    let acc = 0;
    return RING_RADII.map(r => (acc += r / total));
})();

function formationRings(i, count) {
    const u = i / count;
    const ring = RING_CUM.findIndex(c => u <= c);
    const radius = RING_RADII[ring] + (Math.random() - 0.5) * 0.12;
    const angle = Math.random() * Math.PI * 2;
    return [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 0.15,
        Math.sin(angle) * radius,
    ];
}

// Services: 流れるパイプライン — 複数のストリームが並走する
function formationStreams(i, count) {
    const STREAM_NUM = 3;
    const stream = i % STREAM_NUM;
    const x = (Math.random() - 0.5) * 22;
    const y = Math.sin(x * 0.45 + stream * 2.1) * 1.6 + (stream - 1) * 2.6;
    return [x, y + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 4];
}

// About: 二重螺旋 — 積み重なる経歴・成長（テキストと重ならないよう外周に広げ、奥に置く）
function formationHelix(i, count) {
    const strand = i % 2;
    const t = (i / count) * Math.PI * 6;
    const y = (i / count) * 15 - 7.5;
    const phase = t + strand * Math.PI;
    const radius = 8.5 + (Math.random() - 0.5) * 0.6;
    return [
        Math.cos(phase) * radius,
        y,
        Math.sin(phase) * radius - 4,
    ];
}

// Skills: 4つのクラスタ — スキルカテゴリ（画面の四隅寄りに配置）
function formationClusters(i, count) {
    const CENTERS = [
        [-8.5, 4.2, -2],
        [8.5, 4.2, -3],
        [-8.5, -4.6, -3],
        [8.5, -4.6, -2],
    ];
    const c = CENTERS[i % CENTERS.length];
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.5;
    return [c[0] + gauss(), c[1] + gauss(), c[2] + gauss()];
}

// Publications: 球 — 国際共同研究のグローブ
function formationSphere(i, count) {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const R = 5.2;
    return [Math.cos(theta) * r * R, y * R, Math.sin(theta) * r * R];
}

// Contact: 1つの大きな輪がコンテンツを額縁のように囲む
function formationCircle(i, count) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 8 + (Math.random() - 0.5) * 0.5;
    return [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 0.8,
    ];
}

const FORMATIONS = [
    formationRings,
    formationStreams,
    formationHelix,
    formationClusters,
    formationSphere,
    formationCircle,
];

/* ===== Three.js scene ===== */

function initScene() {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch (e) {
        canvas.style.display = 'none';
        return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    const targets = FORMATIONS.map(fn => {
        const arr = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const [x, y, z] = fn(i, PARTICLE_COUNT);
            arr[i * 3] = x;
            arr[i * 3 + 1] = y;
            arr[i * 3 + 2] = z;
        }
        return arr;
    });

    const positions = new Float32Array(targets[0]);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        color.set(PALETTE[i % PALETTE.length]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.55)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const material = new THREE.PointsMaterial({
        size: 0.09,
        map: new THREE.CanvasTexture(spriteCanvas),
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 各フォーメーションが最も映える俯角と、テキストの可読性を保つための不透明度
    const ROT_X = [1.1, 0.25, 0.3, 0.15, 0.35, 0.1];
    const OPACITY = [0.8, 0.2, 0.16, 0.2, 0.26, 0.65];

    const sections = Array.from(document.querySelectorAll('.hero-section, .section'));

    function scrollProgress() {
        const y = window.scrollY;
        for (let k = sections.length - 1; k >= 0; k--) {
            const top = sections[k].offsetTop;
            if (y >= top - 2) {
                const next = sections[k + 1];
                if (!next) return k;
                return k + clamp((y - top) / (next.offsetTop - top), 0, 1);
            }
        }
        return 0;
    }

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('pointermove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const posAttr = geometry.getAttribute('position');

    function render(time) {
        const p = clamp(scrollProgress(), 0, FORMATIONS.length - 1);
        const a = Math.floor(p);
        const b = Math.min(a + 1, FORMATIONS.length - 1);
        // セクション滞在中はフォーメーションを保持し、境界手前40%で次の形へモーフする
        const t = smoothstep(clamp(((p - a) - 0.6) / 0.4, 0, 1));
        const from = targets[a];
        const to = targets[b];
        const arr = posAttr.array;

        for (let i = 0; i < arr.length; i++) {
            const target = from[i] + (to[i] - from[i]) * t;
            arr[i] += (target - arr[i]) * 0.07;
        }
        posAttr.needsUpdate = true;

        points.rotation.y = time * 0.00012 + p * 0.35;
        const rotX = ROT_X[a] + (ROT_X[b] - ROT_X[a]) * t;
        points.rotation.x = rotX + mouseY * 0.05;
        material.opacity = OPACITY[a] + (OPACITY[b] - OPACITY[a]) * t;
        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    if (prefersReducedMotion) {
        render(0);
        window.addEventListener('scroll', () => render(0), { passive: true });
    } else {
        const loop = (time) => {
            render(time);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

/* ===== Apple風スライド遷移: セクションの出入りに合わせてコンテンツが滑る ===== */

function initSlideTransitions() {
    if (prefersReducedMotion) return;
    const containers = Array.from(document.querySelectorAll('.section > .container'));

    function update() {
        const vh = window.innerHeight;
        containers.forEach(el => {
            const r = el.parentElement.getBoundingClientRect();
            if (r.bottom < -100 || r.top > vh + 100) return;
            const tIn = clamp((vh - r.top) / (vh * 0.55), 0, 1);
            const tOut = clamp(r.bottom / (vh * 0.55), 0, 1);
            const k = Math.min(tIn, tOut);
            el.style.opacity = (0.05 + 0.95 * smoothstep(k)).toFixed(3);
            el.style.transform = `translateY(${((1 - tIn) * 70 - (1 - tOut) * 70).toFixed(1)}px)`;
        });
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

initScene();
initSlideTransitions();
