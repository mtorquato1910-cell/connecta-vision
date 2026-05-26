import { useSiteConfig } from "@/hooks/useSiteConfig";
import { SITE } from "@/lib/site-data";

export function TopBar() {
  const { texto } = useSiteConfig();
  // tenta puxar do admin, fallback pro hardcoded
  const msg = texto("global.topbar", SITE.topBar);

  return (
    <div className="bg-conecta-blue text-white/90 text-[12px]">
      <div className="container-edge flex h-9 items-center justify-center text-center">
        <span className="truncate font-mono tracking-wide">{msg}</span>
      </div>
    </div>
  );
}
