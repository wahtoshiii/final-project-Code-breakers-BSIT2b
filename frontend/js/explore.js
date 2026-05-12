const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a); // Spider-Verse Dark Theme

// The "Y" Entrance Fork at Bottom Right
function createRoads() {
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    
    // Main Vertical & Horizontal Cross
    const vMain = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 100), roadMat);
    const hMain = new THREE.Mesh(new THREE.BoxGeometry(100, 0.1, 4), roadMat);
    scene.add(vMain, hMain);

    // Central Roundabout
    const roundabout = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.2, 32), roadMat);
    scene.add(roundabout);

    // Entrance "Y" Fork (Bottom Right)
    const entryPath = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 20), roadMat);
    entryPath.position.set(25, 0, 45);
    entryPath.rotation.y = Math.PI / 4;
    scene.add(entryPath);
}
createRoads();

// 1. First, define the building creator function with the shape logic
function createBupcBuilding(name, x, z, shapeType) {
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: 0x444444, transparent: true, opacity: 0.9 });
    
    // --- INSERT PART B LOGIC HERE ---
    if (shapeType === 'U-UP') { 
        // Education Dept: U-shape facing North
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 2), material);
        base.position.set(0, 0, 4);
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 8), material);
        arm1.position.set(-4, 0, -1);
        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 8), material);
        arm2.position.set(4, 0, -1);
        group.add(base, arm1, arm2);
    } 
    else if (shapeType === 'U-DOWN') {
        // Engineering/CSD: Inverted U-shape facing South
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 2), material);
        base.position.set(0, 0, -4);
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 8), material);
        arm1.position.set(-4, 0, 1);
        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 8), material);
        arm2.position.set(4, 0, 1);
        group.add(base, arm1, arm2);
    } 
    else {
        // General Rectangles for Admin, CSC Office, and Gym
        const box = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 5), material);
        group.add(box);
    }
    // --- END OF PART B LOGIC ---

    group.position.set(x, 2.5, z);
    scene.add(group);
}

// 2. Then, call the function using the grid positions from the Directory
createBupcBuilding("Education", 20, 20, 'U-UP');       // Bottom Right
createBupcBuilding("Engineering", -20, 20, 'U-DOWN'); // Bottom Left
createBupcBuilding("CSC_Office", 0, 10, 'RECT');      // Center
createBupcBuilding("Gym", -20, -20, 'RECT');          // Top Left

window.toggleXRay = function(buildingName) {
    // This finds the specific building group you created in Part B
    const targetBuilding = scene.getObjectByName("roof_" + buildingName);
    
    if (targetBuilding) {
        // .visible is a built-in Three.js property
        // This line makes it true if it's false, and false if it's true
        targetBuilding.visible = !targetBuilding.visible;
        
        console.log(`X-Ray for ${buildingName} is now: ${!targetBuilding.visible}`);
    } else {
        console.error("Building not found! Make sure the name matches Part B exactly.");
    }
};