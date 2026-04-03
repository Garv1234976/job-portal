function Category() {
  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">
          Explore By Category
        </h1>

        <div className="row g-4">

          <div className="col-lg-3 col-sm-6">
            <a className="cat-item rounded p-4" href="#">
              <i className="fa fa-3x fa-mail-bulk text-primary mb-4"></i>
              <h6 className="mb-3">Marketing</h6>
              <p className="mb-0">123 Vacancy</p>
            </a>
          </div>

          <div className="col-lg-3 col-sm-6">
            <a className="cat-item rounded p-4" href="#">
              <i className="fa fa-3x fa-headset text-primary mb-4"></i>
              <h6 className="mb-3">Customer Service</h6>
              <p className="mb-0">123 Vacancy</p>
            </a>
          </div>

          <div className="col-lg-3 col-sm-6">
            <a className="cat-item rounded p-4" href="#">
              <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
              <h6 className="mb-3">Human Resource</h6>
              <p className="mb-0">123 Vacancy</p>
            </a>
          </div>

          <div className="col-lg-3 col-sm-6">
            <a className="cat-item rounded p-4" href="#">
              <i className="fa fa-3x fa-tasks text-primary mb-4"></i>
              <h6 className="mb-3">Project Management</h6>
              <p className="mb-0">123 Vacancy</p>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Category;