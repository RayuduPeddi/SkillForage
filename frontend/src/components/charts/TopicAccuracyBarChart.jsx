import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

export function TopicAccuracyBarChart({ data = [], height = 280 }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">No topic data available</div>;
  }

  const getBarColor = (accuracy) => {
    if (accuracy >= 80) return '#10B981'; // Emerald (Mastered)
    if (accuracy >= 60) return '#F59E0B'; // Amber (Needs Practice)
    return '#EF4444'; // Rose (Needs Revision)
  };

  const formattedData = data.map((d) => ({
    name: d.topic || d.name,
    accuracy: d.accuracy !== undefined ? d.accuracy : d.score || 0,
    status: d.status || (d.accuracy >= 80 ? 'Mastered' : d.accuracy >= 60 ? 'Needs Practice' : 'Needs Revision'),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg border border-slate-700">
          <p className="font-semibold">{item.name}</p>
          <p className="text-slate-300 mt-0.5">
            Accuracy: <span className="font-mono font-bold text-white">{item.accuracy}%</span>
          </p>
          <p className="text-slate-400 text-[10px] mt-0.5">Status: {item.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748B' }}
            interval={0}
            angle={-25}
            textAnchor="end"
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.accuracy)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
