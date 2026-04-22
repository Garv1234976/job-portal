import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

// ✅ IMPORT THESE
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState(null);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        setActivePlan(res.data.active_plan);
      })
      .catch(() => {});
  }, []);

  const handlePostJob = () => {
    if (!activePlan || activePlan.jobs_remaining <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Plan Required",
        text: "Please buy or upgrade your plan first",
      }).then(() => {
        navigate("/recruiter/plans");
      });
    } else {
      navigate("/recruiter/create-job");
    }
  };

  return (
    <>
      {/* ✅ NAVBAR */}
      <Navbar />

      {/* ✅ MAIN WRAPPER (UPDATED) */}
      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* ✅ SIDEBAR */}
          <div className="col-md-3 col-lg-2 mb-3">
            <RecruiterSidebar handlePostJob={handlePostJob} />
          </div>

          {/* ✅ MAIN CONTENT (YOUR ORIGINAL CODE INSIDE) */}
          <div className="col-md-9 col-lg-10">

            <div className="container">
              <h2 className="mb-4">Recruiter Dashboard</h2>

              <div className="row g-4">

                <div className="col-md-3">
                  <div className="card shadow p-3 text-center h-100 dashboard-card">
                    <i className="fa fa-plus-circle fa-2x text-primary mb-2"></i>
                    <h5>Post Job</h5>
                    <p>Create new job listing</p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handlePostJob}
                    >
                      Post Job
                    </button>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow p-3 text-center h-100 dashboard-card">
                    <i className="fa fa-briefcase fa-2x text-success mb-2"></i>
                    <h5>My Jobs</h5>
                    <p>Manage your jobs</p>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => navigate("/recruiter/jobs")}
                    >
                      View Jobs
                    </button>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow p-3 text-center h-100 dashboard-card">
                    <i className="fa fa-credit-card fa-2x text-warning mb-2"></i>
                    <h5>Plans</h5>
                    <p>Check Plans</p>
                    <button
                      className="btn btn-warning w-100"
                      onClick={() => navigate("/recruiter/plans")}
                    >
                      View Plans
                    </button>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow p-3 text-center h-100 dashboard-card">
                    <i className="fa fa-times-circle fa-2x text-dark mb-2"></i>
                    <h5>Closed Jobs</h5>
                    <p>Archived jobs</p>
                    <button
                      className="btn btn-dark w-100"
                      onClick={() => navigate("/recruiter/closed-jobs")}
                    >
                      View Closed
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ✅ FOOTER */}
      <Footer />
    </>
  );
}