function Carousel() {
  return (
    <div className="container-fluid p-0">

      <div className="position-relative" style={{ height: "90vh" }}>

        {/* ✅ HERO IMAGE (FAST LOAD) */}
        <img
          src="/assets/img/job-bg.jpg"
          alt="Job Background"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />

        {/* ✅ GRADIENT OVERLAY */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
            zIndex: 2
          }}
        ></div>

        {/* ✅ CONTENT */}
        <div
          className="container position-relative text-white d-flex align-items-center"
          style={{ height: "100%", zIndex: 3 }}
        >
          <div className="row">
            <div className="col-lg-7">

              <h1 className="display-4 fw-bold mb-4">
                <span className="text-success">Find Your Dream Job with</span>{" "}
                <span className="text-success">Business Buddies</span>
              </h1>

              <p className="fs-5 mb-4">
                Discover thousands of jobs, connect with top companies, and build your career faster.
              </p>

              <div className="d-flex gap-3">
                <a href="/jobs" className="btn btn-success px-4 py-3">
                  Search Jobs
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Carousel;