function JobDetailSection() {
  return (
    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
      <div className="container">
        <div className="row gy-5 gx-4">

          {/* LEFT SIDE */}
          <div className="col-lg-8">

            {/* Header */}
            <div className="d-flex align-items-center mb-5">
              <img
                className="flex-shrink-0 img-fluid border rounded"
                src="/assets/img/com-logo-2.jpg"
                alt=""
                style={{ width: "80px", height: "80px" }}
              />

              <div className="text-start ps-4">
                <h3 className="mb-3">Marketing Manager</h3>

                <span className="me-3">
                  <i className="fa fa-map-marker-alt text-primary me-2"></i>
                  New York, USA
                </span>

                <span className="me-3">
                  <i className="far fa-clock text-primary me-2"></i>
                  Full Time
                </span>

                <span>
                  <i className="far fa-money-bill-alt text-primary me-2"></i>
                  $123 - $456
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="mb-3">Job description</h4>
              <p>
                Dolor justo tempor duo ipsum accusam rebum gubergren erat...
              </p>

              <h4 className="mb-3">Responsibility</h4>
              <p>Magna et elitr diam sed lorem...</p>

              <ul className="list-unstyled">
                <li><i className="fa fa-angle-right text-primary me-2"></i>Dolor justo tempor duo ipsum accusam</li>
                <li><i className="fa fa-angle-right text-primary me-2"></i>Elitr stet dolor vero clita labore</li>
                <li><i className="fa fa-angle-right text-primary me-2"></i>Rebum vero dolores dolores</li>
              </ul>

              <h4 className="mb-3">Qualifications</h4>
              <p>Magna et elitr diam sed lorem...</p>

              <ul className="list-unstyled">
                <li><i className="fa fa-angle-right text-primary me-2"></i>Dolor justo tempor duo ipsum</li>
                <li><i className="fa fa-angle-right text-primary me-2"></i>Elitr stet dolor vero</li>
              </ul>
            </div>

            {/* FORM */}
            <div>
              <h4 className="mb-4">Apply For The Job</h4>

              <form>
                <div className="row g-3">

                  <div className="col-12 col-sm-6">
                    <input className="form-control" placeholder="Your Name" />
                  </div>

                  <div className="col-12 col-sm-6">
                    <input type="email" className="form-control" placeholder="Your Email" />
                  </div>

                  <div className="col-12 col-sm-6">
                    <input className="form-control" placeholder="Portfolio Website" />
                  </div>

                  <div className="col-12 col-sm-6">
                    <input type="file" className="form-control bg-white" />
                  </div>

                  <div className="col-12">
                    <textarea className="form-control" rows="5" placeholder="Coverletter"></textarea>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-primary w-100">
                      Apply Now
                    </button>
                  </div>

                </div>
              </form>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">

            {/* Summary */}
            <div className="bg-light rounded p-5 mb-4 wow slideInUp">
              <h4 className="mb-4">Job Summary</h4>

              <p><i className="fa fa-angle-right text-primary me-2"></i>Published On: 01 Jan, 2045</p>
              <p><i className="fa fa-angle-right text-primary me-2"></i>Vacancy: 123 Position</p>
              <p><i className="fa fa-angle-right text-primary me-2"></i>Job Nature: Full Time</p>
              <p><i className="fa fa-angle-right text-primary me-2"></i>Salary: $123 - $456</p>
              <p><i className="fa fa-angle-right text-primary me-2"></i>Location: New York</p>
              <p className="m-0"><i className="fa fa-angle-right text-primary me-2"></i>Date Line: 01 Jan</p>
            </div>

            {/* Company */}
            <div className="bg-light rounded p-5 wow slideInUp">
              <h4 className="mb-4">Company Detail</h4>

              <p>
                Ipsum dolor ipsum accusam stet et et diam dolores...
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetailSection;