import AdminSidebar from "../../components/Admin/AdminSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="admin-content">
        <div className="content-inner">
          {children}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      {/* STYLES */}
      <style>{`
        .admin-layout {
          min-height: 100vh;
          background: #f8f9fa;
        }

        /* SIDEBAR WIDTH FIX */
        .admin-sidebar {
          width: 250px;
          min-width: 250px;
        }

        /* MAIN CONTENT */
        .admin-content {
          width: 100%;
          transition: all 0.3s ease;
        }

        /* 🔥 DESKTOP FIX (IMPORTANT) */
        @media (min-width: 768px) {
          .admin-content {
            margin-left: 250px;
            width: calc(100% - 250px);
          }
        }

        /* MOBILE */
        @media (max-width: 767px) {
          .admin-content {
            margin-left: 0;
            width: 100%;
          }
        }

        .content-inner {
          padding: 16px;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}