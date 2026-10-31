import { describe, expect, it } from "vitest";
import { clamp, idleSway, initialTilt, pointerTilt, stepTilt, tiltStyle } from "./tilt";

describe("tilt", () => {
  it("clamp limita ao intervalo", () => {
    expect(clamp(5)).toBe(1);
    expect(clamp(-5)).toBe(-1);
    expect(clamp(0.3)).toBe(0.3);
  });
  it("primeira leitura vira referência e não inclina", () => {
    const s = stepTilt(initialTilt(), 10, 20);
    expect(s.ref).toEqual([10, 20]);
    expect(s.value).toEqual([0, 0]);
  });
  it("giro depois da referência inclina, sempre dentro de -1..1", () => {
    let s = stepTilt(initialTilt(), 0, 0);
    for (let i = 0; i < 50; i++) s = stepTilt(s, 90, -90);
    expect(s.value[0]).toBeLessThanOrEqual(1);
    expect(s.value[0]).toBeGreaterThan(0.3);
    expect(s.value[1]).toBeGreaterThanOrEqual(-1);
    expect(s.value[1]).toBeLessThan(-0.3);
  });
  it("parado, a referência alcança a leitura e a carta volta reta", () => {
    let s = stepTilt(initialTilt(), 0, 0);
    for (let i = 0; i < 20; i++) s = stepTilt(s, 30, 30);
    for (let i = 0; i < 600; i++) s = stepTilt(s, 30, 30);
    expect(Math.abs(s.value[0])).toBeLessThan(0.01);
  });
  it("ponteiro no centro é zero e nas bordas é ±1", () => {
    const r = { left: 0, top: 0, width: 100, height: 200 };
    expect(pointerTilt(50, 100, r)).toEqual([0, 0]);
    expect(pointerTilt(500, -50, r)).toEqual([1, -1]);
  });
  it("balanço e estilo", () => {
    expect(idleSway(0)).toEqual([0, 0.3]);
    expect(tiltStyle(1, 0).transform).toBe("rotateX(0deg) rotateY(8deg)");
  });
});
