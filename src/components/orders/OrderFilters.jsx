import Button from "../common/Button.jsx";

export default function OrderFilters({ filters, role, onChange, onApply }) {
  return (
    <div className="toolbar">
      <input
        placeholder="Search order, customer, email or phone"
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
      />
      <select
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value })
        }
      >
        <option value="">All statuses</option>
        {["Draft", "Confirmed", "Processing", "Completed", "Cancelled"].map(
          (status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ),
        )}
      </select>
      {role === "admin" && (
        <select
          value={filters.cancellationStatus}
          onChange={(event) =>
            onChange({ ...filters, cancellationStatus: event.target.value })
          }
        >
          <option value="">All cancellation requests</option>
          <option value="Pending">Pending requests</option>
          <option value="Rejected">Rejected</option>
          <option value="Approved">Approved</option>
        </select>
      )}
      <label className="field">
        <span>From</span>
        <input
          type="date"
          value={filters.from}
          onChange={(event) =>
            onChange({ ...filters, from: event.target.value })
          }
        />
      </label>
      <label className="field">
        <span>To</span>
        <input
          type="date"
          value={filters.to}
          onChange={(event) => onChange({ ...filters, to: event.target.value })}
        />
      </label>
      <Button onClick={onApply}>Apply filters</Button>
    </div>
  );
}
