import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobDetailHeader from "../components/jobDetails/JobDetailHeader";
import JobDetailSection from "../components/jobDetails/JobDetailSection";


function JobDetail() {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <JobDetailHeader />
      <JobDetailSection />
      <Footer />
    </div>
  );
}

export default JobDetail;