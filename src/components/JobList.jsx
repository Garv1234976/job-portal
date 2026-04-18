import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import JobCard from "./JobCard";

// ✅ React Icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function JobList({ filters }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const location = useLocation();

  // ✅ GET QUERY PARAMS FROM URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);

    return {
      category_id: params.get("category_id"),
      sub_category_id: params.get("sub_category_id"),
    };
  };

  // ✅ Reset page when filters or URL changes
  useEffect(() => {
    setPage(1);
  }, [filters, location.search]);

  // ✅ Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, [page, filters, location.search]);

  // ✅ EXTRA: ensure fetch when filters update
  useEffect(() => {
    if (filters) {
      fetchJobs();
    }
  }, [filters]);

  const fetchJobs = () => {
    setLoading(true);

    const query = getQueryParams();

    // ✅ Debug
    console.log("Filters:", filters);
    console.log("Query Params:", query);

    API.get("/jobs", {
      params: {
        page,
        search: filters?.search || "",
        location: filters?.location || "",

        // ✅ FIXED CATEGORY LOGIC
        category_id: query.category_id ? query.category_id : undefined,
        sub_category_id: query.sub_category_id
          ? query.sub_category_id
          : filters?.sub_category_id || undefined,
      },
    })
      .then((res) => {
        setJobs(res?.data?.data?.data || []);
        setLastPage(res?.data?.data?.last_page || 1);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  // ✅ SMART PAGINATION
  const getPagination = () => {
    const pages = [];

    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 4) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(lastPage - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < lastPage - 3) {
        pages.push("...");
      }

      pages.push(lastPage);
    }

    return pages;
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

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-5 text-muted">
          No jobs found
        </div>
      )}

      {/* JOB LIST */}
      {!loading &&
        jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

      {/* PAGINATION */}
      {lastPage > 1 && (
        <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">

          {/* PREV */}
          <button
            className="btn btn-light border d-flex align-items-center"
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaChevronLeft />
          </button>

          {/* PAGE NUMBERS */}
          {getPagination().map((p, i) => (
            <button
              key={i}
              disabled={p === "..."}
              className={`btn ${
                page === p
                  ? "btn-dark"
                  : p === "..."
                  ? "btn-light border disabled"
                  : "btn-light border"
              }`}
              onClick={() => {
                if (typeof p === "number") {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              {p}
            </button>
          ))}

          {/* NEXT */}
          <button
            className="btn btn-light border d-flex align-items-center"
            disabled={page === lastPage}
            onClick={() => {
              setPage(page + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaChevronRight />
          </button>

        </div>
      )}
    </div>
  );
}

export default JobList;