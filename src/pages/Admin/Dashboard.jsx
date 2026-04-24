<AdminLayout>

  <div className="container-fluid mt-3">

    <h3 className="mb-4 fw-bold">Admin Dashboard</h3>

    <div className="row g-4">

      {/* USERS */}
      <div className="col-md-4">
        <div className="dashboard-card bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-1">Total Users</p>
              <h2 className="fw-bold">{stats.users}</h2>
            </div>
            <div className="icon-box bg-primary">
              <FaUsers />
            </div>
          </div>
        </div>
      </div>

      {/* JOBS */}
      <div className="col-md-4">
        <div className="dashboard-card bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-1">Total Jobs</p>
              <h2 className="fw-bold">{stats.jobs}</h2>
            </div>
            <div className="icon-box bg-success">
              <FaBriefcase />
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATIONS */}
      <div className="col-md-4">
        <div className="dashboard-card bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-1">Applications</p>
              <h2 className="fw-bold">{stats.applications}</h2>
            </div>
            <div className="icon-box bg-warning">
              <FaFileAlt />
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>

</AdminLayout>