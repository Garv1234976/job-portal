import React, { useState } from "react";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("applied");

  const tabs = [
    { id: "applied", label: "Applied Jobs" },
    { id: "saved", label: "Saved Jobs" },
    { id: "lastViewed", label: "Last Viewed" },
    { id: "profile", label: "Edit Profile" },
    { id: "resume", label: "Resume" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "applied":
        return <p className="text-gray-600">No applied jobs yet.</p>;
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
        {/* Header */}
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px] flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
