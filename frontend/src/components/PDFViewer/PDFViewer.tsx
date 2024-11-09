'use client'

import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

type PDFViewerProps = {
  pdfBlob: Blob;
}

// Set workerSrc to the location in the public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfBlob }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPDF = async () => {
      const pdfData = new Uint8Array(await pdfBlob.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1);

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1 });

        const scale = canvas.parentElement!.clientWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
          };
          page.render(renderContext);
        }
      }
    };

    renderPDF();
  }, [pdfBlob]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
};

export default PDFViewer;
