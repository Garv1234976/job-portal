import { useState, useEffect } from "react";
import API from "../services/api";
import { FaTimes } from "react-icons/fa";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
      sub_category_id: categoryId, //  FIXED HERE
      location,
    });
  };

  return (
    <div
      className="container-fluid bg-primary mb-5"
      style={{ padding: "35px" }}
    >
      <div className="container">
        <div className="row g-2">
          <div className="col-md-10">
            <div className="row g-2">
              {/* KEYWORD */}
              <div className="col-md-4">
                <input
                  className="form-control border-0"
                  placeholder="Search jobs..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && (
                  <span
                    onClick={() => setKeyword("")}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#999",
                    }}
                  >
                    <FaTimes />
                  </span>
                )}
              </div>

              {/* CATEGORY */}
              <div className="col-md-4">
                <select
                  className="form-select border-0"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.children.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* LOCATION */}
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

          {/* BUTTON */}
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
