type ChatInputProps = {
    chatHistory: { user: string; assistant: string }[]
    onUpdateQuestion: (value: string) => void
    onSubmitQuestion: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({chatHistory, onUpdateQuestion, onSubmitQuestion}) => {
    return (
        <div>
        <h3>Chat about this document</h3>
        <div>
          {chatHistory.map((entry, index) => (
            <div key={index}>
              <p><strong>User:</strong> {entry.user}</p>
              <p><strong>Assistant:</strong> {entry.assistant}</p>
            </div>
          ))}
        </div>
        <textarea
          onChange={(e) => onUpdateQuestion(e.target.value)}
          placeholder="Ask a question about the document"
        />
        <button onClick={onSubmitQuestion}>Ask</button>
      </div>
    )
}

export default ChatInput
