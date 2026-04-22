import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const hasActivePlan = activePlan !== null;
  const isLimitReached = activePlan?.jobs_remaining <= 0;

  useEffect(() => {
    API.get("/plans").then((res) => {
      setPlans(res.data.plans);
      setActivePlan(res.data.active_plan);
    });
  }, []);

  const buyPlan = async (id) => {
    await API.post("/buy-plan", {
      plan_id: id,
    });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Plan Activated Successfully",
      confirmButtonColor: "#28a745",
    }).then(() => {
      window.location.href = "/recruiter/create-job"; 
    });
  };

  return (
     <>
      <Navbar />
    <div className="container mt-4">
       {/* SIDEBAR */}
                <div className="col-md-3 col-lg-2">
                  <RecruiterSidebar />
                </div>
      <h2>Recruiter Plans</h2>

      {activePlan && (
        <div
          className={`alert ${
            activePlan.jobs_remaining <= 0 ? "alert-warning" : "alert-info"
          }`}
        >
          {activePlan.jobs_remaining <= 0 ? (
            <>Your job limit is reached. Please upgrade your plan.</>
          ) : (
            <>
              You already have an active plan: <b>{activePlan.plan_name}</b>
            </>
          )}
        </div>
      )}

      {/* Active Plan */}
      {activePlan && (
        <div className="card p-3 mb-4 bg-light">
          <h4>Active Plan</h4>
          <p>
            <b>{activePlan.plan_name}</b>
          </p>
          <p>Jobs Used: {activePlan.jobs_used}</p>
          <p>Remaining: {activePlan.jobs_remaining}</p>
          <p>Expiry: {activePlan.expiry_date}</p>
        </div>
      )}

      {/* Plans List */}
      <div className="row">
        {plans.map((plan) => (
          <div className="col-md-4" key={plan.id}>
            <div className="card p-3 mb-3">
              <h4>{plan.name}</h4>
              <p>₹{plan.price}</p>
              <p>Job Posts: {plan.job_limit}</p>

              <button
                className="btn btn-success"
                disabled={hasActivePlan && !isLimitReached}
                onClick={() => buyPlan(plan.id)}
              >
                {!hasActivePlan
                  ? "Buy Plan"
                  : isLimitReached
                    ? "Upgrade Plan"
                    : "Plan Active"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
