import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiCheckCircle, FiPercent } from 'react-icons/fi';
import adminService from '../services/adminService';
import { useAdminData, useAdminAction } from '../hooks/useAdminData';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';

const EMPTY_COUPON = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  max_uses: '',
  max_uses_per_user: '1',
  valid_from: '',
  valid_until: '',
};

const AdminCouponsPage = () => {
  const { data: coupons, loading, error, load } = useAdminData(
    adminService.getCoupons.bind(adminService),
  );
  const createAction = useAdminAction(
    adminService.createCoupon.bind(adminService),
  );
  const updateAction = useAdminAction(
    adminService.updateCoupon.bind(adminService),
  );
  const deleteAction = useAdminAction(
    adminService.deleteCoupon.bind(adminService),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_COUPON);
  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_COUPON);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code || '',
      description: coupon.description || '',
      discount_type: coupon.discount_type || 'percentage',
      discount_value: coupon.discount_value ?? '',
      max_uses: coupon.max_uses ?? '',
      max_uses_per_user: coupon.max_uses_per_user ?? '1',
      valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};

    if (!editing) {
      // Create — send all fields
      payload.code = form.code;
      payload.description = form.description || undefined;
      payload.discount_type = form.discount_type;
      payload.discount_value = Number(form.discount_value);
      payload.max_uses = form.max_uses ? Number(form.max_uses) : undefined;
      payload.max_uses_per_user = form.max_uses_per_user
        ? Number(form.max_uses_per_user)
        : undefined;
      payload.valid_from = form.valid_from
        ? new Date(form.valid_from).toISOString()
        : undefined;
      payload.valid_until = form.valid_until
        ? new Date(form.valid_until).toISOString()
        : undefined;
    } else {
      // Update — only send changed/editable fields
      if (form.max_uses !== '') payload.max_uses = Number(form.max_uses);
      if (form.max_uses_per_user !== '')
        payload.max_uses_per_user = Number(form.max_uses_per_user);
      if (form.valid_until)
        payload.valid_until = new Date(form.valid_until).toISOString();
      if (form.description) payload.description = form.description;
      payload.is_active = form.is_active;
    }

    try {
      if (editing) {
        await updateAction.execute(editing.id, payload);
      } else {
        await createAction.execute(payload);
      }
      setModalOpen(false);
      load();
    } catch {
      // Error state handled by hook
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Are you sure you want to delete this coupon?'))
        return;
      try {
        await deleteAction.execute(id);
        load();
      } catch {
        // Error state handled by hook
      }
    },
    [deleteAction, load],
  );

  const columns = [
    { key: 'code', label: 'Code' },
    {
      key: 'description',
      label: 'Description',
      render: (v) => v || '—',
    },
    {
      key: 'discount_type',
      label: 'Type',
      render: (v) => (v === 'percentage' ? 'Percentage' : 'Fixed Amount'),
    },
    {
      key: 'discount_value',
      label: 'Value',
      render: (v, row) =>
        row.discount_type === 'percentage' ? `${v}%` : `$${v}`,
    },
    {
      key: 'max_uses',
      label: 'Max Uses',
      render: (v) => v ?? 'Unlimited',
    },
    {
      key: 'valid_until',
      label: 'Valid Until',
      render: (v) => (v ? new Date(v).toLocaleDateString() : 'No expiry'),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (v) => (
        <span
          className={`admin-badge ${v ? 'admin-badge--success' : 'admin-badge--muted'}`}
        >
          {v ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const activeCoupons = coupons.filter((c) => c.is_active);
  const percentageCoupons = coupons.filter((c) => c.discount_type === 'percentage');

  const actionError =
    createAction.error || updateAction.error || deleteAction.error;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Coupons</h1>
          <p className="admin-page__subtitle">Manage discount coupons</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      {(error || actionError) && (
        <div className="admin-toast admin-toast--error">
          {error || actionError}
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--accent"><FiTag /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{coupons.length}</span>
            <span className="admin-stat__label">Total Coupons</span>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--success"><FiCheckCircle /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{activeCoupons.length}</span>
            <span className="admin-stat__label">Active</span>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--warning"><FiPercent /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{percentageCoupons.length}</span>
            <span className="admin-stat__label">Percentage</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <span className="admin-card__count">{coupons.length} coupons</span>
        </div>

        {loading ? (
          <div className="admin-loader">
            <div className="admin-loader__spinner" />
            Loading coupons...
          </div>
        ) : (
          <AdminTable
            columns={columns}
            data={coupons}
            emptyText="No coupons yet"
            emptySubtext="Create your first coupon to offer discounts to students."
            actions={(row) => (
              <>
                <button
                  className="admin-btn admin-btn--icon"
                  title="Edit"
                  onClick={() => openEdit(row)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="admin-btn admin-btn--icon admin-btn--danger"
                  title="Delete"
                  onClick={() => handleDelete(row.id)}
                >
                  <FiTrash2 />
                </button>
              </>
            )}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Coupon' : 'Create Coupon'}
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-field__label">Coupon Code</label>
            <input
              className="admin-field__input"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. LOCAL2026"
              required
              disabled={!!editing}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label">Description</label>
            <input
              className="admin-field__input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. 10% off for local students"
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Discount Type</label>
              <select
                className="admin-field__input"
                name="discount_type"
                value={form.discount_type}
                onChange={handleChange}
                disabled={!!editing}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Discount Value</label>
              <input
                className="admin-field__input"
                name="discount_value"
                type="number"
                min="0"
                step="0.01"
                value={form.discount_value}
                onChange={handleChange}
                placeholder={
                  form.discount_type === 'percentage' ? 'e.g. 10' : 'e.g. 50.00'
                }
                required
                disabled={!!editing}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Max Uses (total)</label>
              <input
                className="admin-field__input"
                name="max_uses"
                type="number"
                min="0"
                value={form.max_uses}
                onChange={handleChange}
                placeholder="e.g. 50"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Max Uses Per User</label>
              <input
                className="admin-field__input"
                name="max_uses_per_user"
                type="number"
                min="1"
                value={form.max_uses_per_user}
                onChange={handleChange}
                placeholder="e.g. 1"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Valid From</label>
              <input
                className="admin-field__input"
                name="valid_from"
                type="date"
                value={form.valid_from}
                onChange={handleChange}
                disabled={!!editing}
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Valid Until</label>
              <input
                className="admin-field__input"
                name="valid_until"
                type="date"
                value={form.valid_until}
                onChange={handleChange}
              />
            </div>
          </div>

          {editing && (
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active ?? true}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          )}

          <div className="admin-form__actions">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={createAction.loading || updateAction.loading}
            >
              {createAction.loading || updateAction.loading
                ? 'Saving...'
                : editing
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminCouponsPage;
