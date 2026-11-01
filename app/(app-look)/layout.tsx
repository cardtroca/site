import { AppLookShell } from "@/components/public/AppLookShell";

export default function AppLookLayout({ children }: { children: React.ReactNode }) {
  return <AppLookShell>{children}</AppLookShell>;
}
