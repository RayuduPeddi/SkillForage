import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { VideoPlayer } from '../../components/course/VideoPlayer';
import {
  youtubeService,
  extractYouTubeId,
  extractYouTubePlaylistId,
  CURATED_YOUTUBE_PLAYLISTS,
} from '../../services/youtubeService';
import { instructorService } from '../../services/instructorService';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Trash2,
  Video,
  CheckCircle2,
  Search,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  Play,
  Lightbulb,
} from 'lucide-react';
import { YoutubeIcon } from '../../components/ui/Icons';
import { ROUTES } from '../../constants/routes';

export function CourseBuilder() {
  const navigate = useNavigate();
  const { success: toastSuccess, info: toastInfo } = useToast();

  const [activeStep, setActiveStep] = useState(1); // 1: Details, 2: Curriculum & Videos, 3: Quiz Assessment, 4: Publish
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc13c749b5c?w=600&auto=format&fit=crop&q=80',
    description: '',
    sourceType: 'manual', // 'manual' | 'youtube_playlist'
    playlistUrl: '',
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: Foundations & Core Concepts',
        duration: '2h 30m',
        lessons: [
          {
            id: 'les_1',
            title: 'Introduction & Invariant Theory',
            duration: '15:00',
            videoUrl: 'https://www.youtube.com/watch?v=pVS3yhlzrlQ',
            type: 'video',
          },
        ],
      },
    ],
    quizTitle: 'Diagnostic Quiz: Topic Fundamentals',
    quizQuestions: [
      {
        question: 'What is the time complexity of 1D prefix sum queries?',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
        correctIndex: 0,
        topic: 'Prefix Sum',
      },
    ],
  });

  // YouTube Playlist Importer State
  const [playlistInputUrl, setPlaylistInputUrl] = useState('');
  const [isImportingPlaylist, setIsImportingPlaylist] = useState(false);

  // YouTube Video Search Dialog State
  const [ytQuery, setYtQuery] = useState('');
  const [ytResults, setYtResults] = useState([]);
  const [isSearchingYt, setIsSearchingYt] = useState(false);
  const [selectedLessonForYt, setSelectedLessonForYt] = useState(null);

  const handleImportPlaylist = async (urlToImport) => {
    const url = urlToImport || playlistInputUrl;
    if (!url.trim()) return;

    setIsImportingPlaylist(true);
    try {
      const parsedCourse = await youtubeService.parseAndImportPlaylist(url, {
        category: courseData.category,
      });

      setCourseData({
        ...courseData,
        title: parsedCourse.title,
        subtitle: parsedCourse.subtitle,
        category: parsedCourse.category || courseData.category,
        difficulty: parsedCourse.difficulty || courseData.difficulty,
        estimatedHours: parsedCourse.estimatedHours || 18,
        thumbnail: parsedCourse.thumbnail || courseData.thumbnail,
        description: parsedCourse.description || courseData.description,
        sourceType: 'youtube_playlist',
        playlistUrl: url,
        modules: parsedCourse.modules || courseData.modules,
        quizTitle: parsedCourse.quizTitle || 'Diagnostic Assessment',
        quizQuestions: parsedCourse.quizQuestions || courseData.quizQuestions,
      });

      toastSuccess(
        'YouTube Course Generated!',
        `Successfully imported ${parsedCourse.modules?.length || 0} modules with video lessons and adaptive quiz.`
      );
      setActiveStep(2); // Jump straight to curriculum view
    } catch (err) {
      toastInfo('Import note', 'Using default educational playlist template.');
    } finally {
      setIsImportingPlaylist(false);
    }
  };

  const handleSearchYouTube = async (e) => {
    e.preventDefault();
    setIsSearchingYt(true);
    const results = await youtubeService.searchVideos(ytQuery);
    setYtResults(results);
    setIsSearchingYt(false);
  };

  const handleAddModule = () => {
    const newMod = {
      id: `mod_${Date.now()}`,
      title: `Module ${courseData.modules.length + 1}: Advanced Concepts`,
      duration: '1h 45m',
      lessons: [],
    };
    setCourseData({ ...courseData, modules: [...courseData.modules, newMod] });
  };

  const handleRemoveModule = (modIdx) => {
    const updated = courseData.modules.filter((_, idx) => idx !== modIdx);
    setCourseData({ ...courseData, modules: updated });
  };

  const handleAddLesson = (moduleIndex) => {
    const newLesson = {
      id: `les_${Date.now()}`,
      title: 'New Video Lecture',
      duration: '18:00',
      videoUrl: 'https://www.youtube.com/watch?v=pVS3yhlzrlQ',
      type: 'video',
    };
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].lessons.push(newLesson);
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const handleRemoveLesson = (modIdx, lesIdx) => {
    const updatedModules = [...courseData.modules];
    updatedModules[modIdx].lessons = updatedModules[modIdx].lessons.filter((_, idx) => idx !== lesIdx);
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const handleAddQuizQuestion = () => {
    const newQ = {
      question: 'New diagnostic assessment question?',
      options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      topic: courseData.category,
    };
    setCourseData({
      ...courseData,
      quizQuestions: [...courseData.quizQuestions, newQ],
    });
  };

  const handlePublish = async () => {
    await instructorService.createCourse({
      ...courseData,
      title: courseData.title || 'Advanced Algorithmic Mastery',
      subtitle: courseData.subtitle || 'Adaptive curriculum built by instructor',
      isYouTubeCourse: Boolean(courseData.playlistUrl || courseData.modules.some((m) => m.lessons?.some((l) => l.videoUrl))),
    });
    toastSuccess('Course Published!', 'Your course is now live and students can enroll.');
    navigate(ROUTES.INSTRUCTOR_COURSES);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              Course Studio
            </Badge>
            <Badge variant="purple" size="sm">
              YouTube & Adaptive Quizzes
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Instructor Course Builder</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Build courses with YouTube videos, imported playlists, and adaptive diagnostic quizzes.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 1, label: '1. Details' },
            { id: 2, label: '2. Modules & Videos' },
            { id: 3, label: '3. Quiz Editor' },
            { id: 4, label: '4. Publish' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeStep === s.id
                  ? 'bg-white text-brand-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Details & YouTube Playlist Quick Import */}
      {activeStep === 1 && (
        <div className="space-y-6">
          {/* YouTube Playlist 1-Click Importer Card */}
          <Card className="border-brand-200 bg-gradient-to-r from-brand-50/70 via-purple-50/30 to-white shadow-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 shadow-xs">
                    <YoutubeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Instant YouTube Playlist Importer
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        1-Click Course Gen
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Paste any YouTube Playlist URL or select a curated educational playlist. We will automatically generate sequential modules, lessons with video embeds, and diagnostic quizzes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Input
                  placeholder="Paste YouTube Playlist URL (e.g. https://www.youtube.com/playlist?list=PL...)"
                  value={playlistInputUrl}
                  onChange={(e) => setPlaylistInputUrl(e.target.value)}
                  className="flex-1 text-xs"
                />
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={Download}
                  isLoading={isImportingPlaylist}
                  onClick={() => handleImportPlaylist()}
                  disabled={!playlistInputUrl.trim()}
                  className="shrink-0"
                >
                  Import Playlist
                </Button>
              </div>

              {/* Curated 1-Click Playlist Templates */}
              <div className="pt-2 border-t border-slate-200/60 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Or Pick a Curated Educational Playlist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {CURATED_YOUTUBE_PLAYLISTS.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => handleImportPlaylist(pl.playlistId)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50/30 text-left transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                            <YoutubeIcon className="w-3 h-3" /> {pl.channel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{pl.estimatedHours}h</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600">
                          {pl.title}
                        </p>
                      </div>
                      <span className="text-[10px] text-brand-600 font-semibold mt-2 group-hover:underline">
                        Import as Course →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standard Course Details Form */}
          <Card className="border-slate-200 shadow-card">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Course Title"
                placeholder="e.g. Graph Algorithms & Shortest Paths"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              />

              <Input
                label="Course Subtitle / Summary"
                placeholder="e.g. Master Dijkstra, BFS, DFS, and topological sort with adaptive exercises."
                value={courseData.subtitle}
                onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Primary Category"
                  value={courseData.category}
                  onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  options={[
                    { value: 'Data Structures & Algorithms', label: 'Data Structures & Algorithms' },
                    { value: 'System Design', label: 'System Design' },
                    { value: 'Fullstack Web Development', label: 'Fullstack Web Development' },
                    { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
                    { value: 'Computer Science', label: 'Computer Science' },
                  ]}
                />

                <Select
                  label="Difficulty Level"
                  value={courseData.difficulty}
                  onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                  options={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                />

                <Input
                  label="Estimated Hours"
                  type="number"
                  value={courseData.estimatedHours}
                  onChange={(e) => setCourseData({ ...courseData, estimatedHours: e.target.value })}
                />
              </div>

              <Textarea
                label="Detailed Course Description"
                rows={3}
                placeholder="Outline what students will master in this course and prerequisite skills required..."
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              />

              <div className="pt-4 flex justify-end">
                <Button variant="primary" size="md" rightIcon={ArrowRight} onClick={() => setActiveStep(2)}>
                  Next: Modules & YouTube Videos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Curriculum & YouTube Video Integration */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Curriculum Modules & Video Integration</h2>
              <p className="text-xs text-slate-500">
                Organize lectures, attach YouTube video links, and review video previews.
              </p>
            </div>
            <Button variant="outline" size="sm" leftIcon={Plus} onClick={handleAddModule}>
              Add Module
            </Button>
          </div>

          {courseData.modules.map((module, modIdx) => (
            <Card key={module.id} className="border-slate-200 shadow-xs space-y-4 p-5">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 font-mono font-bold text-xs flex items-center justify-center">
                    {modIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => {
                      const updated = [...courseData.modules];
                      updated[modIdx].title = e.target.value;
                      setCourseData({ ...courseData, modules: updated });
                    }}
                    className="font-bold text-sm text-slate-900 border-b border-transparent focus:border-brand-500 focus:outline-none px-1 flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Plus}
                    onClick={() => handleAddLesson(modIdx)}
                  >
                    Add Lesson
                  </Button>
                  {courseData.modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(modIdx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lessons within module */}
              <div className="space-y-3 pl-2">
                {module.lessons.map((lesson, lesIdx) => (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Video className="w-4 h-4 text-brand-600 shrink-0" />
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => {
                            const updated = [...courseData.modules];
                            updated[modIdx].lessons[lesIdx].title = e.target.value;
                            setCourseData({ ...courseData, modules: updated });
                          }}
                          className="font-semibold text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-brand-500 focus:outline-none w-full"
                          placeholder="Lesson Title"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* YouTube URL input & Search Trigger */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Input
                        placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                        value={lesson.videoUrl}
                        onChange={(e) => {
                          const updated = [...courseData.modules];
                          updated[modIdx].lessons[lesIdx].videoUrl = e.target.value;
                          setCourseData({ ...courseData, modules: updated });
                        }}
                        className="text-xs flex-1"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={Search}
                        onClick={() => {
                          setSelectedLessonForYt({ modIdx, lesIdx });
                          setYtQuery(lesson.title || courseData.category);
                        }}
                        className="shrink-0"
                      >
                        Search YouTube
                      </Button>
                    </div>

                    {/* Embedded preview if URL is present */}
                    {lesson.videoUrl && extractYouTubeId(lesson.videoUrl) && (
                      <div className="max-w-md pt-1">
                        <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* YouTube Video Search Popup Area if active */}
          {selectedLessonForYt && (
            <Card className="border-brand-200 bg-brand-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-brand-600" />
                  YouTube Educational Video Search
                </h3>
                <button
                  onClick={() => setSelectedLessonForYt(null)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSearchYouTube} className="flex gap-2">
                <Input
                  placeholder="Search computer science & algorithm lectures..."
                  value={ytQuery}
                  onChange={(e) => setYtQuery(e.target.value)}
                />
                <Button type="submit" variant="primary" size="md" isLoading={isSearchingYt}>
                  Search
                </Button>
              </form>

              {ytResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {ytResults.map((yt) => (
                    <div
                      key={yt.id}
                      onClick={() => {
                        const { modIdx, lesIdx } = selectedLessonForYt;
                        const updated = [...courseData.modules];
                        updated[modIdx].lessons[lesIdx].videoUrl = yt.url;
                        updated[modIdx].lessons[lesIdx].title = yt.title;
                        setCourseData({ ...courseData, modules: updated });
                        setSelectedLessonForYt(null);
                        toastSuccess('Video Attached', `Added "${yt.title}" to lesson.`);
                      }}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-500 cursor-pointer transition-all flex gap-3 shadow-2xs"
                    >
                      <img src={yt.thumbnail} alt={yt.title} className="w-24 h-16 object-cover rounded-lg" />
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{yt.title}</p>
                        <p className="text-[11px] text-slate-500">{yt.channel}</p>
                        <span className="text-[10px] font-mono text-brand-600 font-semibold">{yt.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="md" leftIcon={ArrowLeft} onClick={() => setActiveStep(1)}>
              Back
            </Button>
            <Button variant="primary" size="md" rightIcon={ArrowRight} onClick={() => setActiveStep(3)}>
              Next: Diagnostic Quiz Editor
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Diagnostic Quiz Editor */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Diagnostic Assessment & Adaptive Quizzes</h2>
              <p className="text-xs text-slate-500">
                These questions power the student's real-time topic mastery and adaptive path recalculation.
              </p>
            </div>
            <Button variant="outline" size="sm" leftIcon={Plus} onClick={handleAddQuizQuestion}>
              Add Question
            </Button>
          </div>

          <Card className="border-slate-200 shadow-card p-6 space-y-6">
            <Input
              label="Quiz Title"
              value={courseData.quizTitle}
              onChange={(e) => setCourseData({ ...courseData, quizTitle: e.target.value })}
            />

            <div className="space-y-4">
              {courseData.quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700">Question {qIdx + 1}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Topic Tag (e.g. Prefix Sum)"
                        value={q.topic}
                        onChange={(e) => {
                          const updated = [...courseData.quizQuestions];
                          updated[qIdx].topic = e.target.value;
                          setCourseData({ ...courseData, quizQuestions: updated });
                        }}
                        className="text-xs w-44"
                      />
                      {courseData.quizQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = courseData.quizQuestions.filter((_, idx) => idx !== qIdx);
                            setCourseData({ ...courseData, quizQuestions: updated });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <Input
                    placeholder="Enter question text..."
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...courseData.quizQuestions];
                      updated[qIdx].question = e.target.value;
                      setCourseData({ ...courseData, quizQuestions: updated });
                    }}
                    className="text-xs font-medium"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctIndex === optIdx}
                          onChange={() => {
                            const updated = [...courseData.quizQuestions];
                            updated[qIdx].correctIndex = optIdx;
                            setCourseData({ ...courseData, quizQuestions: updated });
                          }}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...courseData.quizQuestions];
                            updated[qIdx].options[optIdx] = e.target.value;
                            setCourseData({ ...courseData, quizQuestions: updated });
                          }}
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="md" leftIcon={ArrowLeft} onClick={() => setActiveStep(2)}>
              Back
            </Button>
            <Button variant="primary" size="md" rightIcon={ArrowRight} onClick={() => setActiveStep(4)}>
              Next: Review & Publish
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Publish */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Course Ready for Publication</h2>
                <p className="text-xs text-slate-500">
                  Review the syllabus and diagnostic metrics before launching to students.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-slate-900">{courseData.title || 'Untitled Course'}</h3>
              <p className="text-xs text-slate-600">{courseData.subtitle}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="primary" size="sm">
                  {courseData.category}
                </Badge>
                <Badge variant="purple" size="sm">
                  {courseData.difficulty}
                </Badge>
                <Badge variant="default" size="sm">
                  {courseData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Video Lessons
                </Badge>
                <Badge variant="success" size="sm">
                  {courseData.quizQuestions.length} Adaptive Questions
                </Badge>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" leftIcon={ArrowLeft} onClick={() => setActiveStep(3)}>
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={handlePublish}>
                🚀 Publish Course
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
