"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV_LINKS, SITE } from "../../lib/content";
import { CloseIcon } from "../icons";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[60] md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-espresso/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav
        className={`absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-cream px-7 py-8 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xl tracking-[0.3em] text-espresso">
            {SITE.nom}
          </span>
          <button aria-label="Fermer le menu" onClick={onClose} className="p-1">
            <CloseIcon width={22} height={22} />
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="border-b border-line py-4 font-display text-2xl text-espresso"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-8 text-[0.7rem] uppercase tracking-[0.2em] text-taupe">
          <Link href="/favoris" onClick={onClose}>
            Mes favoris
          </Link>
          <Link href="/panier" onClick={onClose}>
            Mon panier
          </Link>
          <Link href="/admin" onClick={onClose}>
            Espace admin
          </Link>
        </div>
      </nav>
    </div>
  );
}
