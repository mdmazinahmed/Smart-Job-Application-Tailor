import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://127.0.0.1:8000/tailor', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Smart Job Application Tailor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Resume (PDF):</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here"
            rows="5"
            cols="50"
          />
        </div>
        <button type="submit">Tailor Application</button>
      </form>

      {result && (
        <div>
          <h2>Results</h2>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Tailored Resume:</strong> {result.resume}</p>
          <p><strong>Cover Letter:</strong> {result.coverLetter}</p>
        </div>
      )}
    </div>
  );
}

export default App;