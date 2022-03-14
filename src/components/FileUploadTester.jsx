import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../firebase";

function FileUploadTester() {
  const [progress, setProgress] = useState(0);
  const [url, setURL] = useState("");
  const handleFile = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    console.log(e.target[0].files);

    uploadFile(file);
  };

  const uploadFile = (file) => {
    if (!file) return;

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((u) => setURL(u));
        console.log(url);
      }
    );

    return { url, progress };
  };
  return (
    <>
      <div>FileUploadTester</div>
      <form onSubmit={handleFile}>
        <input type="file" name="ChooseFile" id="" />
        <button type="submit">Upload</button>
        <p>{progress}</p>
      </form>
    </>
  );
}

export default FileUploadTester;
