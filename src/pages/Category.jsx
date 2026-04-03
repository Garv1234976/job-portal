import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import CategorySection from "../components/category/CategorySection";

function Category() {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <CategoryHeader />
      <CategorySection />
      <Footer />
    </div>
  );
}

export default Category;