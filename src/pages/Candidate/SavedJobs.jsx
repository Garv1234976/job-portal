import React, { useEffect, useState } from "react";
import api from "../../services/api";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

  const fetchJobs = async () => {
    try {
      const res = await api.get("/saved-jobs", {
        params: { search, page, per_page: perPage },
      });

      setJobs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      console.error(err);
    }
  };

  const removeJob = async (id) => {
    await api.post("/unsave-job", { job_id: id });
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(fetchJobs, 400);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          <div className="col-md-3 col-lg-2">
            <CandidateSidebar />
          </div>

          <div className="col-md-9 col-lg-10">
            <div className="bg-white p-4 shadow rounded">

              <h4 className="mb-3">Saved Jobs</h4>

              <input
                className="form-control w-50 mb-3"
                placeholder="Search job..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.length > 0 ? (
                    jobs.map((job, i) => (
                      <tr key={job.id}>
                        <td>{(page - 1) * perPage + i + 1}</td>
                        <td>{job.job_title}</td>
                        <td>{job.company_name || "N/A"}</td>
                        <td>{job.location}</td>
                        <td>₹ {job.salary_range || "N/A"}</td>
                        <td>{new Date(job.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => removeJob(job.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No saved jobs</td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}