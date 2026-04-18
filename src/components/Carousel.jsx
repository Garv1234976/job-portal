function Carousel() {
  return (
    <div className="container-fluid p-0">

      <div
        className="position-relative d-flex align-items-center"
        style={{
          height: "90vh",
          backgroundImage: "url('/assets/img/job-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))"
          }}
        ></div>

        {/* Content */}
        <div className="container position-relative text-white">
          <div className="row">
            <div className="col-lg-7">

              <h1 className="display-4 fw-bold mb-4">
                <span className="text-success">Find Your Dream Job with</span> <span className="text-success">Business Buddies</span>
              </h1>

              <p className="fs-5 mb-4">
                Discover thousands of jobs, connect with top companies, and build your career faster.
              </p>

              {/* Buttons */}
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