function JobDetailHeader() {
  return (
    <div
      className="container-xxl py-5 page-header mb-5 position-relative"
      style={{
        backgroundImage: "url('/assets/img/carousel-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/*  DARK OVERLAY (optional but recommended) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      ></div>

      {/*  CONTENT */}
      <div className="container my-5 pt-5 pb-4 position-relative" style={{ zIndex: 2 }}>

        <h1 className="display-3 text-white mb-3">
          Job Detail
        </h1>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb text-uppercase">

            <li className="breadcrumb-item">
              <a href="/" className="text-white">Home</a>
            </li>

            <li className="breadcrumb-item">
              <a href="#" className="text-white">Jobs</a>
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

export default JobDetailHeader;