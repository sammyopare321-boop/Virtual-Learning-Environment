export default function Button({ variant = "primary", className = "", ...props }) {
  const variantClass = variant === "primary" ? "" : variant;
  return <button className={`btn ${variantClass} ${className}`.trim()} {...props} />;
}
