import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobHeader from "../components/jobList/JobHeader";
import JobSection from "../components/jobList/JobListSection";

function JobList() {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <JobHeader />
      <JobSection />
      <Footer />
    </div>
  );
}

export default JobList;