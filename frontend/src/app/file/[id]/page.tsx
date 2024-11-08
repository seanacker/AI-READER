'use client'

import React, { use, useEffect, useState } from 'react';
import { getFileById } from '@/api/TextFile';
import PDFViewer from '@/components/PDFViewer/PDFViewer';
import ChatWindow from '@/components/ChatWindow/ChatWindow';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { askQuestionWithContext, summarizeText } from '@/api/GPT';

interface FileDisplayProps {
  params: Promise<{ id: string }>; // `params` is a Promise in Next.js App Router
}

const FileDisplay = ({ params }: FileDisplayProps) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ user: string; assistant: string }[]>([]);
  const [question, setQuestion] = useState<string>('');

  const {id} = use(params)

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

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    setChatHistory((prev) => [...prev, { user: question, assistant: '' }]);

    try {
      const response = await askQuestionWithContext(question, summary ?? '', pdfText);
      setChatHistory((prev) =>
        prev.map((chat, index) =>
          index === prev.length - 1 ? { ...chat, assistant: response } : chat
        )
      );
    } catch (error) {
      console.error('Error asking question:', error);
    }
    setQuestion('');
  };

  return (
    <div style={containerStyle}>
      <div style={pdfViewerStyle}>
        {pdfBlob ? <PDFViewer pdfBlob={pdfBlob} /> : <p>Loading PDF...</p>}
      </div>
      <div style={sidebarStyle}>
        {pdfBlob ? <PDFViewer pdfBlob={pdfBlob} /> : <p>Loading PDF...</p>}
      </div>
      {pdfBlob && 
        <ChatWindow 
          summary={summary} 
          onSummarize={handleSummarize} 
          onSubmitQuestion={handleQuestionSubmit}
          chatHistory={chatHistory}
          onUpdateQuestion={value => setQuestion(value)}
        />}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100vh', // Full viewport height
};

const pdfViewerStyle: React.CSSProperties = {
  flex: 4,
  padding: '10px',
  overflow: 'auto',
};

const sidebarStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  borderLeft: '1px solid #ddd',
  backgroundColor: '#f8f9fa', // Light background for sidebar
};

export default FileDisplay;
