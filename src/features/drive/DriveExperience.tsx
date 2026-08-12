"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ExperienceOverlay } from "@/components/experience/ExperienceOverlay";
import { loadMcLarenModel } from "@/features/car3d/loadMcLarenModel";
import type { WheelRig } from "@/features/car3d/wheelRig";
import { createFloor } from "@/lib/three/createFloor";
import { createRenderer } from "@/lib/three/createRenderer";
import { disposeObject3D } from "@/lib/three/disposeObject3D";
import { resizeRenderer } from "@/lib/three/resizeRenderer";
import { DriveController } from "./driveController";
import { KeyboardInput } from "./keyboardInput";
import { updateChaseCamera } from "./updateChaseCamera";
import styles from "./DriveExperience.module.css";

export function DriveExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrame = 0;
    let wheelRigs: WheelRig[] = [];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 70, 360);

    const camera = new THREE.PerspectiveCamera(
      39,
      container.clientWidth / container.clientHeight,
      0.1,
      600,
    );

    const renderer = createRenderer({
      width: container.clientWidth,
      height: container.clientHeight,
      exposure: 1.08,
    });
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d9d9, 2.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(-8, 14, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -18;
    keyLight.shadow.camera.right = 18;
    keyLight.shadow.camera.top = 18;
    keyLight.shadow.camera.bottom = -18;
    scene.add(keyLight, keyLight.target);

    const floor = createFloor({
      width: 700,
      depth: 700,
      color: 0xffffff,
      roughness: 0.98,
    });
    floor.position.y = -0.02;
    scene.add(floor);

    const carRoot = new THREE.Group();
    carRoot.name = "DRIVE_CAR_ROOT";
    scene.add(carRoot);

    const controller = new DriveController(carRoot, () => wheelRigs);
    const keyboard = new KeyboardInput();
    controller.reset();
    keyboard.connect(() => controller.reset());

    void loadMcLarenModel(true)
      .then(({ root, wheelRigs: loadedRigs }) => {
        if (disposed) {
          disposeObject3D(root);
          return;
        }

        carRoot.add(root);
        wheelRigs = loadedRigs;
        controller.reset();
        setStatus("ready");
      })
      .catch((error: unknown) => {
        console.error("Failed to load the MP4/6 model.", error);
        if (!disposed) setStatus("error");
      });

    const timer = new THREE.Timer();
    timer.connect(document);

    const render = () => {
      animationFrame = requestAnimationFrame(render);
      timer.update();

      const deltaTime = timer.getDelta();
      controller.update(keyboard.read(), deltaTime);
      updateChaseCamera(camera, carRoot, deltaTime);

      floor.position.x = carRoot.position.x;
      floor.position.z = carRoot.position.z;
      keyLight.position.set(carRoot.position.x - 8, 14, carRoot.position.z + 7);
      keyLight.target.position.copy(carRoot.position);

      renderer.render(scene, camera);
    };
    render();

    const handleResize = () => resizeRenderer(renderer, camera, container);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      keyboard.disconnect();
      timer.dispose();
      window.removeEventListener("resize", handleResize);
      disposeObject3D(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <main className={styles.page}>
      <div ref={containerRef} className={styles.stage} />
      {status === "loading" && <div className={styles.loader}>Loading model…</div>}
      {status === "error" && (
        <div className={styles.loader}>Unable to load the 3D model.</div>
      )}
      <ExperienceOverlay help="W/S accelerate and brake · A/D steer · R reset" />
    </main>
  );
}
