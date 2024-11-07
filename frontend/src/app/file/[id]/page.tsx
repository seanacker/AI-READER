'use client'

import React, { useEffect, useState } from 'react';
import { getFileById, summarizeText } from '@/api/TextFile';
import PDFViewer from '@/components/PDFViewer/PDFViewer';
import ChatWindow from '@/components/Chatwindow/Chatwindow';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

const FileDisplay = ({ id }: { id: string }) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const blob = await getFileById(id);
        setPdfBlob(blob);
        extractTextFromPDF(blob); // Extract text when PDF is loaded
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, [id]);

  const extractTextFromPDF = async (blob: Blob) => {
    const pdfData = new Uint8Array(await blob.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      text += content.items.map(item => (item as TextItem).str).join(' ') + '\n';
    }

    setPdfText(text); // Set extracted text for display and summarization
  };

  const handleSummarize = async () => {
    try {
      const summaryText = await summarizeText(pdfText);
      setSummary(summaryText);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 3 }}>
        {pdfBlob ? <PDFViewer pdfBlob={pdfBlob} /> : <p>Loading PDF...</p>}
      </div>
      <ChatWindow pdfText={pdfText} summary={summary} onSummarize={handleSummarize} />
    </div>
  );
};

export default FileDisplay;
