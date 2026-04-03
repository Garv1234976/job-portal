import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import RegisterCandidate from "../pages/Auth/RegisterCandidate";
import RegisterRecruiter from "../pages/Auth/RegisterRecruiter";

import CandidateDashboard from "../pages/Candidate/Dashboard";
import RecruiterDashboard from "../pages/Recruiter/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import JobList from "../pages/JobList";
import JobDetail from "../pages/JobDetail";
import Category from "../pages/Category";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/candidate" element={<RegisterCandidate />} />
        <Route path="/register/recruiter" element={<RegisterRecruiter />} />

        {/* Candidate */}
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

        {/* Recruiter */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute roleRequired="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/job-detail" element={<JobDetail />} />
        <Route path="/category" element={<Category />} />

        
    </BrowserRouter>
  );
}

export default AppRoutes;
