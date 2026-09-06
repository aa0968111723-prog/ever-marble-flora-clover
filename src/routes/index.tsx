import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Eye, RotateCcw, Timer, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SceneHero, SceneRibbon, SkyDecor } from "@/components/sky-decor";
import { Turtle } from "@/components/turtle";
import {
  CLUB_NAME_DEFAULT,
  COLORS,
  GAME_DURATION,
  type ColorId,
  type PlayerInfo,
  type TurtleMood,
} from "@/lib/club/constants";
import {
  buildResult,
  colorByKey,
  createLiveGame,
  emptyPlayer,
  judgeAnswer,
  maybeTimedSwitch,
  remainingSeconds,
  type LiveGame,
} from "@/lib/club/logic";
import { validatePlayer, type FieldErrors } from "@/lib/club/validate";

export const Route = createFileRoute("/")({ component: Home });

type Screen = "register" | "game" | "result";
type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok"; sheet: boolean; email: boolean; sheetsConfigured: boolean; smtpConfigured: boolean }
  | { kind: "offline" };

type LbRow = { name: string; department: string; score: number };
type Pop = { id: number; text: string; kind: "good" | "combo" | "bad" };

function Home() {
  const [screen, setScreen] = useState<Screen>("register");
  const [player, setPlayer] = useState<PlayerInfo>(emptyPlayer);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(GAME_DURATION);
  const [mood, setMood] = useState<TurtleMood>("wave");
  const [modePulse, setModePulse] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [club, setClub] = useState(CLUB_NAME_DEFAULT);
  const [lb, setLb] = useState<LbRow[]>([]);
  const [tick, setTick] = useState(0);

  const gameRef = useRef<LiveGame>(createLiveGame());
  const playerRef = useRef<PlayerInfo>(player);
  const moodTimer = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  playerRef.current = player;

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.rows)) setLb(d.rows.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  const bumpMood = useCallback((next: TurtleMood, ms = 420) => {
    setMood(next);
    window.clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms) as unknown as number;
  }, []);

  const beep = useCallback((ok: boolean) => {
    try {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!C) return;
      if (!audioRef.current) audioRef.current = new C();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = ok ? 784 : 196;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      o.stop(ctx.currentTime + 0.13);
    } catch {
      /* ignore */
    }
  }, []);

  const flashMode = useCallback(() => {
    setModePulse((n) => n + 1);
    try {
      navigator.vibrate?.(30);
    } catch {
      /* ignore */
    }
  }, []);

  const endGame = useCallback(() => {
    const g = gameRef.current;
    if (g.ended) return;
    g.ended = true;
    setRemaining(0);
    setMood("celebrate");
    setScreen("result");
    setSave({ kind: "saving" });

    if (g.resultSubmitted) return;
    g.resultSubmitted = true;

    const payload = buildResult(
      playerRef.current,
      g,
      typeof navigator !== "undefined" ? navigator.userAgent : "",
    );

    fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        setClub(d.clubName || CLUB_NAME_DEFAULT);
        if (!r.ok) {
          setSave({ kind: "offline" });
          return;
        }
        setSave({
          kind: "ok",
          sheet: Boolean(d.sheetSaved),
          email: Boolean(d.emailSent),
          sheetsConfigured: Boolean(d.sheetsConfigured),
          smtpConfigured: Boolean(d.smtpConfigured),
        });
      })
      .catch(() => setSave({ kind: "offline" }));
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    let raf = 0;
    const loop = () => {
      const g = gameRef.current;
      if (g.ended) return;
      const left = remainingSeconds(g);
      setRemaining(left);
      if (left <= 0) {
        endGame();
        return;
      }
      if (maybeTimedSwitch(g)) {
        flashMode();
        setTick((n) => n + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [screen, endGame, flashMode]);

  const answer = useCallback(
    (id: ColorId) => {
      const g = gameRef.current;
      if (g.ended || screen !== "game") return;
      const res = judgeAnswer(g, id);
      beep(res.ok);
      const popId = Date.now() + Math.random();
      if (res.ok) {
        const comboHit = res.combo >= 5;
        setPops((list) => [
          ...list.slice(-2),
          {
            id: popId,
            text: comboHit ? "+200 COMBO!" : "+100",
            kind: comboHit ? "combo" : "good",
          },
        ]);
        bumpMood(res.combo >= 5 ? "happy" : "jump");
        try {
          navigator.vibrate?.(12);
        } catch {
          /* ignore */
        }
      } else {
        setPops((list) => [
          ...list.slice(-2),
          { id: popId, text: "-50", kind: "bad" },
        ]);
        bumpMood("surprise", 320);
        try {
          navigator.vibrate?.(40);
        } catch {
          /* ignore */
        }
      }
      if (res.switched) flashMode();
      window.setTimeout(() => {
        setPops((list) => list.filter((p) => p.id !== popId));
      }, 620);
      setTick((n) => n + 1);
    },
    [screen, beep, bumpMood, flashMode],
  );

  useEffect(() => {
    const api = {
      endNow: () => {
        gameRef.current.startTime = Date.now() - GAME_DURATION * 1000;
      },
      getState: () => ({ ...gameRef.current, screen }),
      answer,
    };
    (window as unknown as { __focusChallenge: typeof api }).__focusChallenge = api;
  }, [answer, screen]);

  useEffect(() => {
    if (screen !== "game") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const id = colorByKey(e.key);
      if (!id) return;
      e.preventDefault();
      answer(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, answer]);

  function setField<K extends keyof PlayerInfo>(key: K, value: string) {
    setPlayer((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function startChallenge() {
    const parsed = validatePlayer(player);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setPlayer(parsed.data);
    playerRef.current = parsed.data;
    setBusy(true);

    try {
      const ctrl = new AbortController();
      const t = window.setTimeout(() => ctrl.abort(), 3500);
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: ctrl.signal,
      });
      window.clearTimeout(t);
      const d = await r.json().catch(() => ({}));
      if (d.clubName) setClub(d.clubName);
    } catch {
      /* 現場不斷線就好 */
    }

    gameRef.current = createLiveGame();
    setRemaining(GAME_DURATION);
    setPops([]);
    setMood("idle");
    setSave({ kind: "idle" });
    setBusy(false);
    setScreen("game");
  }

  function playAgain() {
    setPlayer(emptyPlayer());
    playerRef.current = emptyPlayer();
    setErrors({});
    gameRef.current = createLiveGame();
    setRemaining(GAME_DURATION);
    setPops([]);
    setSave({ kind: "idle" });
    setMood("wave");
    setScreen("register");
  }

  const g = gameRef.current;
  const timeShow = Math.ceil(remaining);
  const q = g.question;
  const timeRatio = Math.max(0, Math.min(1, remaining / GAME_DURATION));
  void tick;

  return (
    <div className="app-root" data-screen={screen}>
      <SkyDecor />
      <div className="shell">
        {screen === "register" ? (
          <section className="screen screen-register active">
            <RegisterScreen
              player={player}
              errors={errors}
              busy={busy}
              lb={lb}
              onChange={setField}
              onStart={() => void startChallenge()}
            />
          </section>
        ) : null}

        {screen === "game" ? (
          <section className="screen screen-game active">
            <div className="hud" aria-live="polite">
              <div className="hud-item">
                <span>玩家</span>
                <strong>{player.name || "—"}</strong>
              </div>
              <div className={`hud-item${timeShow <= 10 ? " warn" : ""}`}>
                <span>時間</span>
                <strong>{timeShow}</strong>
              </div>
              <div className="hud-item">
                <span>分數</span>
                <strong>{g.score}</strong>
              </div>
              <div className="hud-item">
                <span>Combo</span>
                <strong>x{g.combo}</strong>
              </div>
            </div>

            <div
              className={`time-rail${timeShow <= 10 ? " is-warn" : ""}`}
              aria-hidden="true"
            >
              <i style={{ transform: `scaleX(${timeRatio})` }} />
            </div>

            <div className={`mode-card${modePulse ? " switch" : ""}`} key={modePulse}>
              <div className="flash" />
              <small>請點擊</small>
              <strong>{g.mode === "meaning" ? "【字面意思】" : "【視覺顏色】"}</strong>
            </div>

            <div className="play-area">
              {pops.map((p) => (
                <div key={p.id} className={`float-pop ${p.kind}`}>
                  {p.text}
                </div>
              ))}
              <div className="stroop-card">
                <div className="stroop" style={{ color: q.visual.hex }}>
                  {q.meaning.label}
                </div>
              </div>
              <Turtle mood={mood} size={86} />
            </div>

            <div className="deck-tray">
              <div className="answers">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`ans ans-${c.id}`}
                    aria-label={c.label}
                    disabled={g.ended}
                    onClick={() => answer(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <p className="keys-hint">鍵盤 1 紅 · 2 藍 · 3 綠 · 4 黃</p>
            </div>
          </section>
        ) : null}

        {screen === "result" ? (
          <section className="screen screen-result active">
            <ResultScreen
              player={player}
              game={g}
              save={save}
              club={club}
              onAgain={playAgain}
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}

function RegisterScreen({
  player,
  errors,
  busy,
  lb,
  onChange,
  onStart,
}: {
  player: PlayerInfo;
  errors: FieldErrors;
  busy: boolean;
  lb: LbRow[];
  onChange: <K extends keyof PlayerInfo>(key: K, value: string) => void;
  onStart: () => void;
}) {
  return (
    <>
      <SceneHero />
      <div className="lintel" aria-hidden="true" />
      <div className="sheet">
        <header className="masthead">
          <p className="eyebrow">淡江大學禪學社 · 社團博覽會</p>
          <h1 className="hero-title">專注力挑戰賽</h1>
          <p className="subtitle">60 秒，看看你能不能讓眼睛和大腦合作。</p>
        </header>

        <div className="prize">
          <div className="prize-badge" aria-hidden="true">
            <Trophy size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2>社博當天最高分前 5 名</h2>
            <p>免費送手搖杯。來看清楚、再出手。</p>
          </div>
        </div>

        <div className="tips">
          <div className="tip">
            <strong>
              <Timer size={14} strokeWidth={2.2} />
              規則一
            </strong>
            你有 60 秒。
          </div>
          <div className="tip">
            <strong>
              <Eye size={14} strokeWidth={2.2} />
              規則二
            </strong>
            看清楚指令，再做選擇。
          </div>
        </div>

        <form
          className="panel form"
          onSubmit={(e) => {
            e.preventDefault();
            onStart();
          }}
          noValidate
        >
          <div className="field-grid">
            <Field
              label="姓名"
              id="name"
              value={player.name}
              placeholder="你的名字"
              error={errors.name}
              autoComplete="name"
              onChange={(v) => onChange("name", v)}
            />
            <Field
              label="系級"
              id="department"
              value={player.department}
              placeholder="資工一A"
              error={errors.department}
              autoComplete="organization-title"
              onChange={(v) => onChange("department", v)}
            />
            <Field
              label="電話"
              id="phone"
              value={player.phone}
              placeholder="09xxxxxxxx"
              error={errors.phone}
              inputMode="tel"
              autoComplete="tel"
              className="span-2"
              onChange={(v) => onChange("phone", v)}
            />
            <Field
              label="Email"
              id="email"
              value={player.email}
              placeholder="example@email.com"
              error={errors.email}
              inputMode="email"
              autoComplete="email"
              className="span-2"
              onChange={(v) => onChange("email", v)}
            />
          </div>
          <button className="cta" type="submit" disabled={busy}>
            {busy ? "準備中…" : "開始 60 秒挑戰"}
            {busy ? null : <ArrowRight size={18} strokeWidth={2.4} />}
          </button>
          <p className="privacy">
            資料僅供本次活動聯絡、成績紀錄與活動相關通知使用。
          </p>
        </form>

        {lb.length > 0 ? (
          <div className="panel lb">
            <h3>今日 TOP 5</h3>
            <ol>
              {lb.map((row, i) => (
                <li key={`${row.name}-${i}`}>
                  <span className="who">
                    <span className="rank">{i + 1}</span>
                    {row.name}
                    <span className="dept"> · {row.department}</span>
                  </span>
                  <span className="score">{row.score}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </>
  );
}

function Field({
  label,
  id,
  value,
  placeholder,
  error,
  onChange,
  inputMode,
  autoComplete,
  className = "",
}: {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (v: string) => void;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        <span className="req">*</span>
      </label>
      <input
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        className={error ? "invalid" : ""}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <div className="err" id={`${id}-err`}>
          {error}
        </div>
      ) : null}
    </div>
  );
}

function ResultScreen({
  player,
  game,
  save,
  club,
  onAgain,
}: {
  player: PlayerInfo;
  game: LiveGame;
  save: SaveState;
  club: string;
  onAgain: () => void;
}) {
  const total = game.correct + game.wrong;
  const accuracy = total ? Math.round((game.correct / total) * 100) : 0;
  const title =
    game.score >= 3000
      ? "Lv.4 卓越領袖"
      : game.score >= 2000
        ? "Lv.3 穩定領航者"
        : game.score >= 1000
          ? "Lv.2 潛力領袖"
          : "Lv.1 心靈修煉者";

  return (
    <>
      <SceneRibbon />
      <div className="lintel" aria-hidden="true" />
      <div className="sheet result-sheet">
        <div className="result-hero">
          <Turtle mood="celebrate" size={84} />
          <h1>完成！</h1>
          <p>{player.name}</p>
          <div className="score-xl">{game.score}</div>
          <div className="title-chip">{title}</div>
        </div>

        <div className="stats">
          <div className="stat">
            <span>答對率</span>
            <strong>{accuracy}%</strong>
          </div>
          <div className="stat">
            <span>最高連擊</span>
            <strong>x{game.maxCombo}</strong>
          </div>
          <div className="stat">
            <span>答對</span>
            <strong>{game.correct}</strong>
          </div>
          <div className="stat">
            <span>答錯</span>
            <strong>{game.wrong}</strong>
          </div>
        </div>

        <SaveStatus save={save} />

        <div className="result-actions">
          <button className="cta secondary" type="button" onClick={onAgain}>
            <RotateCcw size={16} strokeWidth={2.4} />
            再挑戰一次
          </button>
        </div>

        <div className="panel join-copy">
          <span className="seal" aria-hidden="true">
            禪
          </span>
          <p>剛剛的 60 秒，不只是反應速度。當資訊變多、壓力變大，真正重要的是：你還能不能知道自己正在做什麼。</p>
          <p>在大學裡，領導力不只是帶領別人，也包括專注、溝通、認識自己，以及與不同的人合作。</p>
          <p>如果你想在大學期間認識一群夥伴，一起體驗更多活動、成長與挑戰，歡迎來認識我們。</p>
          <p className="join-cta">認識{club}</p>
        </div>
      </div>
    </>
  );
}

function SaveStatus({ save }: { save: SaveState }) {
  if (save.kind === "saving") {
    return <p className="status-line">正在儲存成績…</p>;
  }
  if (save.kind === "offline") {
    return (
      <p className="status-line warn">
        目前尚未連接成績資料庫，本次成績僅供現場查看。
      </p>
    );
  }
  if (save.kind === "ok") {
    const lines: string[] = [];
    if (save.sheet) lines.push("成績已記錄");
    else if (!save.sheetsConfigured) {
      lines.push("目前尚未設定成績後端，本次成績僅供現場查看。");
    } else {
      lines.push("目前尚未連接成績資料庫，本次成績僅供現場查看。");
    }
    if (save.email) lines.push("結果已寄到你的 Email");
    else if (save.smtpConfigured) {
      lines.push("成績已完成，但結果信目前無法寄送。");
    } else {
      lines.push("成績已完成，但 Email 暫時無法寄送。");
    }
    return (
      <div>
        {lines.map((l) => (
          <p
            key={l}
            className={`status-line${l.includes("已") ? " ok" : " warn"}`}
          >
            {l.includes("已") ? `✓ ${l}` : l}
          </p>
        ))}
      </div>
    );
  }
  return <p className="status-line" />;
}
