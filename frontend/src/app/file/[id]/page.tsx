'use client'

import React, { use, useEffect, useRef, useState } from 'react';
import { Chapter, getChapters, getSummaryFromDB, saveSummaryToDB } from '@/api/DB';
import PDFViewer from '@/components/PDFViewer/PDFViewer';
import ChatWindow from '@/components/ChatWindow/ChatWindow';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { askQuestionWithContext, summarizeText } from '@/api/GPT';
import './style.css'

interface FileDisplayProps {
  params: Promise<{ id: string }>; // `params` is a Promise in Next.js App Router
}

const FileDisplay = ({ params }: FileDisplayProps) => {
  // const [chapters, setChapters] = useState<Chapter[]>([])
  // const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(0)
  const [summary, setSummary] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ user: string; assistant: string }[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [chatWidth, setChatWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const {id} = use(params)

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const chapters = await getChapters(id);
        setChapters(chapters);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    const fetchSummary = async() => {
      try {
        const savedData = await getSummaryFromDB(id);
        if (savedData) {
          setSummary(savedData.summary);
          setChatHistory(savedData.chatHistory);
        }
      } catch (error) {
        console.error('Error fetching summary:', error)
      }
    }

    fetchPdf();
    fetchSummary();
  }, [id]);

  const handleMouseDown = (event: React.MouseEvent) => {
    const startX = event.clientX;
    const startWidth = chatWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (startX - moveEvent.clientX);
      setChatWidth(Math.max(200, Math.min(newWidth, window.innerWidth - 200)));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };



  // const handleSummarize = async () => {
  //   try {
  //     const summaryText = await summarizeText(pdfText);
  //     setSummary(summaryText);
  //     await saveSummaryToDB(id, summaryText, chatHistory);
  //   } catch (error) {
  //     console.error('Error generating summary:', error);
  //   }
  // };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    const updatedChatHistory = [...chatHistory, { user: question, assistant: '' }];
    
    try {
      const response = await askQuestionWithContext(question, summary ?? '', pdfText);
      const updatedChatHistoryWithResponse = updatedChatHistory.map((chat, index) =>
        index === updatedChatHistory.length - 1 ? { ...chat, assistant: response } : chat
      );
      await saveSummaryToDB(id, summary ?? '', updatedChatHistoryWithResponse);
      setChatHistory(updatedChatHistoryWithResponse)
    } catch (error) {
      console.error('Error asking question:', error);
    }
    setQuestion('');
  };

  return (
    <div style={containerStyle} ref={containerRef}>
      <div style={pdfViewerStyle }>
        {pdfBlob ? <PDFViewer pdfBlob={pdfBlob} /> : <p>Loading PDF...</p>}
      </div>
      <div
        className="resizable-chat"
        style={{ width: `${chatWidth}px` }}
      >
        <div className="resize-handle" onMouseDown={handleMouseDown} />
        {pdfBlob && (
          <ChatWindow
            summary={summary}
            onSummarize={handleSummarize}
            onSubmitQuestion={handleQuestionSubmit}
            chatHistory={chatHistory}
            onUpdateQuestion={(value) => setQuestion(value)}
            question={question}
          />
        )}
      </div>
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

export default FileDisplay;
