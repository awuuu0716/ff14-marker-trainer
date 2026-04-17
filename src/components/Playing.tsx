import type { FC } from "react";
import { COLORS, MARKERS, type GameState, type MarkerType } from "../types";
import MarkerDisplay from "./MarkerDisplay";

type Props = {
  state: GameState;
  handleInput: (key: MarkerType) => void;
};

const Playing: FC<Props> = ({ state, handleInput }) => {
  const { currentLevel, stage, questions, userInput, isError } = state;
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-zinc-500 mb-4 font-mono text-sm tracking-widest">
        STAGE {stage} / 10
      </div>

      <div className="flex flex-wrap justify-center items-center gap-0 mb-6 min-h-50">
        {questions.map((q, idx) => (
          <MarkerDisplay
            key={`${stage}-${idx}`}
            question={q}
            level={currentLevel}
            isDone={idx < userInput.length}
          />
        ))}
      </div>

      <div
        className={`grid grid-cols-4 gap-4 w-full mt-auto p-2 rounded-2xl transition-all duration-200 
      ${isError ? "animate-shake" : ""}`}
      >
        {MARKERS.map((m) => (
          <button
            key={m}
            disabled={isError} // 錯誤時暫時停用按鈕
            onClick={() => handleInput(m)}
            className={`py-6 rounded-xl text-2xl font-black border-b-4 active:border-b-0 active:translate-y-1 transition-all
            ${COLORS[m]} bg-zinc-800 border-zinc-950 hover:bg-zinc-700 text-white 
            ${isError ? "opacity-50" : "opacity-100"}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Playing;
