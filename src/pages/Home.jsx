import { useState } from "react";

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
  // ✅ ADD FILTER STATE HERE
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
  });

  return (
    <div className="container-xxl bg-white p-0">
      <Spinner />
      <Navbar />
      <Carousel />

      <SearchBar
        onSearch={(data) => {
          setFilters(data);
        }}
      />

      <Category />
      <About />

      <JobList filters={filters} />

      <Testimonial />
      <Footer />
    </div>
  );
}

export default Home;