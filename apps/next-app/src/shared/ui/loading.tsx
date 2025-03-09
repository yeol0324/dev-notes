export const Loading = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-8 h-8 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
};
