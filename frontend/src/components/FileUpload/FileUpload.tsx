'use client'

import React, { useState } from 'react';
import { saveFile } from '@/api/DB';
import './style.css'

type FileUploadProps = {
  onFileAdded: (id: string, name: string) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileAdded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      readPDFAsUint8Array(uploadedFile);
      setFile(uploadedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const readPDFAsUint8Array = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const pdfData = new Uint8Array(reader.result as ArrayBuffer);
      setFileData(pdfData); // Set binary data directly for storage
    };
    reader.readAsArrayBuffer(file);
  };

  async function onSaveFile() {
    if (!fileName || !fileData) {
      throw Error('File name or data not set');
    }

    // Pass the binary data directly to `saveFile`
    const id = await saveFile(fileData, fileName);
    onFileAdded(id, fileName);
  }

  return (
    <div className="container">
      <div className="card">
        <input type="file" onChange={handleFileUpload} accept="application/pdf" className="file-input"/>
        <input type="text" placeholder="File name" onChange={(e) => setFileName(e.target.value)} className="text-input"/>
        {fileData && file?.name && <button onClick={onSaveFile} className="upload-button" disabled={!file.name || !fileData}>Save</button>}
      </div>
    </div>
  );
};

export default FileUpload;
