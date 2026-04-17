import { TimerIcon } from "lucide-react";
import type { GameStatus } from "../types";

const GameHeader = ({
  timeLeft,
  status,
}: {
  timeLeft: number;
  status: GameStatus;
}) => (
  <div className="flex justify-center items-center mb-8 h-10">
    {status === "playing" && (
      <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
        <TimerIcon
          size={18}
          className={
            timeLeft < 1.5 ? "text-red-500 animate-pulse" : "text-emerald-400"
          }
        />
        <span className="font-mono font-bold w-12">{timeLeft.toFixed(1)}s</span>
      </div>
    )}
  </div>
);

export default GameHeader;
