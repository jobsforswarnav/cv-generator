import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import CVForm from './components/CVForm';
import LoadingScreen from './components/LoadingScreen';

interface FormData {
  file: File | null;
  jobDescription: string;
  personalPreferences: string;
  additionalNotes: string;
  tone: 'professional' | 'creative' | 'technical';
  length: '1-page' | '2-page';
  aiProvider: 'gemini' | 'claude';
}

function App() {
  const [step, setStep] = useState<'upload' | 'form' | 'processing'>('upload');
  const [formData, setFormData] = useState<FormData>({
    file: null,
    jobDescription: '',
    personalPreferences: '',
    additionalNotes: '',
    tone: 'professional',
    length: '2-page',
    aiProvider: 'gemini',
  });
  const [error, setError] = useState<string>('');

  const handleFileUpload = (file: File) => {
    setFormData({ ...formData, file });
    setStep('form');
    setError('');
  };

  const handleFormSubmit = async (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
    setStep('processing');
    setError('');

    try {
      // Create form data for API
      const apiFormData = new FormData();
      if (formData.file) {
        apiFormData.append('cv', formData.file);
      }
      apiFormData.append('jobDescription', data.jobDescription || formData.jobDescription);
      apiFormData.append('personalPreferences', data.personalPreferences || formData.personalPreferences);
      apiFormData.append('additionalNotes', data.additionalNotes || formData.additionalNotes);
      apiFormData.append('tone', data.tone || formData.tone);
      apiFormData.append('length', data.length || formData.length);
      apiFormData.append('aiProvider', data.aiProvider || formData.aiProvider);

      // Send to backend
      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate CV');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-cv.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset to upload screen
      setTimeout(() => {
        setStep('upload');
        setFormData({
          file: null,
          jobDescription: '',
          personalPreferences: '',
          additionalNotes: '',
          tone: 'professional',
          length: '2-page',
          aiProvider: 'gemini',
        });
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('form');
    }
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('upload');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>✨ AI CV Generator</h1>
          <p>Transform your resume with AI-powered optimization</p>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {step === 'upload' && <FileUpload onFileUpload={handleFileUpload} />}
        
        {step === 'form' && (
          <CVForm
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            initialData={formData}
          />
        )}

        {step === 'processing' && <LoadingScreen />}
      </div>
    </div>
  );
}

export default App;