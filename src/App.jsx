import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import Category from "./pages/Category";
import Profile from "./pages/Profile";

// Auth
import Login from "./pages/Auth/Login";
import RegisterCandidate from "./pages/Auth/RegisterCandidate";
import RegisterRecruiter from "./pages/Auth/RegisterRecruiter";
import Logout from "./pages/Auth/Logout";

// Middleware
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

// Candidate
import CandidateDashboard from "./pages/Candidate/Dashboard";
import CandidateProfile from "./pages/Candidate/Profile";

// ✅ NEW (for sidebar pages)
import AppliedJobs from "./pages/Candidate/AppliedJobs";
import SavedJobs from "./pages/Candidate/SavedJobs";
import LastViewed from "./pages/Candidate/LastViewed";
import Resume from "./pages/Candidate/Resume";

// Recruiter
import RecruiterDashboard from "./pages/Recruiter/Dashboard";
import Plans from "./pages/Recruiter/Plans";
import CreateJob from "./pages/Recruiter/CreateJob";
import EditJob from "./pages/Recruiter/EditJob";
import ApplyJob from "./pages/Recruiter/ApplyJob";
import MyJobs from "./pages/Recruiter/MyJobs";
import Applications from "./pages/Recruiter/Applications";
import ClosedJobs from "./pages/Recruiter/ClosedJobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/category" element={<Category />} />

        {/* ================= AUTH ROUTES ================= */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route path="/logout" element={<Logout />} />

        <Route
          path="/register/candidate"
          element={
            <GuestRoute>
              <RegisterCandidate />
            </GuestRoute>
          }
        />

        <Route
          path="/register/recruiter"
          element={
            <GuestRoute>
              <RegisterRecruiter />
            </GuestRoute>
          }
        />

        {/* ================= CANDIDATE ROUTES ================= */}

        {/* DASHBOARD */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute roleRequired="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roleRequired="candidate">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute roleRequired="candidate">
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW SIDEBAR ROUTES */}

        <Route
          path="/candidate/applied"
          element={
            <ProtectedRoute roleRequired="candidate">
              <AppliedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/saved"
          element={
            <ProtectedRoute roleRequired="candidate">
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/last-viewed"
          element={
            <ProtectedRoute roleRequired="candidate">
              <LastViewed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/resume"
          element={
            <ProtectedRoute roleRequired="candidate">
              <Resume />
            </ProtectedRoute>
          }
        />

        {/* ================= RECRUITER ROUTES ================= */}

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/plans"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <Plans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/edit-job/:id"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/apply-job"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/closed-jobs"
          element={
            <ProtectedRoute roleRequired="recruiter">
              <ClosedJobs />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;