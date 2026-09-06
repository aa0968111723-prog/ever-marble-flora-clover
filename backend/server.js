import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 8080);
const CLUB_NAME = (process.env.CLUB_NAME || "淡江大學禪學社").trim();
const CONTACT_EMAIL = (process.env.CONTACT_EMAIL || "").trim();
const FRONTEND_URL = (process.env.FRONTEND_URL || "*").trim();
const GOOGLE_SCRIPT_URL = (process.env.GOOGLE_SCRIPT_URL || "").trim();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^09\d{8}$/;

const leaderboard = [];
const hits = new Map();

function envReadySmtp() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function cors(req, res) {
  const origin = req.headers.origin || FRONTEND_URL;
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL === "*" ? origin || "*" : FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function send(res, status, data, req) {
  cors(req, res);
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function ip(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress || "local";
}

function rateLimit(req, limit = 24) {
  const key = ip(req);
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < 60_000);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 200_000) {
        reject(new Error("too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function normalizePhone(raw) {
  return String(raw || "").replace(/[\s\-()]/g, "");
}

function validatePlayer(input) {
  const name = String(input.name ?? "").trim();
  const department = String(input.department ?? "").trim();
  const phone = normalizePhone(input.phone);
  const email = String(input.email ?? "").trim().toLowerCase();
  const errors = {};
  if (!name) errors.name = "請填寫姓名";
  else if (name.length > 30) errors.name = "姓名請在 30 字以內";
  if (!department) errors.department = "請填寫系級";
  else if (department.length > 50) errors.department = "系級請在 50 字以內";
  if (!phone) errors.phone = "請填寫電話";
  else if (!PHONE_RE.test(phone)) errors.phone = "請輸入台灣手機，例如 0912345678";
  if (!email) errors.email = "請填寫 Email";
  else if (email.length > 100) errors.email = "Email 請在 100 字以內";
  else if (!EMAIL_RE.test(email)) errors.email = "Email 格式看起來不對，再檢查一次";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, department, phone, email } };
}

function clampScore(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(Math.round(v), 50000);
}

function clampInt(n, max = 10000) {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(Math.round(v), max);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => {
    if (ch === "&") return "\u0026amp;";
    if (ch === "<") return "\u0026lt;";
    if (ch === ">") return "\u0026gt;";
    if (ch === '"') return "\u0026quot;";
    return "\u0026#39;";
  });
}

async function sendMail({ to, subject, text, html }) {
  if (!envReadySmtp()) return false;
  try {
    const nodemailer = require("nodemailer");
    const port = Number(process.env.SMTP_PORT || 587) || 587;
    const secure = process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1" || port === 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await Promise.race([
      transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000)),
    ]);
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}

function startMail(name) {
  const subject = "【專注力挑戰賽】挑戰即將開始！";
  const text = `嗨，${name}：\n\n謝謝你願意停下腳步，參加「專注力挑戰賽」。\n接下來的 60 秒，請看清楚指令，再做選擇。\n\n— ${CLUB_NAME}`;
  const html = `<div style="font-family:'Microsoft JhengHei',sans-serif;color:#24333F;max-width:520px;margin:0 auto;padding:24px;background:#EAF6FF"><div style="background:#FFFDF7;border-radius:18px;padding:24px"><p>嗨，${escapeHtml(name)}：</p><p>謝謝你願意停下腳步，參加「專注力挑戰賽」。</p><p>接下來的 60 秒，請看清楚指令，再做選擇。</p><p style="color:#5b6b76">— ${escapeHtml(CLUB_NAME)}</p></div></div>`;
  return { subject, text, html };
}

function resultMail(p) {
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

— ${CLUB_NAME}`;
  const html = `<div style="font-family:'Microsoft JhengHei',sans-serif;color:#24333F;max-width:520px;margin:0 auto;padding:16px;background:#EAF6FF"><div style="background:#FFFDF7;border-radius:18px;padding:24px 22px"><p>嗨，${escapeHtml(p.name)}：</p><p>謝謝你參加「專注力挑戰賽」！</p><p style="font-weight:600">你的本次成績：</p><table style="width:100%;border-collapse:collapse;font-size:15px"><tr><td style="padding:8px 0;color:#5b6b76">分數</td><td style="text-align:right;font-weight:700">${p.score}</td></tr><tr><td style="padding:8px 0;color:#5b6b76">答對率</td><td style="text-align:right;font-weight:700">${p.accuracy}%</td></tr><tr><td style="padding:8px 0;color:#5b6b76">最高連擊</td><td style="text-align:right;font-weight:700">${p.maxCombo}</td></tr><tr><td style="padding:8px 0;color:#5b6b76">獲得稱號</td><td style="text-align:right;font-weight:700">${escapeHtml(p.title)}</td></tr></table><p>很高興今天在社團博覽會遇見你。<br>領導力並不是比別人更快，<br>而是能夠在混亂裡保持清楚，<br>在壓力裡仍然知道自己正在做什麼。</p><p>如果你想認識更多朋友、<br>探索自己，<br>也練習專注、表達與領導能力，<br>歡迎來認識我們！</p><p style="color:#5b6b76">— ${escapeHtml(CLUB_NAME)}</p></div></div>`;
  return { subject, text, html };
}

async function saveToSheet(payload) {
  if (!GOOGLE_SCRIPT_URL) return false;
  try {
    const res = await Promise.race([
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000)),
    ]);
    return Boolean(res && res.ok);
  } catch (err) {
    console.error("[sheets] failed", err);
    return false;
  }
}

async function sheetLeaderboard() {
  if (!GOOGLE_SCRIPT_URL) return null;
  try {
    const res = await Promise.race([
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "leaderboard" }),
        redirect: "follow",
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 6000)),
    ]);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.rows)) return null;
    return data.rows.slice(0, 5).map((r) => ({
      name: String(r.name || "").slice(0, 30),
      department: String(r.department || "").slice(0, 50),
      score: clampScore(r.score),
    }));
  } catch (err) {
    console.error("[sheets] leaderboard failed", err);
    return null;
  }
}

function memoryTop5() {
  return [...leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ name, department, score }) => ({ name, department, score }));
}

async function handleRegister(req, res) {
  if (!rateLimit(req)) return send(res, 429, { ok: false, error: "too_many" }, req);
  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: "invalid_json" }, req);
  }
  const parsed = validatePlayer(body);
  if (!parsed.ok) return send(res, 400, { ok: false, errors: parsed.errors }, req);
  let emailSent = false;
  if (envReadySmtp()) {
    const mail = startMail(parsed.data.name);
    emailSent = await sendMail({ to: parsed.data.email, ...mail });
  }
  return send(res, 200, { ok: true, emailSent, clubName: CLUB_NAME }, req);
}

async function handleResult(req, res) {
  if (!rateLimit(req, 18)) return send(res, 429, { ok: false, error: "too_many" }, req);
  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: "invalid_json" }, req);
  }
  const parsed = validatePlayer(body);
  if (!parsed.ok) return send(res, 400, { ok: false, errors: parsed.errors }, req);
  const payload = {
    timestamp: clampInt(body.timestamp, Date.now() + 60_000),
    time: String(body.time || "").slice(0, 32),
    game: "game1",
    name: parsed.data.name,
    department: parsed.data.department,
    phone: parsed.data.phone,
    email: parsed.data.email,
    score: clampScore(body.score),
    correct: clampInt(body.correct, 2000),
    wrong: clampInt(body.wrong, 2000),
    total: clampInt(body.total ?? Number(body.correct) + Number(body.wrong), 4000),
    accuracy: clampInt(body.accuracy, 100),
    maxCombo: clampInt(body.maxCombo, 2000),
    title: String(body.title || "").slice(0, 40),
    duration: 60,
    userAgent: String(body.userAgent || req.headers["user-agent"] || "").slice(0, 180),
  };
  leaderboard.push({
    name: payload.name,
    department: payload.department,
    score: payload.score,
  });
  if (leaderboard.length > 400) leaderboard.splice(0, leaderboard.length - 400);

  const sheetSaved = GOOGLE_SCRIPT_URL ? await saveToSheet(payload) : false;
  let emailSent = false;
  if (envReadySmtp()) {
    const mail = resultMail(payload);
    emailSent = await sendMail({ to: payload.email, ...mail });
  }
  return send(res, 200, {
    ok: true,
    sheetSaved,
    emailSent,
    sheetsConfigured: Boolean(GOOGLE_SCRIPT_URL),
    smtpConfigured: envReadySmtp(),
    clubName: CLUB_NAME,
    contactEmail: CONTACT_EMAIL,
  }, req);
}

function findIndexHtml() {
  const candidates = [
    path.join(__dirname, "..", "index.html"),
    path.join(__dirname, "public", "index.html"),
    path.join(__dirname, "index.html"),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

function serveStatic(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  let filePath = url.pathname === "/" ? findIndexHtml() : null;
  if (!filePath) {
    const rel = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
    const fromPublic = path.join(__dirname, "public", rel);
    const fromRoot = path.join(__dirname, "..", rel);
    if (fs.existsSync(fromPublic) && fs.statSync(fromPublic).isFile()) filePath = fromPublic;
    else if (fs.existsSync(fromRoot) && fs.statSync(fromRoot).isFile()) filePath = fromRoot;
  }
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".json": "application/json",
  };
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const route = url.pathname.replace(/\/$/, "") || "/";
  if (req.method === "OPTIONS") {
    cors(req, res);
    res.writeHead(204);
    res.end();
    return;
  }
  try {
    if (route === "/api/health" && req.method === "GET") {
      return send(res, 200, { status: "ok" }, req);
    }
    if (route === "/api/register" && req.method === "POST") {
      return await handleRegister(req, res);
    }
    if (route === "/api/result" && req.method === "POST") {
      return await handleResult(req, res);
    }
    if (route === "/api/leaderboard" && req.method === "GET") {
      const remote = await sheetLeaderboard();
      const rows = remote && remote.length ? remote : memoryTop5();
      return send(res, 200, { ok: true, rows }, req);
    }
    if (req.method === "GET" || req.method === "HEAD") {
      return serveStatic(req, res);
    }
    send(res, 404, { ok: false, error: "not_found" }, req);
  } catch (err) {
    console.error(err);
    send(res, 500, { ok: false, error: "server_error" }, req);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`focus-challenge api listening on ${PORT}`);
});
