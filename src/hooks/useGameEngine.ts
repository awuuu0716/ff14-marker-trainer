import { useState, useEffect, useRef, useCallback } from "react";
import {
  LEVEL_CONFIG,
  MARKERS,
  type CropType,
  type GameStatus,
  type Level,
  type MarkerType,
  type Question,
} from "../types";

const getAssetUrls = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const urls: string[] = [];

  // 1. ABCD 1234 的本體與底座
  MARKERS.forEach((m) => {
    urls.push(`${baseUrl}assets/${m}.png`);
    urls.push(`${baseUrl}assets/${m}-bottom.png`);
  });

  // 2. 倒數用的數字 1-4
  [1, 2, 3, 4].forEach((n) => {
    urls.push(`${baseUrl}assets/${n}.png`);
  });

  // 3. 參考大圖
  urls.push(`${baseUrl}assets/reference.jpg`);

  return urls;
};

export function useGameEngine() {
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
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const urls = getAssetUrls();
    let loadedCount = 0;

    const loadImage = (url: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // 即使失敗也繼續，避免卡死
      });
    };

    // 逐一載入並更新進度條
    const loadAll = async () => {
      for (const url of urls) {
        await loadImage(url);
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / urls.length) * 100));
      }
      // 稍微延遲一下，讓使用者看清 100%
      setTimeout(() => setIsAssetsLoaded(true), 500);
    };

    loadAll();
  }, []);

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
  }, [state.status, state.stage, finishStage, state.timeLeft]);

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

  return {
    state,
    handleLevelStart,
    handleInput,
    goToMenu,
    isAssetsLoaded,
    loadProgress,
  };
}
