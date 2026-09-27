import React, { useEffect, useState } from 'react';
import { MARIGOLD_OCHRE } from '../../../shared/utils/theme';

export interface HandDrawnGaugeProps {
  score: number;
  grade: string;
  rank: string;
  alert: string;
  className?: string;
}

export const HandDrawnGauge: React.FC<HandDrawnGaugeProps> = ({
  score,
  grade,
  rank,
  alert,
  className = '',
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(easeOutProgress * score);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setAnimatedScore(score);
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  const clampedScore = Math.max(0, Math.min(100, animatedScore));

  return (
    <div className={`w-full flex flex-col items-center text-center ${className}`}>
      {/* Score & Grade Display Header */}
      <div className="w-full flex items-baseline justify-between mb-4 px-1">
        <div className="flex items-baseline gap-2">
          <span className="font-fraunces text-4xl font-normal text-forest leading-none">
            {Math.round(clampedScore)}
          </span>
          <span className="text-xs text-on-surface-variant font-dmsans font-medium">/ 100</span>
        </div>
        <span className="font-fraunces text-xl text-forest font-bold">
          Grade {grade}
        </span>
      </div>

      {/* Horizontal Bar (0-100) */}
      <div className="relative w-full h-8 flex items-center mb-6">
        <div className="relative w-full h-3 bg-surface-container-high rounded-full overflow-hidden border border-outline-variant/30">
          <div
            className="h-full bg-forest transition-all duration-300 ease-out"
            style={{ width: `${clampedScore}%` }}
          />
        </div>

        {/* Scribble Marker Line */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none transition-all duration-300 ease-out transform -translate-x-1/2 flex flex-col items-center justify-between"
          style={{ left: `${clampedScore}%` }}
        >
          <svg className="w-4 h-3 overflow-visible" viewBox="0 0 16 12">
            <path
              d="M 2,10 C 5,2 11,2 14,10"
              fill="none"
              stroke={MARIGOLD_OCHRE}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <svg className="w-4 h-8 overflow-visible" viewBox="0 0 16 32">
            <path
              d="M 8,0 C 7,8 9,16 7,24 C 8,28 7,30 8,32"
              fill="none"
              stroke={MARIGOLD_OCHRE}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 6,2 C 9,10 7,20 9,30"
              fill="none"
              stroke={MARIGOLD_OCHRE}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>

          <svg className="w-4 h-3 overflow-visible" viewBox="0 0 16 12">
            <path
              d="M 2,2 C 5,10 11,10 14,2"
              fill="none"
              stroke={MARIGOLD_OCHRE}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Rank & Alert Footer */}
      <div className="w-full pt-3 border-t border-outline-variant/30 flex flex-col items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest font-dmsans">
          {rank}
        </span>
        <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm font-dmsans">
          {alert}
        </p>
      </div>
    </div>
  );
};
