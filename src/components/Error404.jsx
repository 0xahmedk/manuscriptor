import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadCry } from "@fortawesome/free-solid-svg-icons";

function Error404() {
  return (
    <div className="hero is-fullheight">
      <div className="card-content" style={{ marginTop: 80 }}>
        <section className="section">
          <div className="content has-text-grey has-text-centered">
            <p>
              <span className="icon is-large">
                <FontAwesomeIcon icon={faSadCry} size="5x" />
              </span>
            </p>
            <p style={{ color: "red" }} className="title">
              Error 404, page not found!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Error404;
