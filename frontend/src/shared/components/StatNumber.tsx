import React, { useEffect, useState } from 'react';

export interface StatNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  countUp?: boolean;
  className?: string;
}

export const StatNumber: React.FC<StatNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  countUp = true,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    if (!countUp) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 800;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(easeOutProgress * value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [value, countUp]);

  return (
    <span className={`font-fraunces italic tracking-tight ${className}`}>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};
