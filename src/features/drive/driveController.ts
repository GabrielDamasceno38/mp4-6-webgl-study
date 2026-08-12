import * as THREE from "three";
import { updateWheelRigs, type WheelRig } from "@/features/car3d/wheelRig";
import { driveConfig } from "./drive.config";
import type { DriveInputState } from "./keyboardInput";

export class DriveController {
  private speed = 0;
  private heading = 0;
  private steeringAngle = 0;
  private wheelDistance = 0;

  private readonly localForward = new THREE.Vector3(0, 0, 1);
  private readonly worldForward = new THREE.Vector3();

  constructor(
    private readonly carRoot: THREE.Group,
    private readonly wheelRigs: () => WheelRig[],
  ) {}

  reset() {
    this.speed = 0;
    this.heading = 0;
    this.steeringAngle = 0;
    this.wheelDistance = 0;

    this.carRoot.position.set(0, driveConfig.carHeight, 0);
    this.carRoot.rotation.set(0, 0, 0);
    updateWheelRigs(this.wheelRigs(), 0, 0);
  }

  update(input: DriveInputState, deltaTime: number) {
    const dt = Math.min(deltaTime, driveConfig.maxFrameDelta);

    this.updateSpeed(input, dt);
    const steeringInput = this.updateHeading(input, dt);

    this.worldForward
      .copy(this.localForward)
      .applyQuaternion(this.carRoot.quaternion)
      .normalize();

    this.carRoot.position.addScaledVector(this.worldForward, this.speed * dt);
    this.carRoot.position.y = driveConfig.carHeight;

    const targetSteering = steeringInput * driveConfig.steeringVisualAngle;
    this.steeringAngle = THREE.MathUtils.damp(
      this.steeringAngle,
      targetSteering,
      driveConfig.steeringDamping,
      dt,
    );

    this.wheelDistance += this.speed * dt;
    updateWheelRigs(this.wheelRigs(), this.steeringAngle, this.wheelDistance);
  }

  private updateSpeed(input: DriveInputState, dt: number) {
    if (input.forward) {
      this.speed = Math.min(
        driveConfig.maxForwardSpeed,
        this.speed + driveConfig.acceleration * dt,
      );
      return;
    }

    if (input.backward) {
      if (this.speed > 0.35) {
        this.speed = Math.max(0, this.speed - driveConfig.braking * dt);
      } else {
        this.speed = Math.max(
          driveConfig.maxReverseSpeed,
          this.speed - driveConfig.reverseAcceleration * dt,
        );
      }
      return;
    }

    const resistance = driveConfig.rollingResistance * dt;
    if (Math.abs(this.speed) <= resistance) {
      this.speed = 0;
    } else {
      this.speed -= Math.sign(this.speed) * resistance;
    }
  }

  private updateHeading(input: DriveInputState, dt: number) {
    // This sign convention matches the exported MP4/6 model and the approved controls:
    // A / ArrowLeft turns left; D / ArrowRight turns right.
    const steeringInput = (input.left ? 1 : 0) - (input.right ? 1 : 0);
    const speedFactor = THREE.MathUtils.clamp(
      Math.abs(this.speed) / driveConfig.speedForFullSteering,
      0,
      1,
    );
    const steeringFactor =
      driveConfig.minimumSteeringFactor +
      speedFactor * (1 - driveConfig.minimumSteeringFactor);
    const reverseSign = this.speed >= 0 ? 1 : -1;

    this.heading +=
      steeringInput *
      driveConfig.steeringRate *
      steeringFactor *
      dt *
      reverseSign;

    this.carRoot.rotation.y = this.heading;
    return steeringInput;
  }
}
