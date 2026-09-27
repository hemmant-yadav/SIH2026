import React, { useEffect, useState } from 'react';
import { HeatmapDay } from '@messmind/shared-types';

export interface WasteHeatmapProps {
  days: HeatmapDay[];
  className?: string;
}

export const WasteHeatmap: React.FC<WasteHeatmapProps> = ({ days, className = '' }) => {
  const [visibleIndices, setVisibleIndices] = useState<boolean[]>(
    new Array(days.length).fill(false)
  );

  useEffect(() => {
    setVisibleIndices(new Array(days.length).fill(false));

    days.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleIndices((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, idx * 80);
    });
  }, [days]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return 'bg-[#F8F3E9] text-on-surface-variant border-outline-variant/30';
      case 1:
        return 'bg-[#E7E2D8] text-forest border-outline-variant/40';
      case 2:
        return 'bg-[#C1ECD4] text-forest border-transparent';
      case 3:
        return 'bg-[#1B4332] text-bone border-transparent';
      case 4:
        return 'bg-lime text-bone font-bold border-transparent';
      default:
        return 'bg-surface-container text-forest';
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-forest font-semibold font-dmsans">
          7-Day Culinary Waste Heatmap
        </span>
        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-dmsans">
          <span>Low</span>
          <span className="w-2.5 h-2.5 rounded bg-[#F8F3E9] inline-block border border-outline-variant/30"></span>
          <span className="w-2.5 h-2.5 rounded bg-[#C1ECD4] inline-block"></span>
          <span className="w-2.5 h-2.5 rounded bg-[#1B4332] inline-block"></span>
          <span className="w-2.5 h-2.5 rounded bg-lime inline-block"></span>
          <span>High</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {days.map((item, idx) => (
          <div
            key={item.day}
            className={`p-3 rounded-xl border flex flex-col items-center justify-between transition-all duration-500 ease-out transform ${
              getIntensityColor(item.intensity)
            } ${
              visibleIndices[idx]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
          >
            <span className="text-xs font-mono font-semibold">{item.day}</span>
            <span className="text-sm font-fraunces my-1">{item.wasteKg}</span>
            <span className="text-[10px] opacity-80">kg</span>
          </div>
        ))}
      </div>
    </div>
  );
};
