import React, { useState, useEffect } from "react";
import api from "../../services/api";


export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("applied");
  const [appliedJobs, setAppliedJobs] = useState([]);

  const tabs = [
    { id: "applied", label: "Applied Jobs" },
    { id: "saved", label: "Saved Jobs" },
    { id: "lastViewed", label: "Last Viewed" },
    { id: "profile", label: "Edit Profile" },
    { id: "resume", label: "Resume" },
  ];

  // 🔥 FETCH APPLIED JOBS
  useEffect(() => {
    if (activeTab === "applied") {
      fetchAppliedJobs();
    }
  }, [activeTab]);

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/applied-jobs");
      setAppliedJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "applied":
        return appliedJobs.length > 0 ? (
          <div className="w-full">
            {appliedJobs.map((item) => (
              <div
                key={item.id}
                className="border p-4 mb-3 rounded shadow-sm"
              >
                <h5 className="font-bold">{item.job?.job_title}</h5>
                <p>{item.job?.location}</p>
                <p className="text-sm text-gray-500">
                  Status: {item.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No applied jobs yet.</p>
        );

      case "saved":
        return <p className="text-gray-600">No saved jobs.</p>;

      case "lastViewed":
        return <p className="text-gray-600">No recently viewed jobs.</p>;

      case "profile":
        return <p className="text-gray-600">Update your profile details here.</p>;

      case "resume":
        return <p className="text-gray-600">Upload or update your resume.</p>;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Candidate Dashboard</h1>
          <p className="text-gray-500">Manage your jobs, profile and resume</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}