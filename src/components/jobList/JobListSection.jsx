import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api";
import JobCard from "../../components/JobCard";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [locationInput, setLocationInput] = useState("");
  const [locationMode, setLocationMode] = useState("select");

  const [locations, setLocations] = useState([]);

  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState(0);
  const [savedFilter, setSavedFilter] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const location = useLocation();

  // ✅ LOGIN CHECK
  const isLoggedIn = !!localStorage.getItem("token");

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      category_id: params.get("category_id"),
      sub_category_id: params.get("sub_category_id"),
    };
  };

  useEffect(() => {
    API.get("/filters")
      .then((res) => setLocations(res.data?.locations || []))
      .catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    fetchJobs();
  }, [page, location.search]);

  const fetchJobs = (customPage = page) => {
    setLoading(true);

    const query = getQueryParams();

    API.get("/jobs", {
      params: {
        page: customPage,
        search,
        location: locationInput,
        salary,
        type: jobType,
        experience,
        saved: savedFilter,
        category_id: query.category_id,
        sub_category_id: query.sub_category_id,
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

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h2 className="fw-bold mb-4">Find Jobs</h2>

        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <div className="bg-white p-3 shadow-sm rounded">

              <h5>All Filters</h5>
              <hr />

              {/* SAVED */}
              <h6>Saved Jobs</h6>

              {[
                { label: "All Jobs", value: "" },
                { label: "Saved Jobs", value: "saved" },
                { label: "Unsaved Jobs", value: "unsaved" }
              ].map((item, i) => (
                <div
                  key={i}
                  className="form-check"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSavedFilter(item.value)}
                >
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={savedFilter === item.value}
                    readOnly
                  />
                  <label className="form-check-label">
                    {item.label}
                  </label>
                </div>
              ))}

              <hr />

              {/* WORK MODE */}
              <h6>Work Mode</h6>

              {[
                { label: "All Work Modes", value: "" },
                { label: "WFH", value: "WFH" },
                { label: "Remote", value: "remote" },
                { label: "Hybrid", value: "hybrid" }
              ].map((item, i) => (
                <div
                  key={i}
                  className="form-check"
                  style={{ cursor: "pointer" }}
                  onClick={() => setJobType(item.value)}
                >
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={jobType === item.value}
                    readOnly
                  />
                  <label className="form-check-label">
                    {item.label}
                  </label>
                </div>
              ))}

              <hr />

              {/* EXPERIENCE */}
              <h6>Experience</h6>
              <div>Selected: {experience} Years</div>
              <input
                type="range"
                min="0"
                max="30"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <hr />

              {/* SALARY */}
              <h6>Salary</h6>

              {[
                { label: "All Salaries", value: "" },
                { label: "0-3 Lakhs", value: "0-3" },
                { label: "3-6 Lakhs", value: "3-6" },
                { label: "6-10 Lakhs", value: "6-10" }
              ].map((item, i) => (
                <div
                  key={i}
                  className="form-check"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSalary(item.value)}
                >
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={salary === item.value}
                    readOnly
                  />
                  <label className="form-check-label">
                    {item.label}
                  </label>
                </div>
              ))}

              <hr />

              <button className="btn btn-primary w-100" onClick={()=>fetchJobs(1)}>
                Apply Filters
              </button>

              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => {
                  setJobType("");
                  setSalary("");
                  setExperience(0);
                  setSearch("");
                  setLocationInput("");
                  setSavedFilter("");
                  setPage(1);
                  fetchJobs(1);
                }}
              >
                Reset
              </button>

            </div>
          </div>

          {/* JOB LIST */}
          <div className="col-md-9">

            {/* ❌ NOT LOGGED IN */}
            {!loading && !isLoggedIn && (
              <div className="text-center py-5 text-muted">
                🔒 Jobs will be visible after login
              </div>
            )}

            {/* ✅ EXISTING SEARCH BAR */}
            <div className="row mb-3">

              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <select
                  className="form-select"
                  value={locationInput}
                  onChange={(e)=>setLocationInput(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={()=>fetchJobs(1)}>
                  Search
                </button>
              </div>

            </div>

            {loading && <p>Loading jobs...</p>}

            {/* ✅ ONLY SHOW IF LOGGED IN */}
            {!loading && isLoggedIn && jobs.length === 0 && (
              <p>No jobs found</p>
            )}

            {!loading && isLoggedIn && jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* ✅ PAGINATION ONLY IF LOGGED IN */}
            {isLoggedIn && lastPage > 1 && (
              <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">

                <button
                  className="btn btn-light border"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >‹</button>

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
                >›</button>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobListSection;