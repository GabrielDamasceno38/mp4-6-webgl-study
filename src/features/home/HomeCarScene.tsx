"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { loadMcLarenModel } from "@/features/car3d/loadMcLarenModel";
import { createFloor } from "@/lib/three/createFloor";
import { createRenderer } from "@/lib/three/createRenderer";
import { disposeObject3D } from "@/lib/three/disposeObject3D";
import { resizeRenderer } from "@/lib/three/resizeRenderer";
import styles from "./Home.module.css";

export function HomeCarScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrame = 0;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f5f1);

    const camera = new THREE.PerspectiveCamera(
      31,
      container.clientWidth / container.clientHeight,
      0.1,
      50,
    );
    camera.position.set(6.5, 2.5, 7.7);
    camera.lookAt(0, 0.65, 0);

    const renderer = createRenderer({
      width: container.clientWidth,
      height: container.clientHeight,
      exposure: 1.05,
    });
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb5b3ac, 2.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(-6, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(8, 4, -5);
    scene.add(fillLight);

    scene.add(
      createFloor({
        width: 24,
        depth: 24,
        color: 0xf2f1ed,
        roughness: 0.95,
      }),
    );

    void loadMcLarenModel()
      .then(({ root }) => {
        if (disposed) {
          disposeObject3D(root);
          return;
        }

        root.rotation.y = -0.42;
        root.position.y = 0.02;
        scene.add(root);

        const render = (time: number) => {
          animationFrame = requestAnimationFrame(render);
          root.rotation.y = -0.42 + Math.sin(time * 0.00018) * 0.018;
          renderer.render(scene, camera);
        };

        animationFrame = requestAnimationFrame(render);
      })
      .catch((error: unknown) => {
        console.error("Failed to load the MP4/6 model.", error);
        if (!disposed) setHasError(true);
      });

    const handleResize = () => resizeRenderer(renderer, camera, container);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      disposeObject3D(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={styles.carSceneWrapper}>
      <div
        ref={containerRef}
        className={styles.carScene}
        role="img"
        aria-label="3D view of the McLaren MP4/6"
      />
      {hasError && <p className={styles.carError}>3D model unavailable.</p>}
    </div>
  );
}
