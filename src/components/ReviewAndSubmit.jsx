import React from "react";

function ReviewAndSubmit({ form1Data, filesSelected, coverLetter }) {
  return (
    <div>
      <div className="title">ReviewAndSubmit</div>
      <div class="box">
        <h3>{form1Data.title}</h3>
      </div>
    </div>
  );
}

export default ReviewAndSubmit;
