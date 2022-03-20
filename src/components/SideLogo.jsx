import React from "react";

function SideLogo() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  return urlParams.get("name") ? (
    <div style={{ marginTop: 30, marginLeft: 20, marginRight: 30 }}>
      <img src={urlParams.get("logo")} alt="logo" srcset="" />
      <div className="block" />
      <div className="title">{urlParams.get("name")}</div>
      <div className="subtitle">{urlParams.get("details")}</div>
    </div>
  ) : (
    <div style={{ marginTop: 60, marginLeft: 20, marginRight: 30 }}>
      <img src={require("../assets/iiui.png")} alt="iiui" srcset="" />
      <div className="block" />
      <div className="title">Welcome!</div>
      <div className="subtitle">
        To the International Islamic University, Islamabad's Journal
      </div>
    </div>
  );
}

export default SideLogo;
