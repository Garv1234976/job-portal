import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../components/Category.css";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const toggleMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ FIXED FUNCTION
  const handleSubClick = (catId, subId) => {
    navigate(`/jobs?category_id=${catId}&sub_category_id=${subId}`);
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h1 className="fw-bold wow fadeInUp">
            Explore Jobs by Category
          </h1>
          <p className="text-muted">
            Find the right career opportunities across India
          </p>
        </div>

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div className="text-center text-muted py-5">
            Loading categories...
          </div>
        )}

        {/* CATEGORY GRID */}
        <div className="row g-4">
          {categories.map((cat, index) => {
            const isExpanded = expanded[cat.id];

            return (
              <div
                key={cat.id}
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay={`${0.1 + (index % 4) * 0.2}s`}
              >
                <div className="cat-item rounded p-4 h-100 shadow-sm border bg-white">

                  {/* CATEGORY CLICK */}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/jobs?category_id=${cat.id}`)
                    }
                  >
                    <i
                      className={`fa fa-3x ${
                        cat.icon || "fa-briefcase"
                      } text-primary mb-3`}
                    ></i>

                    <h6 className="mb-2 fw-bold text-dark">
                      {cat.name}
                    </h6>
                  </div>

                  {/* SUBCATEGORY */}
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
                          handleSubClick(cat.id, sub.id)
                        }
                      >
                        • {sub.name}
                      </li>
                    ))}
                  </ul>

                  {/* MORE */}
                  {(cat.children?.length || 0) > 3 && (
                    <small
                      className="text-primary fw-semibold"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleMore(cat.id)}
                    >
                      {isExpanded
                        ? "Show less"
                        : `+${cat.children.length - 3} more`}
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

export default CategorySection;