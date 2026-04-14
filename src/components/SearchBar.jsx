import { useState, useEffect } from "react";
import API from "../services/api";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);

      const res = await API.get("/filters");

      setCategories(res.data?.categories || []);
      setLocations(res.data?.locations || []);

    } catch (err) {
      console.log("Filter API error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (typeof onSearch !== "function") {
      console.error("onSearch not passed");
      return;
    }

    onSearch({
      search: keyword.trim(),
      category,
      location,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("");
    setLocation("");

    if (typeof onSearch === "function") {
      onSearch({
        search: "",
        category: "",
        location: "",
      });
    }
  };

  return (
    <div className="container-fluid bg-primary mb-5" style={{ padding: "35px" }}>
      <div className="container">

        <div className="row g-2 align-items-center">

          <div className="col-md-10">
            <div className="row g-2">

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search jobs..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select border-0"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>

                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select border-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">All Locations</option>

                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    locations.map((loc, i) => (
                      <option key={i} value={loc}>
                        {loc}
                      </option>
                    ))
                  )}
                </select>
              </div>

            </div>
          </div>

          <div className="col-md-2 d-flex gap-2">

            <button
              type="button"
              className="btn btn-dark w-100"
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              type="button"
              className="btn btn-outline-light"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SearchBar;