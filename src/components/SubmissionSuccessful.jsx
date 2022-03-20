import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function SubmissionSuccessful() {
  return (
    <div className="hero is-fullheight">
      <div className="card-content" style={{ marginTop: 80 }}>
        <section className="section">
          <div className="content has-text-grey has-text-centered">
            <p>
              <span className="icon is-large">
                <FontAwesomeIcon icon={faCheckCircle} size="4x" color="green" />
              </span>
            </p>
            <p className="title">Thank You!</p>
            <p className="subtitle">The paper was submitted successfully</p>
            <p>
              <Link
                to={{ pathname: "/submissions" }}
                className="button is-info is-small is-outlined"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{ marginRight: 5 }}
                />
                Back to Dashboard
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SubmissionSuccessful;
