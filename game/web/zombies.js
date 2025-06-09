import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154/build/three.module.js';

export async function startZombies(onKill) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) {
        console.error('Three.js canvas missing');
        return null;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
        70,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );
    camera.position.z = 5;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const playerGeo = new THREE.BoxGeometry(1, 1, 1);
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const player = new THREE.Mesh(playerGeo, playerMat);
    scene.add(player);

    const zombies = [];
    const zombieGeo = new THREE.BoxGeometry(1, 1, 1);
    const zombieMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    function spawnZombie() {
        const z = new THREE.Mesh(zombieGeo, zombieMat);
        z.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -10);
        zombies.push(z);
        scene.add(z);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function shootZombie(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(zombies);
        if (hits.length > 0) {
            const zombie = hits[0].object;
            scene.remove(zombie);
            zombies.splice(zombies.indexOf(zombie), 1);
            if (typeof onKill === 'function') {
                onKill();
            }
            spawnZombie();
        }
    }

    canvas.addEventListener('pointerdown', shootZombie);

    for (let i = 0; i < 3; i++) {
        spawnZombie();
    }

    function animate() {
        zombies.forEach((z) => {
            z.rotation.x += 0.01;
            z.rotation.y += 0.01;
            z.position.z += 0.02;
            if (z.position.z > 5) {
                z.position.z = -10;
            }
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return {
        spawnZombie,
    };
}
