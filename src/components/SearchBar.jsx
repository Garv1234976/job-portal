import { useState, useEffect } from "react";
import API from "../services/api";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const res = await API.get("/filters");

      setCategories(res.data?.categories || []);
      setLocations(res.data?.locations || []);
    } catch (err) {
      console.log("Filter API error", err);
    }
  };

  const handleSearch = () => {
    if (typeof onSearch !== "function") return;

    onSearch({
      search: keyword,
      category,
      location,
    });
  };

  return (
    <div className="container-fluid bg-primary mb-5" style={{ padding: "35px" }}>
      <div className="container">
        <div className="row g-2">

          <div className="col-md-10">
            <div className="row g-2">

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search jobs..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select border-0"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select border-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-dark w-100"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SearchBar;