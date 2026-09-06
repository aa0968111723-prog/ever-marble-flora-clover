export const GAME_DURATION = 60;
export const CLUB_NAME_DEFAULT = "淡江大學禪學社";

export const COLORS = [
  { id: "red", label: "紅", hex: "#EF4444", key: ["1", "r"] },
  { id: "blue", label: "藍", hex: "#3B82F6", key: ["2", "b"] },
  { id: "green", label: "綠", hex: "#10B981", key: ["3", "g"] },
  { id: "yellow", label: "黃", hex: "#EAB308", key: ["4", "y"] },
] as const;

export type ColorId = (typeof COLORS)[number]["id"];
export type ColorDef = (typeof COLORS)[number];
export type Mode = "meaning" | "visual";

export const TITLE_RULES = [
  { min: 3000, title: "Lv.4 卓越領袖" },
  { min: 2000, title: "Lv.3 穩定領航者" },
  { min: 1000, title: "Lv.2 潛力領袖" },
  { min: 0, title: "Lv.1 心靈修煉者" },
] as const;

export function titleForScore(score: number): string {
  if (score >= 3000) return "Lv.4 卓越領袖";
  if (score >= 2000) return "Lv.3 穩定領航者";
  if (score >= 1000) return "Lv.2 潛力領袖";
  return "Lv.1 心靈修煉者";
}

export type PlayerInfo = {
  name: string;
  department: string;
  phone: string;
  email: string;
};

export type GameResultPayload = {
  timestamp: number;
  time: string;
  game: "game1";
  name: string;
  department: string;
  phone: string;
  email: string;
  score: number;
  correct: number;
  wrong: number;
  total: number;
  accuracy: number;
  maxCombo: number;
  title: string;
  duration: number;
  userAgent?: string;
};

export type TurtleMood =
  | "idle"
  | "wave"
  | "happy"
  | "jump"
  | "surprise"
  | "celebrate"
  | "cheer";
