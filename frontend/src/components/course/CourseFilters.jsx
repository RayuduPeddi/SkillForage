import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TOPIC_CATEGORIES } from '../../constants/topics';

export function CourseFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  sortBy,
  onSortByChange,
}) {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...Object.values(TOPIC_CATEGORIES).map((c) => ({ value: c, label: c })),
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Shortest Duration' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <Input
          placeholder="Search courses, instructors..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={Search}
        />

        {/* Category */}
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
        />

        {/* Difficulty */}
        <Select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          options={difficultyOptions}
        />

        {/* Sort */}
        <Select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          options={sortOptions}
        />
      </div>
    </div>
  );
}
