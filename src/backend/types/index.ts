export interface CVInput {
  jobDescription: string;
  personalPreferences: string;
  additionalNotes: string;
  tone?: 'professional' | 'creative' | 'technical';
  length?: '1-page' | '2-page';
  aiProvider?: 'gemini' | 'claude';
}

export interface ParsedCV {
  rawText: string;
}

export interface GeneratedCV {
  name: string;
  title: string;
  contact: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects?: string;
  certifications?: string;
}