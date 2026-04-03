import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutHeader from "../components/about/AboutHeader";
import AboutSection from "../components/about/AboutSection";


function About() {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <AboutHeader />
      <AboutSection />
      <Footer />
    </div>
  );
}

export default About;