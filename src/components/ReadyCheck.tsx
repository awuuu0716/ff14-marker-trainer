import type { FC } from "react";
import { LEVEL_CONFIG, type GameState } from "../types";

const ReadyCheck: FC<{ state: GameState }> = ({ state }) => {
  const { currentLevel, countdownValue } = state;

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-zinc-500 mb-12 text-xl font-bold tracking-widest uppercase">
        準備進入：{LEVEL_CONFIG[currentLevel].name}
      </div>
      <div className="relative">
        <img
          key={countdownValue}
          src={`${import.meta.env.BASE_URL}assets/${countdownValue}.png`}
          alt={String(countdownValue)}
          className="w-40 h-40 object-contain animate-[ping_1s_infinite] drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black text-white">
            {countdownValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadyCheck;
