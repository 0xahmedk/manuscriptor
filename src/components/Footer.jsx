import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="footer py-5 has-background-grey-lighter">
      <div className="container">
        <div className="content has-text-centered">
          <span>Copyright Manuscriptors ⓒ {year}</span>
          <br />
          <span>Developed by Roohullah Saqib - MSSE</span>
          <br />
          <span>Department of Computer Sciences & Software Engineering</span>
          <br />
          <span>International Islamic Universty, Islamabad </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
