import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Upload');

  const steps = ['Upload', 'Analyze', 'Results', 'Download'];
  const currentStep = steps.indexOf(activeTab) + 1;

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setResume(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription.trim()) {
      alert('Please upload a resume and provide a job description.');
      return;
    }

    setLoading(true);
    setActiveTab('Analyze');
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://127.0.0.1:8000/tailor', formData);
      setResult(response.data);
      setActiveTab('Results');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while tailoring your application. Please try again.');
      setActiveTab('Upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    alert('Download functionality will be implemented soon!');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Smart Job Application Tailor</div>
        <nav className="tabs">
          {steps.map((step) => (
            <button
              key={step}
              className={activeTab === step ? 'active' : ''}
              onClick={() => setActiveTab(step)}
              disabled={step === 'Download' && !result}
            >
              {step}
            </button>
          ))}
        </nav>
      </header>

      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
        <div className="step-indicators">
          {steps.map((step, index) => (
            <span
              key={step}
              className={currentStep > index ? 'completed' : ''}
            >
              {index + 1}. {step}
            </span>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          Analyzing your application...
        </div>
      )}

      <main className="main">
        {(activeTab === 'Upload' || activeTab === 'Analyze') && (
          <div className="card">
            <h2>Upload Your Application Materials</h2>
            <p>
              Kindly upload your resume and provide the job description to
              initiate the tailoring process.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <button type="button" className="toggle-btn active">
                  Upload Resume
                </button>
                <button type="button" className="toggle-btn" disabled>
                  URL (Coming Soon)
                </button>
              </div>

              <div className="upload-area">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  hidden
                />
                <label htmlFor="resume-upload" className="upload-label">
                  <span className="upload-icon">↑</span>
                  <p>
                    Drag and drop your resume here, or click to select a file.
                    <br />
                    Maximum file size: 15 MB. Supported format: PDF.
                  </p>
                </label>
                {resume && (
                  <div className="file-preview">
                    <span>Selected File: {resume.name}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={handleRemoveFile}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="job-desc">Job Description</label>
                <textarea
                  id="job-desc"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Please paste the job description here..."
                  rows="5"
                />
              </div>

              <p className="note">
                For optimal results, ensure your resume is well-structured and
                the job description is detailed.
              </p>

              <button
                type="submit"
                className="analyze-btn"
                disabled={loading}
              >
                Tailor My Application
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Results' && result && (
          <div className="results">
            <h2>Tailored Application Results</h2>
            <p>
              Below are the optimized materials for your job application.
            </p>
            <div className="result-item">
              <h3>Application Match Score</h3>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${result.score}%` }}
                ></div>
                <span>{result.score}%</span>
              </div>
            </div>
            <div className="result-item">
              <h3>Optimized Resume</h3>
              <pre className="result-text">
                {result.resume.split(', ').map((part, index) => {
                  const isKeyword = part.includes('keywords:');
                  return isKeyword ? (
                    <span key={index} className="keyword">
                      {part}
                    </span>
                  ) : (
                    part
                  );
                })}
              </pre>
            </div>
            <div className="result-item">
              <h3>Generated Cover Letter</h3>
              <pre className="result-text">{result.coverLetter}</pre>
            </div>
          </div>
        )}

        {activeTab === 'Download' && result && (
          <div className="download-section">
            <h2>Download Your Tailored Application</h2>
            <p>
              Your application materials are ready for download. Ensure to
              review them before submission.
            </p>
            <button className="download-btn" onClick={handleDownload}>
              Download as PDF
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Developed by Mazin for the Smart Job Application Tailor Project
          | Contact: mdmazinahmed@gmail.com
        </p>
      </footer>
    </div>
  );
}

export default App;