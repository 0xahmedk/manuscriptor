import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../components/Home";
import Submissions from "../components/Submissions";
import MainForm from "../components/MainForm";
import RedirectVerify from "../components/RedirectVerify";
import SubmissionSuccessful from "../components/SubmissionSuccessful";

import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import Error404 from "../components/Error404";
import { useAuth } from "../contexts/FirebaseContext";

const MainRoutes = () => {
  const { currentUser, userData } = useAuth();

  // console.log("userData Routes: ", userData, userData.length != 0);

  // const getInstitution = () => {
  //   let institution;
  //   setTimeout(() => {
  //     institution =
  //       userData &&
  //       userData.length != 0 &&
  //       userData.forms[0].data.institution.value;
  //   }, 5000);

  //   return institution;
  // };

  const INITIAL_FORM = currentUser
    ? [
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
                institution: "International Islamic University, Islamabad",
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
      ]
    : [];

  return (
    <Routes>
      {/** Protected Routes */}
      {/** Wrap all Route under ProtectedRoutes element */}
      <Route path="/" element={<ProtectedRoutes />}>
        <Route
          path="/"
          element={currentUser?.emailVerified ? <Home /> : <RedirectVerify />}
        />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/success" element={<SubmissionSuccessful />} />
        <Route
          path="/submit"
          element={<MainForm initialForm={INITIAL_FORM} />}
        />
      </Route>

      {/** Public Routes */}
      {/** Wrap all Route under PublicRoutes element */}
      <Route path="" element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/** Permission denied route */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default MainRoutes;
