import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreePage() {
  const initThree = async () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    setupCanvas(canvas);

    const scene = createScene();
    const renderer = createRenderer(canvas);
    const camera = createCamera();
    const controls = createControls(camera, renderer.domElement);

    addGround(scene);
    addLights(scene);

    const me = createSphere();
    scene.add(me);
    const wall = createWall();
    scene.add(wall);

    const box = createBox();
    scene.add(box);

    const keys = setupKeyControls();
    const animate = createAnimateFunction(
      renderer,
      scene,
      camera,
      controls,
      me,
      keys
    );
    animate();

    renderer.render(scene, camera);
  };

  useEffect(() => {
    initThree();
  }, []);

  return (
    <canvas
      id="canvas"
      style={{ display: "block", width: "500px", height: "500px" }}
    ></canvas>
  );
}
type KeyState = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
  " ": boolean;
};
// Canvas 설정 함수
const setupCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = 500;
  canvas.height = 500;
};

// Scene 생성 함수
const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue");
  return scene;
};

// Renderer 생성 함수
const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.width, canvas.height);
  return renderer;
};

// 카메라 생성 함수
const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.set(0, 2, 4);
  return camera;
};

// OrbitControls 생성 함수
const createControls = (camera: THREE.Camera, domElement: HTMLElement) => {
  const controls = new OrbitControls(camera, domElement);
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableDamping = true; // 부드러운 감속 효과를 위해 damping 활성화
  controls.dampingFactor = 0.25;
  controls.update();
  return controls;
};

// Ground 추가 함수
const addGround = (scene: THREE.Scene) => {
  const groundGeometry = new THREE.PlaneGeometry(10000, 10000); // 매우 큰 평면
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // 평면을 수평으로 만듭니다
  scene.add(ground);
};

// 조명 추가 함수
const addLights = (scene: THREE.Scene) => {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  light.castShadow = true;
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040); // 약간의 주변광 추가
  scene.add(ambientLight);
};

// Sphere 생성 함수
const createSphere = () => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const radius = sphereGeometry.parameters.radius;
  sphere.position.set(-2, radius, 0); // 반지름에 맞게 y 위치 설정
  return sphere;
};

// Wall 생성 함수
const createWall = () => {
  const coneGeometry = new THREE.ConeGeometry(1, 3, 4);
  const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const wall = new THREE.Mesh(coneGeometry, coneMaterial);
  wall.position.set(0.2, 0.1, 0);
  return wall;
};

// Box 생성 함수
const createBox = () => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  const bbox = new THREE.Box3().setFromObject(box);
  const height = bbox.max.y - bbox.min.y;
  box.position.set(2, height / 2, 0); // 다른 위치에 추가
  return box;
};

// 키보드 컨트롤 설정 함수
const setupKeyControls = () => {
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    " ": false,
  };

  const isKeyOfKeyState = (key: any): key is keyof KeyState =>
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === " ";

  document.addEventListener("keydown", (event) => {
    if (isKeyOfKeyState(event.key)) keys[event.key] = true;
  });

  document.addEventListener("keyup", (event) => {
    if (isKeyOfKeyState(event.key)) keys[event.key] = false;
  });

  return keys;
};

// 애니메이션 함수 생성 함수
function createAnimateFunction(
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  controls: OrbitControls,
  object: THREE.Mesh, // 'cone'을 'object'로 변경
  keys: KeyState
) {
  let isJumping = false;
  let jumpSpeed = 0;
  const gravity = 0.005;
  const jumpStrength = 0.15;
  const initialY = object.position.y;

  const updatePosition = () => {
    // 카메라의 방향 벡터 계산
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; // y 방향을 무시하여 수평 이동만 허용
    direction.normalize();

    // 키보드 입력에 따라 물체 이동
    if (keys["ArrowUp"]) {
      object.position.addScaledVector(direction, 0.05);
    }
    if (keys["ArrowDown"]) {
      object.position.addScaledVector(direction, -0.05);
    }
    if (keys["ArrowLeft"]) {
      const left = new THREE.Vector3()
        .crossVectors(camera.up, direction)
        .normalize();
      object.position.addScaledVector(left, 0.05);
    }
    if (keys["ArrowRight"]) {
      const right = new THREE.Vector3()
        .crossVectors(direction, camera.up)
        .normalize();
      object.position.addScaledVector(right, 0.05);
    }
  };

  const handleJump = () => {
    if (keys[" "] && !isJumping) {
      isJumping = true;
      jumpSpeed = jumpStrength;
    }

    if (isJumping) {
      object.position.y += jumpSpeed;
      jumpSpeed -= gravity;

      if (object.position.y <= initialY) {
        // 땅에 도달했을 때
        object.position.y = initialY;
        isJumping = false;
        jumpSpeed = 0;
      }
    }
  };

  const updateCamera = () => {
    camera.position.x = object.position.x + 5;
    camera.position.y = object.position.y + 2;
    camera.position.z = object.position.z + 5;
    camera.lookAt(object.position);

    // controls 업데이트
    // controls.target.copy(object.position);
    // controls.update();
  };

  const animate = () => {
    requestAnimationFrame(animate);

    updatePosition();
    handleJump();
    updateCamera();

    renderer.render(scene, camera);
  };

  return animate;
}
