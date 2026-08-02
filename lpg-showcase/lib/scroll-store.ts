import { create } from 'zustand';

export interface CylinderState {
  rotationY: number;
  rotationX: number;
  posY: number;
  scale: number;
  valveRotation: number;
  emissiveIntensity: number;
  wireframeOpacity: number;
  particleProgress: number; // 0=dispersed, 1=assembled
}

export interface CameraState {
  azimuth: number;   // degrees around Y
  elevation: number; // degrees up/down
  distance: number;  // from origin
  targetX: number;
  targetY: number;
  targetZ: number;
}

interface ScrollStore {
  scrollProgress: number;       // 0–1 total page scroll
  activeScene: number;          // 0–8
  cylinder: CylinderState;
  camera: CameraState;
  modulesVisible: boolean;
  dataFlowVisible: boolean;
  warehouseVisible: boolean;
  analyticsVisible: boolean;
  finalTextVisible: boolean;

  setScrollProgress: (p: number) => void;
  setActiveScene: (s: number) => void;
  setCylinder: (c: Partial<CylinderState>) => void;
  setCamera: (c: Partial<CameraState>) => void;
  setModulesVisible: (v: boolean) => void;
  setDataFlowVisible: (v: boolean) => void;
  setWarehouseVisible: (v: boolean) => void;
  setAnalyticsVisible: (v: boolean) => void;
  setFinalTextVisible: (v: boolean) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  activeScene: 0,
  cylinder: {
    rotationY: 0,
    rotationX: 0,
    posY: -0.5,
    scale: 0,
    valveRotation: 0,
    emissiveIntensity: 0,
    wireframeOpacity: 1,
    particleProgress: 0,
  },
  camera: {
    azimuth: 0,
    elevation: 15,
    distance: 5.5,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
  },
  modulesVisible: false,
  dataFlowVisible: false,
  warehouseVisible: false,
  analyticsVisible: false,
  finalTextVisible: false,

  setScrollProgress: (p) => set({ scrollProgress: p }),
  setActiveScene: (s) => set({ activeScene: s }),
  setCylinder: (c) => set((state) => ({ cylinder: { ...state.cylinder, ...c } })),
  setCamera: (c) => set((state) => ({ camera: { ...state.camera, ...c } })),
  setModulesVisible: (v) => set({ modulesVisible: v }),
  setDataFlowVisible: (v) => set({ dataFlowVisible: v }),
  setWarehouseVisible: (v) => set({ warehouseVisible: v }),
  setAnalyticsVisible: (v) => set({ analyticsVisible: v }),
  setFinalTextVisible: (v) => set({ finalTextVisible: v }),
}));

// Helper: map a value from [inMin,inMax] to [outMin,outMax], clamped
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}

// Scene boundaries (0–1 scroll progress)
export const SCENES = [
  { id: 0, name: 'Birth',      start: 0,    end: 0.12 },
  { id: 1, name: 'Reveal',     start: 0.12, end: 0.25 },
  { id: 2, name: 'Awakens',    start: 0.25, end: 0.40 },
  { id: 3, name: 'OS',         start: 0.40, end: 0.58 },
  { id: 4, name: 'Flow',       start: 0.58, end: 0.72 },
  { id: 5, name: 'Warehouse',  start: 0.72, end: 0.84 },
  { id: 6, name: 'Analytics',  start: 0.84, end: 0.94 },
  { id: 7, name: 'Devices',    start: 0.94, end: 0.97 },
  { id: 8, name: 'Transform',  start: 0.97, end: 1.00 },
] as const;
