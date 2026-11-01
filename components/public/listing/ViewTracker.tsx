"use client";

import { useEffect } from "react";
import { trackPublic, type PublicEvent } from "@/lib/public/track";

export function ViewTracker({ event, props }: { event: PublicEvent; props?: Record<string, string> }) {
  const key = JSON.stringify(props ?? {});
  useEffect(() => {
    trackPublic(event, JSON.parse(key) as Record<string, string>);
  }, [event, key]);
  return null;
}
