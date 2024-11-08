import React from 'react';
import ChatInput from '../ChatInput/ChatInput';

interface ChatWindowProps {
  summary: string | null;
  chatHistory: { user: string; assistant: string }[]
  onSummarize: () => void;
  onSubmitQuestion: () => void
  onUpdateQuestion: (value: string) => void
  question: string | null
}

const ChatWindow: React.FC<ChatWindowProps> = ({ summary, onSummarize, onSubmitQuestion, onUpdateQuestion, chatHistory, question }) => {
  return (
    <div style={{ width: '300px', padding: '10px', borderLeft: '1px solid #ddd' }}>
      <h3>Document Summary</h3>
      <button onClick={onSummarize}>Summarize Document</button>
      {summary ? (
        <p>{summary}</p>
      ) : (
        <p>Summary will appear here after summarization.</p>
      )}
      <ChatInput onSubmitQuestion={onSubmitQuestion} onUpdateQuestion={onUpdateQuestion} chatHistory={chatHistory} question={question}/>
    </div>
  );
};

export default ChatWindow;
