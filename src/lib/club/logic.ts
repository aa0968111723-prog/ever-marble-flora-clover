import {
  COLORS,
  GAME_DURATION,
  titleForScore,
  type ColorDef,
  type ColorId,
  type GameResultPayload,
  type Mode,
  type PlayerInfo,
} from "./constants";

export type Question = {
  meaning: ColorDef;
  visual: ColorDef;
};

export type LiveGame = {
  score: number;
  combo: number;
  maxCombo: number;
  correct: number;
  wrong: number;
  mode: Mode;
  lastModeSwitch: number;
  startTime: number;
  ended: boolean;
  resultSubmitted: boolean;
  question: Question;
};

export function randomColor(except?: ColorId): ColorDef {
  const pool = except ? COLORS.filter((c) => c.id !== except) : COLORS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/** 出題：字義與視覺顏色永遠不能相同 */
export function nextQuestion(): Question {
  const meaning = randomColor();
  const visual = randomColor(meaning.id);
  return { meaning, visual };
}

export function createLiveGame(now = Date.now()): LiveGame {
  return {
    score: 0,
    combo: 0,
    maxCombo: 0,
    correct: 0,
    wrong: 0,
    mode: "meaning",
    lastModeSwitch: now,
    startTime: now,
    ended: false,
    resultSubmitted: false,
    question: nextQuestion(),
  };
}

export function remainingSeconds(game: LiveGame, now = Date.now()): number {
  const elapsed = (now - game.startTime) / 1000;
  return Math.max(0, GAME_DURATION - elapsed);
}

export function correctId(game: LiveGame): ColorId {
  return game.mode === "meaning" ? game.question.meaning.id : game.question.visual.id;
}

export type JudgeResult = {
  ok: boolean;
  delta: number;
  combo: number;
  switched: boolean;
};

const SWITCH_GUARD_MS = 420;

/** 判分 + Combo。連續 3 題或距上次切換滿 3 秒會換模式。 */
export function judgeAnswer(
  game: LiveGame,
  picked: ColorId,
  now = Date.now(),
): JudgeResult {
  if (game.ended) return { ok: false, delta: 0, combo: game.combo, switched: false };
  const ok = picked === correctId(game);
  let delta = 0;
  let switched = false;

  if (ok) {
    game.correct += 1;
    game.combo += 1;
    if (game.combo > game.maxCombo) game.maxCombo = game.combo;
    delta = game.combo >= 5 ? 200 : 100;
    game.score += delta;
    if (game.combo > 0 && game.combo % 3 === 0) {
      switched = trySwitchMode(game, now);
    }
  } else {
    game.wrong += 1;
    game.combo = 0;
    delta = -50;
    game.score = Math.max(0, game.score - 50);
  }

  game.question = nextQuestion();
  return { ok, delta, combo: game.combo, switched };
}

export function trySwitchMode(game: LiveGame, now = Date.now()): boolean {
  if (now - game.lastModeSwitch < SWITCH_GUARD_MS) return false;
  game.mode = game.mode === "meaning" ? "visual" : "meaning";
  game.lastModeSwitch = now;
  return true;
}

export function maybeTimedSwitch(game: LiveGame, now = Date.now()): boolean {
  if (game.ended) return false;
  if (now - game.lastModeSwitch < 3000) return false;
  return trySwitchMode(game, now);
}

export function colorByKey(key: string): ColorId | null {
  const k = key.toLowerCase();
  for (const c of COLORS) {
    if (c.key[0] === k || c.key[1] === k) return c.id;
  }
  return null;
}

export function taipeiTime(date = new Date()): string {
  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  return fmt.replace(/-/g, "/");
}

export function buildResult(
  player: PlayerInfo,
  game: LiveGame,
  userAgent = "",
): GameResultPayload {
  const total = game.correct + game.wrong;
  const accuracy = total ? Math.round((game.correct / total) * 100) : 0;
  return {
    timestamp: Date.now(),
    time: taipeiTime(),
    game: "game1",
    name: player.name,
    department: player.department,
    phone: player.phone,
    email: player.email,
    score: game.score,
    correct: game.correct,
    wrong: game.wrong,
    total,
    accuracy,
    maxCombo: game.maxCombo,
    title: titleForScore(game.score),
    duration: GAME_DURATION,
    userAgent,
  };
}

export function emptyPlayer(): PlayerInfo {
  return { name: "", department: "", phone: "", email: "" };
}
