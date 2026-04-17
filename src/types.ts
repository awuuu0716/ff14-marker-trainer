export type MarkerType = "A" | "B" | "C" | "D" | "1" | "2" | "3" | "4";
export type Level = 1 | 2 | 3 | 4 | 5;
export type CropType =
  | "object-left-top"
  | "object-right-top"
  | "object-left-bottom"
  | "object-right-bottom"
  | "";
export type GameStatus = "idle" | "countdown" | "playing" | "result";

export interface Question {
  type: MarkerType;
  crop: CropType;
  filename: string;
}

export const MARKERS: MarkerType[] = ["A", "B", "C", "D", "1", "2", "3", "4"];
export const COLORS: Record<MarkerType, string> = {
  A: "border-red-500",
  1: "border-red-500",
  B: "border-yellow-500",
  2: "border-yellow-500",
  C: "border-blue-500",
  3: "border-blue-500",
  D: "border-purple-500",
  4: "border-purple-500",
};

export interface GameState {
  currentLevel: Level;
  stage: number;
  questions: Question[];
  userInput: MarkerType[];
  status: GameStatus;
  countdownValue: number;
  results: boolean[];
  timeLeft: number;
  isError: boolean;
}

export const LEVEL_CONFIG = {
  1: {
    name: "光標初學者學堂",
    time: 10,
    counts: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
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

export const testQuestions: Question[] = [
  {
    type: "D",
    filename: "D.png",
    crop: "",
  },
  {
    type: "2",
    filename: "2.png",
    crop: "",
  },
  {
    type: "2",
    filename: "2.png",
    crop: "",
  },
  {
    type: "2",
    filename: "2.png",
    crop: "",
  },
  {
    type: "2",
    filename: "2.png",
    crop: "",
  },
];
