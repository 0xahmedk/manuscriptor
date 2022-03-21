import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";

import { HashRouter } from "react-router-dom";
import { FirebaseProvider } from "./contexts/FirebaseContext";

ReactDOM.render(
  <FirebaseProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </FirebaseProvider>,
  document.getElementById("root")
);
