import React from "react";

import { createPDF, pdfArrayToBlob, mergePDF } from "pdf-actions";
import { saveAs } from "file-saver";

import { useAuth } from "../contexts/FirebaseContext";

function ReviewAndSubmit({
  form1Data,
  addedKeywords,
  coverLetter,
  authorsList,
  fundersList,
  filesSelected,
  fileTypeSelect,
}) {
  const { currentUser } = useAuth();

  const mergePDFHandler = async (fs) => {
    console.log("files merging started");
    let files = [];

    files.push(await createPDF.PDFDocumentFromFile(fs[0]));
    files.push(await createPDF.PDFDocumentFromFile(fs[1]));

    const mergedPDFDocument = await mergePDF(files);

    const mergedPdfFile = await mergedPDFDocument.save();

    const pdfBlob = pdfArrayToBlob(mergedPdfFile);

    saveAs(pdfBlob, "mergedFiles.pdf");

    console.log("files merging ended", pdfBlob);
  };

  const getFormattedTimeDate = () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      "(" +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ")";
    return date;
  };
  return (
    <div>
      <div className="title">ReviewAndSubmit</div>
      <div className="box">
        <h3>
          <strong>Title</strong>
        </h3>
        <div className="subtitle">{form1Data.title}</div>
      </div>
      <div className="box">
        <h3>
          <strong>Abstract</strong>
        </h3>
        <div className="subtitle">{form1Data.abstract}</div>
      </div>
      <div className="box">
        <h3>
          <strong>Additional Material</strong>
        </h3>
        <div className="subtitle">{form1Data.addMaterial}</div>
      </div>
      <div className="box">
        <h3>
          <strong>Cover Letter</strong>
        </h3>
        <div className="subtitle">{coverLetter}</div>
      </div>
      <div className="box">
        <h3>
          <strong>Keywords</strong>
        </h3>
        <div className="content">
          {addedKeywords.length == 0 && (
            <div className="has-text-centered">No keywords added</div>
          )}
          {addedKeywords.map((keyword) => (
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
            </div>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>
          <strong>Authors List </strong>
        </h3>
        {/* Authors Table */}
        <table className="table is-striped is-hoverable">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Author</th>
              <th>ORCID</th>
              <th>Institution</th>
            </tr>
          </thead>
          <tfoot>
            <tr></tr>
          </tfoot>
          <tbody>
            {authorsList.length == 0 && (
              <td className="has-text-centered">No Authors added</td>
            )}
            {authorsList.map((a) => (
              <tr key={a.orcid}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.orcid}</td>
                <td>{a.institution}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="box">
        <h3>
          <strong>Files Uploaded</strong>
        </h3>
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
            {filesSelected[0].name == "" && (
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
                    <td>
                      <progress class="progress is-info" value="45" max="100">
                        45%
                      </progress>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      <div className="box">
        <h3>
          <strong>Funders List</strong>
        </h3>
        {/* Funders Table */}
        <table className="table is-striped is-hoverable">
          <thead>
            <tr>
              <th>Funder</th>
              <th>Award Number</th>
              <th>Grant Recepient</th>
            </tr>
          </thead>
          <tfoot>
            <tr></tr>
          </tfoot>
          <tbody>
            {fundersList.length == 0 && (
              <td className="has-text-centered">No funders added</td>
            )}
            {fundersList.map((f) => (
              <tr>
                <td>{f.findfunder}</td>
                <td>{f.awardnumber}</td>
                <td>{f.grantrecep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => {
          mergePDFHandler(filesSelected);
        }}
        className="button is-info"
      >
        {" "}
        Generate PDF Proof
      </button>
    </div>
  );
}

export default ReviewAndSubmit;
