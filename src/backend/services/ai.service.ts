import Anthropic from '@anthropic-ai/sdk';
import { CVInput, ParsedCV, GeneratedCV } from '../types';

export class AIService {
  private client: Anthropic;

  constructor(apiKey: string) {
    // Initialize the Claude AI client with your API key
    this.client = new Anthropic({ apiKey });
  }

  // This function sends your CV to Claude and gets an optimized version back
  async generateOptimizedCV(
    originalCV: ParsedCV,
    input: CVInput
  ): Promise<GeneratedCV> {
    
    // Build the prompt for Claude
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
      // Send request to Claude
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      // Extract the text response
      const responseText = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';

      // Parse the JSON response
      return this.parseResponse(responseText);
      
    } catch (error) {
      throw new Error(`AI generation failed: ${error}`);
    }
  }

  private parseResponse(response: string): GeneratedCV {
    try {
      // Find JSON in the response (Claude might wrap it in markdown)
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
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }
}