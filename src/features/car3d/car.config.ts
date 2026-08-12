const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const carConfig = {
  modelUrl: `${basePath}/models/mclaren_mp46.glb`,
  targetLengthMeters: 4.7,
  name: "McLaren MP4/6",
} as const;

export const wheelSpecs = [
  {
    id: "front-left",
    tireNode: "polySurface41",
    animatedNodes: ["polySurface40", "polySurface41"],
    steerable: true,
  },
  {
    id: "front-right",
    tireNode: "polySurface59",
    animatedNodes: ["polySurface58", "polySurface59"],
    steerable: true,
  },
  {
    id: "rear-left",
    tireNode: "pCylinder93_Tyre_0",
    animatedNodes: ["pCylinder93_Rim_0", "pCylinder93_Tyre_0"],
    steerable: false,
  },
  {
    id: "rear-right",
    tireNode: "polySurface72",
    animatedNodes: ["polySurface72", "polySurface73"],
    steerable: false,
  },
] as const;
