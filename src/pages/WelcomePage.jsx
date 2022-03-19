import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../components/Home";
import MainForm from "../components/MainForm";
import { useAuth } from "../contexts/FirebaseContext";
import RedirectVerify from "../components/RedirectVerify";



function WelcomePage() {
  const [user, setUser] = useState(null);

  const { currentUser } = useAuth();

  const INITIAL_FORM = [
    {
      data: {
        title: "",
        abstract: "",
        addMaterial: "",
        addedKeywords: [],
        authorsList: [
          {
            name: currentUser.displayName,
            email: currentUser.email,
            orcid: "1234-1234-1234-1234",
            institution: "International Islamic University",
          },
        ],
        submittingAgent: "",
        soleAuthor: "",
      },
      errors: null,
      isCompleted: false,
    },
    {
      data: {},
      errors: null,
      isCompleted: false,
    },
    {
      data: {
        noOfFigures: 0,
        noOfTables: 0,
        noOfWords: 0,
        isSubmittedPrev: "",
        prevMansId: "",
        thirdPartySupport: "",
        fundersList: [],
      },
      errors: null,
      isCompleted: false,
    },
    {
      data: {},
      errors: null,
      isCompleted: false,
    },
  ];

  console.log(currentUser?.emailVerified);

  return (
    <div style={{ marginBottom: 20 }}>
      <Routes>
        <Route
          path="/"
          element={currentUser?.emailVerified ? <Home /> : <RedirectVerify />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/submit"
          element={<MainForm initialForm={INITIAL_FORM} />}
        />
      </Routes>
    </div>
  );
}

export default WelcomePage;
