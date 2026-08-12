"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ExperienceOverlay } from "@/components/experience/ExperienceOverlay";
import { loadMcLarenModel } from "@/features/car3d/loadMcLarenModel";
import { createFloor } from "@/lib/three/createFloor";
import { createRenderer } from "@/lib/three/createRenderer";
import { disposeObject3D } from "@/lib/three/disposeObject3D";
import { resizeRenderer } from "@/lib/three/resizeRenderer";
import styles from "./StudioExperience.module.css";

export function StudioExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrame = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f2ee);

    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / container.clientHeight,
      0.1,
      60,
    );
    camera.position.set(6.2, 2.6, 7.3);

    const renderer = createRenderer({
      width: container.clientWidth,
      height: container.clientHeight,
      exposure: 1.05,
    });
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xa9a7a1, 2.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-8, 14, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.15);
    fillLight.position.set(8, 5, -7);
    scene.add(fillLight);

    scene.add(
      createFloor({
        width: 30,
        depth: 24,
        color: 0xe8e7e2,
        roughness: 0.94,
      }),
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 3.5;
    controls.maxDistance = 11;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.set(0, 0.76, 0);

    void loadMcLarenModel()
      .then(({ root }) => {
        if (disposed) {
          disposeObject3D(root);
          return;
        }

        root.position.y = 0.02;
        scene.add(root);
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
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    const handleResize = () => resizeRenderer(renderer, camera, container);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      timer.dispose();
      controls.dispose();
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
      <ExperienceOverlay help="drag to rotate · scroll to zoom" />
    </main>
  );
}
