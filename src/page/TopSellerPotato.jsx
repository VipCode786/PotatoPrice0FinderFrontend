import React, { useEffect, useState } from "react";
import '../css/bootstrap.css'
import FileDownloader from "./FileDownloader";
const TopPotatoSellers = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [poundsAvailable, setPoundsAvailable] = useState();
  const [cheapestSellers, setCheapestSellers] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    const chunkProgress = 100 / totalChunks;
    let chunkNumber = 0;
    let start = 0;
    let end = chunkSize;

    const uploadNextChunk = async () => {
      if (start < selectedFile.size) {
        const chunk = selectedFile.slice(start, end);
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("chunkNumber", chunkNumber + 1); // Chunk numbers are 1-based
        formData.append("totalChunks", totalChunks);
        formData.append("originalname", selectedFile.name);
        formData.append("poundsAvailable", poundsAvailable);
        try {
          const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`;
          setStatus(temp);
          setProgress((chunkNumber + 1) * chunkProgress);

          // Move to the next chunk
          chunkNumber++;
          start = end;
          end = Math.min(start + chunkSize, selectedFile.size);

          if (chunkNumber === totalChunks) {
            // If this is the last chunk, update cheapestSellers state
            setCheapestSellers(data);
          }
  
          // Recursively upload next chunk
          uploadNextChunk();
        } catch (error) {
          console.error("Error uploading chunk:", error);
          setStatus("Error uploading chunk");
        }
      } else {
        // All chunks uploaded
        setProgress(100);
        // setSelectedFile(null);
        setStatus("File upload completed");
      }
    };

    // Start uploading chunks
    uploadNextChunk();
  };


  useEffect(() => {
   console.log("cheapestSellers",cheapestSellers)
  }, [cheapestSellers]);

  return (
    <div>
    <h2>Potato Price Finder</h2>
    <h3>{status}</h3>
    <form onSubmit={(e) => handleFileUpload(e)}>
      
    
      <div className="mb-3">
        <input type="file" className="form-control" required onChange={handleFileChange} />
        {progress > 0 && (
         <div className="progress my-3">
         <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
       </div>
        // <progress id="file" className="form-control my-4" value={progress} max="100"></progress>
      )}
      </div>

      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Enter the Pounds for check potato availability"
          value={poundsAvailable}
        //   required
          onChange={(e) => setPoundsAvailable(e.target.value)}
        />
      </div>


      <button type="submit" className="btn btn-primary">Check Potato Availability</button>
    </form>
    <div>
  <h2 className="mt-5">Cheapest Sellers</h2>
  {cheapestSellers.length > 0 ? (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Unit Weight</th>
          <th scope="col">Unit Price</th>
          <th scope="col">Unit Quantity</th>
          <th scope="col">Price Per Pound</th>
        </tr>
      </thead>
      <tbody>
        {cheapestSellers.map((seller, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{seller.name}</td>
            <td>{seller["unit weight"]}</td>
            <td>${seller["unit price"]}</td>
            <td>{seller["unit quanitiy"]}</td>
            <td>${seller["pricePerPound"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No cheapest sellers available for the given pounds.</p>
  )}
</div>

<FileDownloader cheapestSellers={cheapestSellers}/>
  </div>
  );
};

export default TopPotatoSellers;
