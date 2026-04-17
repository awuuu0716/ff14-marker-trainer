import type { FC } from "react";

const Loading: FC<{ loadProgress: number }> = ({ loadProgress }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-64">
        <div className="flex justify-between mb-2 text-sm font-mono text-emerald-400">
          <span>LOADING ASSETS...</span>
          <span>{loadProgress}%</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="mt-4 text-xs text-zinc-500 text-center animate-pulse">
          loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
