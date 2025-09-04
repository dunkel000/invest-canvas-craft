import { useCallback, useMemo } from "react";
import type {
  Container,
  Engine,
  IManualParticle,
  ISourceOptions,
} from "@tsparticles/engine";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      // Particles loaded callback
    },
    []
  );

  const manualParticles = useMemo<IManualParticle[]>(
    () =>
      Array.from({ length: 300 }, () => ({
        position: {
          x: Math.random() * 100,
          y: Math.random() * 100,
          mode: "percent"
        },
      })),
    []
  );

  const options: ISourceOptions = {
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        resize: { enable: true },
      },
    },
    manualParticles,
    particles: {
      color: { value: ["hsl(var(--primary))", "hsl(var(--chart-line-primary))", "hsl(var(--success))"] },
      links: { enable: false },
      move: { enable: false },
      number: { value: 0 },
      opacity: { value: 0.8 },
      shape: { type: "circle" },
      size: { value: { min: 0.3, max: 1 } },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 w-full h-full"
    />
  );
};
