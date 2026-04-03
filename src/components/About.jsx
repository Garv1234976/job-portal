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
          <div className="col-lg-6">

            <h1 className="mb-4">
              We Help To Get The Best Job And Find A Talent
            </h1>

            <p className="mb-4">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Tempor erat elitr rebum at clita
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Aliqu diam amet diam et eos
            </p>

            <p>
              <i className="fa fa-check text-primary me-3"></i>
              Clita duo justo magna dolore erat amet
            </p>

            <a href="#" className="btn btn-primary py-3 px-5 mt-3">
              Read More
            </a>

          </div>

        </div>
      </div>
    </div>
  );
}

export default About;