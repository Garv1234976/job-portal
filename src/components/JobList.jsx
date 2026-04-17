import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import JobCard from "./JobCard";

function JobList({ filters }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const location = useLocation();

  // 🔥 Get query params (category + subcategory)
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      category_id: params.get("category"),
      sub_category_id: params.get("sub_category"),
    };
  };

  useEffect(() => {
    setPage(1); // reset page on filter change
  }, [filters, location.search]);

  useEffect(() => {
    fetchJobs();
  }, [page, filters, location.search]);

  const fetchJobs = () => {
    setLoading(true);

    const query = getQueryParams();

    API.get("/jobs", {
      params: {
        page,
        search: filters?.search,
        location: filters?.location,
        category_id: query.category_id || filters?.category_id,
        sub_category_id: query.sub_category_id,
      },
    })
      .then((res) => {
        setJobs(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container py-5">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Find Jobs</h2>
        <p className="text-muted">
          Explore latest opportunities across India
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5 text-muted">
          Loading jobs...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-5 text-muted">
          No jobs found for selected category
        </div>
      )}

      {/* JOB LIST */}
      {!loading &&
        jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

      {/* PAGINATION */}
      {lastPage > 1 && (
        <div className="text-center mt-4">

          <button
            className="btn btn-light me-2"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ← Prev
          </button>

          <span className="mx-2 fw-semibold">
            Page {page} of {lastPage}
          </span>

          <button
            className="btn btn-light ms-2"
            disabled={page === lastPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next →
          </button>

        </div>
      )}
    </div>
  );
}

export default JobList;