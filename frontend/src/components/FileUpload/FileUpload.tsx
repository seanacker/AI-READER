'use client'

import React, { useState } from 'react';
import { saveFile } from '@/api/DB';
import './style.css'

type FileUploadProps = {
  onFileAdded: (id: string, name: string) => void;
};

export type ChapterUploadData = {
  title: string,
  content: Blob
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileAdded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile)
    } else {
      alert('Please upload a PDF file');
    }
  };

  const splitPdfIntoChapters = async (pdfFile: File): Promise<ChapterUploadData[]> => {
    console.log('Splitting PDF into chapters...', JSON.stringify(pdfFile));
    // Mock logic for splitting the PDF into chapters
    // In reality, you would use a library to parse the PDF and extract chapters
    const chapter1 = new Blob(['This is the content of Chapter 1'], { type: 'text/plain' });
    const chapter2 = new Blob(['This is the content of Chapter 2'], { type: 'text/plain' });

    return [
      { title: 'Chapter 1', content: chapter1 },
      { title: 'Chapter 2', content: chapter2 },
    ];
  };


  const onSaveFile = async () => {
    if (!file) {
      alert('Please upload a file');
      return;
    }

    if(!fileName?.trim()) {
      throw Error('Please enter a valid name')
    }

    setLoading(true);
    try {
      // Split the PDF into chapters (using the mock function)
      const chapters = await splitPdfIntoChapters(file);

      // Save the file and its chapters to the backend
      const savedFileId = await saveFile(fileName, chapters);
      onFileAdded(savedFileId, fileName)
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save the file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <input type="file" onChange={handleFileUpload} accept="application/pdf" className="file-input"/>
        <input type="text" placeholder="File name" onChange={(e) => setFileName(e.target.value)} className="text-input"/>
        {file && <button onClick={onSaveFile} className="upload-button" disabled={!fileName}>{loading ? 'Saving...' : 'Save File'}</button>}
      </div>
    </div>
  );
};

export default FileUpload;
