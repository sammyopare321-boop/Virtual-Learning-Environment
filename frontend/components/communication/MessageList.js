import EmptyState from "@/components/shared/EmptyState";
import MessageBubble from "@/components/communication/MessageBubble";

export default function MessageList({ messages = [], userId }) {
  if (!messages.length) return <EmptyState title="No messages" message="Select a conversation or start one from a user profile." />;
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} own={(message.sender?._id || message.sender) === userId} />
      ))}
    </div>
  );
}
