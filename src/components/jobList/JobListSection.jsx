import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api";
import JobCard from "../../components/JobCard";

function JobListSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState(0);
  const [savedFilter, setSavedFilter] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const location = useLocation();

  // ✅ GET QUERY PARAMS
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      category_id: params.get("category_id"),
      sub_category_id: params.get("sub_category_id"),
    };
  };

  // 🔁 Reset page when URL changes
  useEffect(() => {
    setPage(1);
  }, [location.search]);

  // 🔁 Fetch jobs
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
        setJobs(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  // ✅ SMART PAGINATION FUNCTION
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
    <div className="container-xxl py-5">
      <div className="container">

        <h2 className="fw-bold mb-4">Find Jobs</h2>

        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <div className="bg-white p-3 shadow-sm rounded">

              <h5>All Filters</h5>
              <hr />

              <h6>Saved Jobs</h6>
              <div><input type="radio" checked={savedFilter === ""} onChange={() => setSavedFilter("")}/> All Jobs</div>
              <div><input type="radio" checked={savedFilter === "saved"} onChange={() => setSavedFilter("saved")}/> Saved Jobs</div>
              <div><input type="radio" checked={savedFilter === "unsaved"} onChange={() => setSavedFilter("unsaved")}/> Unsaved Jobs</div>

              <hr />

              <h6>Work Mode</h6>
              <div><input type="radio" value="WFH" checked={jobType==="WFH"} onChange={(e)=>setJobType(e.target.value)}/> WFH</div>
              <div><input type="radio" value="remote" checked={jobType==="remote"} onChange={(e)=>setJobType(e.target.value)}/> Remote</div>
              <div><input type="radio" value="hybrid" checked={jobType==="hybrid"} onChange={(e)=>setJobType(e.target.value)}/> Hybrid</div>

              <hr />

              <h6>Experience</h6>
              <div>Selected: {experience} Years</div>
              <input type="range" min="0" max="10" value={experience} onChange={(e)=>setExperience(e.target.value)} />

              <hr />

              <h6>Salary</h6>
              <div><input type="radio" value="0-3" checked={salary==="0-3"} onChange={(e)=>setSalary(e.target.value)}/> 0-3 Lakhs</div>
              <div><input type="radio" value="3-6" checked={salary==="3-6"} onChange={(e)=>setSalary(e.target.value)}/> 3-6 Lakhs</div>
              <div><input type="radio" value="6-10" checked={salary==="6-10"} onChange={(e)=>setSalary(e.target.value)}/> 6-10 Lakhs</div>

              <hr />

              <button className="btn btn-primary w-100" onClick={()=>fetchJobs(1)}>
                Apply Filters
              </button>

              <button className="btn btn-outline-secondary w-100 mt-2" onClick={()=>{
                setJobType("");
                setSalary("");
                setExperience(0);
                setSearch("");
                setLocationInput("");
                setSavedFilter("");
                setPage(1);
                fetchJobs(1);
              }}>
                Reset
              </button>

            </div>
          </div>

          {/* JOB LIST */}
          <div className="col-md-9">

            {/* SEARCH */}
            <div className="row mb-3">
              <div className="col-md-5">
                <input className="form-control" placeholder="Search jobs..."
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <input className="form-control" placeholder="Location"
                  value={locationInput}
                  onChange={(e)=>setLocationInput(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={()=>fetchJobs(1)}>
                  Search
                </button>
              </div>
            </div>

            {/* JOB LIST */}
            {loading && <p>Loading jobs...</p>}
            {!loading && jobs.length === 0 && <p>No jobs found</p>}

            {!loading &&
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

            {/* ✅ SMART PAGINATION */}
            {lastPage > 1 && (
              <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">

                {/* PREV */}
                <button
                  className="btn btn-light border"
                  disabled={page === 1}
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  ‹
                </button>

                {/* PAGES */}
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
                  className="btn btn-light border"
                  disabled={page === lastPage}
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  ›
                </button>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobListSection;