"use client";

export default function ConfirmDialog({ message, onConfirm, confirmLabel = "Confirm" }) {
  const confirm = () => {
    if (window.confirm(message)) onConfirm?.();
  };

  return <button className="btn danger" type="button" onClick={confirm}>{confirmLabel}</button>;
}
