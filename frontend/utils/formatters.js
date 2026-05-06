export function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatShortDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function percent(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "0%";
  return `${number.toFixed(1).replace(".0", "")}%`;
}

export function getId(item) {
  return item?._id || item?.id;
}

export function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

export function errorMessage(error) {
  if (error?.message === "Network Error" && !error?.response) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "the configured API server";
    return `Cannot reach the backend API at ${baseUrl}. Make sure the backend server is running and its database is configured.`;
  }
  return error?.response?.data?.message || error?.message || "Something went wrong.";
}
