import React, { useState, useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.docx')) {
      onFileUpload(file);
    } else {
      alert('Please upload a .docx file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-section">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="drop-zone-icon">📄</div>
        <h3>Upload Your CV</h3>
        <p>Drag and drop your CV here, or click to browse</p>
        <p className="file-types">Supports: .docx files only</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="features">
        <div className="feature">
          <span className="feature-icon">🤖</span>
          <span>AI-Powered Optimization</span>
        </div>
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span>Free with Gemini</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🎯</span>
          <span>Job-Specific Tailoring</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;