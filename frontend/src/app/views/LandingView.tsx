import React, { useEffect, useRef, useState } from 'react';
import { ScribbleMark } from '../../shared/components/ScribbleMark';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { StatNumber } from '../../shared/components/StatNumber';

export const LandingView: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [cardsVisible, setCardsVisible] = useState<boolean>(false);

  const statStripRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState<boolean>(false);

  useEffect(() => {
    const featureObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    const statObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) featureObserver.observe(featuresRef.current);
    if (statStripRef.current) statObserver.observe(statStripRef.current);

    return () => {
      featureObserver.disconnect();
      statObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full flex flex-col bg-surface">
      {/* SECTION 1: ASYMMETRIC EDITORIAL HERO */}
      <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-4 pb-10 lg:pt-6 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <span className="font-dmsans text-xs uppercase tracking-[0.18em] text-forest/70 font-semibold mb-3 block">
              FOR INSTITUTIONAL & HIGH-VOLUME COMMERCIAL KITCHENS
            </span>

            <span className="font-dmsans text-[11px] uppercase tracking-[0.16em] text-on-surface-variant/60 font-medium mb-6">
              For institutional kitchens and food processing units
            </span>

            <h1 className="font-fraunces text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-forest font-normal tracking-tight mb-7">
              Stop wasting food.<br />
              Start{' '}
              <ScribbleMark variant="circle">
                <span className="font-fraunces italic px-3 sm:px-4">recovering</span>
              </ScribbleMark>{' '}
              it.
            </h1>

            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed font-dmsans">
              Institutional kitchens overproduce by 18% on average. MessMind connects live prep telemetry, cafeteria demand curves, and dynamic redistribution—reclaiming kitchen margins before food hits the compost bin.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
              <Button variant="primary" href="#audit">
                Request Kitchen Audit →
              </Button>
              <Button variant="ghost" href="/dashboard">
                Explore Live Telemetry
              </Button>
            </div>

            <div className="flex items-center gap-3 text-on-surface-variant text-sm pt-2 font-dmsans">
              <span>Deployed in 42+ university dining halls, hotel banquets, and hospital networks.</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative w-full aspect-[4/5] rounded-[3rem_1rem_4rem_1.5rem] overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Commercial culinary kitchen prep"
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STAGGERED FEATURE BLOCKS */}
      <section className="w-full bg-surface-container-low py-10 lg:py-14" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-xs uppercase tracking-[0.18em] text-forest/70 mb-3 block font-semibold font-dmsans">
              Bespoke Telemetry
            </span>
            <h2 className="font-fraunces text-3xl sm:text-4xl text-forest">
              Engineered specifically for the line.
            </h2>
            <p className="text-base text-on-surface-variant mt-3 font-dmsans">
              Eliminating clipboards, estimation guesswork, and delayed post-mortem waste logs with automated edge computing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 items-start">
            <div
              className={`transition-all duration-700 ease-out transform ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0ms' }}
            >
              <Card divider className="p-0 border-t border-outline-variant/40 md:border-t-0 md:border-l md:border-outline-variant/35 md:pl-8 bg-transparent">
                <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-forest mb-6">
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24">
                    <path d="M 4 17 C 8 19, 16 19, 20 17 L 18 11 C 14 10, 10 10, 6 11 Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 12 4 L 12 10" strokeLinecap="round" />
                    <path d="M 9 4 C 11 3, 13 3, 15 4" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xs text-outline mb-1 block font-mono">01 / CAPTURE</span>
                <h3 className="font-fraunces text-xl text-forest mb-3">Automated Pan Weigh-Ins</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-dmsans">
                  Sub-second camera and scale recognition tracks every sheet tray before it leaves the pass, cataloging weight, ingredient profile, and temperature.
                </p>
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs font-dmsans">
                  <span className="text-on-surface-variant">Precision threshold</span>
                  <span className="text-forest font-semibold">± 12 grams</span>
                </div>
              </Card>
            </div>

            <div
              className={`transition-all duration-700 ease-out transform md:translate-y-12 ${
                cardsVisible ? 'opacity-100' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Card divider className="p-0 border-t border-outline-variant/40 md:border-t-0 md:border-l md:border-outline-variant/35 md:pl-8 bg-transparent">
                <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-forest mb-6">
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24">
                    <path d="M 3 18 C 7 18, 9 10, 13 13 C 16 15, 18 6, 21 6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 3 20 L 21 20" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </div>
                <span className="text-xs text-outline mb-1 block font-mono">02 / SYNCHRONIZE</span>
                <h3 className="font-fraunces text-xl text-forest mb-3">Algorithmic Prep Forecasting</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-dmsans">
                  Aligns morning batch cooking with real-time dining hall foot traffic patterns, weather shifts, and exam schedules to curb batch overage.
                </p>
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs font-dmsans">
                  <span className="text-on-surface-variant">Variance reduction</span>
                  <span className="text-forest font-semibold">-34% avg</span>
                </div>
              </Card>
            </div>

            <div
              className={`transition-all duration-700 ease-out transform md:-translate-y-3 ${
                cardsVisible ? 'opacity-100' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <Card divider className="p-0 border-t border-outline-variant/40 md:border-t-0 md:border-l md:border-outline-variant/35 md:pl-8 bg-transparent">
                <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-forest mb-6">
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24">
                    <path d="M 5 12 C 5 7, 9 4, 15 4 C 18 4, 20 6, 20 9 C 20 14, 8 10, 8 16 C 8 19, 11 20, 16 20" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 13 18 L 16 20 L 14 22" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xs text-outline mb-1 block font-mono">03 / REDISTRIBUTE</span>
                <h3 className="font-fraunces text-xl text-forest mb-3">Zero-Friction Re-Channeling</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-dmsans">
                  Automated compliance logs, surplus recovery routing, and university pantry APIs for safe surplus redistribution before thermal decline.
                </p>
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs font-dmsans">
                  <span className="text-on-surface-variant">HACCP compliance</span>
                  <span className="text-forest font-semibold">100% automated</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HORIZONTAL STAT STRIP */}
      <section className="w-full bg-forest text-bone py-10 lg:py-14 relative overflow-hidden" ref={statStripRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
            <div className="flex flex-col">
              <div className="font-fraunces text-5xl lg:text-6xl text-bone tracking-tight mb-2">
                <StatNumber value={12400} suffix=" kg" countUp={statsVisible} />
              </div>
              <p className="text-sm text-bone/80 max-w-xs font-dmsans">
                Food diverted from landfill across monitored facilities in Q1 alone.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="font-fraunces text-5xl lg:text-6xl text-bone tracking-tight mb-2">
                <ScribbleMark variant="circle">
                  <StatNumber value={32.4} suffix="%" decimals={1} countUp={statsVisible} />
                </ScribbleMark>
              </div>
              <p className="text-sm text-bone/80 max-w-xs font-dmsans mt-2">
                Average verified reduction in batch culinary prep variance.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="font-fraunces text-5xl lg:text-6xl text-bone tracking-tight mb-2">
                <StatNumber value={418000} prefix="$" countUp={statsVisible} />
              </div>
              <p className="text-sm text-bone/80 max-w-xs font-dmsans">
                Annual food procurement spend recouped per institutional campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL PULL-QUOTE */}
      <section className="w-full py-12 lg:py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="relative pl-6 lg:pl-12 border-l-2 border-forest/30">
            <span className="text-xs uppercase tracking-[0.2em] text-forest/60 mb-6 block font-semibold font-dmsans">
              Culinary Leadership
            </span>
            <blockquote className="font-fraunces text-2xl lg:text-4xl text-forest italic font-normal mb-8 max-w-3xl leading-snug">
              “We stopped guessing what 2,000 students would eat on rainy Tuesdays. MessMind paid for itself in six weeks.”
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-container-high">
                <img
                  className="w-full h-full object-cover"
                  alt="Chef Marcus Vane"
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80"
                />
              </div>
              <div>
                <div className="font-dmsans text-base text-forest font-semibold">Chef Marcus Vane</div>
                <div className="text-xs text-on-surface-variant font-dmsans">Executive Culinary Director, Metro Dining Group</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PILOT EVALUATION CTA */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 lg:pb-16" id="audit">
        <Card className="bg-surface-container p-8 lg:p-16 rounded-[2rem] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.16em] text-forest/70 mb-2 block font-semibold font-dmsans">
              Institutional Pilot Program
            </span>
            <h3 className="font-fraunces text-2xl lg:text-3xl text-forest mb-4">
              Ready to observe what your kitchen leaves behind?
            </h3>
            <p className="text-sm text-on-surface-variant font-dmsans">
              Book an on-site telemetry evaluation. We deploy lightweight vision scales over two prep cycles without disrupting service lines.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <Button variant="primary" href="#contact">
              Schedule Evaluation
            </Button>
            <Button variant="ghost" href="#methodology">
              Download Methodology Brief
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};
