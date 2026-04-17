import type { FC } from "react";
import { LEVEL_CONFIG, type Level } from "../types";

const Menu: FC<{ handleLevelStart: (level: Level) => void }> = ({
  handleLevelStart,
}) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-8 text-white tracking-widest">
        光標殲滅戰 2.0
      </h1>
      <div className="mb-10 p-2 bg-zinc-800/50 rounded-2xl border border-zinc-700 shadow-inner">
        <img
          src={`${import.meta.env.BASE_URL}assets/reference.jpg`}
          alt="Reference"
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {Object.entries(LEVEL_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => handleLevelStart(parseInt(key) as Level)}
            className="group flex flex-col items-start p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700 hover:border-emerald-500/50"
          >
            <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              {config.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
