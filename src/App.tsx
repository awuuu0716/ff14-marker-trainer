import { useGameEngine } from "./hooks/useGameEngine";
import GameHeader from "./components/GameHeader";
import Loading from "./components/Loading";
import Menu from "./components/Menu";
import ReadyCheck from "./components/ReadyCheck";
import Playing from "./components/Playing";
import Result from "./components/Result";

export default function MarkerTrainer() {
  const {
    state,
    handleLevelStart,
    handleInput,
    goToMenu,
    isAssetsLoaded,
    loadProgress,
  } = useGameEngine();

  const accuracy = (state.results.filter(Boolean).length / 10) * 100;

  // 如果資源還沒載入好，顯示讀取條
  if (!isAssetsLoaded) {
    return <Loading loadProgress={loadProgress} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl min-h-125 flex flex-col">
        <GameHeader timeLeft={state.timeLeft} status={state.status} />
        {/* 初始畫面 */}
        {state.status === "idle" && (
          <Menu handleLevelStart={handleLevelStart} />
        )}
        {/* 倒數畫面 */}
        {state.status === "countdown" && (
          <ReadyCheck
            currentLevel={state.currentLevel}
            countdownValue={state.countdownValue}
          />
        )}
        {/* 遊戲進行畫面 */}
        {state.status === "playing" && (
          <Playing
            stage={state.stage}
            questions={state.questions}
            currentLevel={state.currentLevel}
            userInput={state.userInput}
            handleInput={handleInput}
          />
        )}
        {/* 結果畫面 */}
        {state.status === "result" && (
          <Result
            accuracy={accuracy}
            results={state.results}
            currentLevel={state.currentLevel}
            handleLevelStart={handleLevelStart}
            goToMenu={goToMenu}
          />
        )}
      </div>
    </div>
  );
}
