import { useState } from "react";
import About from "./components/About";
import Blog from "./components/Blog";
import BlogModal from "./components/BlogModal";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import CompanyProfile from "./components/Profile";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import UsedBy from "./components/UsedBy";
// In your _app.js or _app.tsx
// import "./styles/hamburger-fix.css";

export default function App() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  // Set initial dark mode state based on user's system preference

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header />
      <Hero />
      <UsedBy />
      <About />
      <CompanyProfile/>
      <Services />
      <Products />
      <Blog onSelectBlog={setSelectedBlog} />
      {selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
      <GallerySection/>
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
