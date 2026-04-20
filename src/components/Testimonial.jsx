import { useEffect, useState } from "react";
import api from "../services/api";

function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      setTestimonials(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const current = testimonials[activeIndex];

  return (
    <div className="container-xxl py-5 bg-light">
      <div className="container">

        {/* TITLE */}
        <div className="text-center mb-5">
          <h6 className="text-primary fw-bold">Testimonials</h6>
          <h2 className="fw-bold">What Our Clients Say</h2>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center">
            <p>Loading testimonials...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center text-muted">
            No testimonials available
          </div>
        )}

        {/* CONTENT */}
        {!loading && current && (
          <div
            key={activeIndex}
            className="mx-auto text-center p-5 rounded-4 shadow-sm position-relative"
            style={{
              maxWidth: "700px",
              background: "#fff",
              transition: "all 0.5s ease",
              animation: "fadeIn 0.5s",
            }}
          >
            {/* QUOTE ICON */}
            <div
              style={{
                fontSize: 40,
                color: "#00B074",
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff",
                padding: "5px 15px",
                borderRadius: "50%",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
            >
              ❝
            </div>

            {/* MESSAGE */}
            <p
              className="mt-4 mb-4 text-muted"
              style={{ fontSize: "16px", lineHeight: "1.7" }}
            >
              {current.message}
            </p>

            {/* USER */}
            <div className="d-flex flex-column align-items-center">

              <img
                src={current.image} // ✅ FIXED (NO "/")
                alt=""
                onError={(e) =>
                  (e.target.src = "/assets/img/default.png")
                }
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #00B074",
                  marginBottom: 10,
                }}
              />

              <h5 className="mb-0 fw-bold">{current.name}</h5>
              <small className="text-muted">{current.profession}</small>

            </div>
          </div>
        )}

        {/* DOTS */}
        {!loading && testimonials.length > 1 && (
          <div className="text-center mt-4">
            {testimonials.map((_, i) => (
              <span
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  height: 12,
                  width: 12,
                  margin: "0 6px",
                  display: "inline-block",
                  borderRadius: "50%",
                  background: i === activeIndex ? "#00B074" : "#ddd",
                  transition: "0.3s",
                  cursor: "pointer",
                  transform:
                    i === activeIndex ? "scale(1.3)" : "scale(1)",
                }}
              ></span>
            ))}
          </div>
        )}

      </div>

      {/* SIMPLE FADE ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Testimonial;