import * as THREE from "three";
import { wheelSpecs } from "./car.config";

type WheelPart = {
  object: THREE.Object3D;
  originalInReference: THREE.Matrix4;
  parentInverseInReference: THREE.Matrix4;
};

export type WheelRig = {
  parts: WheelPart[];
  pivot: THREE.Vector3;
  radius: number;
  steerable: boolean;
};

type WheelSpec = (typeof wheelSpecs)[number];

export function createWheelRig(
  reference: THREE.Object3D,
  model: THREE.Object3D,
  spec: WheelSpec,
): WheelRig | null {
  reference.updateMatrixWorld(true);
  model.updateMatrixWorld(true);

  const tire = model.getObjectByName(spec.tireNode);
  if (!tire) return null;

  const objects = spec.animatedNodes
    .map((name) => model.getObjectByName(name))
    .filter((object): object is THREE.Object3D => Boolean(object));

  if (objects.length === 0) return null;

  const referenceInverse = reference.matrixWorld.clone().invert();
  const tireBox = new THREE.Box3().setFromObject(tire);
  const centerWorld = tireBox.getCenter(new THREE.Vector3());
  const pivot = centerWorld.clone().applyMatrix4(referenceInverse);
  const tireSize = tireBox.getSize(new THREE.Vector3());
  const radius = Math.max(tireSize.y, tireSize.z) * 0.5;

  const parts = objects.map((object) => {
    object.updateMatrixWorld(true);

    const originalInReference = referenceInverse.clone().multiply(object.matrixWorld);
    const parent = object.parent;

    if (!parent) {
      throw new Error(`Wheel node has no parent: ${object.name}`);
    }

    parent.updateMatrixWorld(true);
    const parentInReference = referenceInverse.clone().multiply(parent.matrixWorld);
    const parentInverseInReference = parentInReference.clone().invert();

    object.matrixAutoUpdate = false;

    return {
      object,
      originalInReference,
      parentInverseInReference,
    };
  });

  return {
    parts,
    pivot,
    radius: Math.max(radius, 0.2),
    steerable: spec.steerable,
  };
}

export function updateWheelRigs(rigs: WheelRig[], steeringAngle: number, distance: number) {
  for (const rig of rigs) {
    const aroundPivot = new THREE.Matrix4().makeTranslation(
      rig.pivot.x,
      rig.pivot.y,
      rig.pivot.z,
    );
    const backFromPivot = new THREE.Matrix4().makeTranslation(
      -rig.pivot.x,
      -rig.pivot.y,
      -rig.pivot.z,
    );
    const steering = new THREE.Matrix4().makeRotationY(
      rig.steerable ? steeringAngle : 0,
    );
    const rolling = new THREE.Matrix4().makeRotationX(distance / rig.radius);
    const delta = aroundPivot.clone().multiply(steering).multiply(rolling).multiply(backFromPivot);

    for (const part of rig.parts) {
      const desiredInReference = delta.clone().multiply(part.originalInReference);
      const desiredLocal = part.parentInverseInReference.clone().multiply(desiredInReference);

      part.object.matrix.copy(desiredLocal);
      part.object.matrixWorldNeedsUpdate = true;
    }
  }
}
