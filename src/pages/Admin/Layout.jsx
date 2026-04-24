import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        {children}
      </div>

    </div>
  );
}