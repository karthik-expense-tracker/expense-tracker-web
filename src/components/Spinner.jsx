export const Spinner = ({ label = "Loading expenses..." }) => (
  <p role="status" className="spinner">{label}</p>
);