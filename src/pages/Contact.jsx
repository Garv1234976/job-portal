import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactHeader from "../components/contact/ContactHeader";
import ContactSection from "../components/contact/ContactSection";

function Contact() {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <ContactHeader />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Contact;