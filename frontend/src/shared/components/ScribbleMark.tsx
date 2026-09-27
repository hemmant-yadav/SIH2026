import React, { useEffect, useRef, useState } from 'react';
import { MARIGOLD_OCHRE } from '../utils/theme';

interface ScribbleMarkProps {
  children: React.ReactNode;
  variant?: 'circle' | 'underline';
  className?: string;
  strokeColor?: string;
}

export const ScribbleMark: React.FC<ScribbleMarkProps> = ({
  children,
  variant = 'circle',
  className = '',
  strokeColor = MARIGOLD_OCHRE,
}) => {
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const [offset1, setOffset1] = useState<number>(1000);
  const [array1, setArray1] = useState<number>(1000);
  const [offset2, setOffset2] = useState<number>(1000);
  const [array2, setArray2] = useState<number>(1000);

  useEffect(() => {
    if (pathRef1.current) {
      const len1 = pathRef1.current.getTotalLength();
      setArray1(len1);
      setOffset1(len1);
    }
    if (pathRef2.current) {
      const len2 = pathRef2.current.getTotalLength();
      setArray2(len2);
      setOffset2(len2);
    }

    const timer = setTimeout(() => {
      setOffset1(0);
      setOffset2(0);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      {variant === 'circle' ? (
        <svg
          className="absolute -inset-x-6 sm:-inset-x-8 lg:-inset-x-10 -inset-y-4 sm:-inset-y-5 lg:-inset-y-6 w-[calc(100%+48px)] sm:w-[calc(100%+64px)] lg:w-[calc(100%+80px)] h-[calc(100%+32px)] sm:h-[calc(100%+40px)] lg:h-[calc(100%+48px)] pointer-events-none overflow-visible z-0"
          viewBox="0 0 170 70"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef1}
            d="M 16,35 C 12,18 42,8 92,9 C 138,10 164,17 158,35 C 152,53 116,63 66,62 C 22,61 4,47 12,27 C 20,11 70,5 124,11 C 158,15 166,27 152,43 C 138,59 84,64 42,57"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
            style={{
              strokeDasharray: array1,
              strokeDashoffset: offset1,
              transition: 'stroke-dashoffset 1000ms ease-out',
            }}
          />
          <path
            ref={pathRef2}
            d="M 26,39 C 23,25 62,16 104,17 C 146,18 158,27 152,41 C 144,56 94,61 48,55"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
            style={{
              strokeDasharray: array2,
              strokeDashoffset: offset2,
              transition: 'stroke-dashoffset 1200ms ease-out',
            }}
          />
        </svg>
      ) : (
        <svg
          className="absolute -bottom-2 inset-x-0 w-full h-4 pointer-events-none overflow-visible z-0"
          viewBox="0 0 200 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef1}
            d="M 5,12 C 45,4 105,15 195,8 C 140,16 75,10 15,16"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: array1,
              strokeDashoffset: offset1,
              transition: 'stroke-dashoffset 800ms ease-out',
            }}
          />
        </svg>
      )}
    </span>
  );
};
