function JobListSection() {
  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">Job Listing</h1>

        <div className="tab-content">
          <div className="tab-pane fade show active">

            {/* JOB 1 */}
            <div className="job-item p-4 mb-4">
              <div className="row g-4">

                <div className="col-md-8 d-flex align-items-center">
                  <img className="img-fluid border rounded"
                    src="/assets/img/com-logo-1.jpg"
                    style={{ width: "80px", height: "80px" }} />

                  <div className="ps-4">
                    <h5>Software Engineer</h5>
                    <span>New York</span> | <span>Full Time</span> | <span>$1000</span>
                  </div>
                </div>

                <div className="col-md-4 text-end">
                  <a className="btn btn-primary">Apply</a>
                </div>

              </div>
            </div>

            {/* JOB 2 */}
            <div className="job-item p-4 mb-4">
              <div className="row g-4">

                <div className="col-md-8 d-flex align-items-center">
                  <img className="img-fluid border rounded"
                    src="/assets/img/com-logo-2.jpg"
                    style={{ width: "80px", height: "80px" }} />

                  <div className="ps-4">
                    <h5>Marketing Manager</h5>
                    <span>London</span> | <span>Part Time</span> | <span>$800</span>
                  </div>
                </div>

                <div className="col-md-4 text-end">
                  <a className="btn btn-primary">Apply</a>
                </div>

              </div>
            </div>

            {/* JOB 3 */}
            <div className="job-item p-4 mb-4">
              <div className="row g-4">

                <div className="col-md-8 d-flex align-items-center">
                  <img className="img-fluid border rounded"
                    src="/assets/img/com-logo-3.jpg"
                    style={{ width: "80px", height: "80px" }} />

                  <div className="ps-4">
                    <h5>UI/UX Designer</h5>
                    <span>Delhi</span> | <span>Full Time</span> | <span>$900</span>
                  </div>
                </div>

                <div className="col-md-4 text-end">
                  <a className="btn btn-primary">Apply</a>
                </div>

              </div>
            </div>

            {/* JOB 4 */}
            <div className="job-item p-4 mb-4">
              <div className="row g-4">

                <div className="col-md-8 d-flex align-items-center">
                  <img className="img-fluid border rounded"
                    src="/assets/img/com-logo-4.jpg"
                    style={{ width: "80px", height: "80px" }} />

                  <div className="ps-4">
                    <h5>Graphic Designer</h5>
                    <span>Mumbai</span> | <span>Part Time</span> | <span>$700</span>
                  </div>
                </div>

                <div className="col-md-4 text-end">
                  <a className="btn btn-primary">Apply</a>
                </div>

              </div>
            </div>

            {/* JOB 5 */}
            <div className="job-item p-4 mb-4">
              <div className="row g-4">

                <div className="col-md-8 d-flex align-items-center">
                  <img className="img-fluid border rounded"
                    src="/assets/img/com-logo-5.jpg"
                    style={{ width: "80px", height: "80px" }} />

                  <div className="ps-4">
                    <h5>Backend Developer</h5>
                    <span>Bangalore</span> | <span>Full Time</span> | <span>$1200</span>
                  </div>
                </div>

                <div className="col-md-4 text-end">
                  <a className="btn btn-primary">Apply</a>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default JobListSection;