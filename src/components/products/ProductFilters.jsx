import Button from "../common/Button.jsx";

export default function ProductFilters({
  filters,
  categories,
  onChange,
  onApply,
}) {
  return (
    <div className="toolbar">
      <input
        placeholder="Search SKU or name"
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
      />
      <select
        value={filters.category}
        onChange={(event) =>
          onChange({ ...filters, category: event.target.value })
        }
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option value={category._id} key={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={filters.isActive}
        onChange={(event) =>
          onChange({ ...filters, isActive: event.target.value })
        }
      >
        <option value="">All statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
      <select
        value={filters.lowStock}
        onChange={(event) =>
          onChange({ ...filters, lowStock: event.target.value })
        }
      >
        <option value="">All stock</option>
        <option value="true">Low stock</option>
      </select>
      <Button onClick={onApply}>Apply filters</Button>
    </div>
  );
}
