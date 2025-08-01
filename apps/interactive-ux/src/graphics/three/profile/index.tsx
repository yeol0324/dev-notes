import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader, FontData } from "three/examples/jsm/loaders/FontLoader";
// 폰트 파일은 보통 public 폴더나 src/assets 등에 위치시키고 해당 경로로 불러옵니다.
// 예시: import helvetiker_regular from "/fonts/helvetiker_regular.typeface.json";
import helvetiker_regular from "three/examples/fonts/helvetiker_regular.typeface.json"; // 이 경로는 실제 프로젝트에 맞게 수정 필요

// --- Three.js 헬퍼 함수들 ---

// 씬 생성
const createScene = (): THREE.Scene => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  return scene;
};

// 카메라 생성
const createCamera = (): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1, // near 값을 1에서 0.1로 줄여 가까운 객체가 잘 보이도록 합니다.
    1000 // far 값을 10000에서 1000으로 줄여 불필요한 렌더링을 줄입니다.
  );
  camera.position.set(0, 0, 25);
  return camera;
};

// 렌더러 생성
const createRenderer = (): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 안티엘리어싱 활성화하여 부드러운 가장자리 표현
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  renderer.setPixelRatio(window.devicePixelRatio); // 디바이스 픽셀 비율 설정
  return renderer;
};

// GLTF/GLB 객체 로드
const createObject = async (fileName: string): Promise<GLTF> => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  // DRACO 디코더 경로 설정 (public 폴더 내에 draco 폴더가 있어야 합니다)
  dracoLoader.setDecoderPath("/draco/"); // 실제 경로에 맞게 수정
  loader.setDRACOLoader(dracoLoader);

  const url = `${process.env.PUBLIC_URL}/glb/${fileName}.glb`;
  try {
    const gltf = await loader.loadAsync(url);
    // 텍스처 업데이트는 일반적으로 로드 후 필요 없습니다. 문제가 발생할 경우에만 사용하세요.
    // gltf.scene.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     const materials = Array.isArray(child.material) ? child.material : [child.material];
    //     materials.forEach((material) => {
    //       if (material.map) {
    //         material.map.needsUpdate = true;
    //       }
    //     });
    //   }
    // });
    return gltf;
  } catch (error) {
    console.error(`Error loading GLB object ${fileName}:`, error);
    throw error; // 에러를 다시 던져서 호출자가 처리할 수 있도록 함
  }
};

// 텍스트 객체 생성
const createTextObject = async (string: string): Promise<THREE.Mesh> => {
  const loader = new FontLoader();
  // 폰트 로더가 폰트 데이터를 파싱합니다. helvetiker_regular가 올바른 JSON 형식인지 확인하세요.
  const font = loader.parse(helvetiker_regular as unknown as FontData);

  const textGeometry = new TextGeometry(string, {
    font: font,
    size: 5,
    height: 1,
    curveSegments: 8, // curveSegments 증가로 텍스트 부드럽게
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.2,
    bevelOffset: 0,
    bevelSegments: 5, // bevelSegments 증가로 베벨 부드럽게
  });
  textGeometry.computeBoundingBox(); // 바운딩 박스 계산
  textGeometry.center(); // 텍스트 중앙 정렬
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, material);
  return textMesh;
};

// OrbitControls 설정
const setupControls = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): OrbitControls => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 부드러운 카메라 움직임
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false; // 화면 공간 패닝 비활성화
  controls.maxPolarAngle = Math.PI / 2; // 특정 각도 이상으로 카메라 회전 제한
  controls.update();
  return controls;
};

// 조명 설정
const setupLights = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0xfefefe, 0.7); // 강도 조절
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // 강도 조절
  directionalLight.position.set(5, 10, 7).normalize(); // 위치 조정
  scene.add(directionalLight);

  // 추가 조명 (예: PointLight)
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(-10, -10, 10);
  scene.add(pointLight);
};

// Face 객체 설정
const setupFaceObject = (scene: THREE.Scene, faceObject: GLTF) => {
  faceObject.scene.position.set(0, -5, 0);
  faceObject.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.userData.isFace = true; // Raycasting을 위한 사용자 데이터
      child.castShadow = true; // 그림자 드리우기
      child.receiveShadow = true; // 그림자 받기
    }
  });
  scene.add(faceObject.scene);
};

// 선글라스 객체 설정
const setupSunglassObject = (faceObject: GLTF, sunglassObject: GLTF) => {
  // faceObject의 바운딩 박스를 기준으로 선글라스 위치 조정
  const faceBox = new THREE.Box3().setFromObject(faceObject.scene);
  const faceCenter = faceBox.getCenter(new THREE.Vector3());
  const faceSize = faceBox.getSize(new THREE.Vector3());

  sunglassObject.scene.position.set(
    faceCenter.x,
    faceCenter.y + faceSize.y / 2, // 얼굴 위쪽에 위치
    faceCenter.z + faceSize.z / 2 // 얼굴 앞쪽에 위치
  );
  sunglassObject.scene.scale.set(8, 8, 8); // 스케일 조정 (필요에 따라)

  // 텍스처 업데이트는 일반적으로 로드 후 필요 없습니다. 문제가 발생할 경우에만 사용하세요.
  // sunglassObject.scene.traverse((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     const materials = Array.isArray(child.material) ? child.material : [child.material];
  //     materials.forEach((material) => {
  //       if (material.map) {
  //         material.map.needsUpdate = true;
  //       }
  //     });
  //   }
  // });

  faceObject.scene.add(sunglassObject.scene); // 얼굴 객체의 자식으로 추가
};

// 주변 작은 객체들 생성 및 추가
const createAndAddObjects = async (
  objectGroup: THREE.Group,
  faceObject: GLTF
) => {
  const objectNames = [
    { name: "sparkle", position: [3, 3, 7] },
    { name: "snowflake", position: [-3, 3, 7] },
    { name: "lamp", position: [-3, -6, 6] },
    { name: "cherry", position: [-5, 3, -2] },
    { name: "bulb", position: [7, 0, 3] },
    { name: "swirl", position: [-8, 0, 3] },
    { name: "lightning", position: [8, -9, -4] },
    { name: "diamond", position: [3, -6, 6] },
  ];
  const faceBox = new THREE.Box3().setFromObject(faceObject.scene);
  const standardSize = faceBox.getSize(new THREE.Vector3()).x; // 얼굴 객체의 X축 크기를 기준으로 스케일 조정

  for (const objectData of objectNames) {
    try {
      const obj = await createObject(objectData.name);
      // 객체 스케일 및 위치 조정 로직
      const objBox = new THREE.Box3().setFromObject(obj.scene);
      const objSize = objBox.getSize(new THREE.Vector3());
      const scaleFactor =
        standardSize / 5 / Math.max(objSize.x, objSize.y, objSize.z); // 얼굴 크기에 비례하여 스케일 조정
      obj.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
      obj.scene.position.set(
        objectData.position[0],
        objectData.position[1],
        objectData.position[2]
      );
      objectGroup.add(obj.scene);
    } catch (error) {
      console.error(`Failed to load and add object: ${objectData.name}`, error);
    }
  }
};

// 객체 리소스 해제
const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
  // 객체가 부모로부터 제거되지 않았다면 제거
  if (object.parent) {
    object.parent.remove(object);
  }
};

// --- React 컴포넌트 ---

export default function ProfilePage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseOverFace = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // 마우스 움직임 핸들러 (최적화)
  const onMouseMove = useCallback(
    (
      event: MouseEvent,
      camera: THREE.Camera,
      raycaster: THREE.Raycaster,
      mouse: THREE.Vector2,
      faceObject: GLTF,
      objectGroup: THREE.Group
    ) => {
      // 불필요한 scene 인자 제거
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // faceObject.scene이 실제로 존재하고 로드되었는지 확인
      if (faceObject && faceObject.scene) {
        const intersects = raycaster.intersectObjects(
          [faceObject.scene], // 검사할 특정 객체들만 배열로 전달
          true
        );
        const isOverFace = intersects.some((obj) => obj.object.userData.isFace);
        mouseOverFace.current = isOverFace;

        faceObject.scene.rotation.x = mouse.y / 10;
        faceObject.scene.rotation.y = mouse.x / 10;
      }
      if (objectGroup) {
        objectGroup.rotation.x = -mouse.y / 10;
        objectGroup.rotation.y = -mouse.x / 10;
      }
    },
    [] // 의존성 배열 비움 (camera, raycaster, mouse 등은 변경되지 않으므로)
  );

  const initThree = useCallback(async (): Promise<() => void> => {
    const mount = mountRef.current;
    if (!mount) return () => {};

    // 씬 초기화
    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer();

    mount.appendChild(renderer.domElement);

    const controls = setupControls(camera, renderer);
    setupLights(scene);

    // 객체 로드
    let faceObject: GLTF | null = null;
    let sunglassObject: GLTF | null = null;
    let textObject: THREE.Mesh | null = null;
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    try {
      faceObject = await createObject("emoji");
      setupFaceObject(scene, faceObject);

      sunglassObject = await createObject("sunglasses");
      if (faceObject) {
        // faceObject가 로드된 후에만 sunglassObject 설정
        setupSunglassObject(faceObject, sunglassObject);
      }
      await createAndAddObjects(objectGroup, faceObject);
      textObject = await createTextObject("hover me !");
      textObject.position.set(-10, 5, 0); // 위치 조정
      scene.add(textObject);
    } catch (error) {
      console.error("Failed to load initial 3D objects:", error);
      // 에러 발생 시 사용자에게 알리거나 대체 콘텐츠 표시
      return () => {}; // 클린업 함수 반환
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      // scene 인자 제거
      if (faceObject && sunglassObject) {
        // 객체가 로드되었는지 확인 후 호출
        onMouseMove(event, camera, raycaster, mouse, faceObject, objectGroup);
      }
    };
    renderer.domElement.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();

      if (faceObject && sunglassObject) {
        const faceBox = new THREE.Box3().setFromObject(faceObject.scene);
        const targetY = mouseOverFace.current
          ? faceBox.max.y / 2 + 5 // 마우스 오버 시 선글라스 위치
          : faceBox.max.y / 2; // 기본 선글라스 위치
        sunglassObject.scene.position.y +=
          (targetY - sunglassObject.scene.position.y) * 0.1; // 부드러운 이동
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 클린업 함수
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      // 모든 Three.js 리소스 해제
      scene.children.forEach((object) => disposeObject(object));
      scene.remove(objectGroup); // 그룹도 제거
      controls.dispose();
      renderer.dispose();
      // 재질 및 지오메트리 수동 해제 (필요시)
      // 만약 disposeObject 함수에서 모든 하위 객체를 처리하지 못했다면 여기에 추가
    };
  }, [onMouseMove]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    initThree().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initThree]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      ref={mountRef}
    />
  );
}
