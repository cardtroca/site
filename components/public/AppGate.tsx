"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isInAppBrowser, platformOf, type Platform } from "@/lib/public/links";
import type { GateSubject } from "@/lib/public/gate";
import { trackPublic } from "@/lib/public/track";
import { AppGateContent, AppGateQr } from "./AppGateContent";
import { CircleButton } from "./CircleButton";

type OpenGate = (origin: string) => void;
const GateContext = createContext<OpenGate>(() => {});

export function useAppGate(): OpenGate {
  return useContext(GateContext);
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AppGateProvider({
  subject,
  path,
  children,
}: {
  subject: GateSubject;
  path: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [inApp, setInApp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragY, setDragY] = useState(0);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  // Detecção só depois do mount, para não divergir do HTML do servidor.
  useEffect(() => {
    setPlatform(platformOf(navigator.userAgent));
    setInApp(isInAppBrowser(navigator.userAgent));
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const openGate = useCallback<OpenGate>((origin) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDragY(0);
    setOpen(true);
    trackPublic("web_app_gate_opened", { origin });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !el.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !el.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const onDragStart = (e: React.PointerEvent) => {
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onDragEnd = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > 90) close();
    else setDragY(0);
  };

  const content = (
    <AppGateContent subject={subject} path={path} platform={platform} inApp={inApp} isMobile={isMobile} />
  );
  const value = useMemo(() => openGate, [openGate]);

  return (
    <GateContext.Provider value={value}>
      {children}
      {open && (
        <div className={`gate ${isMobile ? "gate-sheet" : "gate-modal"}`}>
          <div className="gate-bg" onClick={close} />
          <div
            ref={dialogRef}
            className="gate-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-gate-title"
            style={isMobile && dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
          >
            {isMobile ? (
              <>
                <div
                  className="grab-area"
                  onPointerDown={onDragStart}
                  onPointerMove={onDragMove}
                  onPointerUp={onDragEnd}
                  onPointerCancel={onDragEnd}
                >
                  <div className="grab" />
                </div>
                {content}
              </>
            ) : (
              <>
                <div className="gate-x"><CircleButton icon="close" label="Fechar" onClick={close} /></div>
                <div>{content}</div>
                <AppGateQr path={path} kind={subject.kind} />
              </>
            )}
          </div>
        </div>
      )}
    </GateContext.Provider>
  );
}
