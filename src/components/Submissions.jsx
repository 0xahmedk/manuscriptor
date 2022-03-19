import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faSadTear } from "@fortawesome/free-solid-svg-icons";

function Submissions() {
  const [submission, setSubmission] = useState([
    { title: "ADsasdfsdfsdf sdf s df", time: "22-02-2022" },
    { title: "ADsasdfsdfsdf sdf s df", time: "22-02-2022" },
    { title: "ADsasdfsdfsdf sdf s df", time: "22-02-2022" },
  ]);

  return (
    <div style={{ marginBottom: 280, marginTop: 50 }}>
      <div class="card mx-6">
        <header class="card-header">
          <p class="card-header-title">Submissions</p>
        </header>
        <div class="card-content">
          <div class="content">
            {/* Uploaded Files Table */}
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th></th>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Submit Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {submission.map((s, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>Completed</td>
                    <td>{s.title}</td>
                    <td>{s.time}</td>
                    <td>
                      <a href="/">
                        View Document <FontAwesomeIcon icon={faChevronRight} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {submission.length == 0 && (
          <div className="card-content">
            <section className="section">
              <div className="content has-text-grey has-text-centered">
                <p>
                  <span className="icon is-large">
                    <FontAwesomeIcon icon={faSadTear} size="4x" />
                  </span>
                </p>
                <p>No submission yet…</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;
