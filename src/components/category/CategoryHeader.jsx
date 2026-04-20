function CategoryHeader() {
  return (
    <div
      className="container-xxl py-5 page-header mb-5"
      style={{
        backgroundImage: "url('/assets/img/category.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: "60px 0",
        }}
      >
        <div className="container my-5 pt-5 pb-4">

          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Category
          </h1>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb text-uppercase">

              <li className="breadcrumb-item">
                <a href="/" className="text-white">
                  Home
                </a>
              </li>

              <li className="breadcrumb-item">
                <span className="text-white-50">Pages</span>
              </li>

              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Category
              </li>

            </ol>
          </nav>

        </div>
      </div>
    </div>
  );
}

export default CategoryHeader;