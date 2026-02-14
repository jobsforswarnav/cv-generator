import React, { useState } from 'react';
import './CVForm.css';

interface CVFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const CVForm: React.FC<CVFormProps> = ({ onSubmit, onBack, initialData }) => {
  const [formData, setFormData] = useState({
    jobDescription: initialData.jobDescription || '',
    personalPreferences: initialData.personalPreferences || '',
    additionalNotes: initialData.additionalNotes || '',
    tone: initialData.tone || 'professional',
    length: initialData.length || '2-page',
    aiProvider: initialData.aiProvider || 'gemini',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="cv-form-section">
      <form onSubmit={handleSubmit} className="cv-form">
        <div className="form-group">
          <label htmlFor="jobDescription">
            Job Description <span className="required">*</span>
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="personalPreferences">Personal Preferences</label>
          <textarea
            id="personalPreferences"
            name="personalPreferences"
            value={formData.personalPreferences}
            onChange={handleChange}
            placeholder="E.g., Emphasize leadership skills, highlight Python experience..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalNotes">Additional Notes</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Any other instructions..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tone">Tone</label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
            >
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="length">Target Length</label>
            <select
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
            >
              <option value="1-page">1 Page</option>
              <option value="2-page">2 Pages</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="aiProvider">AI Provider</label>
          <select
            id="aiProvider"
            name="aiProvider"
            value={formData.aiProvider}
            onChange={handleChange}
          >
            <option value="gemini">Google Gemini (Free! ⭐)</option>
            <option value="claude">Claude (Requires Credits)</option>
          </select>
        </div>

        <div className="button-group">
          <button type="button" onClick={onBack} className="btn-secondary">
            ← Back
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Processing...' : 'Generate CV ✨'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CVForm;