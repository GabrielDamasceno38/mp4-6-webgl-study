import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { carConfig, wheelSpecs } from "./car.config";
import { createWheelRig, type WheelRig } from "./wheelRig";

export type McLarenModel = {
  root: THREE.Group;
  model: THREE.Object3D;
  wheelRigs: WheelRig[];
};

function normalizeModel(model: THREE.Object3D) {
  model.updateMatrixWorld(true);

  let bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const scale = carConfig.targetLengthMeters / Math.max(size.z, 0.001);

  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());

  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= bounds.min.y;
  model.updateMatrixWorld(true);
}

function configureMeshes(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return;

    const mesh = object as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

export async function loadMcLarenModel(withWheelAnimation = false): Promise<McLarenModel> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(carConfig.modelUrl);
  const model = gltf.scene;

  model.name = "MCLAREN_MP46_ORIGINAL";
  configureMeshes(model);

  const root = new THREE.Group();
  const reference = new THREE.Group();

  root.name = "MCLAREN_MP46_ROOT";
  reference.name = "MCLAREN_MP46_REFERENCE";

  root.add(reference);
  reference.add(model);

  normalizeModel(model);
  reference.updateMatrixWorld(true);

  const wheelRigs = withWheelAnimation
    ? wheelSpecs
        .map((spec) => createWheelRig(reference, model, spec))
        .filter((rig): rig is WheelRig => Boolean(rig))
    : [];

  return { root, model, wheelRigs };
}
