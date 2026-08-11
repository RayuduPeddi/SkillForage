import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export function MasteryRadarChart({ data = [], height = 280 }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">No skill radar data</div>;
  }

  const radarData = data.map((d) => ({
    subject: d.topic || d.name,
    accuracy: d.accuracy || 0,
    fullMark: 100,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#CBD5E1" />
          <Radar
            name="Mastery"
            dataKey="accuracy"
            stroke="#2563EB"
            fill="#3B82F6"
            fillOpacity={0.25}
          />
          <Tooltip
            formatter={(val) => [`${val}%`, 'Accuracy']}
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
