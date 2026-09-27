import React, { useState } from 'react';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { useWasteLogger } from '../hooks/useWasteLogger';

export const VoiceLogCard: React.FC<{ facilityId?: string }> = ({ facilityId = 'campus-dining-1' }) => {
  const [voiceText, setVoiceText] = useState('5kg rice');
  const [feedback, setFeedback] = useState<string | null>(null);
  const { logs, isLogging, logWaste } = useWasteLogger(facilityId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceText.trim()) return;

    const newLog = await logWaste(voiceText);
    if (newLog) {
      setVoiceText('');
      setFeedback(`✓ Logged ${newLog.quantityKg}kg of ${newLog.itemName} to DynamoDB.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <Card className="bg-surface-container border border-outline-variant/30 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-forest/70 font-semibold block font-dmsans">
            AWS Telemetry Intake
          </span>
          <h3 className="font-fraunces text-xl text-forest font-normal">
            WhatsApp Voice-to-Text Parser
          </h3>
        </div>
      </div>

      <p className="text-xs text-on-surface-variant font-dmsans leading-relaxed">
        Simulates inbound WhatsApp audio messages transcribed into natural text strings (e.g. &apos;12kg cooked lentils&apos;).
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          placeholder="e.g. 5kg rice or 8.5 kg potatoes"
          className="flex-1 bg-surface border border-outline-variant/50 rounded-full px-4 py-2 text-sm text-forest placeholder:text-outline focus:outline-none focus:border-forest font-dmsans"
        />
        <Button
          type="submit"
          variant="primary"
          className="text-xs px-5 py-2.5 font-bold"
          disabled={isLogging}
        >
          {isLogging ? 'Processing...' : 'Parse & Log →'}
        </Button>
      </form>

      {feedback && (
        <div className="text-xs text-lime font-dmsans font-semibold animate-pulse">
          {feedback}
        </div>
      )}

      {logs.length > 0 && (
        <div className="pt-2 border-t border-outline-variant/30">
          <span className="text-[11px] uppercase tracking-wider text-outline block mb-2 font-semibold">
            Recent Telemetry Stream ({logs.length})
          </span>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center text-xs py-1 px-2 rounded bg-surface/60 border border-outline-variant/20 font-dmsans"
              >
                <span className="text-forest font-medium">{log.itemName}</span>
                <span className="font-mono text-on-surface-variant">{log.quantityKg} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
