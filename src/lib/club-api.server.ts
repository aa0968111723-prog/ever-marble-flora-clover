import { CLUB_NAME_DEFAULT, type GameResultPayload } from "./club/constants";
import { clampInt, clampScore, validatePlayer } from "./club/validate";

type LbRow = { name: string; department: string; score: number };

const leaderboard: LbRow[] = [];
const hits = new Map<string, number[]>();

function env(name: string, fallback = ""): string {
  return String(process.env[name] ?? fallback).trim();
}

export function clubName(): string {
  return env("CLUB_NAME", CLUB_NAME_DEFAULT);
}

export function contactEmail(): string {
  return env("CONTACT_EMAIL");
}

export function corsHeaders(req: Request): HeadersInit {
  const allow = env("FRONTEND_URL", "*");
  const origin = req.headers.get("origin") || allow;
  const value = allow === "*" ? origin || "*" : allow;
  return {
    "Access-Control-Allow-Origin": value,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export function json(data: unknown, status: number, req: Request): Response {
  return Response.json(data, { status, headers: corsHeaders(req) });
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "local";
}

export function rateLimit(ip: string, limit = 24, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(ip, arr);
    return false;
  }
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

export function rememberScore(row: LbRow) {
  leaderboard.push(row);
  if (leaderboard.length > 400) leaderboard.splice(0, leaderboard.length - 400);
}

export function memoryTop5(): LbRow[] {
  return [...leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ name, department, score }) => ({ name, department, score }));
}

function smtpReady(): boolean {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}

function sheetsReady(): boolean {
  return Boolean(env("GOOGLE_SCRIPT_URL"));
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, rej) => {
        ctrl.signal.addEventListener("abort", () => rej(new Error("timeout")));
      }),
    ]);
  } finally {
    clearTimeout(t);
  }
}

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function sendMail(input: MailInput): Promise<boolean> {
  if (!smtpReady()) return false;
  try {
    const nodemailer = await import("nodemailer");
    const port = Number(env("SMTP_PORT", "587")) || 587;
    const secure =
      env("SMTP_SECURE") === "true" || env("SMTP_SECURE") === "1" || port === 465;
    const transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port,
      secure,
      auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
    });
    await withTimeout(
      transporter.sendMail({
        from: env("SMTP_FROM") || env("SMTP_USER"),
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
      8000,
    );
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => {
    if (ch === "&") return "\u0026amp;";
    if (ch === "<") return "\u0026lt;";
    if (ch === ">") return "\u0026gt;";
    if (ch === '"') return "\u0026quot;";
    return "\u0026#39;";
  });
}

function startMail(name: string) {
  const club = clubName();
  const subject = "【專注力挑戰賽】挑戰即將開始！";
  const text = `嗨，${name}：

謝謝你願意停下腳步，參加「專注力挑戰賽」。

接下來的 60 秒，請看清楚指令，再做選擇。
我們在攤位等你回來。

— ${club}`;
  const html = `
  <div style="font-family:'Microsoft JhengHei','Noto Sans TC',sans-serif;color:#24333F;max-width:520px;margin:0 auto;padding:24px;background:#EAF6FF;">
    <div style="background:#FFFDF7;border-radius:18px;padding:24px;">
      <p style="margin:0 0 12px;font-size:16px;">嗨，${escapeHtml(name)}：</p>
      <p style="margin:0 0 12px;line-height:1.7;">謝謝你願意停下腳步，參加「專注力挑戰賽」。</p>
      <p style="margin:0 0 12px;line-height:1.7;">接下來的 60 秒，請看清楚指令，再做選擇。</p>
      <p style="margin:0;color:#5b6b76;">— ${escapeHtml(club)}</p>
    </div>
  </div>`;
  return { subject, text, html };
}

function resultMail(p: GameResultPayload) {
  const club = clubName();
  const subject = "【專注力挑戰賽】你的挑戰結果出爐啦！";
  const text = `嗨，${p.name}：

謝謝你參加「專注力挑戰賽」！

你的本次成績：
分數：
${p.score}
答對率：
${p.accuracy}%
最高連擊：
${p.maxCombo}
獲得稱號：
${p.title}

很高興今天在社團博覽會遇見你。
領導力並不是比別人更快，
而是能夠在混亂裡保持清楚，
在壓力裡仍然知道自己正在做什麼。

如果你想認識更多朋友、
探索自己，
也練習專注、表達與領導能力，
歡迎來認識我們！

— ${club}`;

  const html = `
  <div style="font-family:'Microsoft JhengHei','Noto Sans TC',sans-serif;color:#24333F;max-width:520px;margin:0 auto;padding:16px;background:#EAF6FF;">
    <div style="background:#FFFDF7;border-radius:18px;padding:24px 22px;">
      <p style="margin:0 0 14px;font-size:16px;">嗨，${escapeHtml(p.name)}：</p>
      <p style="margin:0 0 16px;line-height:1.75;font-size:15px;">謝謝你參加「專注力挑戰賽」！</p>
      <p style="margin:0 0 8px;font-weight:600;">你的本次成績：</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 18px;font-size:15px;">
        <tr><td style="padding:8px 0;color:#5b6b76;">分數</td><td style="padding:8px 0;text-align:right;font-weight:700;">${p.score}</td></tr>
        <tr><td style="padding:8px 0;color:#5b6b76;">答對率</td><td style="padding:8px 0;text-align:right;font-weight:700;">${p.accuracy}%</td></tr>
        <tr><td style="padding:8px 0;color:#5b6b76;">最高連擊</td><td style="padding:8px 0;text-align:right;font-weight:700;">${p.maxCombo}</td></tr>
        <tr><td style="padding:8px 0;color:#5b6b76;">獲得稱號</td><td style="padding:8px 0;text-align:right;font-weight:700;">${escapeHtml(p.title)}</td></tr>
      </table>
      <p style="margin:0 0 10px;line-height:1.75;font-size:15px;">很高興今天在社團博覽會遇見你。<br>領導力並不是比別人更快，<br>而是能夠在混亂裡保持清楚，<br>在壓力裡仍然知道自己正在做什麼。</p>
      <p style="margin:0 0 18px;line-height:1.75;font-size:15px;">如果你想認識更多朋友、<br>探索自己，<br>也練習專注、表達與領導能力，<br>歡迎來認識我們！</p>
      <p style="margin:0;color:#5b6b76;">— ${escapeHtml(club)}</p>
    </div>
  </div>`;
  return { subject, text, html };
}

export async function saveToSheet(
  payload: Record<string, unknown>,
): Promise<boolean> {
  const url = env("GOOGLE_SCRIPT_URL");
  if (!url) return false;
  try {
    const res = await withTimeout(
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      }),
      8000,
    );
    if (!res.ok) {
      console.error("[sheets] status", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sheets] failed", err);
    return false;
  }
}

export async function fetchSheetLeaderboard(): Promise<LbRow[] | null> {
  const url = env("GOOGLE_SCRIPT_URL");
  if (!url) return null;
  try {
    const res = await withTimeout(
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "leaderboard" }),
        redirect: "follow",
      }),
      6000,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { rows?: LbRow[] };
    if (!Array.isArray(data.rows)) return null;
    return data.rows
      .filter((r) => r && typeof r.name === "string" && typeof r.score === "number")
      .slice(0, 5)
      .map((r) => ({
        name: String(r.name).slice(0, 30),
        department: String(r.department || "").slice(0, 50),
        score: clampScore(r.score),
      }));
  } catch (err) {
    console.error("[sheets] leaderboard failed", err);
    return null;
  }
}

export async function handleRegister(req: Request): Promise<Response> {
  if (!rateLimit(clientIp(req))) {
    return json({ ok: false, error: "too_many" }, 429, req);
  }
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, req);
  }
  const parsed = validatePlayer(body);
  if (!parsed.ok) {
    return json({ ok: false, errors: parsed.errors }, 400, req);
  }

  let emailSent = false;
  if (smtpReady()) {
    const mail = startMail(parsed.data.name);
    emailSent = await sendMail({ to: parsed.data.email, ...mail });
  }

  return json(
    {
      ok: true,
      emailSent,
      clubName: clubName(),
    },
    200,
    req,
  );
}

export async function handleResult(req: Request): Promise<Response> {
  if (!rateLimit(clientIp(req), 18)) {
    return json({ ok: false, error: "too_many" }, 429, req);
  }
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, req);
  }

  const parsed = validatePlayer(body);
  if (!parsed.ok) {
    return json({ ok: false, errors: parsed.errors }, 400, req);
  }

  const score = clampScore(body.score);
  const correct = clampInt(body.correct, 2000);
  const wrong = clampInt(body.wrong, 2000);
  const total = clampInt(body.total ?? correct + wrong, 4000);
  const accuracy = clampInt(body.accuracy, 100);
  const maxCombo = clampInt(body.maxCombo, 2000);
  const title = String(body.title ?? "").slice(0, 40);
  const time = String(body.time ?? "").slice(0, 32);
  const timestamp = clampInt(body.timestamp, Date.now() + 60_000);
  const ua =
    String(body.userAgent ?? "").slice(0, 180) ||
    (req.headers.get("user-agent") || "").slice(0, 180);

  const payload: GameResultPayload = {
    timestamp,
    time,
    game: "game1",
    name: parsed.data.name,
    department: parsed.data.department,
    phone: parsed.data.phone,
    email: parsed.data.email,
    score,
    correct,
    wrong,
    total,
    accuracy,
    maxCombo,
    title,
    duration: 60,
    userAgent: ua,
  };

  rememberScore({
    name: payload.name,
    department: payload.department,
    score: payload.score,
  });

  let sheetSaved = false;
  let emailSent = false;

  if (sheetsReady()) {
    sheetSaved = await saveToSheet({ ...payload });
  }

  if (smtpReady()) {
    const mail = resultMail(payload);
    emailSent = await sendMail({ to: payload.email, ...mail });
  }

  return json(
    {
      ok: true,
      sheetSaved,
      emailSent,
      sheetsConfigured: sheetsReady(),
      smtpConfigured: smtpReady(),
      clubName: clubName(),
      contactEmail: contactEmail(),
    },
    200,
    req,
  );
}

export async function handleLeaderboard(req: Request): Promise<Response> {
  const remote = await fetchSheetLeaderboard();
  const rows = remote && remote.length ? remote : memoryTop5();
  return json({ ok: true, rows }, 200, req);
}
