export default function ContentItem({ item }) {
  return (
    <article className="card">
      <h3>{item.title || item.name || "Content item"}</h3>
      <p className="muted">{item.type || item.contentType || "Learning material"}</p>
      {item.url && <a className="btn secondary" href={item.url} target="_blank" rel="noreferrer">Open file</a>}
    </article>
  );
}
