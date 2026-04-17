import { useEffect, useState } from "react";
import API from "../services/api";

function CategorySection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  return (
    <div className="container-xxl py-5">
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h1 className="fw-bold wow fadeInUp" data-wow-delay="0.1s">
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
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="col-lg-3 col-sm-6 wow fadeInUp"
              data-wow-delay={`${0.1 + (index % 4) * 0.2}s`}
            >
              <a
                className="cat-item rounded p-4 d-block h-100 shadow-sm border bg-white text-decoration-none"
                href={`/jobs?category=${cat.id}`}
              >
                {/* ICON */}
                <i
                  className={`fa fa-3x ${cat.icon || "fa-briefcase"} text-primary mb-4`}
                ></i>

                {/* TITLE */}
                <h6 className="mb-3 fw-bold text-dark">
                  {cat.name}
                </h6>

                {/* JOB COUNT */}
                <p className="mb-0 text-muted">
                  {cat.jobs_count ?? 0} Jobs Available
                </p>
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default CategorySection;