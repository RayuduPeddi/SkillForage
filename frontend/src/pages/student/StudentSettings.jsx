import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../hooks/useToast';
import { Settings, Bell, Shield, Sliders } from 'lucide-react';

export function StudentSettings() {
  const { success: toastSuccess } = useToast();
  const [dailyGoal, setDailyGoal] = useState('45');
  const [digestEmail, setDigestEmail] = useState(true);
  const [adaptiveRecs, setAdaptiveRecs] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toastSuccess('Settings Saved', 'Your learning preferences have been updated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Settings & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-500">Configure your study cadence and adaptive AI notifications.</p>
      </div>

      <Card className="border-slate-200 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <CardTitle>Adaptive Learning Cadence</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <Select
              label="Daily Study Goal"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              options={[
                { value: '20', label: '20 minutes / day (Light)' },
                { value: '45', label: '45 minutes / day (Moderate - Recommended)' },
                { value: '90', label: '90 minutes / day (Intensive)' },
              ]}
              helperText="The adaptive engine calibrates problem drill sizes according to this goal."
            />

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Automated AI Notifications
              </h4>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveRecs}
                  onChange={(e) => setAdaptiveRecs(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">Dynamic Weak Topic Alerts</span>
                  <p className="text-[11px] text-slate-500">
                    Receive suggestions when topic accuracy dips below 60% after diagnostic quizzes.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={digestEmail}
                  onChange={(e) => setDigestEmail(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">Weekly Progress Digest</span>
                  <p className="text-[11px] text-slate-500">
                    Receive a summary of hours learned, problems solved, and streak milestones.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md">
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
