import { TimerIcon } from "lucide-react";
import type { GameState } from "../types";

const GameHeader = ({ state }: { state: GameState }) =>
  state.status === "playing" ? (
    <div className="flex justify-end items-center mb-8 h-10">
      <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
        <TimerIcon
          size={18}
          className={
            state.timeLeft < 1.5
              ? "text-red-500 animate-pulse"
              : "text-emerald-400"
          }
        />
        <span className="font-mono font-bold w-12">
          {state.timeLeft.toFixed(1)}s
        </span>
      </div>
    </div>
  ) : null;

export default GameHeader;
