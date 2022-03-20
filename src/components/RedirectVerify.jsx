import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/FirebaseContext";
import { sendEmailVerification } from "firebase/auth";

function RedirectVerify() {
  const { currentUser } = useAuth();

  const [disabled, setDisabled] = useState(true);

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setDisabled(false);
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div className="hero is-fullheight">
      <div className="card-content" style={{ marginTop: 80 }}>
        <section className="section">
          <div className="content has-text-grey has-text-centered">
            <p>
              <span className="icon is-large">
                <FontAwesomeIcon icon={faQuestionCircle} size="4x" />
              </span>
            </p>
            <p className="title">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
            <p className="subtitle">
              Looks like your account is not verified :(
            </p>
            <p className="subtitle">
              A verification email was sent to your email address, please verify
              it to continue.
            </p>
            <p>
              <button
                disabled={disabled}
                onClick={() => {
                  sendEmailVerification(currentUser)
                    .then(() => {
                      alert(
                        "Email verification link send to your email address!"
                      );
                    })
                    .catch((err) => alert(err.message));
                  setMinutes(1);
                  setSeconds(59);
                  setDisabled(true);
                }}
                className="button is-info is-small is-outlined"
              >
                Resend Email
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RedirectVerify;
