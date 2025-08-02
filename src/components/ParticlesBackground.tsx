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
          x: 50 + (Math.random() - 0.5) * 20,
          y: 50 + (Math.random() - 0.5) * 20,
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
      color: { value: ["#10b981", "#059669", "#047857"] },
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

      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: {
              enable: true
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#10b981", "#059669", "#047857"],
          },
          links: {
            color: "#10b981",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}

      className="absolute inset-0 w-full h-full"
    />
  );
};
