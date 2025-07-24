// BreakpointIndicator.tsx
const BreakpointIndicator = () => {
  return (
    <div className="fixed bottom-2 right-2 z-50 text-xs font-mono bg-black text-white px-2 py-1 rounded shadow">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
};

export default BreakpointIndicator;