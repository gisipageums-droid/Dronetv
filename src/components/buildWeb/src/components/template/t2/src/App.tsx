// App.tsx (updated)
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Profile from "./components/Profile"; // Add this import
import Services from "./components/Services";
import Product from "./components/Product";
import Gallery from "./components/Gallery";
import Blog from "./components/Blog";
import Testimonials from "./components/Testimonials";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Publish from "./components/Publish";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header />
        <main>
          <Hero />
          <About />
          <Profile /> {/* Add this line */}
          <Product />
          <Services />
          <Gallery />
          <Blog />
          <Testimonials />
          <Clients />
          <Contact />
        </main>
        <Publish />
        <Footer />
      </div>
    </ThemeProvider>
  );
}