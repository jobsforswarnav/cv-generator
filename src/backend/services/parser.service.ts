import mammoth from 'mammoth';
import * as fs from 'fs/promises';
import { ParsedCV } from '../types';

export class ParserService {
  async parseDocx(filePath: string): Promise<ParsedCV> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      
      return {
        rawText: result.value
      };
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error}`);
    }
  }
}