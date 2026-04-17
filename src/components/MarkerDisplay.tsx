import type { Question, Level } from "../types";

const MarkerDisplay = ({
  question,
  level,
  isDone,
}: {
  question: Question;
  level: Level;
  isDone: boolean;
}) => (
  <div
    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 
    ${isDone ? "opacity-20 grayscale scale-95 border-transparent" : "opacity-100 border-zinc-700 bg-zinc-800 shadow-xl"}`}
  >
    <img
      src={`${import.meta.env.BASE_URL}assets/${question.filename}`}
      alt={question.type}
      className={`w-full h-full object-cover transition-transform ${level === 5 ? `scale-[2.5] ${question.crop}` : "scale-100"}`}
    />
    {level === 5 && !isDone && (
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-white/5 to-transparent animate-pulse" />
    )}
  </div>
);

export default MarkerDisplay;
