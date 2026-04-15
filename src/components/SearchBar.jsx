import { useState, useEffect } from "react";
import API from "../services/api";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState(""); // parent
  const [subCategory, setSubCategory] = useState(""); // child
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
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

  // ✅ When category changes
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCategory(selectedId);
    setSubCategory("");

    const selectedCat = categories.find((c) => c.id == selectedId);
    setSubCategories(selectedCat?.children || []);
  };

  const handleSearch = () => {
    if (typeof onSearch !== "function") return;

    onSearch({
      search: keyword,
      category_id: subCategory, // ✅ send subcategory id
      location,
    });
  };

  return (
    <div className="container-fluid bg-primary mb-5" style={{ padding: "35px" }}>
      <div className="container">
        <div className="row g-2">

          <div className="col-md-10">
            <div className="row g-2">

              {/* 🔍 KEYWORD */}
              <div className="col-md-3">
                <input
                  className="form-control border-0"
                  placeholder="Search jobs..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              {/* 📂 CATEGORY */}
              <div className="col-md-3">
                <select
                  className="form-select border-0"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}

                </select>
              </div>

              {/* 📁 SUBCATEGORY */}
              <div className="col-md-3">
                <select
                  className="form-select border-0"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="">Select Sub Category</option>

                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}

                </select>
              </div>

              {/* 📍 LOCATION */}
              <div className="col-md-3">
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

          {/* 🔘 BUTTON */}
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