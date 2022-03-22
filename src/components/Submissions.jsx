import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronRight,
  faSadTear,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

import { onSnapshot, query, where, collection } from "firebase/firestore";

import { useAuth } from "../contexts/FirebaseContext";
import { db } from "../firebase";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

function Submissions() {
  const [submittedForms, setSubmittedForms] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const formsRef = collection(db, "papers");
      const q = query(formsRef, where("id", "==", currentUser?.uid));
      var unsubscribe = onSnapshot(q, (snapshot) => {
        let forms = [];
        snapshot.docs.map((doc) => {
          forms.push({ ...doc.data() });
        });
        setSubmittedForms(forms);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

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
                  <th>Author</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {submittedForms.map((s, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      {s.status === "completed" ? (
                        <span style={{ color: "green" }}>
                          <FontAwesomeIcon
                            style={{ marginRight: 3 }}
                            icon={faCheck}
                          />
                          Completed
                        </span>
                      ) : (
                        <span style={{ color: "orange" }}>
                          <FontAwesomeIcon
                            style={{ marginRight: 3 }}
                            icon={faEdit}
                          />
                          Drafted
                        </span>
                      )}
                    </td>
                    <td>{s.forms[0].data.title}</td>
                    <td>{s.forms[0].data.authorsList[0].name}</td>
                    <td>
                      {s.status === "completed" ? (
                        <a href={s.forms[1].data.fileURL} target="_blank">
                          View Document
                          <FontAwesomeIcon
                            style={{ marginLeft: 3 }}
                            icon={faChevronRight}
                          />
                        </a>
                      ) : (
                        <Link to={{ pathname: "/submit" }} state={s.forms}>
                          Continue
                          <FontAwesomeIcon
                            style={{ marginLeft: 3 }}
                            icon={faChevronRight}
                          />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {submittedForms.length === 0 && (
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
