import { useEffect, useState, useRef } from "react";
import API from "../services/api";

function Category() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const scrollRef = useRef(null); // ✅ reference for scroll

  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const toggleMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ SCROLL LEFT
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // ✅ SCROLL RIGHT
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">Explore By Category</h1>

        {/* ✅ NAV BUTTONS */}
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-light me-2" onClick={scrollLeft}>
            &#10094;
          </button>
          <button className="btn btn-light" onClick={scrollRight}>
            &#10095;
          </button>
        </div>

        {/* ✅ CAROUSEL CONTAINER */}
        <div
          ref={scrollRef}
          className="d-flex overflow-auto"
          style={{ gap: "15px", scrollBehavior: "smooth" }}
        >

          {categories.map((cat) => {
            const isExpanded = expanded[cat.id];

            return (
              <div
                key={cat.id}
                className="cat-item rounded p-4 flex-shrink-0"
                style={{ minWidth: "250px" }}
              >

                <i className={`fa fa-3x ${cat.icon} text-primary mb-4`}></i>

                <h6 className="mb-3">{cat.name}</h6>

                <ul className="list-unstyled small mb-2">
                  {(isExpanded
                    ? cat.children
                    : cat.children.slice(0, 3)
                  ).map((sub) => (
                    <li key={sub.id}>• {sub.name}</li>
                  ))}
                </ul>

                {cat.children.length > 3 && (
                  <small
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleMore(cat.id)}
                  >
                    {isExpanded
                      ? "Show less"
                      : `+${cat.children.length - 3} more`}
                  </small>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default Category;