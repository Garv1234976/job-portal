import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import JobCard from "./JobCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./skeleton.css";


function JobList({ filters }) {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const location = useLocation();

  //  CHECK LOGIN
  const isLoggedIn = !!localStorage.getItem("token");

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      category_id: params.get("category_id"),
      sub_category_id: params.get("sub_category_id"),
    };
  };

  useEffect(() => {
    setPage(1);
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
        search: filters?.search || "",
        location: filters?.location || "",
        category_id: query.category_id || undefined,
        sub_category_id:
          query.sub_category_id || filters?.sub_category_id || undefined,
      },
    })
      .then((res) => {
        setJobs(res?.data?.data?.data || []);
        setLastPage(res?.data?.data?.last_page || 1);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  const getPagination = () => {
    const pages = [];

    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(lastPage - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < lastPage - 3) pages.push("...");
      pages.push(lastPage);
    }

    return pages;
  };

  const SkeletonCard = () => (
    <div className="card mb-3 p-3">
      <div className="d-flex justify-content-between">
        <div style={{ width: "70%" }}>
          <div className="skeleton skeleton-title mb-2"></div>
          <div className="skeleton skeleton-text mb-2"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
        <div className="skeleton skeleton-box"></div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Find Jobs</h2>
        <p className="text-muted">Explore latest opportunities across India</p>
      </div>
      {loading ? (
        [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
      ) : jobs.length > 0 ? (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      ) : (
        <p className="text-center text-muted">No jobs found</p>
      )}
      {lastPage > 1 && (
        <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
          <button
            className="btn btn-light border"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <FaChevronLeft />
          </button>

          {getPagination().map((p, i) => (
            <button
              key={i}
              disabled={p === "..."}
              className={`btn ${page === p ? "btn-dark" : "btn-light border"}`}
              onClick={() => typeof p === "number" && setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="btn btn-light border"
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default JobList;
