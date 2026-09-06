import "./globals.css";
import { Fraunces, Karla } from "next/font/google";
import { CartProvider } from "./context/CartContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "MERHAS",
  description: "Foulards MERHAS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${karla.variable} font-body`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}