import { useEffect } from "react";

function Carousel() {

  useEffect(() => {
    if (window.$ && window.$.fn.owlCarousel) {
      window.$('.header-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
          '<i class="bi bi-chevron-left"></i>',
          '<i class="bi bi-chevron-right"></i>'
        ]
      });
    }
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="owl-carousel header-carousel position-relative">

        {/* Slide 1 */}
        <div className="owl-carousel-item position-relative">
          <img className="img-fluid" src="/assets/img/carousel-1.jpg" alt="" />

          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
            style={{ background: "rgba(43, 57, 64, .5)" }}
          >
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-10 col-lg-8">

                  <h1 className="display-3 text-white mb-4">
                    Find The Perfect Job That You Deserved
                  </h1>

                  <p className="fs-5 fw-medium text-white mb-4 pb-2">
                    Vero elitr justo clita lorem. Ipsum dolor at sed stet sit diam no.
                  </p>

                  <a href="#" className="btn btn-primary py-md-3 px-md-5 me-3">
                    Search A Job
                  </a>

                  <a href="#" className="btn btn-secondary py-md-3 px-md-5">
                    Find A Talent
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="owl-carousel-item position-relative">
          <img className="img-fluid" src="/assets/img/carousel-2.jpg" alt="" />

          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
            style={{ background: "rgba(43, 57, 64, .5)" }}
          >
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-10 col-lg-8">

                  <h1 className="display-3 text-white mb-4">
                    Find The Best Startup Job That Fit You
                  </h1>

                  <p className="fs-5 fw-medium text-white mb-4 pb-2">
                    Vero elitr justo clita lorem.
                  </p>

                  <a href="#" className="btn btn-primary py-md-3 px-md-5 me-3">
                    Search A Job
                  </a>

                  <a href="#" className="btn btn-secondary py-md-3 px-md-5">
                    Find A Talent
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Carousel;