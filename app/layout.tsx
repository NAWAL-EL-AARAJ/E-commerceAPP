import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Petit_Formal_Script } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500"],
  display: "swap",
});

const script = Petit_Formal_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MERHAS — Foulards pensés avec élégance",
  description:
    "MERHAS — des foulards fluides et élégants, pensés pour sublimer chaque moment, avec style et modestie. Livraison partout au Maroc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable} ${script.variable}`}
    >
      <body className="min-h-screen bg-cream font-body text-espresso antialiased">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
