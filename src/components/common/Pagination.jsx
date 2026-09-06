import Button from "./Button.jsx";

export default function Pagination({ page = 1, pages = 1, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      <span>
        Page {page} of {pages}
      </span>
      <Button
        variant="secondary"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
