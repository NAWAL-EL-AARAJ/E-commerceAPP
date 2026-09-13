import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartBar from "../components/layout/CartBar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartBar />
    </>
  );
}
