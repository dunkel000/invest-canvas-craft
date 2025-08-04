export function GlowingCircles() {
  return (
    <div className="relative w-[200px] h-[120px]">
      <div className="absolute w-[120px] h-[120px] bg-primary rounded-full blur-xl opacity-80" />
      <div className="absolute left-10 w-[120px] h-[120px] bg-primary rounded-full blur-xl mix-blend-screen" />
    </div>
  );
}

export default GlowingCircles;
