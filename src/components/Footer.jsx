import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>Copyright Manuscriptors ⓒ {year}</p>
        <p>Developed by Roohullah Saqib</p>
      </div>
    </footer>
  );
}

export default Footer;
