import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import * as fs from 'fs/promises';
import { GeneratedCV } from '../types';

export class DocxService {
  async generateDocx(cvData: GeneratedCV, outputPath: string): Promise<string> {
    try {
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cvData.name,
                  font: 'Arial'
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: cvData.title,
                  bold: true,
                  size: 24,
                  font: 'Arial'
                })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: cvData.contact,
                  font: 'Arial'
                })
              ],
              spacing: { after: 300 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'PROFESSIONAL SUMMARY',
                  font: 'Arial'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: cvData.summary,
                  font: 'Arial'
                })
              ],
              spacing: { after: 300 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'EXPERIENCE',
                  font: 'Arial'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...this.createParagraphs(cvData.experience),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'EDUCATION',
                  font: 'Arial'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...this.createParagraphs(cvData.education),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'SKILLS',
                  font: 'Arial'
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...this.createParagraphs(cvData.skills),

            ...(cvData.projects ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'PROJECTS',
                    font: 'Arial'
                  })
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
              }),
              ...this.createParagraphs(cvData.projects)
            ] : []),

            ...(cvData.certifications ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CERTIFICATIONS',
                    font: 'Arial'
                  })
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
              }),
              ...this.createParagraphs(cvData.certifications)
            ] : [])
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      await fs.writeFile(outputPath, buffer);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to generate DOCX: ${error}`);
    }
  }

  private createParagraphs(text: string | undefined): Paragraph[] {
    if (!text || typeof text !== 'string') return [];
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => new Paragraph({
        children: [
          new TextRun({
            text: line,
            font: 'Arial'
          })
        ],
        spacing: { after: 100 }
      }));
  }
}