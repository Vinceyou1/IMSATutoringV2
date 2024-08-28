import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="h-full flex-grow flex w-full">{children}</main>
      {/* Footer is still very fucked, content pokes through the bottom on longer tutor pages */}
      <Footer />
    </div>
  );
}
