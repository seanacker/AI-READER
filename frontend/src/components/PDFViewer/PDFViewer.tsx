'use client'

import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFViewerProps {
  pdfBlob: Blob;
}

// Set workerSrc to the location in the public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PDFViewer = ({ pdfBlob }: PDFViewerProps) => {
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfBlob) return;

      try {
        const pdfDataUrl = URL.createObjectURL(pdfBlob);
        const loadingTask = pdfjsLib.getDocument(pdfDataUrl);
        const pdf = await loadingTask.promise;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context || !pdfContainerRef.current) return;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          pdfContainerRef.current.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        }

        URL.revokeObjectURL(pdfDataUrl);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfBlob]);

  return (
    <div>
      <h3>PDF Document</h3>
      <div ref={pdfContainerRef}/>
    </div>
  );
};

export default PDFViewer;
