import React from "react";
import error from "../../static/img/error404.png";

const NotFoundPage = () => {
  return (
    <main className="container margin-vert--xl">
      <div className="row">
        <div className="col col--6 col--offset-3">
          <div className="text-center">
            <img
              src={error}
              width={300}
              height={300}
              alt="404 Error"
              style={{ margin: '0 auto' }}
            />
            <h1 className="hero__title">🐰 Oops! 🐰</h1>
            <p className="hero__subtitle margin-vert--md">404 - Page Not Found</p>
            <div className="margin-vert--lg">
              <div className="loading-dots">
                <span>Redirecting to documentation</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
