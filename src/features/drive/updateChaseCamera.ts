import * as THREE from "three";

const desiredPosition = new THREE.Vector3();
const desiredLookAt = new THREE.Vector3();

export function updateChaseCamera(
  camera: THREE.PerspectiveCamera,
  carRoot: THREE.Object3D,
  deltaTime: number,
) {
  desiredPosition
    .set(0, 2.2, -6.5)
    .applyQuaternion(carRoot.quaternion)
    .add(carRoot.position);

  desiredLookAt
    .set(0, 0.72, 2.5)
    .applyQuaternion(carRoot.quaternion)
    .add(carRoot.position);

  camera.position.lerp(desiredPosition, 1 - Math.exp(-6 * deltaTime));
  camera.lookAt(desiredLookAt);
}
