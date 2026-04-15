import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const scrollRef = useRef();

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

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Explore By Category</h1>

          <div>
            <button
              className="btn btn-light me-2"
              onClick={() => scroll("left")}
            >
              ❮
            </button>
            <button className="btn btn-light" onClick={() => scroll("right")}>
              ❯
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={scrollRef}
          className="slider-container"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            scrollSnapType: "x mandatory",
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
                <div className="cat-item rounded p-4 h-100 border">
                  {/* ICON */}
                  <i className={`fa fa-3x ${cat.icon} text-success mb-3`}></i>

                  {/* TITLE */}
                  <h6 className="mb-2 fw-bold">{cat.name}</h6>

                  {/* SUB LIST */}
                  <ul className="list-unstyled small text-muted mb-2">
                    {(isExpanded ? cat.children : cat.children.slice(0, 3)).map(
                      (sub) => (
                        <li key={sub.id}>• {sub.name}</li>
                      ),
                    )}
                  </ul>

                  {/* MORE */}
                  {cat.children.length > 3 && (
                    <small
                      className="text-success"
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

export default Category;
