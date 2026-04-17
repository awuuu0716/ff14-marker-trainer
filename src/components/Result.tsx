import type { FC } from "react";
import type { Level } from "../types";
import { ArrowRight, RefreshCw } from "lucide-react";

type Props = {
  accuracy: number;
  results: boolean[];
  currentLevel: Level;
  handleLevelStart: (level: Level) => void;
  goToMenu: () => void;
};

const Result: FC<Props> = ({
  currentLevel,
  accuracy,
  results,
  handleLevelStart,
  goToMenu,
}) => {
  return (
    <div className="text-center py-8 flex-1 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2">訓練完成</h2>
      <div className="text-6xl font-black text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
        {accuracy}%
      </div>
      <div className="text-zinc-400 mb-10 text-lg">
        答對題數:{" "}
        <span className="text-white font-mono">
          {results.filter(Boolean).length}
        </span>{" "}
        / 10
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-4">
        <button
          onClick={() => handleLevelStart(currentLevel)}
          className="btn-secondary flex-1"
        >
          <RefreshCw size={20} /> 重試此階
        </button>
        {accuracy >= 80 && currentLevel < 5 && (
          <button
            onClick={() => handleLevelStart((currentLevel + 1) as Level)}
            className="btn-primary flex-1"
          >
            下一階 <ArrowRight size={20} />
          </button>
        )}
        <button
          onClick={goToMenu}
          className="btn-secondary flex-1 text-zinc-300"
        >
          返回選單
        </button>
      </div>
    </div>
  );
};

export default Result;
