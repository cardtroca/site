import { DesktopFooter, DesktopNav } from "@/components/public/PageChrome";
import { ProfileNotFound } from "@/components/public/profile/ProfileNotFound";

/** notFound() da página do perfil cai aqui, com HTTP 404. */
export default function NotFound() {
  return (
    <>
      <DesktopNav />
      <main className="lp lp-unav-page">
        <ProfileNotFound />
      </main>
      <DesktopFooter />
    </>
  );
}
