export const driveConfig = {
  maxForwardSpeed: 55,
  maxReverseSpeed: -10,
  acceleration: 16,
  braking: 27,
  reverseAcceleration: 8,
  rollingResistance: 4.2,
  steeringRate: 1.5,
  steeringVisualAngle: 0.32,
  steeringDamping: 11,
  speedForFullSteering: 13,
  minimumSteeringFactor: 0.2,
  carHeight: 0.035,
  maxFrameDelta: 0.04,
} as const;

export const driveKeys = {
  forward: ["KeyW", "ArrowUp"],
  backward: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  reset: "KeyR",
} as const;
