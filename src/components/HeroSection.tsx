interface HeroSectionProps {
  title: string;
  subtitle: string;
  variant?: 'default' | 'radial';
}

export const HeroSection = ({ title, subtitle, variant = 'default' }: HeroSectionProps) => {
  const isRadial = variant === 'radial';
  const headerHeight = isRadial ? 'h-80' : 'h-48';
  
  return (
    <div className={`relative ${headerHeight} mb-8 rounded-xl overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/20`}>
      {/* Fade to black gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/80 to-transparent z-20"></div>
      
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_20%),radial-gradient(circle_at_70%_80%,hsl(var(--primary))_0%,transparent_20%)] opacity-10"></div>
      </div>

      {/* Moving particles */}
      <div className="absolute inset-0 z-5">
        {isRadial ? (
          // Radial particles moving from center outwards - star cruising simulation
          [...Array(150)].map((_, i) => {
            const angle = (i / 150) * 360;
            const distance = 200 + (i % 5) * 100; // Much larger distance to cover whole header
            
            return (
              <div
                key={i}
                className="absolute animate-radial-expand"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${12 + Math.random() * 8}s`, // Slower for cruising effect
                  '--angle': `${angle}deg`,
                  '--distance': `${distance}px`
                } as React.CSSProperties & { '--angle': string; '--distance': string }}
              >
                <div 
                  className="w-1 h-1 bg-primary rounded-full opacity-60"
                  style={{
                    boxShadow: '0 0 8px hsl(var(--primary)), 0 0 3px hsl(var(--primary))'
                  }}
                ></div>
              </div>
            );
          })
        ) : (
          // Default floating particles
          [...Array(80)].map((_, i) => {
            const animations = ['animate-float-x', 'animate-float-y', 'animate-float-diagonal'];
            const sizes = ['w-0.5 h-0.5', 'w-1 h-1', 'w-1.5 h-1.5'];
            const opacities = ['opacity-30', 'opacity-40', 'opacity-60'];
            
            return (
              <div
                key={i}
                className={`absolute ${animations[i % animations.length]}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${6 + Math.random() * 8}s`
                }}
              >
                <div 
                  className={`${sizes[i % sizes.length]} ${opacities[i % opacities.length]} bg-primary rounded-full`}
                  style={{
                    boxShadow: '0 0 6px hsl(var(--primary))'
                  }}
                ></div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className={`${isRadial ? 'text-6xl md:text-7xl' : 'text-4xl md:text-5xl'} font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent`}>
            {title}
          </h1>
          <p className={`${isRadial ? 'text-xl' : 'text-lg'} text-muted-foreground max-w-2xl mx-auto`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};