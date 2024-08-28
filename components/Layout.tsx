import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
    return (
      <>
        <Header />
        <div className="h-[calc(100%-5rem)] flex flex-col justify-between">
          <main className="flex-grow">
            {children}
          </main>
          {/* Footer is still very fucked, content pokes through the bottom on longer tutor pages */}
          <Footer />
        </div>
      </>
    )
  }