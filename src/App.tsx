import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, ArrowRight, Timer as TimerIcon } from "lucide-react";

// ==========================================
// 1. Types & Constants
// ==========================================
type MarkerType = "A" | "B" | "C" | "D" | "1" | "2" | "3" | "4";
type Level = 1 | 2 | 3 | 4 | 5;
type CropType =
  | "object-left-top"
  | "object-right-top"
  | "object-left-bottom"
  | "object-right-bottom"
  | "";
type GameStatus = "idle" | "countdown" | "playing" | "result";

interface Question {
  type: MarkerType;
  crop: CropType;
  filename: string;
}

const MARKERS: MarkerType[] = ["A", "B", "C", "D", "1", "2", "3", "4"];
const COLORS: Record<MarkerType, string> = {
  A: "border-red-500",
  1: "border-red-500",
  B: "border-yellow-500",
  2: "border-yellow-500",
  C: "border-blue-500",
  3: "border-blue-500",
  D: "border-purple-500",
  4: "border-purple-500",
};

const LEVEL_CONFIG = {
  1: {
    name: "光標初學者學堂",
    time: 5,
    counts: [1, 1, 1, 2, 2, 2, 3, 3, 3, 3],
  },
  2: {
    name: "光標殲滅戰",
    time: 5,
    counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6],
  },
  3: {
    name: "極光標殲滅戰",
    time: 5,
    counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6],
  },
  4: {
    name: "零式光標殲滅戰",
    time: 5,
    counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6],
  },
  5: {
    name: "絕光標殲滅戰",
    time: 5,
    counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6],
  },
} as const;

// ==========================================
// 2. Custom Hooks (Logic)
// ==========================================
function useGameEngine() {
  const [state, setState] = useState({
    currentLevel: 1 as Level,
    stage: 1,
    questions: [] as Question[],
    userInput: [] as MarkerType[],
    status: "idle" as GameStatus,
    countdownValue: 4,
    results: [] as boolean[],
    timeLeft: 5,
  });

  const timerRef = useRef<number | null>(null);

  const startStage = useCallback((level: Level, stageNum: number) => {
    const config = LEVEL_CONFIG[level];
    const count = config.counts[stageNum - 1];
    const crops: CropType[] = [
      "object-left-top",
      "object-right-top",
      "object-left-bottom",
      "object-right-bottom",
    ];

    const newQuestions: Question[] = Array.from({ length: count }, () => {
      const type = MARKERS[Math.floor(Math.random() * MARKERS.length)];
      const filename =
        level === 3
          ? `${type}-bottom.png`
          : level >= 4 && Math.random() > 0.5
            ? `${type}-bottom.png`
            : `${type}.png`;
      const crop =
        level === 5 ? crops[Math.floor(Math.random() * crops.length)] : "";
      return { type, filename, crop };
    });

    setState((prev) => ({
      ...prev,
      stage: stageNum,
      questions: newQuestions,
      userInput: [],
      status: "playing",
      timeLeft: config.time,
    }));
  }, []);

  const finishStage = useCallback(
    (isCorrect: boolean) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setState((prev) => {
        const newResults = [...prev.results, isCorrect];
        if (prev.stage < 10) {
          // 非同步調用 startStage 避免 Effect 衝突
          setTimeout(() => startStage(prev.currentLevel, prev.stage + 1), 0);
          return { ...prev, results: newResults };
        }
        return { ...prev, results: newResults, status: "result" };
      });
    },
    [startStage],
  );

  // 倒數邏輯
  useEffect(() => {
    if (state.status !== "countdown") return;
    const timer = setTimeout(() => {
      if (state.countdownValue > 1) {
        setState((prev) => ({
          ...prev,
          countdownValue: prev.countdownValue - 1,
        }));
      } else {
        startStage(state.currentLevel, 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [state.status, state.countdownValue, state.currentLevel, startStage]);

  // 遊戲計時器
  useEffect(() => {
    if (state.status === "playing" && state.timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.timeLeft <= 0.1) {
            finishStage(false);
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 0.1 };
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.stage, finishStage]);

  const handleLevelStart = (level: Level) => {
    setState((prev) => ({
      ...prev,
      currentLevel: level,
      status: "countdown",
      countdownValue: 4,
      results: [],
      stage: 1,
    }));
  };

  const handleInput = (key: MarkerType) => {
    if (state.status !== "playing") return;
    const currentIndex = state.userInput.length;
    if (key !== state.questions[currentIndex].type) {
      finishStage(false);
      return;
    }
    if (state.userInput.length + 1 === state.questions.length) {
      finishStage(true);
    } else {
      setState((prev) => ({ ...prev, userInput: [...prev.userInput, key] }));
    }
  };

  const goToMenu = () => setState((prev) => ({ ...prev, status: "idle" }));

  return { state, handleLevelStart, handleInput, goToMenu };
}

// ==========================================
// 3. Sub-Components (UI)
// ==========================================

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
      src={`/assets/${question.filename}`}
      alt={question.type}
      className={`w-full h-full object-cover transition-transform ${level === 5 ? `scale-[2.5] ${question.crop}` : "scale-100"}`}
    />
    {level === 5 && !isDone && (
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-white/5 to-transparent animate-pulse" />
    )}
  </div>
);

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

// ==========================================
// 4. Main Component
// ==========================================
export default function MarkerTrainer() {
  const { state, handleLevelStart, handleInput, goToMenu } = useGameEngine();
  const accuracy = (state.results.filter(Boolean).length / 10) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl min-h-125 flex flex-col">
        <GameHeader timeLeft={state.timeLeft} status={state.status} />

        {/* 初始畫面 */}
        {state.status === "idle" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-8 text-white tracking-widest">
              光標殲滅戰 2.0
            </h1>
            <div className="mb-10 p-2 bg-zinc-800/50 rounded-2xl border border-zinc-700 shadow-inner">
              <img
                src="/assets/reference.jpg"
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
        )}

        {/* 倒數畫面 */}
        {state.status === "countdown" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-zinc-500 mb-12 text-xl font-bold tracking-widest uppercase">
              準備進入：{LEVEL_CONFIG[state.currentLevel].name}
            </div>
            <div className="relative">
              <img
                key={state.countdownValue}
                src={`/assets/${state.countdownValue}.png`}
                alt={String(state.countdownValue)}
                className="w-40 h-40 object-contain animate-[ping_1s_infinite] drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-black text-white">
                  {state.countdownValue}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 遊戲進行畫面 */}
        {state.status === "playing" && (
          <div className="flex flex-col items-center flex-1">
            <div className="text-zinc-500 mb-4 font-mono text-sm tracking-widest">
              STAGE {state.stage} / 10
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-4 min-h-30">
              {state.questions.map((q, idx) => (
                <MarkerDisplay
                  key={`${state.stage}-${idx}`}
                  question={q}
                  level={state.currentLevel}
                  isDone={idx < state.userInput.length}
                />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 w-full mt-auto">
              {MARKERS.map((m) => (
                <button
                  key={m}
                  onClick={() => handleInput(m)}
                  className={`py-6 rounded-xl text-2xl font-black border-b-4 active:border-b-0 active:translate-y-1 transition-all
                    ${COLORS[m]} bg-zinc-800 border-zinc-950 hover:bg-zinc-700 text-white`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 結果畫面 */}
        {state.status === "result" && (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">訓練完成</h2>
            <div className="text-6xl font-black text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              {accuracy}%
            </div>
            <div className="text-zinc-400 mb-10 text-lg">
              答對題數:{" "}
              <span className="text-white font-mono">
                {state.results.filter(Boolean).length}
              </span>{" "}
              / 10
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-4">
              <button
                onClick={() => handleLevelStart(state.currentLevel)}
                className="btn-secondary flex-1"
              >
                <RefreshCw size={20} /> 重試此階
              </button>
              {accuracy >= 80 && state.currentLevel < 5 && (
                <button
                  onClick={() =>
                    handleLevelStart((state.currentLevel + 1) as Level)
                  }
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
        )}
      </div>
    </div>
  );
}
