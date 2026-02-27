import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBookOpen, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import adminService from '../services/adminService';
import { useAdminData, useAdminAction } from '../hooks/useAdminData';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';

const EMPTY_COURSE = {
  name: '',
  description: '',
  subject_area: '',
  price: '',
  credential_type: 'Certificate',
  ace_certified: false,
  nccrs_certified: false,
  is_local: false,
};

const AdminCoursesPage = () => {
  const { data: courses, loading, error, load } = useAdminData(
    adminService.getCourses.bind(adminService),
  );
  const createAction = useAdminAction(
    adminService.createCourse.bind(adminService),
  );
  const updateAction = useAdminAction(
    adminService.updateCourse.bind(adminService),
  );
  const deleteAction = useAdminAction(
    adminService.deleteCourse.bind(adminService),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_COURSE);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      load(search ? { search } : {});
    }, 400);
    return () => clearTimeout(timer);
  }, [load, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_COURSE);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      name: course.name || '',
      description: course.description || '',
      subject_area: course.subject_area || '',
      price: course.price ? String(course.price).replace('$', '') : '',
      credential_type: course.credential_type || 'Certificate',
      ace_certified: course.ace_certified ?? false,
      nccrs_certified: course.nccrs_certified ?? false,
      is_local: course.is_local ?? false,
      is_active: course.is_active ?? true,
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
      payload.name = form.name;
      payload.description = form.description || undefined;
      payload.subject_area = form.subject_area || undefined;
      payload.price = form.price ? Number(form.price) : undefined;
      payload.credential_type = form.credential_type;
      payload.ace_certified = form.ace_certified;
      payload.nccrs_certified = form.nccrs_certified;
      payload.is_local = form.is_local;
    } else {
      // Update — only send editable fields
      if (form.name) payload.name = form.name;
      if (form.description) payload.description = form.description;
      if (form.subject_area) payload.subject_area = form.subject_area;
      if (form.price) payload.price = Number(form.price);
      payload.credential_type = form.credential_type;
      payload.ace_certified = form.ace_certified;
      payload.nccrs_certified = form.nccrs_certified;
      payload.is_local = form.is_local;
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
      if (!window.confirm('Are you sure you want to delete this course?'))
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
    { key: 'name', label: 'Course Name' },
    { key: 'subject_area', label: 'Subject' },
    { key: 'price', label: 'Price' },
    {
      key: 'credential_type',
      label: 'Type',
      render: (v) => v || '—',
    },
    {
      key: 'seats',
      label: 'Enrollment',
      render: (v) => v?.display || '—',
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

  const activeCourses = useMemo(() => courses.filter((c) => c.is_active), [courses]);
  const avgPrice = useMemo(() => {
    const priced = courses.filter((c) => c.price);
    if (!priced.length) return '—';
    const avg = priced.reduce((sum, c) => sum + Number(String(c.price).replace('$', '')), 0) / priced.length;
    return `$${Math.round(avg).toLocaleString()}`;
  }, [courses]);

  const actionError =
    createAction.error || updateAction.error || deleteAction.error;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Courses</h1>
          <p className="admin-page__subtitle">Manage course catalog</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <FiPlus /> Create Course
        </button>
      </div>

      {(error || actionError) && (
        <div className="admin-toast admin-toast--error">
          {error || actionError}
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--accent"><FiBookOpen /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{courses.length}</span>
            <span className="admin-stat__label">Total Courses</span>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--success"><FiCheckCircle /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{activeCourses.length}</span>
            <span className="admin-stat__label">Active</span>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__icon admin-stat__icon--warning"><FiDollarSign /></div>
          <div className="admin-stat__info">
            <span className="admin-stat__value">{avgPrice}</span>
            <span className="admin-stat__label">Avg Price</span>
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
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="admin-card__count">{courses.length} courses</span>
        </div>

        {loading ? (
          <div className="admin-loader">
            <div className="admin-loader__spinner" />
            Loading courses...
          </div>
        ) : (
          <AdminTable
            columns={columns}
            data={courses}
            emptyText="No courses found"
            emptySubtext="Create your first course to start building your catalog."
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
        title={editing ? 'Edit Course' : 'Create Course'}
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-field__label">Course Name</label>
            <input
              className="admin-field__input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Business 101: Principles of Management"
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
              placeholder="Brief course description..."
              rows={3}
            />
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Subject Area</label>
              <input
                className="admin-field__input"
                name="subject_area"
                value={form.subject_area}
                onChange={handleChange}
                placeholder="e.g. Business"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Price ($)</label>
              <input
                className="admin-field__input"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 850"
                required
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-field">
              <label className="admin-field__label">Credential Type</label>
              <select
                className="admin-field__input"
                name="credential_type"
                value={form.credential_type}
                onChange={handleChange}
              >
                <option value="Course">Course</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
          </div>

          <div className="admin-form__row">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="ace_certified"
                checked={form.ace_certified}
                onChange={handleChange}
              />
              <span>ACE Certified</span>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="nccrs_certified"
                checked={form.nccrs_certified}
                onChange={handleChange}
              />
              <span>NCCRS Certified</span>
            </label>
          </div>

          <div className="admin-form__row">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="is_local"
                checked={form.is_local}
                onChange={handleChange}
              />
              <span>Local Course</span>
            </label>
            {editing && (
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
            )}
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
                  : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminCoursesPage;
