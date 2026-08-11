import { delay } from './api';
import { getAutoCourseThumbnail } from '../utils/courseThumbnails';

/**
 * Extracts YouTube Video ID from standard video URLs, short URLs, embeds, and playlist watch links.
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extracts YouTube Playlist ID from playlist URLs or mixed video+playlist URLs.
 */
export function extractYouTubePlaylistId(url) {
  if (!url) return null;
  const regExp = /[?&]list=([^#&?]+)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Generates an optimized, privacy-enhanced YouTube embed URL.
 * Handles both individual videos, playlists, and start timestamps.
 */
export function getYouTubeEmbedUrl(url, { autoplay = false, loop = false } = {}) {
  if (!url) return null;

  const playlistId = extractYouTubePlaylistId(url);
  const videoId = extractYouTubeId(url);

  // If pure playlist URL (without single video)
  if (playlistId && !videoId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  }

  // If video with playlist
  if (videoId && playlistId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?list=${playlistId}&rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
  }

  // If individual video
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
  }

  return null;
}

/**
 * Extracts thumbnail for a YouTube video URL with fallback.
 */
export function getYouTubeThumbnail(url, category = '', title = '') {
  const videoId = extractYouTubeId(url);
  if (!videoId) return getAutoCourseThumbnail(category, title);
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Curated high-quality Educational YouTube Playlists and Courses
 */
export const CURATED_YOUTUBE_PLAYLISTS = [
  {
    id: 'pl_neetcode_dsa',
    title: 'NeetCode Core Data Structures & Algorithms',
    playlistId: 'PLot-Xpze53lf5C3HSjCnyFghlW0G1QgXo',
    channel: 'NeetCode',
    category: 'Data Structures & Algorithms',
    difficulty: 'Intermediate',
    estimatedHours: 24,
    thumbnail: 'https://img.youtube.com/vi/-gjxg6Pln50/hqdefault.jpg',
    description: 'The definitive video roadmap for coding interviews. Covers Arrays, Two-Pointers, Sliding Window, Trees, and Dynamic Programming with visual step-by-step intuition.',
    modules: [
      {
        id: 'mod_arrays_pointers',
        title: 'Module 1: Arrays, Hashing & Two Pointers',
        duration: '3h 10m',
        lessons: [
          { id: 'les_nc_1', title: 'Two Sum - LeetCode 1 - HashMap Technique', duration: '12:30', videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', type: 'video' },
          { id: 'les_nc_2', title: 'Valid Anagram & Frequency Arrays', duration: '08:45', videoUrl: 'https://www.youtube.com/watch?v=9UtInBqnCgA', type: 'video' },
          { id: 'les_nc_3', title: 'Two Pointer Technique Masterclass', duration: '22:15', videoUrl: 'https://www.youtube.com/watch?v=-gjxg6Pln50', type: 'video' },
          { id: 'les_nc_4', title: 'Container With Most Water - Two Pointers', duration: '15:20', videoUrl: 'https://www.youtube.com/watch?v=UuiTKBwPgAo', type: 'video' },
        ],
        quizTitle: 'Diagnostic Quiz: Arrays & Pointers',
        quizQuestions: [
          { question: 'What is the lookup complexity in an ideal Hash Table?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctIndex: 0, topic: 'HashMap' },
          { question: 'When can the Two Pointer technique be applied efficiently on arrays?', options: ['When array is sorted or monotonic', 'Only on empty arrays', 'When elements are random strings', 'Never in O(N) time'], correctIndex: 0, topic: 'Two Pointer' },
        ],
      },
      {
        id: 'mod_prefix_sliding',
        title: 'Module 2: Prefix Sum & Sliding Window Mastery',
        duration: '4h 15m',
        lessons: [
          { id: 'les_nc_5', title: 'Prefix Sum Array & Range Sum Queries Explained', duration: '14:20', videoUrl: 'https://www.youtube.com/watch?v=pVS3yhlzrlQ', type: 'video' },
          { id: 'les_nc_6', title: 'Subarray Sum Equals K - Prefix + HashMap', duration: '16:40', videoUrl: 'https://www.youtube.com/watch?v=fFVZt-6sgyo', type: 'video' },
          { id: 'les_nc_7', title: 'Longest Substring Without Repeating Characters', duration: '20:10', videoUrl: 'https://www.youtube.com/watch?v=wiGpQwVHdE0', type: 'video' },
        ],
        quizTitle: 'Diagnostic Quiz: Subarrays & Sliding Window',
        quizQuestions: [
          { question: 'What is the time complexity to query sum(L...R) after building a prefix array?', options: ['O(1)', 'O(R-L)', 'O(N)', 'O(log N)'], correctIndex: 0, topic: 'Prefix Sum' },
          { question: 'Why does standard sliding window fail when array contains negative numbers?', options: ['Monotonicity of window sum is broken', 'Memory buffer overflows', 'Window size becomes negative', 'Prefix sums cannot be computed'], correctIndex: 0, topic: 'Sliding Window' },
        ],
      },
      {
        id: 'mod_trees_graphs',
        title: 'Module 3: Trees, Binary Search & Recursion',
        duration: '5h 00m',
        lessons: [
          { id: 'les_nc_8', title: 'Binary Search Algorithm & Search in Rotated Array', duration: '18:50', videoUrl: 'https://www.youtube.com/watch?v=U8XENwh8Oy8', type: 'video' },
          { id: 'les_nc_9', title: 'Maximum Depth of Binary Tree & DFS Invariants', duration: '14:00', videoUrl: 'https://www.youtube.com/watch?v=hTM3phJS6GE', type: 'video' },
          { id: 'les_nc_10', title: 'Invert Binary Tree & Recursive Proofs', duration: '10:15', videoUrl: 'https://www.youtube.com/watch?v=OnSn2XEQ4MY', type: 'video' },
        ],
        quizTitle: 'Diagnostic Quiz: Trees & Search',
        quizQuestions: [
          { question: 'What is the worst-case time complexity of Binary Search on N elements?', options: ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'], correctIndex: 0, topic: 'Binary Search' },
        ],
      },
    ],
  },
  {
    id: 'pl_fcc_fullstack',
    title: 'freeCodeCamp Full Stack Web Development Blueprint',
    playlistId: 'PLWKjhJtqVAbnupwRFOq9zGOWjdvYtCmE7',
    channel: 'freeCodeCamp.org',
    category: 'Fullstack Web Development',
    difficulty: 'Beginner',
    estimatedHours: 32,
    thumbnail: 'https://img.youtube.com/vi/7u2Krb9ZqNk/hqdefault.jpg',
    description: 'End-to-end full stack development: React 19, Node.js, Express, RESTful APIs, JWT Authentication, and PostgreSQL database modeling.',
    modules: [
      {
        id: 'mod_fcc_react',
        title: 'Module 1: Modern React 19 Architecture & State',
        duration: '6h 30m',
        lessons: [
          { id: 'les_fcc_1', title: 'React Core Principles, Components & Virtual DOM', duration: '45:00', videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'video' },
          { id: 'les_fcc_2', title: 'Hooks Deep Dive: useState, useEffect, useMemo', duration: '38:20', videoUrl: 'https://www.youtube.com/watch?v=TNhaISOUy6Q', type: 'video' },
          { id: 'les_fcc_3', title: 'Redux Toolkit & Global State Management', duration: '42:15', videoUrl: 'https://www.youtube.com/watch?v=9zySeP5vH9c', type: 'video' },
        ],
        quizTitle: 'React & State Management Quiz',
        quizQuestions: [
          { question: 'What triggers a React component re-render?', options: ['State change or props change', 'DOM click only', 'CSS class modification', 'HTTP request arrival only'], correctIndex: 0, topic: 'React Architecture' },
        ],
      },
      {
        id: 'mod_fcc_backend',
        title: 'Module 2: Node.js, Express & REST API Design',
        duration: '5h 45m',
        lessons: [
          { id: 'les_fcc_4', title: 'Node.js Event Loop & Non-Blocking I/O', duration: '35:00', videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE', type: 'video' },
          { id: 'les_fcc_5', title: 'Building Secure REST APIs with Express & JWT', duration: '50:10', videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4', type: 'video' },
        ],
        quizTitle: 'Backend & Authentication Diagnostic',
        quizQuestions: [
          { question: 'Where should sensitive JWT secrets be stored?', options: ['Environment variables (.env)', 'Frontend React state', 'URL query parameters', 'Local browser storage unencrypted'], correctIndex: 0, topic: 'Security & Auth' },
        ],
      },
    ],
  },
  {
    id: 'pl_cs50_fundamentals',
    title: 'Harvard CS50: Computer Science & Systems Foundation',
    playlistId: 'PLhQjrBD2T382_R183lS219808sP8n806t',
    channel: 'CS50',
    category: 'Computer Science',
    difficulty: 'Beginner',
    estimatedHours: 30,
    thumbnail: 'https://img.youtube.com/vi/shs0KM3wKv8/hqdefault.jpg',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming: memory management, algorithms, data structures, and web development.',
    modules: [
      {
        id: 'mod_cs50_c',
        title: 'Module 1: Computational Thinking & Memory Architecture',
        duration: '4h 20m',
        lessons: [
          { id: 'les_cs50_1', title: 'Memory, Pointers & Array Storage in RAM', duration: '52:00', videoUrl: 'https://www.youtube.com/watch?v=shs0KM3wKv8', type: 'video' },
          { id: 'les_cs50_2', title: 'Sorting Algorithms: Merge Sort vs Quick Sort', duration: '48:30', videoUrl: 'https://www.youtube.com/watch?v=7u2Krb9ZqNk', type: 'video' },
        ],
        quizTitle: 'Diagnostic Quiz: Memory & Sorting',
        quizQuestions: [
          { question: 'What is the asymptotic time complexity of Merge Sort in all cases?', options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'], correctIndex: 0, topic: 'Sorting' },
        ],
      },
    ],
  },
  {
    id: 'pl_ml_andrew_ng',
    title: 'Machine Learning Engineering & LLM Architecture',
    playlistId: 'PLoROMvodv4rMiGQp3WXShtMGjnqpfkyfb',
    channel: 'Stanford Online',
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    estimatedHours: 28,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    description: 'Learn neural networks, gradient descent optimization, attention mechanisms, transformers, and prompt evaluation for real-world AI systems.',
    modules: [
      {
        id: 'mod_ml_nn',
        title: 'Module 1: Neural Networks & Backpropagation',
        duration: '5h 15m',
        lessons: [
          { id: 'les_ml_1', title: 'Gradient Descent & Cost Functions Explained', duration: '42:00', videoUrl: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', type: 'video' },
          { id: 'les_ml_2', title: 'Self-Attention & Transformer Architecture', duration: '48:10', videoUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', type: 'video' },
        ],
        quizTitle: 'Diagnostic Quiz: Transformers & Neural Nets',
        quizQuestions: [
          { question: 'What is the main computational advantage of Self-Attention over RNNs?', options: ['Parallelization across token positions', 'Zero memory consumption', 'No need for weights', 'Operates in O(1) time'], correctIndex: 0, topic: 'Transformers' },
        ],
      },
    ],
  },
];

export const youtubeService = {
  /**
   * Search for educational YouTube videos
   */
  async searchVideos(query) {
    await delay(250);
    const results = [
      {
        id: 'pVS3yhlzrlQ',
        title: 'Prefix Sum Array & Range Sum Queries Explained',
        channel: 'Algorithms Made Easy',
        duration: '14:20',
        thumbnail: 'https://img.youtube.com/vi/pVS3yhlzrlQ/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=pVS3yhlzrlQ',
      },
      {
        id: '7u2Krb9ZqNk',
        title: 'Arrays Data Structure & Memory Allocation',
        channel: 'freeCodeCamp.org',
        duration: '18:50',
        thumbnail: 'https://img.youtube.com/vi/7u2Krb9ZqNk/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=7u2Krb9ZqNk',
      },
      {
        id: '-gjxg6Pln50',
        title: 'Two Pointer Technique Masterclass',
        channel: 'NeetCode',
        duration: '22:15',
        thumbnail: 'https://img.youtube.com/vi/-gjxg6Pln50/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=-gjxg6Pln50',
      },
      {
        id: 'shs0KM3wKv8',
        title: 'Hash Tables & Hash Maps - Computer Science Core',
        channel: 'CS50',
        duration: '20:10',
        thumbnail: 'https://img.youtube.com/vi/shs0KM3wKv8/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=shs0KM3wKv8',
      },
      {
        id: 'wiGpQwVHdE0',
        title: 'Sliding Window Algorithm Technique & Patterns',
        channel: 'NeetCode',
        duration: '26:30',
        thumbnail: 'https://img.youtube.com/vi/wiGpQwVHdE0/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
      },
      {
        id: 'kCc8FmEb1nY',
        title: 'Attention Is All You Need - Transformer Deep Dive',
        channel: 'Yannic Kilcher',
        duration: '38:15',
        thumbnail: 'https://img.youtube.com/vi/kCc8FmEb1nY/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
      },
    ];

    if (!query) return results;
    const q = query.toLowerCase();
    return results.filter((r) => r.title.toLowerCase().includes(q) || r.channel.toLowerCase().includes(q));
  },

  /**
   * Get all curated YouTube playlists for instant 1-click course creation
   */
  async getCuratedPlaylists() {
    await delay(150);
    return CURATED_YOUTUBE_PLAYLISTS;
  },

  /**
   * Parse any YouTube Playlist URL or ID and convert it into a complete structured course
   */
  async parseAndImportPlaylist(playlistUrlOrId, customMetadata = {}) {
    await delay(400);
    const playlistId = extractYouTubePlaylistId(playlistUrlOrId) || playlistUrlOrId;

    // Check if it matches a known curated playlist
    const matchedCurated = CURATED_YOUTUBE_PLAYLISTS.find(
      (p) => p.playlistId === playlistId || p.id === playlistId
    );

    if (matchedCurated) {
      return {
        ...matchedCurated,
        ...customMetadata,
        isYouTubeCourse: true,
        sourceType: 'youtube_playlist',
      };
    }

    // Otherwise, generate a structured course from the custom playlist URL
    const cleanId = playlistId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'custom_playlist';
    const courseTitle = customMetadata.title || `YouTube Playlist Course: ${cleanId}`;

    return {
      id: `yt_course_${Date.now()}`,
      title: courseTitle,
      subtitle: customMetadata.subtitle || 'Structured video course created with interactive lessons and adaptive diagnostics.',
      category: customMetadata.category || 'Data Structures & Algorithms',
      difficulty: customMetadata.difficulty || 'Intermediate',
      estimatedHours: customMetadata.estimatedHours || 18,
      thumbnail: getYouTubeThumbnail(playlistUrlOrId, customMetadata.category, courseTitle),
      description: customMetadata.description || `A comprehensive video curriculum integrated with SkillForage's adaptive learning engine. Complete each video lesson, take auto-generated diagnostic quizzes, and track your topic mastery.`,
      sourceType: 'youtube_playlist',
      playlistUrl: playlistUrlOrId,
      modules: [
        {
          id: `mod_yt_1_${Date.now()}`,
          title: 'Module 1: Video Lessons & Core Concepts',
          duration: '3h 30m',
          lessons: [
            {
              id: `les_yt_1_${Date.now()}`,
              title: 'Lesson 1: Introduction & Foundational Overview',
              duration: '18:00',
              videoUrl: playlistUrlOrId.includes('watch?v=') ? playlistUrlOrId : 'https://www.youtube.com/watch?v=pVS3yhlzrlQ',
              type: 'video',
            },
            {
              id: `les_yt_2_${Date.now()}`,
              title: 'Lesson 2: Core Algorithmic Techniques',
              duration: '22:30',
              videoUrl: 'https://www.youtube.com/watch?v=-gjxg6Pln50',
              type: 'video',
            },
            {
              id: `quiz_yt_1_${Date.now()}`,
              title: 'Diagnostic Quiz: Module 1 Checkpoint',
              duration: '15:00',
              type: 'quiz',
              quizId: 'quiz-prefix-sum',
            },
          ],
        },
        {
          id: `mod_yt_2_${Date.now()}`,
          title: 'Module 2: Advanced Implementations & Problem Solving',
          duration: '4h 15m',
          lessons: [
            {
              id: `les_yt_3_${Date.now()}`,
              title: 'Lesson 3: Deep Dive & Edge Cases',
              duration: '25:00',
              videoUrl: 'https://www.youtube.com/watch?v=shs0KM3wKv8',
              type: 'video',
            },
            {
              id: `les_yt_4_${Date.now()}`,
              title: 'Lesson 4: Complexity Analysis & Optimization',
              duration: '28:15',
              videoUrl: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
              type: 'video',
            },
          ],
        },
      ],
      quizTitle: `Diagnostic Quiz for ${courseTitle}`,
      quizQuestions: [
        {
          question: 'What is the primary optimization goal demonstrated in this playlist course?',
          options: ['Minimizing asymptotic time and space complexity', 'Increasing code size without verification', 'Ignoring edge cases', 'Using brute force in all queries'],
          correctIndex: 0,
          topic: customMetadata.category || 'Algorithmic Optimization',
        },
        {
          question: 'How does adaptive learning assist your retention during video courses?',
          options: ['By providing real-time diagnostic checks and reinforcing weak concepts', 'By skipping all exercises', 'By preventing you from asking questions', 'By disabling code practice'],
          correctIndex: 0,
          topic: 'Adaptive Learning',
        },
      ],
    };
  },
};
