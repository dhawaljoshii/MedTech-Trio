export default function ChatBubble({ text, sender }) {
  return (
    <div
      className={`chat-bubble-row ${
        sender === "bot" ? "align-left" : "align-right"
      }`}
    >
      <div
        className={`chat-bubble ${
          sender === "bot" ? "chat-bubble-bot" : "chat-bubble-user"
        }`}
      >
        {text}
      </div>
    </div>
  );
}