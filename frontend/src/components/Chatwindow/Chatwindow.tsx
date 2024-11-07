import React from 'react';

interface ChatWindowProps {
  pdfText: string;
  summary: string | null;
  onSummarize: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ pdfText, summary, onSummarize }) => {
  return (
    <div style={{ width: '300px', padding: '10px', borderLeft: '1px solid #ddd' }}>
      <h3>Document Summary</h3>
      <button onClick={onSummarize}>Summarize Document</button>
      {summary ? (
        <p>{summary}</p>
      ) : (
        <p>Summary will appear here after summarization.</p>
      )}
      <h4>Extracted Text</h4>
      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <p>{pdfText}</p>
      </div>
    </div>
  );
};

export default ChatWindow;
