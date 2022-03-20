import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  fa1,
  fa2,
  fa3,
  fa4,
  faAdd,
  faRemove,
  faUpload,
  faEdit,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import CreatableSelect from "react-select/creatable";
import { createPDF, pdfArrayToBlob, mergePDF } from "pdf-actions";
import { saveAs } from "file-saver";

import { useAuth } from "../contexts/FirebaseContext";
import FileUploadTester from "./FileUploadTester";
import ReviewAndSubmit from "./ReviewAndSubmit";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase";

function MainForm({ initialForm }) {
  let navigate = useNavigate();

  const { currentUser, fileUploadStart, addPaper } = useAuth();

  const [submissionType, setSubmissionType] = useState("sada");

  const [forms, setForms] = useState(initialForm);

  const [step, setStep] = useState(2);

  const decideStepperButtonColor = (i) => {
    return forms[i].isCompleted
      ? "green"
      : forms[i].errors === null
      ? "hsl(204, 86%, 53%)"
      : "red";
  };
  const decideStepperButtonIcon = (i) => {
    let icon;
    if (forms[i].isCompleted) {
      icon = faCheck;
    } else {
      if (forms[i].errors === null) {
        switch (i + 1) {
          case 1:
            icon = fa1;
            break;
          case 2:
            icon = fa2;
            break;
          case 3:
            icon = fa3;
            break;
          case 4:
            icon = fa4;
            break;

          default:
            break;
        }
      } else {
        icon = faXmark;
      }
    }
    return icon;
  };

  const mergePDFHandler = async (fs) => {
    if (fs[0].name === "") return;

    fileUploadStart(true);
    let files = [];

    files.push(await createPDF.PDFDocumentFromFile(fs[0]));
    files.push(await createPDF.PDFDocumentFromFile(fs[1]));

    const mergedPDFDocument = await mergePDF(files);

    const mergedPdfFile = await mergedPDFDocument.save();

    const pdfBlob = pdfArrayToBlob(mergedPdfFile);

    uploadFile(pdfBlob);

    saveAs(pdfBlob, "submitted_paper_proof.pdf");

    console.log("files merging ended", pdfBlob);
    fileUploadStart(false);
    setSubmitDisable(false);
  };

  const [author, setAuthor] = useState({
    name: "",
    email: "",
    orcid: "",
    institution: "",
  });

  const [editAuthorId, setEditAuthorId] = useState(0);
  const [editAuthor, setEditAuthor] = useState({
    name: "",
    email: "",
    orcid: "",
    institution: "",
  });

  const onInputChangeAuthor = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const onInputChangeEditAuthor = (e) => {
    setEditAuthor({ ...editAuthor, [e.target.name]: e.target.value });
  };

  const [options, setOptions] = useState([
    { value: "accounting", label: "Accounting" },
    { value: "business history", label: "Business history" },
    { value: "business law", label: "Business law" },
  ]);
  const [currentSelectVal, setCurrentSelectVal] = useState({
    value: "",
    label: "Select Value",
  });
  const [showKeywordsList, setShowKeywordsList] = useState(false);

  const [state, setState] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const [toggleAuthorModal, setToggleAuthorModal] = useState(false);
  const [toggleEditAuthorModal, setToggleEditAuthorModal] = useState(false);

  const { email, password, cpassword } = state;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(true);

  const addErrorsToFormsState = (errs, step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      errors: errs,
      isCompleted: false,
    };
    setForms([...forms]);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const setErrorsToNull = (step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      errors: null,
      isCompleted: true,
    };
    setForms([...forms]);

    setStep(step + 1);

    window.scrollTo({
      top: 0,
      left: 0,
    });
  };

  const setErrorsToTrue = (step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      errors: ["Please fill out this form!"],
    };
    setForms([...forms]);
  };

  async function handleSubmission(e) {
    e.preventDefault();

    // Check for errs

    if (step !== 4) {
      let errs = [];

      switch (step) {
        case 1:
          if (forms[0].data.title < 50) {
            errs.push("Title should be of minimum 50 characters");
          }
          if (forms[0].data.abstract < 500) {
            errs.push("Abstract should be of minimum 500 characters");
          }
          if (forms[0].data.addedKeywords.length < 3) {
            errs.push("There should be minimum 3 keywords");
          }
          if (forms[0].data.submittingAgent === "") {
            errs.push("Please select Submitting Agent.");
          }
          if (forms[0].data.soleAuthor === "") {
            errs.push("Please select Sole Author option.");
          }
          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;
        case 2:
          for (const f of filesSelected) {
            if (f.name == "") {
              errs.push("Please Upload at least 4 files!");
              break;
            }
          }
          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;
        case 3:
          if (coverLetter == "") {
            errs.push("Please write the cover the letter!");
          }
          if (!(isConfirmed1 && isConfirmed2 && isConfirmed3)) {
            errs.push(
              "Please check all the confirmation statements given below!"
            );
          }
          if (
            forms[2].data.noOfFigures === 0 ||
            forms[2].data.noOfTables === 0 ||
            forms[2].data.noOfWords === 0
          ) {
            errs.push(
              "Please complete Manuscript Information first, given below!"
            );
          }

          if (forms[2].data.isSubmittedPrev === "") {
            errs.push(
              "Please select if Manuscript has been submitted previously?"
            );
          }
          if (
            forms[2].data.isSubmittedPrev === "yes" &&
            forms[2].data.prevMansId === ""
          ) {
            errs.push("Please enter previously submitted Manuscript's ID?");
          }

          if (forms[2].data.thirdPartySupport === "") {
            errs.push("Please check Third Party Support options.");
          }
          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;

        default:
          break;
      }
    } else {
      let errs = [];
      if (!forms[0].isCompleted) {
        errs.push("Please complete the Metadata (Step 1) first ");
        setErrorsToTrue(1);
        addErrorsToFormsState(errs, step);
        if (!forms[1].isCompleted) {
          errs.push("Please complete the Upload Files (Step 2) first");
          setErrorsToTrue(2);
          addErrorsToFormsState(errs, step);
          if (!forms[3].isCompleted) {
            errs.push("Please complete the Details & Comments (Step 3) first");
            setErrorsToTrue(3);
            addErrorsToFormsState(errs, step);
            return;
          }
          return;
        }
        return;
      }

      setErrorsToNull(step);
      //submit paper
    }
  }

  const handleInputs = (e, step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      data: {
        ...forms[step - 1].data,
        [e.target.name]: e.target.value,
      },
    };
    setForms([...forms]);
  };

  const renderStepperButton = (title, color, icon, stp) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <button
        style={{
          width: 30,
          cursor: "pointer",
          height: 30,
          borderRadius: "50%",
          textAlign: "center",
          backgroundColor:
            stp == step
              ? "hsl(204, 86%, 53%)"
              : forms[stp - 1].isCompleted
              ? "green"
              : color === "red"
              ? color
              : "#777",
          marginBottom: 5,
        }}
        onClick={() => setStep(stp)}
      >
        <FontAwesomeIcon icon={icon} color="#fff" />
      </button>
      <span style={{ width: 200, textAlign: "center" }}>{title}</span>
    </div>
  );

  // Form Step 2 states
  const [fileTypeSelect, setFileTypeSelect] = useState(["", "", "", ""]);
  const [filesSelected, setFilesSelected] = useState(
    new Array(4).fill(new File([], "", {}))
  );

  const checkIfAllFilesSelected = () => {
    for (const element of filesSelected) {
      if (element == "") return false;
    }
    return true;
  };

  const [progress, setProgress] = useState(0);
  const [url, setURL] = useState("");

  const uploadFile =  (file) => {
    if (!file) return;

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      (err) => console.log(err),
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((u) => setURL(u));
        console.log(url);
      }
    );
  };

  const getFormattedTimeDate = () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " (" +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ")";
    return date;
  };

  // Form 3 states
  const [toggleFundingModal, setToggleFundingModal] = useState(false);
  const [toggleEditFundingModal, setToggleEditFundingModal] = useState(false);

  const [funder, setFunder] = useState({
    findfunder: "",
    grantrecep: "",
    awardnumber: 0,
  });

  const [editFunderId, setEditFunderId] = useState(0);
  const [editFunder, setEditFunder] = useState({
    findfunder: "",
    grantrecep: "",
    awardnumber: 0,
  });

  const [coverLetter, setCoverLetter] = useState("");

  const [isConfirmed1, setIsConfirmed1] = useState(false);
  const [isConfirmed2, setIsConfirmed2] = useState(false);
  const [isConfirmed3, setIsConfirmed3] = useState(false);

  const onInputChangeFunder = (e) => {
    setFunder({ ...funder, [e.target.name]: e.target.value });
  };

  const onInputChangeEditFunder = (e) => {
    setEditFunder({ ...editFunder, [e.target.name]: e.target.value });
  };

  ////////////---------///////////

  const renderFormBody = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="" id="form1">
            <div className="field">
              <label className="label">
                Title <span style={{ color: "red" }}>*</span>
              </label>
              {forms[step - 1].data.title.length < 50 ? (
                <span
                  style={{
                    color: "red",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Title should be of minimum 50 characters
                </span>
              ) : (
                <span
                  style={{
                    color: "green",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Your title is fine!
                </span>
              )}

              {forms[step - 1].data.title.length < 50 ? (
                <p className="control">
                  <textarea
                    className="textarea is-danger"
                    type="text"
                    placeholder="Title"
                    rows="4"
                    name="title"
                    value={forms[step - 1].data.title}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              ) : (
                <p className="control">
                  <textarea
                    className="textarea is-success"
                    type="text"
                    placeholder="Title"
                    rows="4"
                    name="title"
                    value={forms[step - 1].data.title}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              )}
            </div>

            {/* ABSTRACT */}
            <div className="field">
              <label className="label">
                Abstract <span style={{ color: "red" }}>*</span>
              </label>

              {forms[step - 1].data.abstract.length < 500 ? (
                <span
                  style={{
                    color: "red",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Abstract should be of minimum 500 characters
                </span>
              ) : (
                <span
                  style={{
                    color: "green",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Your Abstract is fine!
                </span>
              )}

              {forms[step - 1].data.abstract.length < 500 ? (
                <p className="control">
                  <textarea
                    className="textarea is-danger"
                    type="text"
                    placeholder="Abstract"
                    rows="8"
                    name="abstract"
                    value={forms[step - 1].data.abstract}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              ) : (
                <p className="control">
                  <textarea
                    className="textarea is-success"
                    type="text"
                    placeholder="Abstract"
                    rows="8"
                    name="abstract"
                    value={forms[step - 1].data.abstract}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              )}
            </div>

            {/* Additional Material */}
            <div className="field">
              <label className="label">Additional Material</label>

              <p className="control">
                <textarea
                  className="textarea"
                  type="text"
                  placeholder="Additional Material"
                  rows="3"
                  name="addMaterial"
                  value={forms[step - 1].data.addMaterial}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>

            {/* Keywords */}
            <label className="label">
              Keywords<span style={{ color: "red" }}>*</span>
            </label>

            <span
              style={{
                color:
                  forms[0].data.addedKeywords.length < 3 ||
                  forms[0].data.addedKeywords.length > 5
                    ? "red"
                    : "green",
                paddingLeft: 4,
                paddingRight: 4,
                borderRadius: 5,
              }}
            >
              Min. 3, Max 5
            </span>
            <div className="block">
              <CreatableSelect
                placeholder="Select Keyword"
                isDisabled={
                  forms[0].data.addedKeywords.length > 4 ? true : false
                }
                options={options}
                value={currentSelectVal}
                onChange={(item) => setCurrentSelectVal(item)}
                onCreateOption={(newValue) => {
                  newValue.split(/,+|,\s+/g).forEach((item) => {
                    forms[0].data.addedKeywords.push({
                      value: item,
                      label: item.charAt(0).toUpperCase() + item.slice(1),
                    });
                  });

                  setForms([...forms]);
                }}
              />
            </div>
            <div className="block">
              {" "}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <p className="control"></p>

                <button
                  onClick={() => {
                    if (currentSelectVal.value != "")
                      forms[0].data.addedKeywords.push(currentSelectVal);
                    setForms([...forms]);
                    setCurrentSelectVal({
                      value: "",
                      label: "Select Value",
                    });
                    setOptions(
                      options.filter(function (el) {
                        return el.value != currentSelectVal.value;
                      })
                    );
                  }}
                  className="button is-info"
                >
                  <FontAwesomeIcon icon={faAdd} />
                  <span style={{ marginLeft: 5 }}>Add Keyword</span>
                </button>
              </div>
            </div>

            <div className="field">
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title">Keywords</p>
                </div>
                <div className="card-content">
                  <div className="content">
                    {forms[0].data.addedKeywords.length == 0 && (
                      <div className="has-text-centered">No keywords added</div>
                    )}
                    {forms[0].data.addedKeywords.map((keyword) => (
                      <div
                        key={keyword.value}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingRight: 10,
                          paddingLeft: 10,
                          height: 50,
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <div style={{ fontWeight: "600" }}>{keyword.label}</div>
                        <button
                          onClick={() => {
                            options.push(keyword);
                            setOptions([...options]);

                            forms[0] = {
                              ...forms[0],
                              data: {
                                ...forms[0].data,
                                addedKeywords:
                                  forms[0].data.addedKeywords.filter(function (
                                    el
                                  ) {
                                    return el.value != keyword.value;
                                  }),
                              },
                            };

                            setForms([...forms]);
                          }}
                          className="button is-danger is-round is-small is-outlined"
                        >
                          <FontAwesomeIcon icon={faRemove} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="block" />

            {/* Add Author  */}
            <label className="label">Authors</label>
            {/* Modals */}
            {toggleAuthorModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head px-6">
                    <p className="modal-card-title">Add Author</p>
                    <button
                      onClick={() => setToggleAuthorModal(false)}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <div className="field is-horizontal">
                      {/* Author Name */}
                      <div className="field-label is-normal">
                        <label className="label">Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Name"
                              name="name"
                              value={author.name}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author Email */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Email</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Email"
                              name="email"
                              value={author.email}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author ORCID */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">ORCID</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="ORCID with dashes"
                              name="orcid"
                              value={author.orcid}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author Institution */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Institution</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Institution"
                              name="institution"
                              value={author.institution}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      onClick={() => {
                        forms[0].data.authorsList.push(author);
                        setForms(forms);
                        setToggleAuthorModal(false);
                      }}
                      className="button is-info"
                    >
                      Add Author
                    </button>
                    <button
                      onClick={() => setToggleAuthorModal(false)}
                      className="button"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {toggleEditAuthorModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head px-6">
                    <p className="modal-card-title">Edit Author</p>
                    <button
                      onClick={() => setToggleEditAuthorModal(false)}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <div className="field is-horizontal">
                      {/* Author Name */}
                      <div className="field-label is-normal">
                        <label className="label">Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Name"
                              name="name"
                              value={editAuthor.name}
                              onChange={onInputChangeEditAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author Email */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Email</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Email"
                              name="email"
                              value={editAuthor.email}
                              onChange={onInputChangeEditAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author ORCID */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">ORCID</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="ORCID with dashes"
                              name="orcid"
                              value={editAuthor.orcid}
                              onChange={onInputChangeEditAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author Institution */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Institution</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Institution"
                              name="institution"
                              value={editAuthor.institution}
                              onChange={onInputChangeEditAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      onClick={() => {
                        let authorsNewList = forms[0].data.authorsList.filter(
                          function (el) {
                            return el.orcid !== editAuthorId;
                          }
                        );
                        authorsNewList.push(editAuthor);

                        forms[0] = {
                          ...forms[0],
                          data: {
                            ...forms[0].data,
                            authorsList: authorsNewList,
                          },
                        };

                        setForms([...forms]);
                        setToggleEditAuthorModal(false);
                      }}
                      className="button is-info"
                    >
                      Edit Author
                    </button>
                    <button
                      onClick={() => setToggleEditAuthorModal(false)}
                      className="button"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {/* Author Button */}
            <div className="field">
              <button
                onClick={() => setToggleAuthorModal(true)}
                className="button is-info"
              >
                <FontAwesomeIcon icon={faAdd} />
                <span style={{ marginLeft: 5 }}>Add Author</span>
              </button>
            </div>
            <div className="block" />

            {/* Authors Table */}
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Author</th>
                  <th>ORCID</th>
                  <th>Institution</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr></tr>
              </tfoot>
              <tbody>
                {forms[0].data.authorsList.length == 0 && (
                  <td className="has-text-centered">No Authors added</td>
                )}
                {forms[0].data.authorsList.map((a) => (
                  <tr key={a.orcid}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.orcid}</td>
                    <td>{a.institution}</td>
                    <td>
                      {a.name !== currentUser.displayName && (
                        <>
                          <button
                            onClick={() => {
                              setEditAuthorId(a.orcid);
                              setEditAuthor(
                                forms[0].data.authorsList.find(
                                  (aa) => aa.orcid === a.orcid
                                )
                              );
                              setToggleEditAuthorModal(true);
                            }}
                            className="button is-info is-round is-small is-outlined"
                            style={{ marginRight: 5 }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure to delete author named ${a.name}?`
                                )
                              ) {
                                forms[0] = {
                                  ...forms[0],
                                  data: {
                                    ...forms[0].data,
                                    authorsList:
                                      forms[0].data.authorsList.filter(
                                        function (el) {
                                          return el.orcid != a.orcid;
                                        }
                                      ),
                                  },
                                };

                                setForms([...forms]);
                              }
                            }}
                            className="button is-danger is-round is-small is-outlined"
                          >
                            <FontAwesomeIcon icon={faRemove} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="block" />
            <div className="block" />

            <div className="field">
              <label className="label">
                Submitting Agent
                <span style={{ color: "red" }}>*</span>
              </label>{" "}
              {/* Authors Ques */}
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="submittingAgent"
                    value="yes"
                    checked={forms[step - 1].data.submittingAgent === "yes"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <strong> Author </strong>
                  I, {currentUser.displayName}, am submitting this manuscript on
                  behalf of myself and my co-authors.
                </label>
              </p>
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="submittingAgent"
                    value="no"
                    checked={forms[step - 1].data.submittingAgent === "no"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <strong> Submitting Agent </strong>
                  I, {currentUser.displayName}, am not an author on this
                  manuscript. I am submitting this manuscript on behalf of an
                  author.
                </label>
              </p>
            </div>

            <div className="block" />

            <div className="field">
              <label className="label">
                <strong>
                  Please confirm that you are the sole author OR have listed all
                  other co-authors and have their approval to submit this
                  manuscript by checking the box below.
                </strong>
                <span style={{ color: "red" }}>*</span>
              </label>{" "}
              {/* Authors Ques */}
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="soleAuthor"
                    value="yes"
                    checked={forms[step - 1].data.soleAuthor === "yes"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <span>
                    {" "}
                    All co-authors are listed and agree the submission
                  </span>
                </label>
              </p>
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="soleAuthor"
                    value="no"
                    checked={forms[step - 1].data.soleAuthor === "no"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <span> There are no co-authors for this submission</span>
                </label>
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form2">
            {/* Upload Files */}

            {/* Pick Files */}
            <label className="label">
              Pick Files<span style={{ color: "red" }}>*</span>
            </label>
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>File Type</th>
                  <th>File</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filesSelected.map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="select">
                        <select
                          value={fileTypeSelect[i]}
                          onChange={(e) => {
                            if (e.target.value == "Select File Type") {
                              fileTypeSelect[i] = "";
                              setFileTypeSelect([...fileTypeSelect]);
                            } else {
                              fileTypeSelect[i] = e.target.value;
                              setFileTypeSelect([...fileTypeSelect]);
                            }
                          }}
                          disabled={filesSelected[i].name !== "" ? true : false}
                        >
                          <option>Select File Type</option>
                          <option value="Title Page">Title Page</option>
                          <option>Article File</option>
                          <option>Figure</option>
                          <option>Table</option>
                          <option>Author Biography</option>
                          <option>Suplementary File not for Review</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      {fileTypeSelect[i] !== "" &&
                        (filesSelected[i].name === "" ? (
                          <div className="file has-name">
                            <label className="file-label">
                              <input
                                className="file-input"
                                type="file"
                                name="resume"
                                accept=".doc, .pdf, .docx"
                                onChange={(e) => {
                                  filesSelected[i] = e.target.files[0];
                                  setFilesSelected([...filesSelected]);
                                }}
                              />
                              <span className="file-cta">
                                <span className="file-icon">
                                  <FontAwesomeIcon
                                    color="black"
                                    icon={faUpload}
                                  />
                                </span>
                                <span className="file-label">
                                  Choose a file…
                                </span>
                              </span>
                              <span className="file-name">
                                {filesSelected[i].name}
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="file has-name is-success">
                            <label className="file-label">
                              <input
                                className="file-input"
                                type="file"
                                name="resume"
                                accept=".doc, .pdf, .docx"
                                onChange={(e) => {
                                  filesSelected[i] = e.target.files[0];
                                  setFilesSelected([...filesSelected]);
                                }}
                              />
                              <span className="file-cta">
                                <span className="file-icon">
                                  <FontAwesomeIcon
                                    color="white"
                                    icon={faUpload}
                                  />
                                </span>
                                <span className="file-label">Change file…</span>
                              </span>
                              <span className="file-name">
                                {filesSelected[i].name}
                              </span>
                            </label>
                          </div>
                        ))}
                    </td>
                    <td>
                      {filesSelected[i].name !== "" && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure to remove file named ${filesSelected[i]}?`
                              )
                            ) {
                              filesSelected[i] = new File([], "", {});
                              setFileTypeSelect[i] = "";
                              setFilesSelected([...filesSelected]);
                            }
                          }}
                          className="button is-danger is-round is-small is-outlined"
                        >
                          <FontAwesomeIcon icon={faRemove} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Upload Button */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <button
                // disabled={checkIfAllFilesSelected() ? true : false}
                className="button is-info"
                onClick={() => {
                  if (
                    window.confirm(
                      "Caution: This process can't be reversed! Are you sure to upload selected files?"
                    )
                  ) {
                    fileUploadStart(true);
                    uploadFile(filesSelected[0]);

                    setTimeout(() => {
                      fileUploadStart(false);
                    }, 30000);
                  }
                }}
              >
                <span className="icon is-small">
                  <FontAwesomeIcon color="white" icon={faUpload} />
                </span>
                <span>Upload Selected Files</span>
              </button>
            </div>
            <div className="block" />

            {/* Uploaded Files Table */}
            <label className="label">Uploaded Files</label>
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>Upload Time</th>
                  <th>Uploaded By</th>
                </tr>
              </thead>

              <tbody>
                {filesSelected.length == 0 && (
                  <td className="has-text-centered">No files added</td>
                )}
                {filesSelected.map(
                  (f, i) =>
                    f.name !== "" && (
                      <tr>
                        <td>{f.name}</td>
                        <td>{fileTypeSelect[i]}</td>
                        <td>{getFormattedTimeDate()}</td>
                        <td>{currentUser.displayName}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
            <div className="block" />
          </div>
        );
      case 3:
        return (
          <div className="form3">
            {/* Cover Letter */}
            <div className="field">
              <label className="label">
                Cover Letter <span style={{ color: "red" }}>*</span>
              </label>

              {coverLetter === "" ? (
                <p className="control">
                  <textarea
                    className="textarea is-danger"
                    type="text"
                    placeholder="Cover Letter"
                    rows="5"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </p>
              ) : (
                <p className="control">
                  <textarea
                    className="textarea is-success"
                    type="text"
                    placeholder="Cover Letter"
                    rows="5"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </p>
              )}
            </div>

            {/* Manuscript Info */}
            <div className="field">
              <label className="label">
                Manuscript Information <span style={{ color: "red" }}>*</span>
              </label>

              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">No of Figures</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input
                        class="input"
                        type="number"
                        placeholder="No of Figures"
                        name="noOfFigures"
                        value={forms[step - 1].data.noOfFigures}
                        onChange={(e) => {
                          handleInputs(e, step);
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">No of Tables</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input
                        class="input"
                        type="number"
                        placeholder="No of Tables"
                        name="noOfTables"
                        value={forms[step - 1].data.noOfTables}
                        onChange={(e) => {
                          handleInputs(e, step);
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">No of Words</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input
                        class="input"
                        type="number"
                        placeholder="No of Words"
                        name="noOfWords"
                        value={forms[step - 1].data.noOfWords}
                        onChange={(e) => {
                          handleInputs(e, step);
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">
                <strong>Has this manuscript submitted previously?</strong>
                <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="isSubmittedPrev"
                    value="yes"
                    checked={forms[step - 1].data.isSubmittedPrev === "yes"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <span> Yes</span>
                </label>
              </p>
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="isSubmittedPrev"
                    value="no"
                    checked={forms[step - 1].data.isSubmittedPrev === "no"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <span> No</span>
                </label>
              </p>
            </div>

            {forms[step - 1].data.isSubmittedPrev === "yes" && (
              <div class="field">
                <div class="field-label">
                  <label class="label">
                    What is the Manuscript ID of the previous submission?
                    <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input
                        class="input"
                        type="number"
                        placeholder="ID"
                        name="prevMansId"
                        value={forms[step - 1].data.prevMansId}
                        onChange={(e) => {
                          handleInputs(e, step);
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="field">
              <label className="label">
                <strong>
                  I/We have declared any potential conflict of interest in the
                  research. Any support from a third party has been noted in the
                  Acknowledgements.
                </strong>
                <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="thirdPartySupport"
                    value="yes"
                    checked={forms[step - 1].data.thirdPartySupport === "yes"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <span> Yes</span>
                </label>
              </p>
              <p className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="thirdPartySupport"
                    value="no"
                    checked={forms[step - 1].data.thirdPartySupport === "no"}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                  <span> No</span>
                </label>
              </p>
            </div>

            {/* Funding */}

            {/* Add Funding  */}
            <label className="label">Add Funding</label>
            {/* Modals */}
            {toggleFundingModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head px-6">
                    <p className="modal-card-title">Add Funding</p>
                    <button
                      onClick={() => setToggleFundingModal(false)}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <div className="field is-horizontal">
                      {/* Find a Funder */}
                      <div className="field-label is-normal">
                        <label className="label">Find a Funder</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Find a Funder"
                              name="findfunder"
                              value={funder.findfunder}
                              onChange={onInputChangeFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Award Number */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Award Number </label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="number"
                              placeholder="Award Number "
                              name="awardnumber"
                              value={funder.awardnumber}
                              onChange={onInputChangeFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Grant Recepient  */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Grant Recepient</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Grant Recepient"
                              name="grantrecep"
                              value={funder.grantrecep}
                              onChange={onInputChangeFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      onClick={() => {
                        forms[2].data.fundersList.push(funder);
                        setForms(forms);
                        setToggleFundingModal(false);
                      }}
                      className="button is-info"
                    >
                      Add Funder
                    </button>
                    <button
                      onClick={() => setToggleFundingModal(false)}
                      className="button"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {toggleEditFundingModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head px-6">
                    <p className="modal-card-title">Edit Funding</p>
                    <button
                      onClick={() => setToggleEditFundingModal(false)}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <div className="field is-horizontal">
                      {/* Find a Funder */}
                      <div className="field-label is-normal">
                        <label className="label">Edit Funder Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Find a Funder"
                              name="findfunder"
                              value={editFunder.findfunder}
                              onChange={onInputChangeEditFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Award Number */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Award Number </label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="number"
                              placeholder="Award Number "
                              name="awardnumber"
                              value={editFunder.awardnumber}
                              onChange={onInputChangeEditFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Grant Recepient  */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Grant Recepient</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Grant Recepient"
                              name="grantrecep"
                              value={editFunder.grantrecep}
                              onChange={onInputChangeEditFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      onClick={() => {
                        let fundersNewList = forms[2].data.fundersList.filter(
                          function (el) {
                            return el.awardnumber !== editFunderId;
                          }
                        );
                        fundersNewList.push(editFunder);

                        forms[2] = {
                          ...forms[2],
                          data: {
                            ...forms[2].data,
                            fundersList: fundersNewList,
                          },
                        };

                        setForms([...forms]);

                        setToggleEditFundingModal(false);
                      }}
                      className="button is-info"
                    >
                      Edit Funder
                    </button>
                    <button
                      onClick={() => setToggleEditFundingModal(false)}
                      className="button"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {/* Funders Button */}
            <div className="field">
              <button
                onClick={() => setToggleFundingModal(true)}
                className="button is-info"
              >
                <FontAwesomeIcon icon={faAdd} />
                <span style={{ marginLeft: 5 }}>Add Funder</span>
              </button>
            </div>
            <div className="block" />

            {/* Funders Table */}
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Funder</th>
                  <th>Award Number</th>
                  <th>Grant Recepient</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr></tr>
              </tfoot>
              <tbody>
                {forms[2].data.fundersList.length == 0 && (
                  <td className="has-text-centered">No funders added</td>
                )}
                {forms[2].data.fundersList.map((f) => (
                  <tr>
                    <td>{f.findfunder}</td>
                    <td>{f.awardnumber}</td>
                    <td>{f.grantrecep}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditFunderId(f.awardnumber);
                          setEditFunder(
                            forms[2].data.fundersList.find(
                              (ff) => ff.awardnumber === f.awardnumber
                            )
                          );
                          setToggleEditFundingModal(true);
                        }}
                        className="button is-info is-round is-small is-outlined"
                        style={{ marginRight: 5 }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure to delete funder named ${f.findfunder}?`
                            )
                          ) {
                            forms[2] = {
                              ...forms[2],
                              data: {
                                ...forms[2].data,
                                fundersList: forms[2].data.fundersList.filter(
                                  function (el) {
                                    return el.awardnumber != f.awardnumber;
                                  }
                                ),
                              },
                            };

                            setForms([...forms]);
                          }
                        }}
                        className="button is-danger is-round is-small is-outlined"
                      >
                        <FontAwesomeIcon icon={faRemove} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="block" />

            {/* Cofirmation */}
            <div className="field">
              <label className="label">
                <strong>Confirm the following:</strong>
              </label>
              <div className="block" />

              <label class="checkbox">
                <input
                  checked={isConfirmed1}
                  type="checkbox"
                  onChange={() => setIsConfirmed1(!isConfirmed1)}
                />
                <span style={{ color: "red", marginLeft: 5 }}>*</span>
                Confirm that the manuscript has been submitted solely to this
                journal and is not published, in press, or submitted elsewhere.
              </label>
              <div className="block" />

              <label class="checkbox">
                <input
                  checked={isConfirmed2}
                  type="checkbox"
                  onChange={() => setIsConfirmed2(!isConfirmed2)}
                />
                <span style={{ color: "red", marginLeft: 5 }}>*</span>
                Confirm that all the research meets the ethical guidelines,
                including adherence to the legal requirements of the study
                country.
              </label>
              <div className="block" />

              <label class="checkbox">
                <input
                  checked={isConfirmed3}
                  type="checkbox"
                  onChange={() => setIsConfirmed3(!isConfirmed3)}
                />
                <span style={{ color: "red", marginLeft: 5 }}>*</span>
                Confirm that you have prepared a complete text within the
                anonymous article file. Any identifying information has been
                included separately in a title page, acknowledgements or
                supplementary file not for review, to allow blinded review.
              </label>
            </div>
            <div className="block" />
          </div>
        );
      case 4:
        return (
          <ReviewAndSubmit
            form1Data={forms[0].data}
            addedKeywords={forms[0].data.addedKeywords}
            authorsList={forms[0].data.authorsList}
            filesSelected={filesSelected}
            fundersList={forms[2].data.fundersList}
            coverLetter={coverLetter}
            fileTypeSelect={fileTypeSelect}
          />
        );
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: 50,
          marginRight: "10%",
          marginLeft: "10%",
          padding: 35,
          border: "1px solid #ccc",
          borderRadius: 20,
          paddingBottom: submissionType == "" ? 200 : 20,
        }}
      >
        <div className="title">Submission</div>

        {/* Submission Category */}
        {submissionType == "" ? (
          <>
            <div className="subtitle">
              Please choose a category for your paper.
            </div>
            <div className="select">
              <select
                value={submissionType}
                onChange={(e) => {
                  if (e.target.value == "Select Submission Type") {
                    setSubmissionType("");
                  } else {
                    setSubmissionType(e.target.value);
                  }
                }}
                disabled={submissionType != "" ? true : false}
              >
                <option>Select Submission Type</option>
                <option>Case Study</option>
                <option>Research Paper</option>
                <option>Technical Paper</option>
                <option>Select Submission Type</option>
              </select>
            </div>
          </>
        ) : (
          <>
            {/* Stepper*/}
            <div className="subtitle">{submissionType}</div>
            {/* <FileUploadTester /> */}
            {/* Errors Notification */}
            {forms[step - 1].errors != null && (
              <div class="notification is-danger is-light pl-6">
                <h3>
                  <strong>Errors: </strong>
                </h3>
                <ul style={{ listStyleType: "disc" }}>
                  {forms[step - 1].errors.map((e) => (
                    <li>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                position: "relative",
                marginTop: 5,
                marginBottom: 30,
              }}
            >
              {renderStepperButton(
                "Metadata",
                decideStepperButtonColor(0),
                decideStepperButtonIcon(0),
                1
              )}
              {renderStepperButton(
                "Upload Files",
                decideStepperButtonColor(1),
                decideStepperButtonIcon(1),
                2
              )}
              {renderStepperButton(
                "Details & Comments",
                decideStepperButtonColor(2),
                decideStepperButtonIcon(2),
                3
              )}
              {renderStepperButton(
                "Review Your Submission",
                decideStepperButtonColor(3),
                decideStepperButtonIcon(3),
                4
              )}

              <div
                style={{
                  width: "75%",
                  height: 4,
                  backgroundColor: "#000",
                  position: "absolute",
                  top: "25%",
                  zIndex: 0,
                }}
              />
            </div>
            {error.length > 0 && (
              <div className="notification is-danger is-light">{error}</div>
            )}

            {renderFormBody(step)}
            <div className="block" />

            {step === 4 && (
              <button
                onClick={() => {
                  mergePDFHandler(filesSelected);
                }}
                className="button is-info"
              >
                <FontAwesomeIcon icon={faDownload} style={{ marginRight: 5 }} />
                Generate PDF Proof
              </button>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 35,
              }}
            >
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure to leave? Entered data will be lost!`
                    )
                  ) {
                    navigate("/");
                  }
                }}
                className="button is-light"
              >
                Cancel
              </button>
              <button
                style={{ marginLeft: 5 }}
                onClick={async () => {
                  if (window.confirm(`Are you sure to leave and save data?`)) {
                    try {
                      fileUploadStart(true);
                      await addPaper({
                        id: currentUser.uid,
                        forms,
                        status: "drafted",
                      }).then(() => {
                        fileUploadStart(false);
                        navigate("/submissions");
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }}
                className="button is-info is-light"
              >
                Save Progress & Leave
              </button>

              <button
                style={{ marginLeft: 5 }}
                onClick={async () => {
                  try {
                    fileUploadStart(true);
                    await addPaper({
                      id: currentUser.uid,
                      forms,
                      status: "completed",
                    }).then(() => {
                      fileUploadStart(false);
                      navigate("/success");
                    });
                  } catch (err) {
                    console.log(err);
                  }
                }}
                // disabled={submitDisable && step === 4}
                className="button is-info is-right"
              >
                {step == 4 ? "Submit Paper" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MainForm;
