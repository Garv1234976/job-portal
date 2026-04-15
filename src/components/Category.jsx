import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function Category() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const scrollRef = useRef(); // ✅ add this

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

  // ✅ scroll functions
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        {/* HEADER + ARROWS */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1>Explore By Category</h1>

          <div>
            <button className="btn btn-light me-2" onClick={scrollLeft}>
              ⟨
            </button>
            <button className="btn btn-light" onClick={scrollRight}>
              ⟩
            </button>
          </div>
        </div>

        {/* ✅ CHANGE ONLY THIS PART */}
        <div
          ref={scrollRef}
          className="d-flex"
          style={{
            overflowX: "auto",
            gap: "20px",
            scrollBehavior: "smooth",
          }}
        >

          {categories.map((cat) => {
            const isExpanded = expanded[cat.id];

            return (
              <div
                key={cat.id}
                style={{ minWidth: "250px" }} // ✅ important
              >
                <div className="cat-item rounded p-4 h-100">

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
              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default Category;  