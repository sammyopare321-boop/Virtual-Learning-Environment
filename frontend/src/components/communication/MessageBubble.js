import { formatDate } from "@/utils/formatters";

export default function MessageBubble({ message, own }) {
  return (
    <div className={`message-bubble ${own ? "own" : ""}`}>
      <strong>{message.sender?.name || message.from?.name || "Message"}</strong>
      <p>{message.body || message.text || message.content || message.message}</p>
      <p className="muted">{formatDate(message.createdAt)}</p>
    </div>
  );
}
