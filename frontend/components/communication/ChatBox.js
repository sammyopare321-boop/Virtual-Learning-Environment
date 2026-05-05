"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { Field, Input } from "@/components/shared/Input";
import MessageList from "@/components/communication/MessageList";

export default function ChatBox({ messages = [], userId, recipientId }) {
  const socketRef = useSocket();
  const [items, setItems] = useState(messages);
  const [text, setText] = useState("");

  useEffect(() => setItems(messages), [messages]);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;
    const receive = (message) => setItems((current) => [...current, message]);
    socket.on("new_message", receive);
    return () => socket.off("new_message", receive);
  }, [socketRef]);

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    socketRef?.current?.emit("send_message", { receiverId: recipientId, body: text });
    setItems((current) => [...current, { _id: `${Date.now()}`, sender: userId, body: text, createdAt: new Date().toISOString() }]);
    setText("");
  };

  return (
    <section className="form-card form-grid">
      <MessageList messages={items} userId={userId} />
      <form className="button-row" onSubmit={submit}>
        <Field label="Message">
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <button className="btn" type="submit">Send</button>
      </form>
    </section>
  );
}
