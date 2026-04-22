import { Link } from "react-router-dom";

function AboutSection() {
  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">

          {/* Images */}
          <div className="col-lg-6">
            <div className="row g-0 about-bg rounded overflow-hidden">

              <div className="col-6 text-start">
                <img
                  className="img-fluid w-100"
                  src="/assets/img/about-1.jpg"
                  alt="jobs"
                  loading="lazy"
                />
              </div>

              <div className="col-6 text-start">
                <img
                  className="img-fluid"
                  src="/assets/img/about-2.jpg"
                  alt="career"
                  style={{ width: "85%", marginTop: "15%" }}
                  loading="lazy"
                />
              </div>

              <div className="col-6 text-end">
                <img
                  className="img-fluid"
                  src="/assets/img/about-3.jpg"
                  alt="hiring"
                  style={{ width: "85%" }}
                  loading="lazy"
                />
              </div>

              <div className="col-6 text-end">
                <img
                  className="img-fluid w-100"
                  src="/assets/img/about-4.jpg"
                  alt="company"
                  loading="lazy"
                />
              </div>

            </div>
          </div>

          {/* Content */}
          <div className="col-lg-6">

            <h1 className="mb-4">
              Find the Right Job Across India
            </h1>

            <p className="mb-4">
              We connect job seekers with trusted companies across India. 
              Whether you're a fresher or an experienced professional, 
              discover opportunities that match your skills and career goals.
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Explore jobs in IT, Marketing, Finance, Sales & more
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Apply instantly with a simple and fast process
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Connect with verified employers across India
            </p>

            <Link to="/jobs" className="btn btn-primary py-3 px-5 mt-3">
              Explore Jobs
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutSection;