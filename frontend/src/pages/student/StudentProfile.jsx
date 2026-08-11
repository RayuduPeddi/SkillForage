import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { User, Mail, Award, Flame, Target, Calendar, Save, Check } from 'lucide-react';

export function StudentProfile() {
  const { user } = useAuth();
  const { success: toastSuccess } = useToast();

  const [name, setName] = useState(user?.name || 'Rayudu V.');
  const [headline, setHeadline] = useState(user?.headline || 'Aspiring Software Engineer');
  const [goal, setGoal] = useState(user?.learningGoal || 'Software Engineer Interview Prep');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    toastSuccess('Profile Saved', 'Your profile details have been updated.');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <Avatar name={user?.name || 'Rayudu V.'} size="xl" />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-900">{user?.name || 'Rayudu V.'}</h1>
            <Badge variant="primary" size="sm">
              Student Scholar
            </Badge>
          </div>
          <p className="text-xs text-slate-500">{user?.email || 'rayudu@skillforage.edu'}</p>
          <p className="text-xs text-slate-700 font-medium">{user?.headline || 'Aspiring Software Engineer'}</p>
        </div>

        <div className="flex sm:flex-col gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-semibold text-amber-700 uppercase">Streak</span>
            <p className="text-base font-mono font-bold text-amber-800">{user?.streak || 14} Days</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="border-slate-200 shadow-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={User}
              />
              <Input
                label="Email Address"
                value={user?.email || 'rayudu@skillforage.edu'}
                disabled
                leftIcon={Mail}
              />
            </div>

            <Input
              label="Professional Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <Input
              label="Current Learning Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              leftIcon={Target}
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={isSaved ? Check : Save}
              >
                {isSaved ? 'Saved Successfully' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
