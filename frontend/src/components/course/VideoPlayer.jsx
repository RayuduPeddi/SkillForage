import React, { useState } from 'react';
import { getYouTubeEmbedUrl, extractYouTubePlaylistId, extractYouTubeId } from '../../services/youtubeService';
import { Play, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { YoutubeIcon } from '../ui/Icons';

export function VideoPlayer({ videoUrl, title, onEnded }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const isPlaylist = Boolean(extractYouTubePlaylistId(videoUrl));
  const videoId = extractYouTubeId(videoUrl);

  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-card border border-slate-800 group">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title || 'Course Lesson Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center bg-slate-900">
            <div className="w-12 h-12 rounded-full bg-brand-600/20 text-brand-400 flex items-center justify-center mb-3">
              <Play className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200 mb-1">Adaptive Interactive Lecture</p>
            <p className="text-xs text-slate-400 max-w-sm">
              {videoUrl || 'Video stream ready for adaptive learning drills.'}
            </p>
          </div>
        )}
      </div>

      {/* Video Footer Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <YoutubeIcon className="w-3.5 h-3.5 text-rose-600" />
            {isPlaylist ? 'YouTube Playlist Course Stream' : 'YouTube Video Lesson'}
          </span>
          {videoId && (
            <span className="text-[11px] font-mono text-slate-400">
              ID: {videoId}
            </span>
          )}
        </div>

        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium transition-colors"
          >
            <span>Open in YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
