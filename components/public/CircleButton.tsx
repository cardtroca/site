"use client";

import { Icon } from "./Icon";

export function CircleButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button type="button" className="circle" aria-label={label} title={label} onClick={onClick}>
      <Icon name={icon} />
    </button>
  );
}
