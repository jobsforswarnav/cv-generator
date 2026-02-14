import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVInput, ParsedCV, GeneratedCV } from '../types';

export class GeminiAIService {
  private client: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    // Initialize Gemini client
    this.client = new GoogleGenerativeAI(apiKey);
    
    // Try gemini-3-flash-preview
    this.model = this.client.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  }

  // This function sends your CV to Gemini and gets an optimized version back
  async generateOptimizedCV(
    originalCV: ParsedCV,
    input: CVInput
  ): Promise<GeneratedCV> {
    
    // Build the prompt for Gemini
    const prompt = `You are a professional CV writer. Optimize this CV for a job application.

ORIGINAL CV:
${originalCV.rawText}

JOB DESCRIPTION:
${input.jobDescription}

PREFERENCES:
${input.personalPreferences}

NOTES:
${input.additionalNotes}

Requirements:
- Tone: ${input.tone || 'professional'}
- Length: ${input.length || '2-page'}
- Keep all facts truthful
- Highlight relevant experience
- Use job description keywords

Return ONLY a JSON object with these fields:
{
  "name": "person's name",
  "title": "professional title",
  "contact": "email | phone",
  "summary": "professional summary",
  "experience": "work experience",
  "education": "education details",
  "skills": "skills list",
  "projects": "projects (optional)",
  "certifications": "certifications (optional)"
}`;

    try {
      console.log('🤖 Using Google Gemini AI...');
      
      // Send request to Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      return this.parseResponse(text);
      
    } catch (error) {
      throw new Error(`Gemini AI generation failed: ${error}`);
    }
  }

  private parseResponse(response: string): GeneratedCV {
    try {
      // Find JSON in the response (Gemini might wrap it in markdown)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        name: parsed.name || '',
        title: parsed.title || '',
        contact: parsed.contact || '',
        summary: parsed.summary || '',
        experience: parsed.experience || '',
        education: parsed.education || '',
        skills: parsed.skills || '',
        projects: parsed.projects,
        certifications: parsed.certifications
      };
    } catch (error) {
      throw new Error(`Failed to parse Gemini response: ${error}`);
    }
  }
}