import React from "react";

function ReviewAndSubmit({
  form1Data,
  addedKeywords,
  coverLetter,
  authorsList,
  fundersList,
  filesSelected,
}) {
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
            {/* {fundersList.length == 0 && (
                  <td className="has-text-centered">No funders added</td>
                )} */}
            <tr>
              <td>Screenshot from 2022-03-11 11-28-19.png</td>
              <td>Title Page</td>
              <td>{getFormattedTimeDate()}</td>
              <td>Ahmed Khan</td>
            </tr>
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
    </div>
  );
}

export default ReviewAndSubmit;
