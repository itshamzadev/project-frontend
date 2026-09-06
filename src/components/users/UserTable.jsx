import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Table from "../common/Table.jsx";

export default function UserTable({ users, currentUserId, onUpdate }) {
  if (!users.length)
    return (
      <div className="card">
        <EmptyState title="No users found" />
      </div>
    );
  return (
    <Table headers={["Name", "Email", "Role", "Status", "Actions"]}>
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <select
              value={user.role}
              onChange={(event) =>
                onUpdate(user._id, { role: event.target.value })
              }
            >
              <option value="sales">Sales</option>
              <option value="warehouse">Warehouse</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td>{user.isActive ? "Active" : "Inactive"}</td>
          <td>
            <Button
              className="small"
              variant="secondary"
              disabled={user._id === currentUserId && user.isActive}
              onClick={() => onUpdate(user._id, { isActive: !user.isActive })}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </Button>
          </td>
        </tr>
      ))}
    </Table>
  );
}
