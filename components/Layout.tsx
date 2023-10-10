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
          <Footer />
        </div>
      </>
    )
  }