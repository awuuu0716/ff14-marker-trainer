import { useState, useEffect, useCallback, useRef } from "react";
import { Trophy, RefreshCw, ArrowRight, Timer } from "lucide-react";

// --- 類型定義 ---
type MarkerType = "A" | "B" | "C" | "D" | "1" | "2" | "3" | "4";
type Level = 1 | 2 | 3 | 4 | 5;
type CropType =
  | "object-left-top"
  | "object-right-top"
  | "object-left-bottom"
  | "object-right-bottom"
  | "";

interface Question {
  type: MarkerType;
  crop: CropType;
}

interface GameState {
  currentLevel: Level;
  stage: number; // 1-10
  questions: Question[]; // 改為 Question 物件陣列
  userInput: MarkerType[];
  status: "idle" | "playing" | "result";
  results: boolean[]; // 紀錄每關是否正確
  timeLeft: number;
}

// --- 常數配置 ---
const MARKERS: MarkerType[] = ["A", "B", "C", "D", "1", "2", "3", "4"];
const COLORS = {
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
  1: { time: 5, counts: [1, 1, 1, 2, 2, 2, 3, 3, 3, 3], type: "main" },
  2: { time: 5, counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6], type: "main" },
  3: { time: 5, counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6], type: "bottom" },
  4: { time: 5, counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6], type: "mixed" },
  5: { time: 3, counts: [3, 3, 3, 5, 5, 5, 6, 6, 6, 6], type: "crop" },
};

export default function MarkerTrainer() {
  const [state, setState] = useState<GameState>({
    currentLevel: 1,
    stage: 1,
    questions: [],
    userInput: [],
    status: "idle",
    results: [],
    timeLeft: 5,
  });

  const timerRef = useRef<number | null>(null);

  // --- 遊戲邏輯 ---

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
      // 只有第五階才隨機選一個角落，其餘為空
      const crop =
        level === 5 ? crops[Math.floor(Math.random() * crops.length)] : "";
      return { type, crop };
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

  const handleLevelStart = (level: Level) => {
    setState((prev) => ({
      ...prev,
      currentLevel: level,
      results: [],
      stage: 1,
    }));
    startStage(level, 1);
  };

  const handleInput = (key: MarkerType) => {
    if (state.status !== "playing") return;

    const nextInput = [...state.userInput, key];
    const currentIndex = state.userInput.length;

    // 檢查是否點對
    if (key !== state.questions[currentIndex].type) {
      // 點錯直接判定該關失敗
      finishStage(false);
      return;
    }

    if (nextInput.length === state.questions.length) {
      // 全對，進入下一關
      finishStage(true);
    } else {
      setState((prev) => ({ ...prev, userInput: nextInput }));
    }
  };

  const finishStage = useCallback(
    (isCorrect: boolean) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const newResults = [...state.results, isCorrect];

      if (state.stage < 10) {
        setState((prev) => ({ ...prev, results: newResults }));
        startStage(state.currentLevel, state.stage + 1);
      } else {
        setState((prev) => ({
          ...prev,
          results: newResults,
          status: "result",
        }));
      }
    },
    [startStage, state.currentLevel, state.results, state.stage],
  );

  // 計時器邏輯
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
  }, [state.status, state.stage, state.timeLeft, finishStage]);

  // --- 計算結果 ---
  const accuracy = (state.results.filter(Boolean).length / 10) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              FF14 副本光標訓練
            </h1>
            <p className="text-zinc-400 text-sm">
              提升你的 ABCD / 1234 辨識反應
            </p>
          </div>
          {state.status === "playing" && (
            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full">
              <Timer
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
          )}
        </div>

        {/* 遊戲主畫面 */}
        {state.status === "idle" && (
          <div className="text-center py-12">
            <Trophy className="mx-auto mb-4 text-yellow-500" size={48} />
            <h2 className="text-xl mb-6">準備好挑戰了嗎？</h2>
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3, 4, 5].map((l) => (
                <button
                  key={l}
                  onClick={() => handleLevelStart(l as Level)}
                  className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg transition-colors border border-zinc-700"
                >
                  開始 第 {l} 階 {l === 5 && "(限時 3s + 局部顯示)"}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.status === "playing" && (
          <div className="flex flex-col items-center">
            <div className="text-zinc-500 mb-4">關卡: {state.stage} / 10</div>

            {/* 標記顯示區 */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 min-h-30">
              {state.questions.map((q, idx) => (
                <MarkerDisplay
                  question={q}
                  key={`${state.stage}-${idx}`}
                  level={state.currentLevel}
                  isDone={idx < state.userInput.length}
                />
              ))}
            </div>

            {/* 輸入按鈕區 */}
            <div className="grid grid-cols-4 gap-4 w-full">
              {MARKERS.map((m) => (
                <button
                  key={m}
                  onClick={() => handleInput(m)}
                  className={`py-6 rounded-xl text-2xl font-black border-b-4 active:border-b-0 active:translate-y-1 transition-all
                    ${COLORS[m as keyof typeof COLORS]} bg-zinc-800 border-zinc-950 hover:bg-zinc-700 text-white`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.status === "result" && (
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-2">訓練完成</h2>
            <div className="text-5xl font-black text-emerald-400 mb-6">
              {accuracy}%
            </div>
            <p className="text-zinc-400 mb-8">
              答對題數: {state.results.filter(Boolean).length} / 10
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleLevelStart(state.currentLevel)}
                className="flex items-center gap-2 bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <RefreshCw size={18} /> 重試此階
              </button>

              {accuracy >= 80 && state.currentLevel < 5 && (
                <button
                  onClick={() =>
                    handleLevelStart((state.currentLevel + 1) as Level)
                  }
                  className="flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  下一階 <ArrowRight size={18} />
                </button>
              )}

              {accuracy < 80 && (
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, status: "idle" }))
                  }
                  className="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700"
                >
                  返回選單
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MarkerDisplay({
  question,
  level,
  isDone,
}: {
  question: Question;
  level: Level;
  isDone: boolean;
}) {
  const { type, crop } = question;

  let filename = `${type}.png`;
  if (level === 3) filename = `${type}-bottom.png`;
  if (level === 4) {
    // 這裡雖然也有 random，但因為 MarkerDisplay 在每一關會重新掛載(key變了)
    // 且這只是決定路徑，相對穩定。如果也要嚴格，建議同樣在 startStage 決定好。
    // filename = question.filename; // 建議做法
  }

  return (
    <div
      className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-opacity duration-300
      ${isDone ? "opacity-20 grayscale" : "opacity-100 border-zinc-700 bg-zinc-800 shadow-lg"}`}
    >
      <img
        src={`/assets/${filename}`}
        className={`w-full h-full object-cover ${level === 5 ? `scale-[2.5] ${crop}` : ""}`}
        alt=""
      />
    </div>
  );
}
