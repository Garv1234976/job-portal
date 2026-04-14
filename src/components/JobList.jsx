import { useEffect, useState } from "react";
import API from "../services/api";
import JobCard from "./JobCard";
import SearchBar from "./SearchBar"; 

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const fetchJobs = () => {
    setLoading(true);

    API.get("/jobs", {
      params: {
        page,
        search: filters.search,
        location: filters.location,
        category: filters.category,
      },
    })
      .then((res) => {
        setJobs(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="container py-5">

      <SearchBar
        onSearch={(data) => {
          setPage(1);
          setFilters(data);
        }}
      />

      <h2 className="mb-4">Find Jobs</h2>

      {loading && <p>Loading...</p>}

      {!loading && jobs.length === 0 && <p>No jobs found</p>}

      {!loading &&
        jobs.map((job) => <JobCard key={job.id} job={job} />)}

      {lastPage > 1 && (
        <div className="text-center mt-4">

          <button
            className="btn btn-light me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="mx-2">
            Page {page} of {lastPage}
          </span>

          <button
            className="btn btn-light ms-2"
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}

export default JobList;