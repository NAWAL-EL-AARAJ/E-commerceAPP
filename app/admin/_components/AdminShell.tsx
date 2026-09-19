"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../components/ui/Logo";
import {
  BagIcon,
  CloseIcon,
  GridIcon,
  LogoutIcon,
  MenuIcon,
  TagIcon,
  UserIcon,
} from "../../components/icons";
import { useAdmin } from "./AdminProviders";
import { initiales } from "../_lib/helpers";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: GridIcon, exact: true },
  { href: "/admin/produits", label: "Produits", icon: TagIcon },
  { href: "/admin/commandes", label: "Commandes", icon: BagIcon },
  { href: "/admin/profil", label: "Admin", icon: UserIcon },
];

const TITRES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/produits": "Produits",
  "/admin/commandes": "Commandes",
  "/admin/profil": "Admin",
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, signOut, produits, commandes } = useAdmin();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const nom = session?.user?.user_metadata?.nom as string | undefined;
  const avatar = session?.user?.user_metadata?.avatar_url as string | undefined;
  const email = session?.user?.email;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const compteur = (href: string) =>
    href === "/admin/produits"
      ? produits.length
      : href === "/admin/commandes"
        ? commandes.length
        : null;

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <Logo size={48} priority />
        <span className="text-xs uppercase tracking-[0.2em] text-cream/50">
          Admin
        </span>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const actif = isActive(href, exact);
          const n = compteur(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                actif
                  ? "bg-cream/12 text-cream"
                  : "text-cream/60 hover:bg-cream/8 hover:text-cream"
              }`}
            >
              <Icon width={18} height={18} />
              <span className="flex-1">{label}</span>
              {n !== null && (
                <span className="rounded-full bg-cream/10 px-2 py-0.5 text-xs text-cream/70">
                  {n}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/15 text-xs font-medium text-cream">
              {initiales(nom, email)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-cream">{nom || "Admin"}</p>
            <p className="truncate text-xs text-cream/50">{email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/60 transition-colors hover:bg-cream/8 hover:text-cream"
        >
          <LogoutIcon width={18} height={18} />
          Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream text-espresso">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-espresso lg:block">
        {SidebarContent}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-espresso">
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute right-3 top-5 text-cream/60"
            >
              <CloseIcon width={22} height={22} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-line bg-cream/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="text-espresso lg:hidden"
          >
            <MenuIcon width={22} height={22} />
          </button>
          <h1 className="font-display text-2xl text-espresso">
            {TITRES[pathname] ?? "Admin"}
          </h1>
          <Link
            href="/"
            target="_blank"
            className="ml-auto hidden text-xs uppercase tracking-[0.15em] text-taupe hover:text-espresso sm:block"
          >
            Voir le site ↗
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
