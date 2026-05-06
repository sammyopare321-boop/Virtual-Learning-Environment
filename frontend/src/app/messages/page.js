"use client";

import { useMemo, useState } from "react";
import { communicationApi } from "@/utils/api/communicationApi";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import ChatBox from "@/components/communication/ChatBox";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import { Field, Input } from "@/components/shared/Input";
import { unwrap } from "@/utils/formatters";

export default function MessagesPage() {
  const { user } = useAuth();
  const [draftRecipient, setDraftRecipient] = useState("");
  const [recipientId, setRecipientId] = useState("");

  const messages = useFetch(
    () => recipientId ? communicationApi.getMessages(recipientId) : Promise.resolve({ data: { data: [] } }),
    [recipientId]
  );

  const rows = useMemo(() => unwrap(messages.data) || [], [messages.data]);

  const openThread = (event) => {
    event.preventDefault();
    setRecipientId(draftRecipient.trim());
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Communication</p>
          <h1>Messages</h1>
          <p className="muted">Open a direct thread with another user by their account id.</p>
        </div>
      </div>
      <form className="form-card form-grid" onSubmit={openThread} style={{ marginBottom: 18 }}>
        <Field label="Recipient user id">
          <Input value={draftRecipient} onChange={(event) => setDraftRecipient(event.target.value)} placeholder="Paste a user id" />
        </Field>
        <div className="button-row">
          <button className="btn" type="submit">Open thread</button>
        </div>
      </form>
      {messages.loading && <Loader label="Loading messages" />}
      <ErrorMessage message={messages.error} />
      {recipientId ? (
        <ChatBox messages={rows} userId={user?._id} recipientId={recipientId} />
      ) : (
        <EmptyState title="No thread selected" message="Enter a recipient id to load an existing conversation or start a new one." />
      )}
    </section>
  );
}
