import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";

import { BrowserRouter } from "react-router-dom";
import { FirebaseProvider } from "./contexts/FirebaseContext";

ReactDOM.render(
  <FirebaseProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FirebaseProvider>,
  document.getElementById("root")
);
