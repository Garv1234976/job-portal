function JobDetailHeader() {
  return (
    <div
      className="container-xxl py-5 page-header mb-5"
      style={{
        backgroundImage: "url('/assets/img/carousel-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container my-5 pt-5 pb-4">

        <h1 className="display-3 text-white mb-3">
          Job Detail
        </h1>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb text-uppercase">

            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>

            <li className="breadcrumb-item">
              <a href="#">Pages</a>
            </li>

            <li className="breadcrumb-item text-white active">
              Job Detail
            </li>

          </ol>
        </nav>

      </div>
    </div>
  );
}