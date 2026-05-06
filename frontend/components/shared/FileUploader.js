export default function FileUploader({ name = "files", multiple = true, ...props }) {
  return <input className="input" type="file" name={name} multiple={multiple} {...props} />;
}
