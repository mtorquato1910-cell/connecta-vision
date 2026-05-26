import { SITE } from "@/lib/site-data";

export function TopBar() {
  return (
    <div className="bg-conecta-blue text-white/90 text-[12px]">
      <div className="container-edge flex h-9 items-center justify-center text-center">
        <span className="truncate font-mono tracking-wide">{SITE.topBar}</span>
      </div>
    </div>
  );
}
