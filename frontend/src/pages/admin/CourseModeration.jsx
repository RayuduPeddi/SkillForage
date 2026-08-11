import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  Eye,
  Star,
  Users,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getAutoCourseThumbnail } from '../../utils/courseThumbnails';

export function CourseModeration() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  // New course form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    instructorName: 'Dr. Emily Watson',
    instructorTitle: 'Lead Computer Science Faculty',
    estimatedHours: 20,
    modulesCount: 4,
    lessonsCount: 12,
    status: 'active',
    description: '',
  });

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const list = await adminService.getCourses({
        search,
        category: categoryFilter,
        status: statusFilter,
        sortBy,
      });
      setCourses(list);
    } catch (err) {
      toastError('Failed to load courses', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [search, categoryFilter, statusFilter, sortBy]);

  // Handle Add Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Validation Error', 'Course title is required.');
      return;
    }

    try {
      const created = await adminService.createCourse(formData);
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        subtitle: '',
        category: 'Data Structures & Algorithms',
        difficulty: 'Intermediate',
        instructorName: 'Dr. Emily Watson',
        instructorTitle: 'Lead Computer Science Faculty',
        estimatedHours: 20,
        modulesCount: 4,
        lessonsCount: 12,
        status: 'active',
        description: '',
      });
      toastSuccess('Course Added', `"${created.title}" is now available on the platform.`);
      loadCourses();
    } catch (err) {
      toastError('Creation Failed', err.message);
    }
  };

  // Handle Edit Course
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const updated = await adminService.updateCourse(editingCourse.id, editingCourse);
      setEditingCourse(null);
      toastSuccess('Course Updated', `Successfully updated "${updated.title}".`);
      loadCourses();
    } catch (err) {
      toastError('Update Failed', err.message);
    }
  };

  // Handle 1-Click Toggle Active / Inactive
  const handleToggleStatus = async (course) => {
    try {
      const updated = await adminService.toggleCourseStatus(course.id);
      toastSuccess(
        'Status Updated',
        `"${course.title}" is now ${updated.status === 'active' ? 'Active & Published' : 'Inactive / Unlisted'}.`
      );
      loadCourses();
    } catch (err) {
      toastError('Status Update Failed', err.message);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    try {
      await adminService.deleteCourse(deletingCourse.id);
      setDeletingCourse(null);
      toastSuccess('Course Deleted', `Deleted "${deletingCourse.title}" from platform database.`);
      loadCourses();
    } catch (err) {
      toastError('Delete Failed', err.message);
    }
  };

  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => (c.status || 'active') === 'active').length;
  const inactiveCourses = courses.filter((c) => c.status === 'inactive').length;
  const totalEnrollments = courses.reduce((acc, c) => acc + (c.studentsEnrolled || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              Academic Moderation
            </Badge>
            <span className="text-xs text-slate-500 font-mono">Curriculum Governance & Publication</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Course Management & Moderation</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish curricula, toggle active/inactive availability, edit syllabus metadata, or provision new academic courses.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold self-start sm:self-auto"
        >
          Provision Course
        </Button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Courses</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalCourses}</p>
          <span className="text-[11px] text-slate-400">All registered curricula</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active / Published</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{activeCourses}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Available to students</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Inactive / Unlisted</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{inactiveCourses}</p>
          <span className="text-[11px] text-slate-400">Hidden from explore</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Enrollments</span>
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand-700 mt-2">{totalEnrollments.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Student subscriptions</span>
        </Card>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by course title, instructor, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={Search}
            className="w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="w-44">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'Data Structures & Algorithms', label: 'Algorithms & DSA' },
                { value: 'System Design', label: 'System Design' },
                { value: 'Fullstack Web Development', label: 'Fullstack Web' },
                { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
              ]}
              className="text-xs"
            />
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active (Live)' },
                { value: 'inactive', label: 'Inactive (Unlisted)' },
              ]}
              className="text-xs"
            />
          </div>

          {/* Sort By */}
          <div className="w-36">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'title', label: 'Sort: Title' },
                { value: 'students', label: 'Sort: Enrollments' },
                { value: 'rating', label: 'Sort: Rating' },
              ]}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <Card className="border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Course & Domain</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Enrollments & Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading courses catalogue...
                  </td>
                </tr>
              ) : courses.length > 0 ? (
                courses.map((c) => {
                  const thumbnailSrc = c.thumbnail || getAutoCourseThumbnail(c.category, c.title);
                  const isActive = (c.status || 'active') === 'active';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Course & Domain */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumbnailSrc}
                            alt={c.title}
                            className="w-14 h-10 object-cover rounded-lg shrink-0 border border-slate-200 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <p
                              className="font-bold text-slate-900 text-sm hover:text-purple-700 cursor-pointer line-clamp-1"
                              onClick={() => setViewingCourse(c)}
                            >
                              {c.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                                {c.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {c.estimatedHours || 18}h • {c.modulesCount || 4} modules
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-xs">
                          {c.instructor?.name || 'Dr. Emily Watson'}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {c.instructor?.title || 'Faculty Lead'}
                        </p>
                      </td>

                      {/* Difficulty */}
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            c.difficulty === 'Advanced'
                              ? 'warning'
                              : c.difficulty === 'Intermediate'
                              ? 'purple'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {c.difficulty || 'Intermediate'}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold',
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            )}
                          />
                          {isActive ? 'Active (Live)' : 'Inactive'}
                        </span>
                      </td>

                      {/* Enrollments & Rating */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{(c.studentsEnrolled || 0).toLocaleString()} enrolled</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{c.rating || 4.9}</span>
                            <span className="text-slate-400 font-normal">({c.ratingCount || 120})</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Syllabus */}
                          <button
                            type="button"
                            onClick={() => setViewingCourse(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Inspect Syllabus"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Course */}
                          <button
                            type="button"
                            onClick={() => setEditingCourse({ ...c })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            title="Edit Course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Toggle Active/Inactive */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              isActive
                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            )}
                            title={isActive ? 'Deactivate Course (Unlist)' : 'Activate Course (Publish)'}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          {/* Delete Course */}
                          <button
                            type="button"
                            onClick={() => setDeletingCourse(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No courses match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 1. ADD COURSE MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Provision New Academic Course"
          size="lg"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <Input
              label="Course Title"
              placeholder="e.g. Distributed Consensus & Microservices"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="Course Subtitle / Focus"
              placeholder="e.g. Master scalable distributed systems with Raft, Paxos, and gRPC"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category Domain
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'Data Structures & Algorithms', label: 'Data Structures & Algorithms' },
                    { value: 'System Design', label: 'System Design' },
                    { value: 'Fullstack Web Development', label: 'Fullstack Web' },
                    { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
                    { value: 'Python', label: 'Python Programming' },
                    { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
                    { value: 'Cybersecurity', label: 'Cybersecurity' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Difficulty
                </label>
                <Select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  options={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
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
                    { value: 'active', label: 'Active (Live)' },
                    { value: 'inactive', label: 'Inactive (Unlisted)' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Assigned Lead Instructor"
                value={formData.instructorName}
                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
              />
              <Input
                label="Estimated Hours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="md" type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                Create & Publish Course
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. EDIT COURSE MODAL */}
      {editingCourse && (
        <Modal
          isOpen={Boolean(editingCourse)}
          onClose={() => setEditingCourse(null)}
          title={`Edit Course: ${editingCourse.title}`}
          size="lg"
        >
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <Input
              label="Course Title"
              value={editingCourse.title}
              onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
              required
            />

            <Input
              label="Course Subtitle"
              value={editingCourse.subtitle || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category Domain
                </label>
                <Select
                  value={editingCourse.category}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                  options={[
                    { value: 'Data Structures & Algorithms', label: 'Data Structures & Algorithms' },
                    { value: 'System Design', label: 'System Design' },
                    { value: 'Fullstack Web Development', label: 'Fullstack Web' },
                    { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
                    { value: 'Python', label: 'Python Programming' },
                    { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
                    { value: 'Cybersecurity', label: 'Cybersecurity' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Difficulty Level
                </label>
                <Select
                  value={editingCourse.difficulty}
                  onChange={(e) => setEditingCourse({ ...editingCourse, difficulty: e.target.value })}
                  options={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Course Status
                </label>
                <Select
                  value={editingCourse.status || 'active'}
                  onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                  options={[
                    { value: 'active', label: 'Active (Live)' },
                    { value: 'inactive', label: 'Inactive (Unlisted)' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Instructor Name"
                value={editingCourse.instructor?.name || ''}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    instructor: { ...editingCourse.instructor, name: e.target.value },
                  })
                }
              />
              <Input
                label="Estimated Hours"
                type="number"
                value={editingCourse.estimatedHours || 20}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, estimatedHours: Number(e.target.value) })
                }
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="md" type="button" onClick={() => setEditingCourse(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. VIEW COURSE DETAILS MODAL */}
      {viewingCourse && (
        <Modal
          isOpen={Boolean(viewingCourse)}
          onClose={() => setViewingCourse(null)}
          title="Curriculum Details & Modules"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={viewingCourse.thumbnail || getAutoCourseThumbnail(viewingCourse.category, viewingCourse.title)}
                alt={viewingCourse.title}
                className="w-full sm:w-44 aspect-video object-cover rounded-xl border border-slate-200"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">{viewingCourse.category}</Badge>
                  <Badge variant={(viewingCourse.status || 'active') === 'active' ? 'success' : 'danger'} size="sm">
                    {(viewingCourse.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900">{viewingCourse.title}</h3>
                <p className="text-xs text-slate-600">{viewingCourse.subtitle || viewingCourse.description}</p>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  Instructor: <strong>{viewingCourse.instructor?.name || 'Dr. Emily Watson'}</strong> • {viewingCourse.estimatedHours || 20} Hours
                </p>
              </div>
            </div>

            {/* Modules breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Module Syllabus ({viewingCourse.modules?.length || viewingCourse.modulesCount || 4} Modules)
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(viewingCourse.modules && viewingCourse.modules.length > 0) ? (
                  viewingCourse.modules.map((mod, idx) => (
                    <div key={mod.id || idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>{mod.title}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{mod.duration || '2h 15m'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {mod.lessons?.length || 3} interactive lessons & adaptive diagnostics
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-500">
                    Standard 4-module progressive curriculum with adaptive topic checkpoints.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/courses/${viewingCourse.id}`)}
              >
                Open Student Preview
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const cToEdit = viewingCourse;
                    setViewingCourse(null);
                    setEditingCourse(cToEdit);
                  }}
                >
                  Edit Course
                </Button>
                <Button variant="primary" size="sm" onClick={() => setViewingCourse(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. DELETE COURSE CONFIRMATION MODAL */}
      {deletingCourse && (
        <Modal
          isOpen={Boolean(deletingCourse)}
          onClose={() => setDeletingCourse(null)}
          title="Confirm Course Deletion"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
              <p className="text-xs">
                Are you sure you want to permanently delete <strong>{deletingCourse.title}</strong>? All associated enrollment records and analytics will be removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeletingCourse(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteCourse}>
                Delete Course
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
