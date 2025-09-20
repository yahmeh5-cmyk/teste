import { PDFDocument, rgb, PageSizes } from 'pdf-lib';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class PDFToolkit {
  // Compress PDF
  static async compressPDF(file: File, quality: number = 0.7): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Optimize the PDF by removing unused objects and compressing
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      objectsPerTick: 50
    });
    
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  // Merge multiple PDFs
  static async mergePDFs(files: File[]): Promise<Blob> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  // Split PDF
  static async splitPDF(file: File): Promise<Blob[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    const splitPDFs: Blob[] = [];
    
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      
      const pdfBytes = await newPdf.save();
      splitPDFs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
    }
    
    return splitPDFs;
  }

  // Extract text from PDF
  static async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }

  // Convert Word document to PDF
  static async convertWordToPDF(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result.value, 180);
    
    let y = 20;
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 10;
    });
    
    return doc.output('blob');
  }

  // Convert Excel to PDF
  static async convertExcelToPDF(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const doc = new jsPDF();
    let y = 20;
    
    jsonData.forEach((row: any) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const rowText = row.join(' | ');
      const lines = doc.splitTextToSize(rowText, 180);
      lines.forEach((line: string) => {
        doc.text(line, 10, y);
        y += 10;
      });
    });
    
    return doc.output('blob');
  }

  // Convert CSV to PDF
  static async convertCSVToPDF(file: File): Promise<Blob> {
    const text = await file.text();
    const parsed = Papa.parse(text);
    
    const doc = new jsPDF();
    let y = 20;
    
    parsed.data.forEach((row: any) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const rowText = row.join(' | ');
      const lines = doc.splitTextToSize(rowText, 180);
      lines.forEach((line: string) => {
        doc.text(line, 10, y);
        y += 10;
      });
    });
    
    return doc.output('blob');
  }

  // Convert PDF to images
  static async convertPDFToImages(file: File): Promise<Blob[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const images: Blob[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });
      
      images.push(blob);
    }
    
    return images;
  }

  // Create PDF from text
  static async createPDFFromText(text: string, options: { title?: string } = {}): Promise<Blob> {
    const doc = new jsPDF();
    
    if (options.title) {
      doc.setFontSize(16);
      doc.text(options.title, 10, 20);
      doc.setFontSize(12);
    }
    
    const lines = doc.splitTextToSize(text, 180);
    let y = options.title ? 40 : 20;
    
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 10;
    });
    
    return doc.output('blob');
  }

  // Download file
  static downloadFile(blob: Blob, filename: string) {
    saveAs(blob, filename);
  }
}