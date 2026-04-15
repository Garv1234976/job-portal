import { useEffect, useState } from "react";
import API from "../services/api";

function Category() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({}); // ✅ track expanded state

  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  // ✅ Toggle function
  const toggleMore = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">Explore By Category</h1>

        <div className="row g-4">

          {categories.map((cat) => {
            const isExpanded = expanded[cat.id];

            return (
              <div className="col-lg-3 col-sm-6" key={cat.id}>
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

                  {/* ✅ TOGGLE BUTTON */}
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