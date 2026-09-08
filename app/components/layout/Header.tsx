"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "../../lib/content";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  BagIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "../icons";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const pathname = usePathname();
  const { nombreArticles } = useCart();
  const { count } = useWishlist();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-cream/95 backdrop-blur"
          : "border-transparent bg-cream"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1180px] items-center justify-between px-5 sm:px-8">
        {/* Gauche : burger (mobile) */}
        <div className="flex flex-1 items-center md:hidden">
          <button
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
            className="p-1 text-espresso"
          >
            <MenuIcon width={22} height={22} />
          </button>
        </div>

        {/* Nav gauche (desktop) */}
        <nav className="hidden flex-1 items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.7rem] uppercase tracking-[0.2em] transition-colors ${
                isActive(link.href)
                  ? "text-rosewood"
                  : "text-espresso/70 hover:text-espresso"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-center"
          aria-label={SITE.nom}
        >
          <span className="text-rosewood text-lg leading-none">&#10047;</span>
          <span className="font-display text-2xl tracking-[0.35em] text-espresso">
            {SITE.nom}
          </span>
        </Link>

        {/* Actions droite */}
        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
          <Link
            href="/boutique"
            aria-label="Rechercher"
            className="hidden text-espresso/80 hover:text-rosewood sm:block"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/favoris"
            aria-label="Favoris"
            className="relative hidden text-espresso/80 hover:text-rosewood sm:block"
          >
            <HeartIcon />
            {count > 0 && <Badge>{count}</Badge>}
          </Link>
          <Link
            href="/admin"
            aria-label="Compte"
            className="text-espresso/80 hover:text-rosewood"
          >
            <UserIcon />
          </Link>
          <Link
            href="/panier"
            aria-label="Panier"
            className="relative text-espresso/80 hover:text-rosewood"
          >
            <BagIcon />
            {nombreArticles > 0 && <Badge>{nombreArticles}</Badge>}
          </Link>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rosewood px-1 text-[0.6rem] font-medium text-cream">
      {children}
    </span>
  );
}
