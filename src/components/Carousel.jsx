function Carousel() {
  return (
    <div className="container-fluid p-0">

      {/* HERO SECTION */}
      <div
        className="position-relative d-flex align-items-center"
        style={{
          height: "90vh",
          backgroundImage: "url('/assets/img/job-portal.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        {/* Dark Overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{ background: "rgba(0,0,0,0.6)" }}
        ></div>

        {/* Content */}
        <div className="container position-relative text-white">
          <div className="row">
            <div className="col-lg-8">

              <h1 className="display-4 fw-bold mb-4">
                Find Your Dream Job with Business Buddies
              </h1>

              <p className="fs-5 mb-4">
                Discover thousands of jobs, connect with top companies, and build your career faster.
              </p>

              {/* Buttons */}
              <div className="d-flex gap-3">
                <a href="/jobs" className="btn btn-primary px-4 py-3">
                  Search Jobs
                </a>

                <a href="/post-job" className="btn btn-outline-light px-4 py-3">
                  Hire Talent
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