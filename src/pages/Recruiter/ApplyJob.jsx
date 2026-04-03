// src/pages/ApplyJob.jsx
import { useState } from "react";
import API from "../../services/api";

export default function ApplyJob() {
  const [jobId, setJobId] = useState("");

  const apply = async () => {
    try {
      await API.post("/apply-job", {
        job_id: jobId,
        candidate_id: 2,
      });

      alert("Applied Successfully");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Apply Job</h2>
      <input
        placeholder="Job ID"
        onChange={(e) => setJobId(e.target.value)}
      />
      <button onClick={apply}>Apply</button>
    </div>
  );
}