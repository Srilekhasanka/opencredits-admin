import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiMapPin, FiUsers, FiLock } from 'react-icons/fi';
import adminService from '../services/adminService';
import { useAdminData, useAdminAction } from '../hooks/useAdminData';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';

const EMPTY_UNIVERSITY = {
  name: '',
  logo_url: '',
  website_url: '',
  description: '',
  display_order: '',
  state_code: '',
  city: '',
  is_partner: false,
  is_private: false,
  is_annual_tuition: '',
  int_annual_tuition: '',
  annual_living_cost: '',
  is_per_3_credit_course_cost: '',
  int_per_3_credit_course_cost: '',
};

const AdminUniversitiesPage = () => {
  const { data: universities, loading, error, load } = useAdminData(
    adminService.getUniversities.bind(adminService),
  );
  const createAction = useAdminAction(
    adminService.createUniversity.bind(adminService),
  );
  const updateAction = useAdminAction(
    adminService.updateUniversity.bind(adminService),
  );
  const deleteAction = useAdminAction(
    adminService.deleteUniversity.bind(adminService),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [form, setForm] = useState(EMPTY_UNIVERSITY);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      load(search ? { search } : {});
    }, 400);
    return () => clearTimeout(timer);
  }, [load, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_UNIVERSITY);
    setModalOpen(true);
  };

  const openEdit = (uni) => {
    setEditing(uni);
    setForm({
      name: uni.name || '',
      logo_url: uni.logo_url || '',
      website_url: uni.website_url || '',
      description: uni.description || '',
      display_order: uni.display_order ?? '',
      state_code: uni.state_code || '',
      city: uni.city || '',
      is_partner: uni.is_partner ?? false,
      is_private: uni.is_private ?? false,
      is_annual_tuition: uni.is_annual_tuition ?? '',
      int_annual_tuition: uni.int_annual_tuition ?? '',
      annual_living_cost: uni.annual_living_cost ?? '',
      is_per_3_credit_course_cost: uni.is_per_3_credit_course_cost ?? '',
      int_per_3_credit_course_cost: uni.int_per_3_credit_course_cost ?? '',
    });
    setModalOpen(true);
  };

  const viewDetail = useCallback(async (uni) => {
    try {
      const detail = await adminService.getUniversity(uni.id);
      setDetailModal(detail);
    } catch {
      setDetailModal(uni);
    }
  }, []);

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
      // Create — send all fields from the curl
      payload.name = form.name;
      if (form.logo_url) payload.logo_url = form.logo_url;
      if (form.website_url) payload.website_url = form.website_url;
      if (form.description) payload.description = form.description;
      if (form.display_order !== '') payload.display_order = Number(form.display_order);
      if (form.state_code) payload.state_code = form.state_code;
      if (form.city) payload.city = form.city;
      payload.is_partner = form.is_partner;
      payload.is_private = form.is_private;
      if (form.is_annual_tuition !== '') payload.is_annual_tuition = Number(form.is_annual_tuition);
      if (form.int_annual_tuition !== '') payload.int_annual_tuition = Number(form.int_annual_tuition);
      if (form.annual_living_cost !== '') payload.annual_living_cost = Number(form.annual_living_cost);
      if (form.is_per_3_credit_course_cost !== '') payload.is_per_3_credit_course_cost = Number(form.is_per_3_credit_course_cost);
      if (form.int_per_3_credit_course_cost !== '') payload.int_per_3_credit_course_cost = Number(form.int_per_3_credit_course_cost);
    } else {
      // Update — send changed fields
      if (form.name) payload.name = form.name;
      if (form.logo_url) payload.logo_url = form.logo_url;
      if (form.website_url) payload.website_url = form.website_url;
      if (form.description) payload.description = form.description;
      if (form.display_order !== '') payload.display_order = Number(form.display_order);
      if (form.state_code) payload.state_code = form.state_code;
      if (form.city) payload.city = form.city;
      payload.is_partner = form.is_partner;
      payload.is_private = form.is_private;
      if (form.is_annual_tuition !== '') payload.is_annual_tuition = Number(form.is_annual_tuition);
      if (form.int_annual_tuition !== '') payload.int_annual_tuition = Number(form.int_annual_tuition);
      if (form.annual_living_cost !== '') payload.annual_living_cost = Number(form.annual_living_cost);
      if (form.is_per_3_credit_course_cost !== '') payload.is_per_3_credit_course_cost = Number(form.is_per_3_credit_course_cost);
      if (form.int_per_3_credit_course_cost !== '') payload.int_per_3_credit_course_cost = Number(form.int_per_3_credit_course_cost);
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
      if (!window.confirm('Are you sure you want to delete this university?'))
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

  const fmt = (v) => (v != null ? `$${Number(v).toLocaleString()}` : '—');

  const columns = [
    { key: 'name', label: 'University' },
    {
      key: 'city',
      label: 'Location',
      render: (v, row) => [v, row.state_code].filter(Boolean).join(', ') || '—',
    },
    {
      key: 'is_partner',
      label: 'Partner',
      render: (v) => (
        <span className={`admin-badge ${v ? 'admin-badge--success' : 'admin-badge--muted'}`}>
          {v ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'is_annual_tuition',
      label: 'Annual Tuition',
      render: (v) => fmt(v),
    },
  ];

  const partnerCount = useMemo(() => universities.filter((u) => u.is_partner).length, [universities]);
  const privateCount = useMemo(() => universities.filter((u) => u.is_private).length, [universities]);

  const actionError =
    createAction.error || updateAction.error || deleteAction.error;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Universities</h1>
          <p className="admin-page__subtitle">Manage partner universities</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <FiPlus /> Add University
        </button>
      </div>

      {(error || actionError) && (
        <div className="admin-toast admin-toast--error">
          {error || actionError}
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--accent"><FiMapPin /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{universities.length}</span>
            <span className="admin-stat__label">Total Universities</span>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--success"><FiUsers /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{partnerCount}</span>
            <span className="admin-stat__label">Partners</span>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--warning"><FiLock /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{privateCount}</span>
            <span className="admin-stat__label">Private</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <div className="admin-search">
            <FiSearch className="admin-search__icon" />
            <input
              className="admin-search__input"
              type="text"
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="admin-card__count">
            {universities.length} universities
          </span>
        </div>

        {loading ? (
          <div className="admin-loader">
            <div className="admin-loader__spinner" />
            Loading universities...
          </div>
        ) : (
          <AdminTable
            columns={columns}
            data={universities}
            emptyText="No universities found"
            emptySubtext="Add your first university to start building your network."
            actions={(row) => (
              <>
                <button
                  className="admin-btn admin-btn--icon"
                  title="View Details"
                  onClick={() => viewDetail(row)}
                >
                  <FiEye />
                </button>
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
        title={editing ? 'Edit University' : 'Add University'}
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-field__label">University Name</label>
            <input
              className="admin-field__input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Harvard University"
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label">Description</label>
            <textarea
              className="admin-field__input admin-field__textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">City</label>
              <input
                className="admin-field__input"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Cambridge"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">State Code</label>
              <input
                className="admin-field__input"
                name="state_code"
                value={form.state_code}
                onChange={handleChange}
                placeholder="e.g. MA"
                maxLength={2}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Website URL</label>
              <input
                className="admin-field__input"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="https://www.harvard.edu"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Logo URL</label>
              <input
                className="admin-field__input"
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">In-State Annual Tuition ($)</label>
              <input
                className="admin-field__input"
                name="is_annual_tuition"
                type="number"
                min="0"
                step="0.01"
                value={form.is_annual_tuition}
                onChange={handleChange}
                placeholder="e.g. 57261.00"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Int'l Annual Tuition ($)</label>
              <input
                className="admin-field__input"
                name="int_annual_tuition"
                type="number"
                min="0"
                step="0.01"
                value={form.int_annual_tuition}
                onChange={handleChange}
                placeholder="e.g. 57261.00"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Annual Living Cost ($)</label>
              <input
                className="admin-field__input"
                name="annual_living_cost"
                type="number"
                min="0"
                step="0.01"
                value={form.annual_living_cost}
                onChange={handleChange}
                placeholder="e.g. 22000.00"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Display Order</label>
              <input
                className="admin-field__input"
                name="display_order"
                type="number"
                min="0"
                value={form.display_order}
                onChange={handleChange}
                placeholder="e.g. 1"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">In-State Per 3-Credit Cost ($)</label>
              <input
                className="admin-field__input"
                name="is_per_3_credit_course_cost"
                type="number"
                min="0"
                step="0.01"
                value={form.is_per_3_credit_course_cost}
                onChange={handleChange}
                placeholder="e.g. 5726.10"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Int'l Per 3-Credit Cost ($)</label>
              <input
                className="admin-field__input"
                name="int_per_3_credit_course_cost"
                type="number"
                min="0"
                step="0.01"
                value={form.int_per_3_credit_course_cost}
                onChange={handleChange}
                placeholder="e.g. 5726.10"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="is_partner"
                checked={form.is_partner}
                onChange={handleChange}
              />
              <span>Partner University</span>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="is_private"
                checked={form.is_private}
                onChange={handleChange}
              />
              <span>Private University</span>
            </label>
          </div>

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
                  : 'Add University'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Detail Modal */}
      <AdminModal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="University Details"
      >
        {detailModal && (
          <div className="admin-detail admin-detail--grid">
            <div className="admin-detail__row admin-detail__row--full">
              <span className="admin-detail__label">Name</span>
              <span className="admin-detail__value">{detailModal.name}</span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Location</span>
              <span className="admin-detail__value">
                {[detailModal.city, detailModal.state_code].filter(Boolean).join(', ') || '—'}
              </span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Website</span>
              <span className="admin-detail__value">
                {detailModal.website_url ? (
                  <a href={detailModal.website_url} target="_blank" rel="noopener noreferrer" className="admin-link">
                    {detailModal.website_url}
                  </a>
                ) : '—'}
              </span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Partner</span>
              <span className="admin-detail__value">
                <span className={`admin-badge ${detailModal.is_partner ? 'admin-badge--success' : 'admin-badge--muted'}`}>
                  {detailModal.is_partner ? 'Yes' : 'No'}
                </span>
              </span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Private</span>
              <span className="admin-detail__value">
                <span className={`admin-badge ${detailModal.is_private ? 'admin-badge--success' : 'admin-badge--muted'}`}>
                  {detailModal.is_private ? 'Yes' : 'No'}
                </span>
              </span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">In-State Tuition</span>
              <span className="admin-detail__value">{fmt(detailModal.is_annual_tuition)}</span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Int'l Tuition</span>
              <span className="admin-detail__value">{fmt(detailModal.int_annual_tuition)}</span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Living Cost</span>
              <span className="admin-detail__value">{fmt(detailModal.annual_living_cost)}</span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">In-State Per 3-Credit</span>
              <span className="admin-detail__value">{fmt(detailModal.is_per_3_credit_course_cost)}</span>
            </div>
            <div className="admin-detail__row">
              <span className="admin-detail__label">Int'l Per 3-Credit</span>
              <span className="admin-detail__value">{fmt(detailModal.int_per_3_credit_course_cost)}</span>
            </div>
            {detailModal.description && (
              <div className="admin-detail__row admin-detail__row--full">
                <span className="admin-detail__label">Description</span>
                <span className="admin-detail__value">{detailModal.description}</span>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminUniversitiesPage;
