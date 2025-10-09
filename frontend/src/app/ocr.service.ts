import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/pdf/pdf.worker.min.js'; 
@Injectable({
  providedIn: 'root'
})
export class OcrService {

  private worker = createWorker({
    logger: m => console.log(m) // progress log
  });
  private initialized = false;

  constructor() {
  }

  private async initWorker() {
    if (!this.initialized) {
      await this.worker.load();
      await this.worker.loadLanguage('fra+ara');
      await this.worker.initialize('fra+ara');
      this.initialized = true;
    }
  }

  async recognizeTextFromImage(image: File): Promise<string> {
    await this.initWorker();
    const { data: { text } } = await this.worker.recognize(image);
    return text;
  }

  async recognizeTextFromPdf(file: File): Promise<string> {
    await this.initWorker();

    const buffer = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: buffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject('Canvas toBlob failed'), 'image/png');
      });

      const imageFile = new File([blob], `page-${pageNum}.png`, { type: 'image/png' });
      const text = await this.recognizeTextFromImage(imageFile);

      fullText += `\n--- Page ${pageNum} ---\n${text}\n`;
    }

    return fullText;
  }

  async terminateWorker() {
    await this.worker.terminate();
    this.initialized = false;
  }
}