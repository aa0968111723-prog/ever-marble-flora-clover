import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-6fnVOcKt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-BJTnNGiv.css";
var APP_NAME = "專注力挑戰賽";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "淡江大學禪學社 · 社團博覽會 60 秒專注力挑戰賽。掃碼即可遊玩。"
			},
			{
				name: "theme-color",
				content: "#8EC8F0"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preload",
				href: "/scene.jpg",
				as: "image"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "zh-Hant",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter = () => import("./routes-CQstx33O.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var CLUB_NAME_DEFAULT = "淡江大學禪學社";
var COLORS = [
	{
		id: "red",
		label: "紅",
		hex: "#EF4444",
		key: ["1", "r"]
	},
	{
		id: "blue",
		label: "藍",
		hex: "#3B82F6",
		key: ["2", "b"]
	},
	{
		id: "green",
		label: "綠",
		hex: "#10B981",
		key: ["3", "g"]
	},
	{
		id: "yellow",
		label: "黃",
		hex: "#EAB308",
		key: ["4", "y"]
	}
];
function titleForScore(score) {
	if (score >= 3e3) return "Lv.4 卓越領袖";
	if (score >= 2e3) return "Lv.3 穩定領航者";
	if (score >= 1e3) return "Lv.2 潛力領袖";
	return "Lv.1 心靈修煉者";
}
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PHONE_RE = /^09\d{8}$/;
function normalizePhone(raw) {
	return String(raw || "").replace(/[\s\-()]/g, "");
}
function validatePlayer(input) {
	const name = String(input.name ?? "").trim();
	const department = String(input.department ?? "").trim();
	const phone = normalizePhone(String(input.phone ?? ""));
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
	if (Object.keys(errors).length) return {
		ok: false,
		errors
	};
	return {
		ok: true,
		data: {
			name,
			department,
			phone,
			email
		}
	};
}
function clampScore(n) {
	const v = typeof n === "number" ? n : Number(n);
	if (!Number.isFinite(v) || v < 0) return 0;
	return Math.min(Math.round(v), 5e4);
}
function clampInt(n, max = 1e4) {
	const v = typeof n === "number" ? n : Number(n);
	if (!Number.isFinite(v) || v < 0) return 0;
	return Math.min(Math.round(v), max);
}
var leaderboard = [];
var hits = /* @__PURE__ */ new Map();
function env(name, fallback = "") {
	return String(process.env[name] ?? fallback).trim();
}
function clubName() {
	return env("CLUB_NAME", CLUB_NAME_DEFAULT);
}
function contactEmail() {
	return env("CONTACT_EMAIL");
}
function corsHeaders(req) {
	const allow = env("FRONTEND_URL", "*");
	const origin = req.headers.get("origin") || allow;
	return {
		"Access-Control-Allow-Origin": allow === "*" ? origin || "*" : allow,
		"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400"
	};
}
function json(data, status, req) {
	return Response.json(data, {
		status,
		headers: corsHeaders(req)
	});
}
function clientIp(req) {
	const fwd = req.headers.get("x-forwarded-for");
	if (fwd) return fwd.split(",")[0].trim();
	return req.headers.get("x-real-ip") || "local";
}
function rateLimit(ip, limit = 24, windowMs = 6e4) {
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
function rememberScore(row) {
	leaderboard.push(row);
	if (leaderboard.length > 400) leaderboard.splice(0, leaderboard.length - 400);
}
function memoryTop5() {
	return [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 5).map(({ name, department, score }) => ({
		name,
		department,
		score
	}));
}
function smtpReady() {
	return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}
function sheetsReady() {
	return Boolean(env("GOOGLE_SCRIPT_URL"));
}
async function withTimeout(p, ms) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), ms);
	try {
		return await Promise.race([p, new Promise((_, rej) => {
			ctrl.signal.addEventListener("abort", () => rej(/* @__PURE__ */ new Error("timeout")));
		})]);
	} finally {
		clearTimeout(t);
	}
}
async function sendMail(input) {
	if (!smtpReady()) return false;
	try {
		const nodemailer = await import("../_libs/nodemailer.mjs").then((n) => n.t);
		const port = Number(env("SMTP_PORT", "587")) || 587;
		const secure = env("SMTP_SECURE") === "true" || env("SMTP_SECURE") === "1" || port === 465;
		await withTimeout(nodemailer.createTransport({
			host: env("SMTP_HOST"),
			port,
			secure,
			auth: {
				user: env("SMTP_USER"),
				pass: env("SMTP_PASS")
			}
		}).sendMail({
			from: env("SMTP_FROM") || env("SMTP_USER"),
			to: input.to,
			subject: input.subject,
			text: input.text,
			html: input.html
		}), 8e3);
		return true;
	} catch (err) {
		console.error("[email] send failed", err);
		return false;
	}
}
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (ch) => {
		if (ch === "&") return "&amp;";
		if (ch === "<") return "&lt;";
		if (ch === ">") return "&gt;";
		if (ch === "\"") return "&quot;";
		return "&#39;";
	});
}
function startMail(name) {
	const club = clubName();
	return {
		subject: "【專注力挑戰賽】挑戰即將開始！",
		text: `嗨，${name}：

謝謝你願意停下腳步，參加「專注力挑戰賽」。

接下來的 60 秒，請看清楚指令，再做選擇。
我們在攤位等你回來。

— ${club}`,
		html: `
  <div style="font-family:'Microsoft JhengHei','Noto Sans TC',sans-serif;color:#24333F;max-width:520px;margin:0 auto;padding:24px;background:#EAF6FF;">
    <div style="background:#FFFDF7;border-radius:18px;padding:24px;">
      <p style="margin:0 0 12px;font-size:16px;">嗨，${escapeHtml(name)}：</p>
      <p style="margin:0 0 12px;line-height:1.7;">謝謝你願意停下腳步，參加「專注力挑戰賽」。</p>
      <p style="margin:0 0 12px;line-height:1.7;">接下來的 60 秒，請看清楚指令，再做選擇。</p>
      <p style="margin:0;color:#5b6b76;">— ${escapeHtml(club)}</p>
    </div>
  </div>`
	};
}
function resultMail(p) {
	const club = clubName();
	return {
		subject: "【專注力挑戰賽】你的挑戰結果出爐啦！",
		text: `嗨，${p.name}：

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

— ${club}`,
		html: `
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
  </div>`
	};
}
async function saveToSheet(payload) {
	const url = env("GOOGLE_SCRIPT_URL");
	if (!url) return false;
	try {
		const res = await withTimeout(fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			redirect: "follow"
		}), 8e3);
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
async function fetchSheetLeaderboard() {
	const url = env("GOOGLE_SCRIPT_URL");
	if (!url) return null;
	try {
		const res = await withTimeout(fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "leaderboard" }),
			redirect: "follow"
		}), 6e3);
		if (!res.ok) return null;
		const data = await res.json();
		if (!Array.isArray(data.rows)) return null;
		return data.rows.filter((r) => r && typeof r.name === "string" && typeof r.score === "number").slice(0, 5).map((r) => ({
			name: String(r.name).slice(0, 30),
			department: String(r.department || "").slice(0, 50),
			score: clampScore(r.score)
		}));
	} catch (err) {
		console.error("[sheets] leaderboard failed", err);
		return null;
	}
}
async function handleRegister(req) {
	if (!rateLimit(clientIp(req))) return json({
		ok: false,
		error: "too_many"
	}, 429, req);
	let body = {};
	try {
		body = await req.json();
	} catch {
		return json({
			ok: false,
			error: "invalid_json"
		}, 400, req);
	}
	const parsed = validatePlayer(body);
	if (!parsed.ok) return json({
		ok: false,
		errors: parsed.errors
	}, 400, req);
	let emailSent = false;
	if (smtpReady()) {
		const mail = startMail(parsed.data.name);
		emailSent = await sendMail({
			to: parsed.data.email,
			...mail
		});
	}
	return json({
		ok: true,
		emailSent,
		clubName: clubName()
	}, 200, req);
}
async function handleResult(req) {
	if (!rateLimit(clientIp(req), 18)) return json({
		ok: false,
		error: "too_many"
	}, 429, req);
	let body = {};
	try {
		body = await req.json();
	} catch {
		return json({
			ok: false,
			error: "invalid_json"
		}, 400, req);
	}
	const parsed = validatePlayer(body);
	if (!parsed.ok) return json({
		ok: false,
		errors: parsed.errors
	}, 400, req);
	const score = clampScore(body.score);
	const correct = clampInt(body.correct, 2e3);
	const wrong = clampInt(body.wrong, 2e3);
	const total = clampInt(body.total ?? correct + wrong, 4e3);
	const accuracy = clampInt(body.accuracy, 100);
	const maxCombo = clampInt(body.maxCombo, 2e3);
	const title = String(body.title ?? "").slice(0, 40);
	const time = String(body.time ?? "").slice(0, 32);
	const timestamp = clampInt(body.timestamp, Date.now() + 6e4);
	const ua = String(body.userAgent ?? "").slice(0, 180) || (req.headers.get("user-agent") || "").slice(0, 180);
	const payload = {
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
		userAgent: ua
	};
	rememberScore({
		name: payload.name,
		department: payload.department,
		score: payload.score
	});
	let sheetSaved = false;
	let emailSent = false;
	if (sheetsReady()) sheetSaved = await saveToSheet({ ...payload });
	if (smtpReady()) {
		const mail = resultMail(payload);
		emailSent = await sendMail({
			to: payload.email,
			...mail
		});
	}
	return json({
		ok: true,
		sheetSaved,
		emailSent,
		sheetsConfigured: sheetsReady(),
		smtpConfigured: smtpReady(),
		clubName: clubName(),
		contactEmail: contactEmail()
	}, 200, req);
}
async function handleLeaderboard(req) {
	const remote = await fetchSheetLeaderboard();
	return json({
		ok: true,
		rows: remote && remote.length ? remote : memoryTop5()
	}, 200, req);
}
var Route$3 = createFileRoute("/api/health")({ server: { handlers: {
	OPTIONS: async ({ request }) => new Response(null, {
		status: 204,
		headers: corsHeaders(request)
	}),
	GET: async ({ request }) => json({ status: "ok" }, 200, request)
} } });
var Route$2 = createFileRoute("/api/leaderboard")({ server: { handlers: {
	OPTIONS: async ({ request }) => new Response(null, {
		status: 204,
		headers: corsHeaders(request)
	}),
	GET: async ({ request }) => handleLeaderboard(request)
} } });
var Route$1 = createFileRoute("/api/register")({ server: { handlers: {
	OPTIONS: async ({ request }) => new Response(null, {
		status: 204,
		headers: corsHeaders(request)
	}),
	POST: async ({ request }) => handleRegister(request)
} } });
var Route = createFileRoute("/api/result")({ server: { handlers: {
	OPTIONS: async ({ request }) => new Response(null, {
		status: 204,
		headers: corsHeaders(request)
	}),
	POST: async ({ request }) => handleResult(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	ApiHealthRoute: Route$3.update({
		id: "/api/health",
		path: "/api/health",
		getParentRoute: () => Route$5
	}),
	ApiLeaderboardRoute: Route$2.update({
		id: "/api/leaderboard",
		path: "/api/leaderboard",
		getParentRoute: () => Route$5
	}),
	ApiRegisterRoute: Route$1.update({
		id: "/api/register",
		path: "/api/register",
		getParentRoute: () => Route$5
	}),
	ApiResultRoute: Route.update({
		id: "/api/result",
		path: "/api/result",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { titleForScore as a, COLORS as i, validatePlayer as n, CLUB_NAME_DEFAULT as r, router_exports as t };
