import './style.css'

type ChatInputProps = {
    chatHistory: { user: string; assistant: string }[]
    onUpdateQuestion: (value: string) => void
    onSubmitQuestion: () => void
    question: string | null
}

const ChatInput: React.FC<ChatInputProps> = ({chatHistory, onUpdateQuestion, onSubmitQuestion, question}) => {
    return (
<div className="chat-container">
      <h3>Chat about this document</h3>
      <div className="chat-history">
        {chatHistory.map((entry, index) => (
          <div key={index} className="chat-message">
            <div className="user-message">User: {entry.user}</div>
            <div className="assistant-message">Assistant: {entry.assistant}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          onChange={(e) => onUpdateQuestion(e.target.value)}
          placeholder="Ask a question about the document"
          value={question ?? ''}
          className="question-input"
        />
        <button onClick={onSubmitQuestion} className="ask-button">Ask</button>
      </div>
    </div>
    )
}

export default ChatInput
