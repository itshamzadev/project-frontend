import EmptyState from "./EmptyState.jsx";

export default function Table({ headers, children, empty = false }) {
  if (empty)
    return (
      <div className="card">
        <EmptyState />
      </div>
    );
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
