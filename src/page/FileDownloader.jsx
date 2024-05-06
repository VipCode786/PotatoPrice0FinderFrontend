import React, { useState } from "react";
import '../css/bootstrap.css'

const FileDownloader = ({ cheapestSellers }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadChunks = async () => {
    try {
      const response = await fetch("http://localhost:8000/download");
      const reader = response.body.getReader();

      let receivedLength = 0;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        setDownloadProgress((receivedLength / response.headers.get("content-length")) * 100);
      }

      // Combine chunks into a single blob
      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);

      // Create a temporary download link and initiate download
      const a = document.createElement("a");
      a.href = url;
      a.download = "example.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <button  className="btn btn-primary" onClick={downloadChunks} disabled={cheapestSellers.length === 0}>Download File</button>
    </div>
  );
};

export default FileDownloader;
