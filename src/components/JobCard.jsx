import Swal from "sweetalert2";
import API from "../services/api";

function JobCard({ job }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(job.applied || false);

  const applyJob = async () => {
    if (loading || applied) return;

    if (!job?.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid Job ID",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/apply-job", {
        job_id: job.id,
      });

      setApplied(true);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message || "Applied successfully",
      });
    } catch (err) {
      console.error("Apply Job Error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-item p-4 mb-4 border rounded shadow-sm">
      <div className="row g-4">
        {/* Left Side */}
        <div className="col-sm-12 col-md-8 d-flex align-items-center">
          <img
            className="flex-shrink-0 img-fluid border rounded"
            src={
              job.logo
                ? `https://server.budes.online/storage/${job.logo}`
                : "/assets/img/default.png"
            }
            alt="Company Logo"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />

          <div className="text-start ps-4">
            <h5 className="mb-2">{job.job_title}</h5>

            <span className="text-truncate me-3">
              <i className="fa fa-map-marker-alt text-primary me-2"></i>
              {job.location || "N/A"}
            </span>

            <span className="text-truncate me-3">
              <i className="far fa-clock text-primary me-2"></i>
              {job.employment_type || "Full Time"}
            </span>

            <span className="text-truncate">
              <i className="far fa-money-bill-alt text-primary me-2"></i>
              {job.salary_range || "Not Disclosed"}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
          <div className="d-flex mb-3">
            <button className="btn btn-light btn-square me-3">
              <i className="far fa-heart text-primary"></i>
            </button>
            return (
            {/* <button
              className="btn btn-primary"
              onClick={applyJob}
              disabled={loading || applied}
            >
              {loading ? "Applying..." : applied ? "Applied" : "Apply Now"}
            </button>  */}
            );
          </div>

          <small className="text-truncate">
            <i className="far fa-calendar-alt text-primary me-2"></i>
            Deadline:{" "}
            {job.apply_deadline
              ? new Date(job.apply_deadline).toLocaleDateString()
              : "N/A"}
          </small>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
