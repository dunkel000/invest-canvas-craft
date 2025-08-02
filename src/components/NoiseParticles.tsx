import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const NoiseParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    const particles: Particle[] = [];
    const particleCount = 100;


      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };


    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      life: 0,
      maxLife: Math.random() * 300 + 200
    });


    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles.forEach((particle, index) => {
        // Add noise to movement
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;
        
        // Apply velocity damping
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update life
        particle.life++;
        
        // Fade in/out based on life
        if (particle.life < particle.maxLife * 0.1) {
          particle.opacity = (particle.life / (particle.maxLife * 0.1)) * 0.3;
        } else if (particle.life > particle.maxLife * 0.9) {
          particle.opacity = ((particle.maxLife - particle.life) / (particle.maxLife * 0.1)) * 0.3;
        }
        
          // Keep particles within central cluster
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.min(canvas.width, canvas.height) * 0.2;
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > maxRadius) {
            const ratio = maxRadius / distance;
            particle.x = centerX + dx * ratio;
            particle.y = centerY + dy * ratio;
          }
        
        // Reset particle if life exceeded
        if (particle.life >= particle.maxLife) {
          particles[index] = createParticle();
        }
      });
    };

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      renderParticles();
      requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ pointerEvents: 'none' }}
    />
  );
};
