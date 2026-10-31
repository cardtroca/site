export function Icon({ name, size, filled }: { name: string; size?: number; filled?: boolean }) {
  return (
    <span
      className="ms"
      aria-hidden="true"
      style={{
        ...(size ? { fontSize: size } : {}),
        ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
      }}
    >
      {name}
    </span>
  );
}
