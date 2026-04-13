import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import API from "../services/api";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");

  useEffect(() => {
    fetchJobs(activeTab);
  }, [activeTab]);

  const fetchJobs = (type) => {
    setLoading(true);

    API.get("/jobs", {
      params: { type },
    })
      .then((res) => {
         setJobs(res.data.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">Job Listing</h1>

        {/* 🔥 Tabs */}
        <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "featured" ? "active" : ""}`}
              onClick={() => setActiveTab("featured")}
            >
              Featured
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Full Time" ? "active" : ""}`}
              onClick={() => setActiveTab("Full Time")}
            >
              Full Time
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Part Time" ? "active" : ""}`}
              onClick={() => setActiveTab("Part Time")}
            >
              Part Time
            </button>
          </li>

        </ul>

        {/* 🔄 Loading */}
        {loading && <div className="text-center">Loading jobs...</div>}

        {/* 📦 Jobs */}
        {!loading && jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          !loading && <div className="text-center">No jobs found</div>
        )}

      </div>
    </div>
  );
}

export default JobList;