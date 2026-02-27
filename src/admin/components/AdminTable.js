import React from 'react';
import { FiInbox } from 'react-icons/fi';

const AdminTable = ({
  columns,
  data,
  actions,
  emptyText = 'No records found',
  emptySubtext = '',
}) => {
  if (!data.length) {
    return (
      <div className="admin-empty">
        <div className="admin-empty__icon">
          <FiInbox />
        </div>
        <span className="admin-empty__title">{emptyText}</span>
        {emptySubtext && (
          <span className="admin-empty__text">{emptySubtext}</span>
        )}
      </div>
    );
  }

  return (
    <div className="admin-table__wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key] ?? '—'}
                </td>
              ))}
              {actions && (
                <td className="admin-table__actions">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
