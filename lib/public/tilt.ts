// Matemática do tilt (port de device_tilt.dart e card_viewer_scaffold.dart).
export const MAX_TILT_DEG = 8;
/** Variação de beta/gamma (graus) que leva a inclinação ao máximo. */
export const FULL_TILT_DEG = 17;
/** Fator com que a referência acompanha a leitura atual. */
export const REFERENCE_FACTOR = 0.02;
/** Suavização do tremor do sensor. */
export const SMOOTH_FACTOR = 0.2;

export const clamp = (v: number, min = -1, max = 1) => Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface TiltState { ref: [number, number] | null; value: [number, number] }
export const initialTilt = (): TiltState => ({ ref: null, value: [0, 0] });

/** Uma leitura do giroscópio (gamma = eixo x, beta = eixo y). Devolve o novo estado, de -1 a 1 em cada eixo. */
export function stepTilt(s: TiltState, gamma: number, beta: number): TiltState {
  const ref: [number, number] = s.ref
    ? [lerp(s.ref[0], gamma, REFERENCE_FACTOR), lerp(s.ref[1], beta, REFERENCE_FACTOR)]
    : [gamma, beta];
  const target: [number, number] = [
    clamp((gamma - ref[0]) / FULL_TILT_DEG),
    clamp((beta - ref[1]) / FULL_TILT_DEG),
  ];
  return {
    ref,
    value: [lerp(s.value[0], target[0], SMOOTH_FACTOR), lerp(s.value[1], target[1], SMOOTH_FACTOR)],
  };
}

/** Posição do ponteiro dentro do retângulo, de -1 a 1. */
export function pointerTilt(px: number, py: number, rect: { left: number; top: number; width: number; height: number }): [number, number] {
  return [
    clamp(((px - rect.left) / rect.width - 0.5) * 2),
    clamp(((py - rect.top) / rect.height - 0.5) * 2),
  ];
}

/** Balanço quando parado. */
export const idleSway = (t: number): [number, number] => [Math.sin(t) * 0.5, Math.cos(t * 0.8) * 0.3];

export function tiltStyle(x: number, y: number) {
  return {
    transform: `rotateX(${-y * MAX_TILT_DEG}deg) rotateY(${x * MAX_TILT_DEG}deg)`,
    shine: `${50 - x * 60}% ${50 - y * 30}%`,
  };
}

/** Toque sem arraste (< 10 px entre touchstart e touchend): só ele pede a permissão do giroscópio. */
export const TAP_SLOP_PX = 10;
export const isStillTap = (start: [number, number], end: [number, number]) =>
  Math.hypot(end[0] - start[0], end[1] - start[1]) < TAP_SLOP_PX;
