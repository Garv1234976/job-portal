import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Carousel from "../components/Carousel";
import SearchBar from "../components/SearchBar";
import Category from "../components/Category";
import About from "../components/About";
import JobList from "../components/JobList";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="container-xxl bg-white p-0">
      <Spinner />
      <Navbar />
      <Carousel />
      <SearchBar />
      <Category />
      <About />
      <JobList />
      <Testimonial />
      <Footer />
    </div>
  );
}

export default Home;