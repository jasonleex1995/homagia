import Lenis from 'lenis';
import { useEffect } from 'react';
import { Closing } from './components/Closing';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Insight } from './components/Insight';
import { Method } from './components/Method';
import { Nav } from './components/Nav';
import { Problem } from './components/Problem';
import { Results } from './components/Results';
import { WhyNow } from './components/WhyNow';

export default function App() {
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
        <Problem />
        <Insight />
        <HowItWorks />
        <Method />
        <Results />
        <WhyNow />
        <Closing />
      </main>
    </>
  );
}
