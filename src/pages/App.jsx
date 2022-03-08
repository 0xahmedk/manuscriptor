import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomePage from "./WelcomePage";
import { AuthProvider } from "../contexts/AuthContext";

import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-svg-core";
import "@fortawesome/free-solid-svg-icons";
import "@fortawesome/react-fontawesome";

function App() {
  return (
    <div>
      <AuthProvider>
        <Header />
        <WelcomePage />
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
