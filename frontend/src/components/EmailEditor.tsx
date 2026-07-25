import React, { useState } from 'react';
import { EmailStep } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { Send, Edit3, Check } from 'lucide-react';

interface EmailEditorProps {
  steps: EmailStep[];
  onSaveStep?: (stepId: string, subject: string, body: string) => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({ steps, onSaveStep }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentStep = steps[activeTab];
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>(currentStep?.subject || '');
  const [body, setBody] = useState<string>(currentStep?.body || '');

  if (!steps || steps.length === 0) {
    return <div className="text-xs text-slate-500 italic p-4">No email steps generated yet.</div>;
  }

  const handleSave = () => {
    if (currentStep && onSaveStep) {
      onSaveStep(currentStep.id, subject, body);
    }
    setIsEditing(false);
  };

  return (
    <Card title="Multi-Touch Cold Email Sequence" subtitle="Review and fine-tune signal-personalized email templates">
      <div className="flex border-b border-slate-800 mb-4 space-x-2">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => {
              setActiveTab(idx);
              setSubject(steps[idx].subject);
              setBody(steps[idx].body);
              setIsEditing(false);
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition ${
              activeTab === idx
                ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Step {step.step_number}: {step.step_name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Subject Line</label>
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          ) : (
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 font-medium text-sm text-indigo-200">
              {currentStep.subject}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Email Body</label>
          {isEditing ? (
            <textarea
              rows={8}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          ) : (
            <div className="p-4 bg-slate-950/90 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {currentStep.body}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <Button size="sm" onClick={handleSave} leftIcon={<Check className="w-3.5 h-3.5" />}>
              Save Sequence Changes
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
              Edit Email Draft
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
