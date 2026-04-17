import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/categories")
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  const toggleMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  // ✅ FIXED FUNCTION
  const handleSubCategoryClick = (catId, subId) => {
    navigate(`/jobs?category_id=${catId}&sub_category_id=${subId}`);
  };

  // ✅ CATEGORY CLICK
  const handleCategoryClick = (catId) => {
    navigate(`/jobs?category_id=${catId}`);
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h2 className="fw-bold mb-1">Explore Jobs by Category</h2>
            <p className="text-muted mb-0">
              Discover opportunities across top industries in India
            </p>
          </div>

          <div className="mt-3 mt-md-0">
            <button
              className="btn btn-light me-2 shadow-sm"
              onClick={() => scroll("left")}
            >
              ❮
            </button>
            <button
              className="btn btn-light shadow-sm"
              onClick={() => scroll("right")}
            >
              ❯
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div className="text-center text-muted py-5">
            Loading categories...
          </div>
        )}

        {/* SLIDER */}
        <div
          ref={scrollRef}
          className="slider-container"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            scrollSnapType: "x mandatory",
            paddingBottom: "10px",
          }}
        >
          {categories.map((cat) => {
            const isExpanded = expanded[cat.id];

            return (
              <div
                key={cat.id}
                style={{
                  minWidth: "260px",
                  maxWidth: "260px",
                  flex: "0 0 auto",
                  scrollSnapAlign: "start",
                }}
              >
                <div className="cat-item rounded p-4 h-100 border shadow-sm bg-white">

                  {/* CATEGORY CLICKABLE */}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    {/* ICON */}
                    <i
                      className={`fa fa-3x ${
                        cat.icon || "fa-briefcase"
                      } text-success mb-3`}
                    ></i>

                    {/* TITLE */}
                    <h6 className="mb-2 fw-bold">{cat.name}</h6>
                  </div>

                  {/* SUB LIST */}
                  <ul className="list-unstyled small text-muted mb-2">
                    {(isExpanded
                      ? cat.children || []
                      : (cat.children || []).slice(0, 3)
                    ).map((sub) => (
                      <li
                        key={sub.id}
                        className="sub-cat-item"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleSubCategoryClick(cat.id, sub.id)
                        }
                      >
                        • {sub.name}
                      </li>
                    ))}
                  </ul>

                  {/* MORE */}
                  {(cat.children?.length || 0) > 3 && (
                    <small
                      className="text-success fw-semibold"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleMore(cat.id)}
                    >
                      {isExpanded
                        ? "Show less"
                        : `+${cat.children.length - 3} more roles`}
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Category;