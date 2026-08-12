import * as THREE from "three";

type FloorOptions = {
  width: number;
  depth: number;
  color: number;
  roughness?: number;
};

export function createFloor({ width, depth, color, roughness = 0.95 }: FloorOptions) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color, roughness }),
  );

  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  return floor;
}
