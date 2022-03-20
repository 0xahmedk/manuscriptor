import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomePage from "./WelcomePage";
import { useAuth } from "../contexts/FirebaseContext";
import LoadingOverlay from "react-loading-overlay";

import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-svg-core";
import "@fortawesome/free-solid-svg-icons";
import "@fortawesome/react-fontawesome";

function App() {
  const { fileUploadLoading } = useAuth();

  return (
    <div>
      {/* Loading Modal Wrapper */}
      <LoadingOverlay active={fileUploadLoading} spinner text="Please wait...">
        <Header />
        <WelcomePage />
        <Footer />
      </LoadingOverlay>
    </div>
  );
}

export default App;
