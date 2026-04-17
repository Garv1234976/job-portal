import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api";
import Swal from "sweetalert2";
import JobCard from "../../components/JobCard"; // ✅ IMPORTANT

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

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      category_id: params.get("category_id"),
      sub_category_id: params.get("sub_category_id"),
    };
  };

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

        // ✅ IMPORTANT
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

              {/* Saved */}
              <h6>Saved Jobs</h6>

              <div>
                <input type="radio" checked={savedFilter === ""} onChange={() => setSavedFilter("")}/> All Jobs
              </div>

              <div>
                <input type="radio" checked={savedFilter === "saved"} onChange={() => setSavedFilter("saved")}/> Saved Jobs
              </div>

              <div>
                <input type="radio" checked={savedFilter === "unsaved"} onChange={() => setSavedFilter("unsaved")}/> Unsaved Jobs
              </div>

              <hr />

              {/* Work Mode */}
              <h6>Work Mode</h6>

              <div>
                <input type="radio" value="WFH" checked={jobType==="WFH"} onChange={(e)=>setJobType(e.target.value)}/> WFH
              </div>

              <div>
                <input type="radio" value="remote" checked={jobType==="remote"} onChange={(e)=>setJobType(e.target.value)}/> Remote
              </div>

              <div>
                <input type="radio" value="hybrid" checked={jobType==="hybrid"} onChange={(e)=>setJobType(e.target.value)}/> Hybrid
              </div>

              <hr />

              {/* Experience */}
              <h6>Experience</h6>
              <div>Selected: {experience} Years</div>

              <input type="range" min="0" max="10" value={experience}
                onChange={(e)=>setExperience(e.target.value)}
              />

              <hr />

              {/* Salary */}
              <h6>Salary</h6>

              <div>
                <input type="radio" value="0-3" checked={salary==="0-3"} onChange={(e)=>setSalary(e.target.value)}/> 0-3 Lakhs
              </div>

              <div>
                <input type="radio" value="3-6" checked={salary==="3-6"} onChange={(e)=>setSalary(e.target.value)}/> 3-6 Lakhs
              </div>

              <div>
                <input type="radio" value="6-10" checked={salary==="6-10"} onChange={(e)=>setSalary(e.target.value)}/> 6-10 Lakhs
              </div>

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

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobListSection;