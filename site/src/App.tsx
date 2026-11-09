import Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { Closing } from './components/Closing';
import { Hero } from './components/Hero';
import { Insight } from './components/Insight';
import { Method } from './components/Method';
import { Nav } from './components/Nav';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { WhyNow } from './components/WhyNow';

export default function App() {
  // Problem and Solution always show the same scenario.
  const [sid, setSid] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -56 } });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Problem sid={sid} onScenario={setSid} />
        <Insight />
        <Solution sid={sid} onScenario={setSid} />
        <Method />
        <WhyNow />
        <Closing />
      </main>
    </>
  );
}
