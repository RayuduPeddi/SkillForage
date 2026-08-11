import React, { useState, useEffect } from 'react';
import { CourseFilters } from '../../components/course/CourseFilters';
import { CourseCard } from '../../components/course/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import { BookOpen } from 'lucide-react';

export function ExploreCourses() {
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector((state) => state.courses);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    dispatch(fetchCourses({ search, category, difficulty, sortBy }));
  }, [dispatch, search, category, difficulty, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Explore Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse structured courses with interactive video lectures & adaptive auto-adjusting topic modules.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <CourseFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No courses match your filters"
          description="Try clearing search keywords or switching category filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setCategory('all');
            setDifficulty('all');
          }}
        />
      )}
    </div>
  );
}

