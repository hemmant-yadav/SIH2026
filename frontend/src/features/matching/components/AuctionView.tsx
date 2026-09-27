import React, { useEffect, useState } from 'react';
import { ScribbleMark } from '../../../shared/components/ScribbleMark';
import { StatNumber } from '../../../shared/components/StatNumber';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { MARIGOLD_OCHRE } from '../../../shared/utils/theme';
import { useAuctionStream } from '../hooks/useAuctionStream';
import { AuctionItem } from '@messmind/shared-types';

export const AuctionView: React.FC = () => {
  const { items, claimItem } = useAuctionStream();
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(450);
  const [secondsLeft, setSecondsLeft] = useState<number>(1458);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [pulseTrigger, setPulseTrigger] = useState<boolean>(false);

  useEffect(() => {
    if (items.length > 0 && items[activeItemIndex]) {
      setCurrentPrice(items[activeItemIndex].currentPrice);
    }
  }, [items, activeItemIndex]);

  const activeItem: AuctionItem = items[activeItemIndex] || {
    id: 'auction-1',
    facilityId: 'campus-dining-1',
    name: 'Paneer Biryani Saffron Batch (50 Portions)',
    imageUrl:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    currentPrice: currentPrice,
    startPrice: 650,
    quantityLeft: 50,
    batchLabel: 'Kitchen Pass #2',
    drainStartTime: new Date().toISOString(),
    drainIntervalSeconds: 3.5,
    status: 'active',
  };

  // Price Tick-Down Interval
  useEffect(() => {
    if (claimed) return;

    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const next = Math.max(prev - 10, 150);
        setPulseTrigger(true);
        setTimeout(() => setPulseTrigger(false), 300);
        return next;
      });
    }, (activeItem.drainIntervalSeconds || 3.5) * 1000);

    return () => clearInterval(interval);
  }, [claimed, activeItem.drainIntervalSeconds]);

  // Countdown timer seconds interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleClaim = async () => {
    setClaimed(true);
    if (activeItem.id) {
      await claimItem(activeItem.id);
    }
  };

  // Hand-drawn countdown dial calculations
  const radius = 85;
  const arcLength = 2 * Math.PI * radius * 0.75;
  const dashoffset = arcLength * (1 - secondsLeft / 1800);

  const ticks = Array.from({ length: 14 }).map((_, i) => {
    const angleDeg = 225 - i * 19.2;
    const angleRad = (angleDeg * Math.PI) / 180;
    const jitter = (i % 2 === 0 ? 1 : -1) * 2;
    const innerR = radius - 12 + jitter;
    const outerR = radius + 3 + jitter;
    const cx = 120;
    const cy = 120;

    const x1 = cx + innerR * Math.cos(angleRad);
    const y1 = cy - innerR * Math.sin(angleRad);
    const x2 = cx + outerR * Math.cos(angleRad);
    const y2 = cy - outerR * Math.sin(angleRad);

    const isReached = i / 14 <= secondsLeft / 1800;

    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isReached ? MARIGOLD_OCHRE : '#717973'}
        strokeWidth={i % 4 === 0 ? 3 : 1.5}
        strokeLinecap="round"
        opacity={isReached ? 0.95 : 0.35}
      />
    );
  });

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-forest text-bone flex flex-col justify-between py-10 px-6 lg:px-12">
      {/* Top Section Header */}
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-bone/15 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-lime font-semibold block font-dmsans mb-1">
            Zero-Friction Re-Channeling Portal
          </span>
          <h1 className="font-fraunces text-3xl md:text-4xl text-bone font-normal">
            Live Flash Surplus Auction
          </h1>
        </div>

        {/* LIVE status with ScribbleMark Underline */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold font-dmsans text-bone/90">
          <span>STATUS:</span>
          <ScribbleMark variant="underline">
            <span className="text-lime font-bold">LIVE (AWS WS)</span>
          </ScribbleMark>
        </div>
      </div>

      {/* Main Asymmetric Hero Section */}
      <div className="max-w-7xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start z-10 pl-0 lg:pl-6">
          <div className="relative flex flex-col items-center sm:items-start">
            {/* Hand-Drawn Irregular Countdown Dial */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 45,195 A 95,95 0 1,1 195,195"
                  fill="none"
                  stroke="#2D5A43"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                <g>{ticks}</g>

                <path
                  d="M 45,195 A 95,95 0 1,1 195,195"
                  fill="none"
                  stroke={MARIGOLD_OCHRE}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={arcLength}
                  strokeDashoffset={dashoffset}
                  style={{ transition: 'stroke-dashoffset 1000ms ease-out' }}
                />

                <path
                  d="M 48,196 A 93,93 0 1,1 192,196"
                  fill="none"
                  stroke="#F5F0E6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={arcLength}
                  strokeDashoffset={dashoffset + 4}
                  opacity="0.5"
                />
              </svg>

              {/* Center Price & Timer Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] uppercase tracking-wider text-bone/70 font-dmsans mb-1">
                  Current Flash Offer
                </span>

                <div
                  className={`transition-all duration-300 transform ${
                    pulseTrigger ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
                  }`}
                >
                  <span className="font-fraunces italic text-5xl sm:text-6xl text-lime font-normal">
                    <StatNumber value={currentPrice} prefix="₹" countUp={false} />
                  </span>
                </div>

                <div className="mt-2 text-xs font-mono text-bone/80 uppercase tracking-wider">
                  {formatTimer(secondsLeft)} window left
                </div>
              </div>
            </div>

            {/* Batch Info & Claim CTA */}
            <div className="mt-6 flex flex-col gap-3 w-full max-w-md">
              <h2 className="font-fraunces text-2xl text-bone">
                {activeItem.name}
              </h2>
              <p className="text-xs text-bone/80 font-dmsans leading-relaxed">
                Freshly prepped batch from {activeItem.batchLabel}. HACCP thermal certificate verified at 68°C. Direct delivery to campus dining hall or pantry.
              </p>

              <div className="pt-3">
                {claimed ? (
                  <div className="w-full py-4 rounded-full bg-lime text-bone text-center font-dmsans text-sm font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2">
                    <span className="font-mono text-base">✓</span>
                    Claimed — Recorded via DynamoDB
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleClaim}
                    className="w-full py-4 text-base font-bold shadow-none"
                  >
                    Grab It Now ({activeItem.quantityLeft} left) →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photo Card */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-12">
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-forest/80 border border-bone/20 shadow-none lg:-ml-8 lg:mt-8 z-20">
            <img
              src={activeItem.imageUrl}
              alt={activeItem.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-forest/90 border border-bone/20 backdrop-none">
              <div className="flex justify-between items-center text-xs font-dmsans">
                <span className="text-lime font-semibold">{activeItem.batchLabel}</span>
                <span className="text-bone/80 font-mono">{activeItem.quantityLeft} Portions Left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker Row */}
      <div className="max-w-7xl w-full mx-auto pt-8 border-t border-bone/15">
        <span className="text-xs uppercase tracking-wider text-bone/50 block font-dmsans font-semibold mb-4">
          Real-Time AWS Surplus Auctions ({items.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <Card
              key={item.id || idx}
              onClick={() => {
                setActiveItemIndex(idx);
                setCurrentPrice(item.currentPrice);
                setClaimed(false);
              }}
              className={`bg-forest/60 border border-bone/15 p-4 cursor-pointer transition-all duration-200 ${
                activeItemIndex === idx ? 'opacity-100 border-lime' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-fraunces text-base text-bone font-normal">
                  {item.name}
                </span>
                <span className="font-fraunces italic text-sm text-bone/80">₹{item.currentPrice}</span>
              </div>
              <span className="text-[11px] text-bone/50 font-dmsans block">
                {item.quantityLeft} Portions · {item.batchLabel}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
