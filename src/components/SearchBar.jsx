function SearchBar() {
  return (
    <div
      className="container-fluid bg-primary mb-5"
      style={{ padding: "35px" }}
    >
      <div className="container">
        <div className="row g-2">
          
          <div className="col-md-10">
            <div className="row g-2">

              {/* Keyword */}
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Keyword"
                />
              </div>

              {/* Category */}
              <div className="col-md-4">
                <select className="form-select border-0">
                  <option>Category</option>
                  <option value="1">Category 1</option>
                  <option value="2">Category 2</option>
                </select>
              </div>

              {/* Location */}
              <div className="col-md-4">
                <select className="form-select border-0">
                  <option>Location</option>
                  <option value="1">Location 1</option>
                  <option value="2">Location 2</option>
                </select>
              </div>

            </div>
          </div>

          {/* Button */}
          <div className="col-md-2">
            <button className="btn btn-dark border-0 w-100">
              Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SearchBar;