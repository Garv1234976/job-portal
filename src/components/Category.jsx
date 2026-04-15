import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function Category() {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  // 👉 scroll left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // 👉 scroll right
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Explore By Category</h2>

          <div>
            <button className="btn btn-light me-2" onClick={scrollLeft}>
              ⟨
            </button>
            <button className="btn btn-light" onClick={scrollRight}>
              ⟩
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            scrollBehavior: "smooth",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                minWidth: "250px",
                borderRadius: "10px",
                padding: "20px",
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >

              {/* ICON */}
              <i
                className={`fa ${cat.icon} text-primary mb-3`}
                style={{ fontSize: "40px" }}
              ></i>

              {/* TITLE */}
              <h6>{cat.name}</h6>

              {/* SUBCATEGORY */}
              <p className="text-muted small">
                {cat.children?.slice(0, 2).map((s) => s.name).join(", ")}
              </p>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Category;