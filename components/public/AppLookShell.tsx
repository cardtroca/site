import { Poppins } from "next/font/google";
import "@/app/(app-look)/app-look.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

/** Visual do app: Poppins, ícones e a classe .app-look. Usado pelo layout de (app-look) e pelo 404 da raiz. */
export function AppLookShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`app-look ${poppins.variable}`}>
      {/* Material Symbols Rounded: só carrega nas rotas com este visual */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
      />
      {children}
    </div>
  );
}
