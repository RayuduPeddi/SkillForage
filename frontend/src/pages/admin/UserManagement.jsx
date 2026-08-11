import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  UserCheck,
  UserX,
  GraduationCap,
  Presentation,
  Shield,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function UserManagement() {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    headline: '',
    status: 'active',
  });

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const list = await adminService.getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
        sortBy,
      });
      setUsers(list);
    } catch (err) {
      toastError('Failed to load users', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter, sortBy]);

  // Handle Add User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toastError('Validation Error', 'Name and Email are required.');
      return;
    }

    try {
      const created = await adminService.createUser(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', role: 'student', headline: '', status: 'active' });
      toastSuccess('User Created', `Successfully registered ${created.name} as ${created.role}.`);
      loadUsers();
    } catch (err) {
      toastError('Creation Failed', err.message);
    }
  };

  // Handle Edit User
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updated = await adminService.updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      toastSuccess('User Updated', `Updated profile details for ${updated.name}.`);
      loadUsers();
    } catch (err) {
      toastError('Update Failed', err.message);
    }
  };

  // Handle 1-Click Toggle Active / Inactive
  const handleToggleStatus = async (user) => {
    try {
      const updated = await adminService.toggleUserStatus(user.id);
      toastSuccess(
        'Status Changed',
        `${user.name} is now ${updated.status === 'active' ? 'Active' : 'Inactive'}.`
      );
      loadUsers();
    } catch (err) {
      toastError('Status Update Failed', err.message);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await adminService.deleteUser(deletingUser.id);
      setDeletingUser(null);
      toastSuccess('User Deleted', `Permanently removed ${deletingUser.name} from the platform.`);
      loadUsers();
    } catch (err) {
      toastError('Delete Failed', err.message);
    }
  };

  // Stats calculation
  const totalCount = users.length;
  const studentsCount = users.filter((u) => u.role === 'student').length;
  const instructorsCount = users.filter((u) => u.role === 'instructor').length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status !== 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              Admin Governance
            </Badge>
            <span className="text-xs text-slate-500 font-mono">User Directory & Permissions</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">User Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, inspect, update roles, toggle active status, or manage credentials for all students & instructors.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => {
            setFormData({ name: '', email: '', role: 'student', headline: '', status: 'active' });
            setIsAddModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold self-start sm:self-auto"
        >
          Add New User
        </Button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">{activeCount} active now</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Students</span>
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand-700 mt-2">{studentsCount}</p>
          <span className="text-[11px] text-slate-400">Learner accounts</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Instructors</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Presentation className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{instructorsCount}</p>
          <span className="text-[11px] text-slate-400">Faculty & Mentors</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Inactive / Suspended</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{inactiveCount}</p>
          <span className="text-[11px] text-slate-400">Restricted access</span>
        </Card>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by name, email, headline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={Search}
            className="w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'all', label: 'All Roles' },
              { id: 'student', label: 'Students' },
              { id: 'instructor', label: 'Instructors' },
              { id: 'admin', label: 'Admins' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoleFilter(r.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg transition-all',
                  roleFilter === r.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Status Select */}
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="text-xs"
            />
          </div>

          {/* Sort Select */}
          <div className="w-36">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'name', label: 'Sort: Name' },
                { value: 'joined', label: 'Sort: Joined Date' },
                { value: 'role', label: 'Sort: Role' },
              ]}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User Profile</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Performance / Activity</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading users directory...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="md" className="shrink-0 ring-2 ring-slate-100" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm hover:text-purple-700 cursor-pointer" onClick={() => setViewingUser(u)}>
                            {u.name}
                          </p>
                          <p className="text-slate-500 text-xs truncate max-w-xs">{u.email}</p>
                          {u.headline && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5 font-medium">
                              {u.headline}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          u.role === 'admin'
                            ? 'purple'
                            : u.role === 'instructor'
                            ? 'warning'
                            : 'primary'
                        }
                        size="sm"
                        className="font-bold capitalize"
                      >
                        {u.role === 'student' && <GraduationCap className="w-3 h-3 mr-1 inline" />}
                        {u.role === 'instructor' && <Presentation className="w-3 h-3 mr-1 inline" />}
                        {u.role === 'admin' && <Shield className="w-3 h-3 mr-1 inline" />}
                        {u.role}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold',
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                          )}
                        />
                        {u.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Performance / Activity */}
                    <td className="px-6 py-4">
                      {u.role === 'student' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600">
                            <Zap className="w-3 h-3 text-purple-600" />
                            <span>Mastery: <strong>{u.mastery || 70}%</strong></span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {u.coursesEnrolled || 1} Courses Enrolled • {u.streak || 0}d Streak
                          </p>
                        </div>
                      ) : u.role === 'instructor' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Rating: <strong>★ {u.rating || 4.9}</strong></span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {u.coursesCreated || 2} Courses • {u.studentsCount?.toLocaleString() || 0} Students
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Platform Admin</span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                      {u.joined || '2026-01-01'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inspect Details */}
                        <button
                          type="button"
                          onClick={() => setViewingUser(u)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit User */}
                        <button
                          type="button"
                          onClick={() => setEditingUser({ ...u })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Toggle Active / Inactive Status */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            u.status === 'active'
                              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                              : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                          )}
                          title={u.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          onClick={() => setDeletingUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No users found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 1. ADD USER MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Register New User"
          size="md"
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@skillforage.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Role
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { value: 'student', label: 'Student Learner' },
                    { value: 'instructor', label: 'Faculty Instructor' },
                    { value: 'admin', label: 'System Administrator' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Initial Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'active', label: 'Active (Instant Access)' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <Input
              label="Academic Headline / Specialty (Optional)"
              placeholder="e.g. Computer Science Student or Lead Algorithms Faculty"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="md" type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                Create Account
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. EDIT USER MODAL */}
      {editingUser && (
        <Modal
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          title={`Edit User: ${editingUser.name}`}
          size="md"
        >
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <Input
              label="Full Name"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Role Permission
                </label>
                <Select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  options={[
                    { value: 'student', label: 'Student' },
                    { value: 'instructor', label: 'Instructor' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Status
                </label>
                <Select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <Input
              label="Headline / Title"
              value={editingUser.headline || ''}
              onChange={(e) => setEditingUser({ ...editingUser, headline: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="md" type="button" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. VIEW USER DETAILS MODAL */}
      {viewingUser && (
        <Modal
          isOpen={Boolean(viewingUser)}
          onClose={() => setViewingUser(null)}
          title="User Account Details"
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Avatar name={viewingUser.name} size="lg" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingUser.name}</h3>
                <p className="text-xs text-slate-500">{viewingUser.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={viewingUser.role === 'admin' ? 'purple' : viewingUser.role === 'instructor' ? 'warning' : 'primary'} size="sm">
                    {viewingUser.role}
                  </Badge>
                  <Badge variant={viewingUser.status === 'active' ? 'success' : 'danger'} size="sm">
                    {viewingUser.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-semibold">Account ID</span>
                <p className="font-mono font-bold text-slate-800">{viewingUser.id}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-semibold">Date Registered</span>
                <p className="font-mono font-bold text-slate-800">{viewingUser.joined || '2026-01-01'}</p>
              </div>

              {viewingUser.role === 'student' ? (
                <>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold">Adaptive Mastery</span>
                    <p className="font-bold text-brand-700 text-sm">{viewingUser.mastery || 72}%</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold">Daily Active Streak</span>
                    <p className="font-bold text-purple-700 text-sm">{viewingUser.streak || 14} days</p>
                  </div>
                </>
              ) : viewingUser.role === 'instructor' ? (
                <>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold">Courses Created</span>
                    <p className="font-bold text-amber-700 text-sm">{viewingUser.coursesCreated || 3} Curricula</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-slate-400 font-semibold">Student Satisfaction</span>
                    <p className="font-bold text-emerald-700 text-sm">★ {viewingUser.rating || 4.9} / 5.0</p>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const userToEdit = viewingUser;
                  setViewingUser(null);
                  setEditingUser(userToEdit);
                }}
              >
                Edit Account
              </Button>
              <Button variant="primary" size="sm" onClick={() => setViewingUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. DELETE USER CONFIRMATION MODAL */}
      {deletingUser && (
        <Modal
          isOpen={Boolean(deletingUser)}
          onClose={() => setDeletingUser(null)}
          title="Confirm User Deletion"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
              <p className="text-xs">
                Are you sure you want to permanently delete <strong>{deletingUser.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
