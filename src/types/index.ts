export interface PDFFile {
  id: string;
  name: string;
  size: number;
  file: File;
  preview?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DocumentAnalysis {
  fileName: string;
  content: string;
  pageCount?: number;
  metadata?: Record<string, any>;
}

export type PDFOperation = 
  | 'compress' 
  | 'merge' 
  | 'split' 
  | 'convert-to-pdf' 
  | 'convert-from-pdf' 
  | 'create-pdf' 
  | 'analyze';

export interface ConversionOptions {
  quality?: number;
  format?: string;
  pages?: number[];
}