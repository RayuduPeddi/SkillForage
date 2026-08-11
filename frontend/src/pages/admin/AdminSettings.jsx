import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../hooks/useToast';
import { Shield } from 'lucide-react';

export function AdminSettings() {
  const { success: toastSuccess } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    toastSuccess('System Parameters Saved', 'Global platform parameters have been updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Platform Global Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500">Configure default adaptive thresholds and platform parameters.</p>
      </div>

      <Card className="border-slate-200 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            <CardTitle>Adaptive Engine Parameters</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Mastery Threshold Percentage (Default 80%)"
              type="number"
              defaultValue={80}
            />

            <Input
              label="Revision Needed Trigger Percentage (Default < 60%)"
              type="number"
              defaultValue={60}
            />

            <Select
              label="AI Recommendation Algorithm Engine"
              defaultValue="exponential-moving-average"
              options={[
                { value: 'exponential-moving-average', label: 'Exponential Moving Average (Recency-Weighted)' },
                { value: 'bayesian-knowledge-tracing', label: 'Bayesian Knowledge Tracing (Academic CS)' },
                { value: 'spaced-repetition-ebbinghaus', label: 'Spaced Repetition (Ebbinghaus Decay Curve)' },
              ]}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md">
                Save Platform Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
