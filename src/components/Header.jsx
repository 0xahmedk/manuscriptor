import React from "react";

function Header() {
  return (
    <header style={{ display: "flex", flexDirection: "row" }}>
      <h1 style={{ fontWeight: "700", marginLeft: 20 }}>MANUSCRIPTOR</h1>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div style={{ color: "#fff" }}>Account</div>
        <div style={{ marginLeft: 10 }}>
          <figure className="image is-32x32">
            <img
              className="is-rounded"
              src="https://bulma.io/images/placeholders/32x32.png"
            />
          </figure>
        </div>
      </div>
    </header>
  );
}

export default Header;
