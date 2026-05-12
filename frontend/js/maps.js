const cv = document.getElementById('c');
const W = window.innerWidth;
const H = window.innerHeight;
cv.width = W; cv.height = H;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08111c);

const cam = new THREE.PerspectiveCamera(52, W / H, 0.1, 2000);

const ren = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
ren.setSize(W, H);
ren.shadowMap.enabled = true;

// ── LIGHTS ──
scene.add(new THREE.AmbientLight(0x9aaece, 0.6));
const sun = new THREE.DirectionalLight(0xfff0d0, 1.0);
sun.position.set(60, 130, 80);
sun.castShadow = true;
sun.shadow.camera.left = -180; sun.shadow.camera.right = 180;
sun.shadow.camera.top = 180;   sun.shadow.camera.bottom = -180;
sun.shadow.camera.far = 800;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

// ── GROUND ──
const gnd = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshLambertMaterial({ color: 0x0b1828 })
);
gnd.rotation.x = -Math.PI / 2;
gnd.receiveShadow = true;
scene.add(gnd);

// ── ROADS ──
const roadMat = new THREE.MeshLambertMaterial({ color: 0x162c44, side: THREE.DoubleSide });
const RW = 2.5, RH = 0.2;

function road(w, d, x, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, RH, d), roadMat);
    m.position.set(x, RH / 2, z);
    m.receiveShadow = true;
    scene.add(m);
}

// The Main Grid
road(62.5, RW, 0, 0);       // Main Horizontal (Center)
road(30, RW, 15, -25);      // Top Horizontal (Dormstel)

// SHIFTED BOTTOM HORIZONTAL ROAD (Moved from z=38 down to z=48)
road(30, RW, -15, 48);      

// Vertical roads
// EXTENDED FAR-LEFT VERTICAL (Now reaches z=48 to meet the new horizontal road)
road(RW, 73, -30, 11.5);    
road(RW, 75, 0, 12.5);      // Center Vertical
road(RW, 75, 30, 12.5);     // Right Vertical

// The Center Roundabout
const circle = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, RH + 0.02, 32), roadMat);
circle.position.set(0, RH / 2, 0);
scene.add(circle);

// ── THE PERFECT U-CURVE ──
const innerRadius = 15 - (RW / 2);
const outerRadius = 15 + (RW / 2);
const curveGeo = new THREE.RingGeometry(innerRadius, outerRadius, 32, 1, Math.PI, Math.PI);
const curveMesh = new THREE.Mesh(curveGeo, roadMat);
curveMesh.rotation.x = -Math.PI / 2;
curveMesh.position.set(15, RH / 2, 50);
curveMesh.receiveShadow = true;
scene.add(curveMesh);

// The Main Entrance Stem
road(RW, 35, 15, 82.5); 


// ── ROAD DASHES ──
const dashMat = new THREE.MeshLambertMaterial({ color: 0x284c68 });
function dashes(vert, len, cx, cz) {
    for (let i = -len / 2 + 5; i < len / 2 - 5; i += 6) {
        const m = new THREE.Mesh(
            vert ? new THREE.BoxGeometry(0.22, 0.25, 2.5) : new THREE.BoxGeometry(2.5, 0.25, 0.22),
            dashMat
        );
        m.position.set(vert ? cx : cx + i, 0.25, vert ? cz + i : cz);
        scene.add(m);
    }
}
dashes(false, 62.5, 0, 0);
dashes(false, 30, 15, -25);
dashes(false, 30, -15, 48); // Dashes for the shifted horizontal road
dashes(true, 73, -30, 11.5); // Dashes for the extended left road
dashes(true, 75, 0, 12.5);
dashes(true, 75, 30, 12.5);
dashes(true, 35, 15, 82.5);

// Dashes perfectly wrapped along the U-Curve
const numDashes = 10;
for (let i = 1; i < numDashes; i++) {
    const angle = Math.PI + (Math.PI * (i / numDashes));
    const wx = 15 + 15 * Math.cos(angle);
    const wz = 50 - 15 * Math.sin(angle);
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.25, 2.5), dashMat);
    m.position.set(wx, 0.25, wz);
    m.rotation.y = -angle; 
    scene.add(m);
}

// ── CAMPUS PERIMETER WALL (Based on your red sketch) ──
const wallMat = new THREE.MeshLambertMaterial({ color: 0x6b302a }); // Brick Red hue

function wall(w, d, x, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), wallMat);
    m.position.set(x, 2, z); // Height is 4, so Y is set to 2 to rest on ground
    m.castShadow = true; 
    m.receiveShadow = true;
    scene.add(m);
}

// Seamlessly connected bounding walls
wall(81, 1, -2, -42);       // Top edge
wall(1, 113, -42, 14);      // Far Left edge
wall(1, 143, 38, 29);       // Far Right edge
wall(52, 1, -16.5, 70);     // Bottom Left jog (horizontal)
wall(1, 31, 9, 85);         // Entrance left side (vertical down to gate)
wall(18, 1, 29.5, 100);     // Bottom Right piece (horizontal to right gate)


// ── BUILDINGS ──
const bldgs = [];
const origCol = new Map();

const MATS = {
    ac: () => new THREE.MeshLambertMaterial({ color: 0x1e4a80 }), 
    ad: () => new THREE.MeshLambertMaterial({ color: 0x741c1c }), 
    st: () => new THREE.MeshLambertMaterial({ color: 0x134e26 }), 
    ut: () => new THREE.MeshLambertMaterial({ color: 0x453810 }), 
    pk: () => new THREE.MeshLambertMaterial({ color: 0xd84b72 }),
    pu: () => new THREE.MeshLambertMaterial({ color: 0x8a2be2 }),
    wh: () => new THREE.MeshLambertMaterial({ color: 0xffffff })
};
const ROOFS = {
    ac: new THREE.MeshLambertMaterial({ color: 0x2258a8 }),
    ad: new THREE.MeshLambertMaterial({ color: 0x922424 }),
    st: new THREE.MeshLambertMaterial({ color: 0x196634 }),
    ut: new THREE.MeshLambertMaterial({ color: 0x5a4c14 }),
    pk: new THREE.MeshLambertMaterial({ color: 0xff69b4 }),
    pu: new THREE.MeshLambertMaterial({ color: 0x9b30ff }),
    wh: new THREE.MeshLambertMaterial({ color: 0xd0d0d0 }) 
};
const winMat = new THREE.MeshLambertMaterial({
    color: 0x70b8f8, emissive: 0x183860, emissiveIntensity: 0.5
});

function block(w, d, x, z, cat, name, desc, h) {
    h = h || 6;
    const mat = MATS[cat]();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    body.position.set(x, h / 2, z);
    body.castShadow = true; body.receiveShadow = true;
    scene.add(body);

    const rf = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 0.5, d + 0.5), ROOFS[cat]);
    rf.position.set(x, h + 0.25, z);
    scene.add(rf);

    if (w >= 4 && h >= 4) {
        const cols = Math.max(1, Math.floor((w - 1) / 3.2));
        const rows = Math.max(1, Math.floor((h - 1) / 3.2));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const wx = x - w / 2 + 1.2 + c * ((w - 2) / Math.max(cols - 1, 1));
                const wy = 1.2 + r * ((h - 1) / Math.max(rows, 1));
                const wn = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.12), winMat);
                wn.position.set(wx, wy, z + d / 2 + 0.02);
                scene.add(wn);
            }
        }
    }

    bldgs.push({ mesh: body, name, desc });
    origCol.set(body, mat.color.clone());
}

// FAR LEFT STRIP
block(6, 14, -36, -22, 'ut', 'Technology Department', 'BSELT, BSET, BSAT', 6); // <-- CHANGED (Top)
block(6, 8, -36, -9, 'ut', 'Utility Block B', 'Equipment room', 5);
block(6, 8, -36, 1, 'ut', 'Utility Block C', 'Campus services', 5);
block(6, 8, -36, 11, 'ut', 'Utility Block D', 'Grounds dept.', 5);
block(6, 12, -36, 23, 'ut', 'Registrar', 'Campus Registrar', 6); // <-- CHANGED (Bottom)

// TOP LEFT
block(18, 20, -15, -12, 'st', 'Gymnasium', 'Sports & Physical Education', 10);
block(8, 4, -15, 0, 'st', 'Gym Annex', 'Equipment & locker rooms', 5);

// BOTTOM LEFT
block(18, 5, -15, 12, 'pk', 'Computer Studies & Engineering', 'BSIT · BSCE · BSECE', 8);     
block(5, 12, -21.5, 20.5, 'pk', 'Computer Studies & Engineering', 'BSIT · BSCE · BSECE', 8); 
block(5, 12, -8.5, 20.5, 'pk', 'Computer Studies & Engineering', 'BSIT · BSCE · BSECE', 8);  
block(18, 6, -15, 31, 'ad', 'Administration Building', 'Campus Administration', 8);          

// THE CLINIC
block(4, 8, 3.5, 44, 'st', 'AVR & Health Clinic', 'Audio-visual room & clinic', 6);

// TOP RIGHT (Unified Purple Nursing Complex)
block(20, 5, 15, -30, 'wh', 'DOORMSTEL', 'Campus Storage and Workshops', 12); 
block(5, 16, 22.5, -15, 'pu', 'Nursing Department Building', 'Nursing & Clinical Labs', 12); 
block(10, 5, 15, -20.5, 'pu', 'Nursing Department Building', 'Nursing & Clinical Labs', 12); 
block(10, 5, 15, -9.5, 'pu', 'Nursing Department Building', 'Nursing & Clinical Labs', 12); 
block(4, 10, 8, -15, 'pu', 'Nursing Department Building', 'Nursing & Clinical Labs', 12); 

// CANTEEN AREA
block(8, 5, 15, -3, 'ac', 'Canteen', 'Student Food Court', 5);
block(5, 4, 22.5, -3, 'ut', 'Utility Hub', 'Storage & Services', 5); 

// BOTTOM RIGHT (Unified College of Education)
block(18, 5, 15, 30, 'ac', 'College of Education', 'BEEd, BSEd & Campus Library (2nd Floor)', 12);
block(5, 16, 8.5, 19.5, 'ac', 'College of Education', 'BEEd, BSEd & Campus Library (2nd Floor)', 12);
block(5, 16, 21.5, 19.5, 'ac', 'College of Education', 'BEEd, BSEd & Campus Library (2nd Floor)', 12);

// THE STUDENT CENTER 
block(3.5, 14, 3.5, 21, 'st', 'Student Center', 'Student Council & The Inditers Office', 7);


// MAIN ENTRANCE GATE
const gateM = new THREE.MeshLambertMaterial({ color: 0xb84018 });
for (const ox of [10, 20]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.4, 11, 1.4), gateM);
    p.position.set(ox, 5.5, 100);
    p.castShadow = true; scene.add(p);
}
const gb = new THREE.Mesh(new THREE.BoxGeometry(13, 1.2, 1.6), gateM);
gb.position.set(15, 11.1, 100); scene.add(gb);
bldgs.push({ mesh: gb, name: 'Main Entrance Gate', desc: 'BU Polangui Campus' });
origCol.set(gb, gb.material.color.clone());


// ── TREES ──
const trM = new THREE.MeshLambertMaterial({ color: 0x3a2008 });
const cnM = new THREE.MeshLambertMaterial({ color: 0x0c3816 });
function tree(x, z) {
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.8, 6), trM);
    tr.position.set(x, 1.4, z); tr.castShadow = true; scene.add(tr);
    const cn = new THREE.Mesh(new THREE.SphereGeometry(1.6, 7, 5), cnM);
    cn.position.set(x, 4.0, z); cn.castShadow = true; scene.add(cn);
}
[
    [-5,-8], [-9,-8], [-5,8], [-9,8], [25,38], 
    [-3,38], [-8,38], [-5,55], [25,5], [25,18], 
    [-15, 42], // Adjusted to not clip the newly moved road
    [6, 60], [24, 60], 
    [10, 85], [20, 85] 
].forEach(([x,z]) => tree(x, z));


// ── HOVER LOGIC ──
const rc = new THREE.Raycaster();
const mp = new THREE.Vector2();
const ttEl = document.getElementById('tt');
const tnEl = document.getElementById('tn');
const tdEl = document.getElementById('td');
let hov = null;

cv.addEventListener('mousemove', e => {
    const r = cv.getBoundingClientRect();
    mp.x =  ((e.clientX - r.left) / W) * 2 - 1;
    mp.y = -((e.clientY - r.top)  / H) * 2 + 1;
    rc.setFromCamera(mp, cam);
    const hits = rc.intersectObjects(bldgs.map(b => b.mesh));
    if (hov) {
        hov.mesh.material.color.copy(origCol.get(hov.mesh));
        hov = null; ttEl.style.display = 'none';
    }
    if (hits.length) {
        const bd = bldgs.find(b => b.mesh === hits[0].object);
        if (bd) {
            hov = bd;
            bd.mesh.material.color.set(0xffaa44);
            tnEl.textContent = bd.name;
            tdEl.textContent = bd.desc;
            ttEl.style.display = 'block';
            ttEl.style.left = (e.clientX - r.left + 16) + 'px';
            ttEl.style.top  = (e.clientY - r.top  - 48) + 'px';
        }
    }
});
cv.addEventListener('mouseleave', () => {
    if (hov) { hov.mesh.material.color.copy(origCol.get(hov.mesh)); hov = null; }
    ttEl.style.display = 'none';
});


// ── ORBIT CAMERA ──
let drag = false, lx = 0, ly = 0;
let sph = { th: 0.42, ph: 0.75, r: 200 };
const tgt = new THREE.Vector3(-3, 0, 12);

function updateCam() {
    cam.position.set(
        tgt.x + sph.r * Math.sin(sph.ph) * Math.sin(sph.th),
        tgt.y + sph.r * Math.cos(sph.ph),
        tgt.z + sph.r * Math.sin(sph.ph) * Math.cos(sph.th)
    );
    cam.lookAt(tgt);
}
updateCam();

cv.addEventListener('mousedown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
window.addEventListener('mouseup', () => drag = false);
window.addEventListener('mousemove', e => {
    if (!drag) return;
    sph.th -= (e.clientX - lx) * 0.007;
    sph.ph  = Math.max(0.1, Math.min(1.5, sph.ph + (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY;
    updateCam();
});
cv.addEventListener('wheel', e => {
    sph.r = Math.max(40, Math.min(450, sph.r + e.deltaY * 0.4));
    updateCam(); e.preventDefault();
}, { passive: false });

let lt = null;
cv.addEventListener('touchstart', e => { lt = e.touches[0]; }, { passive: true });
cv.addEventListener('touchmove', e => {
    if (!lt) return;
    const t = e.touches[0];
    sph.th -= (t.clientX - lt.clientX) * 0.007;
    sph.ph  = Math.max(0.1, Math.min(1.5, sph.ph + (t.clientY - lt.clientY) * 0.006));
    lt = t; updateCam(); e.preventDefault();
}, { passive: false });


// ── RENDER LOOP ──
let tk = 0;
(function animate() {
    requestAnimationFrame(animate);
    tk += 0.004;
    winMat.emissiveIntensity = 0.38 + Math.sin(tk * 2) * 0.1;
    ren.render(scene, cam);
})();

window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    ren.setSize(window.innerWidth, window.innerHeight);
});