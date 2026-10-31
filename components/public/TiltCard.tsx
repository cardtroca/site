"use client";

import { useEffect, useRef } from "react";
import { CardImage } from "./CardImage";
import { idleSway, initialTilt, pointerTilt, stepTilt, tiltStyle } from "@/lib/public/tilt";

type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function TiltCard({ src, alt, width }: { src: string | null; alt: string; width: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current, card = cardRef.current, shine = shineRef.current;
    if (!stage || !card || !shine) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const apply = (x: number, y: number) => {
      const s = tiltStyle(x, y);
      card.style.transform = s.transform;
      shine.style.backgroundPosition = s.shine;
    };

    let tilt = initialTilt();
    let t = Math.random() * 6;
    let hovering = false;
    let lastSensor = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      hovering = true;
      const [x, y] = pointerTilt(e.clientX, e.clientY, card.getBoundingClientRect());
      apply(x, y);
    };
    const onLeave = () => { hovering = false; };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt = stepTilt(tilt, e.gamma, e.beta);
      lastSensor = performance.now();
      apply(tilt.value[0], tilt.value[1]);
    };
    let listening = false;
    const listen = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("deviceorientation", onOrientation);
    };
    // iOS só aceita requestPermission dentro de um gesto válido (click/touchend).
    // O listener fica até a resposta ser definitiva (granted ou denied).
    let asking = false;
    const onTap = async () => {
      const D = window.DeviceOrientationEvent as IOSOrientation | undefined;
      if (!D || typeof D.requestPermission !== "function" || asking) return;
      asking = true;
      try {
        const answer = await D.requestPermission();
        if (answer === "granted") listen();
        stage.removeEventListener("click", onTap);
        stage.removeEventListener("touchend", onTap);
      } catch {
        // rejeitado fora de gesto válido: tenta de novo no próximo toque
      } finally {
        asking = false;
      }
    };

    const D = window.DeviceOrientationEvent as IOSOrientation | undefined;
    if (D && typeof D.requestPermission !== "function") listen();

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    stage.addEventListener("click", onTap);
    stage.addEventListener("touchend", onTap);

    const idle = () => {
      const sensorActive = performance.now() - lastSensor < 600;
      if (!hovering && !sensorActive) {
        t += 0.016;
        const [x, y] = idleSway(t);
        apply(x, y);
      }
      raf = requestAnimationFrame(idle);
    };
    raf = requestAnimationFrame(idle);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("click", onTap);
      stage.removeEventListener("touchend", onTap);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  return (
    <div ref={stageRef} className="stage" style={{ padding: "16px 0 24px" }}>
      <div className="tiltwrap">
        <div ref={cardRef} className="tcard" style={{ width }}>
          <CardImage url={src} alt={alt} />
          <div ref={shineRef} className="shine" />
        </div>
      </div>
    </div>
  );
}
