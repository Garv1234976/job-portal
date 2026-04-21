import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecruiterSidebar from "../../components/RecruiterSidebar";

export default function Applications() {
  const { id } = useParams(); // ✅ job_id
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ✅ FETCH APPLICATIONS BY JOB
  const fetchApplications = () => {
    API.get(`/job-applications/${id}`, {
      params: { page }
    })
      .then((res) => {
        setApplications(res.data.data.data || []);
        setLastPage(res.data.data.last_page || 1);
      })
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    fetchApplications();
  }, [id, page]);

  // ✅ PAGINATION
  const renderPagination = () => {
    let pages = [];

    pages.push(
      <button
        key="prev"
        className="btn btn-light border"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
    );

    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${page === i ? "btn-dark" : "btn-light border"}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="btn btn-light border"
        disabled={page === lastPage}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    );

    return pages;
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4 mb-5">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 col-lg-2">
            <RecruiterSidebar />
          </div>

          {/* MAIN */}
          <div className="col-md-9 col-lg-10">
            <div className="container">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Applications</h3>

                {/* BACK BUTTON */}
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Portfolio</th>
                      <th>Cover Letter</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.length > 0 ? (
                      applications.map((app, index) => (
                        <tr key={app.id}>
                          <td>{(page - 1) * 10 + index + 1}</td>

                          <td>{app.name}</td>
                          <td>{app.email}</td>

                          <td>
                            {app.portfolio ? (
                              <a href={app.portfolio} target="_blank">
                                View
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {app.cover_letter
                              ? app.cover_letter.slice(0, 50) + "..."
                              : "-"}
                          </td>

                          <td>
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No applications found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {lastPage > 1 && (
                <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
                  {renderPagination()}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}