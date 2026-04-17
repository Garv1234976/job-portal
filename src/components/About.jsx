function About() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Images Section */}
          <div className="col-lg-6">
            <div className="row g-0 about-bg rounded overflow-hidden">
              <div className="col-6 text-start">
                <img
                  className="img-fluid w-100"
                  src="/assets/img/about-1.jpg"
                  alt="about"
                />
              </div>

              <div className="col-6 text-start">
                <img
                  className="img-fluid"
                  src="/assets/img/about-2.jpg"
                  alt="about"
                  style={{ width: "85%", marginTop: "15%" }}
                />
              </div>

              <div className="col-6 text-end">
                <img
                  className="img-fluid"
                  src="/assets/img/about-3.jpg"
                  alt="about"
                  style={{ width: "85%" }}
                />
              </div>

              <div className="col-6 text-end">
                <img
                  className="img-fluid w-100"
                  src="/assets/img/about-4.jpg"
                  alt="about"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          {/* Content Section */}
          <div className="col-lg-6">
            <h1 className="mb-4">
              Find Your Dream Job or Hire Top Talent Across India
            </h1>

            <p className="mb-4">
              We connect job seekers with leading companies across India.
              Whether you're looking to start your career or hire skilled
              professionals, our platform makes recruitment fast, reliable, and
              efficient.
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Explore thousands of verified job opportunities across multiple
              industries
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Hire qualified candidates with smart filtering and easy hiring
              tools
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Build your career with trusted employers and career growth
              resources
            </p>

            <a href="#" className="btn btn-primary py-3 px-5 mt-3">
              Explore Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
