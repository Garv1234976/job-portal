import { useEffect, useState } from "react";
import API from "../services/api";

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  return (
    <div className="container-xxl py-5">
      <div className="container">

        <h1 className="text-center mb-5">Explore By Category</h1>

        <div className="row g-4">

          {categories.map((cat) => (
            <div className="col-lg-3 col-sm-6" key={cat.id}>
              <div className="cat-item rounded p-4">

                <i className={`fa fa-3x ${cat.icon} text-primary mb-4`}></i>

                <h6 className="mb-3">{cat.name}</h6>

                <ul className="list-unstyled small">
                  {cat.children.slice(0, 3).map((sub) => (
                    <li key={sub.id}>• {sub.name}</li>
                  ))}
                </ul>

                {cat.children.length > 3 && (
                  <small className="text-primary">
                    +{cat.children.length - 3} more
                  </small>
                )}

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Category;