import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatNumber } from '../../../shared/components/StatNumber';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { HandDrawnGauge } from './HandDrawnGauge';
import { WasteHeatmap } from './WasteHeatmap';
import { VoiceLogCard } from '../../donations/components/VoiceLogCard';
import { dashboardApi } from '../api/dashboardApi';

export const DashboardView: React.FC = () => {
  const { unitType, toggleUnit, data, loading, toggleCount } = useDashboardData('kitchen');
  const [recStatus, setRecStatus] = useState<'pending' | 'accepted' | 'overridden'>('pending');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleUpdateRec = async (status: 'accepted' | 'overridden') => {
    setRecStatus(status);
    await dashboardApi.updateRecommendationStatus('campus-dining-1', status);
    setFeedbackMessage(
      status === 'accepted'
        ? '✓ Recommendation accepted — Written to DynamoDB.'
        : '✕ Recommendation overridden — Logged to DynamoDB.'
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  if (loading || !data) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-20 flex justify-center items-center">
        <div className="text-forest font-dmsans text-sm opacity-60 animate-pulse">
          Loading telemetry data...
        </div>
      </div>
    );
  }

  const { stats, recommendation, heatmap, reportCard } = data;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col gap-10 bg-surface">
      {/* Top Header & Pill Toggle Switch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-outline-variant/40 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-forest/70 font-semibold mb-1 block font-dmsans">
            Operational Telemetry · {data.unitName}
          </span>
          <h1 className="font-fraunces text-3xl md:text-4xl text-forest font-normal">
            Operational Intelligence Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Unit Toggle Pill */}
          <div className="inline-flex p-1 bg-surface-container-high rounded-full border border-outline-variant/40">
            <button
              onClick={() => toggleUnit('kitchen')}
              className={`text-xs font-dmsans font-semibold px-4 py-2 rounded-full transition-all duration-150 ${
                unitType === 'kitchen'
                  ? 'bg-forest text-bone shadow-none'
                  : 'text-on-surface-variant hover:text-forest'
              }`}
            >
              Institutional Kitchen
            </button>
            <button
              onClick={() => toggleUnit('processing-unit')}
              className={`text-xs font-dmsans font-semibold px-4 py-2 rounded-full transition-all duration-150 ${
                unitType === 'processing-unit'
                  ? 'bg-forest text-bone shadow-none'
                  : 'text-on-surface-variant hover:text-forest'
              }`}
            >
              Processing Unit
            </button>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="w-full p-4 rounded-xl bg-forest text-bone text-xs font-dmsans font-semibold flex items-center justify-between transition-all duration-300">
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-bone/80 hover:text-bone text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-forest/70 font-semibold block mb-2 font-dmsans">
              {stats.loggedPrep.label}
            </span>
            <div className="font-fraunces text-4xl text-forest font-normal my-2">
              <StatNumber
                key={`loggedPrep-${toggleCount}`}
                value={stats.loggedPrep.value}
                suffix={stats.loggedPrep.suffix}
                decimals={stats.loggedPrep.decimals}
              />
            </div>
          </div>
          <span className="text-xs text-on-surface-variant font-dmsans mt-2">
            {stats.loggedPrep.subtext}
          </span>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-forest/70 font-semibold block mb-2 font-dmsans">
              {stats.varianceRate.label}
            </span>
            <div className="font-fraunces text-4xl text-forest font-normal my-2">
              <StatNumber
                key={`varianceRate-${toggleCount}`}
                value={stats.varianceRate.value}
                suffix={stats.varianceRate.suffix}
                decimals={stats.varianceRate.decimals}
              />
            </div>
          </div>
          <span className="text-xs text-on-surface-variant font-dmsans mt-2">
            {stats.varianceRate.subtext}
          </span>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-forest/70 font-semibold block mb-2 font-dmsans">
              {stats.surplusDiverted.label}
            </span>
            <div className="font-fraunces text-4xl text-forest font-normal my-2">
              <StatNumber
                key={`surplusDiverted-${toggleCount}`}
                value={stats.surplusDiverted.value}
                suffix={stats.surplusDiverted.suffix}
                decimals={stats.surplusDiverted.decimals}
              />
            </div>
          </div>
          <span className="text-xs text-on-surface-variant font-dmsans mt-2">
            {stats.surplusDiverted.subtext}
          </span>
        </Card>
      </div>

      {/* Row 2: Recommendation & Voice-to-Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Algorithmic Recommendation */}
        <div className="lg:col-span-7">
          <Card className="border border-outline-variant/30 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <span className="text-xs uppercase tracking-widest text-lime font-bold font-dmsans">
                Algorithmic Intervention
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {recommendation.confidenceScore}% Confidence
              </span>
            </div>

            <div>
              <h2 className="font-fraunces text-2xl text-forest mb-2">
                {recommendation.title}
              </h2>
              <p className="text-xs text-on-surface-variant font-dmsans leading-relaxed">
                {recommendation.description}
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 font-dmsans text-xs">
              <div>
                <span className="text-outline block">Projected Biomass Salvage</span>
                <span className="font-fraunces text-base text-forest font-bold">
                  {recommendation.estimatedSavingsKg} kg
                </span>
              </div>
              <div className="w-px h-8 bg-outline-variant/40" />
              <div>
                <span className="text-outline block">Cost Recovery</span>
                <span className="font-fraunces text-base text-forest font-bold">
                  ₹{recommendation.estimatedSavingsCost}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => handleUpdateRec('accepted')}
                className={`flex-1 text-xs py-3 ${
                  recStatus === 'accepted' ? 'opacity-80' : ''
                }`}
              >
                {recStatus === 'accepted' ? '✓ Accepted & Syncing' : recommendation.actionText}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleUpdateRec('overridden')}
                className="text-xs py-3"
              >
                {recStatus === 'overridden' ? 'Overridden' : 'Override Forecast'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Telemetry Voice/Text Intake Card */}
        <div className="lg:col-span-5">
          <VoiceLogCard facilityId="campus-dining-1" />
        </div>
      </div>

      {/* Row 3: Heatmap & Hand-Drawn Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <Card className="border border-outline-variant/30">
            <WasteHeatmap days={heatmap} />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="border border-outline-variant/30">
            <HandDrawnGauge
              score={reportCard.score}
              grade={reportCard.grade}
              rank={reportCard.efficiencyRank}
              alert={reportCard.primaryAlert}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
