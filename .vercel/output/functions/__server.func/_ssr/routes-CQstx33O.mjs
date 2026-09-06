import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Eye, i as RotateCcw, o as ArrowRight, r as Timer, t as Trophy } from "../_libs/lucide-react.mjs";
import { a as titleForScore, i as COLORS, n as validatePlayer, r as CLUB_NAME_DEFAULT } from "./router-6fnVOcKt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CQstx33O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SCENE_SRC = "/scene.jpg";
function SkyDecor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "scene",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "scene-img",
				src: SCENE_SRC,
				alt: ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scene-veil" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scene-grain" })
		]
	});
}
function SceneHero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "scene-hero",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: SCENE_SRC,
				alt: "淡江禪學社木廊：同學與龜龜看著淡水風景",
				width: 1587,
				height: 2245,
				decoding: "async",
				fetchPriority: "high"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scene-hero-shade" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: "scene-hero-cap",
				children: "龜龜在木廊上等你"
			})
		]
	});
}
function SceneRibbon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scene-ribbon",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: SCENE_SRC,
			alt: "",
			width: 1587,
			height: 2245,
			decoding: "async"
		})
	});
}
function Turtle({ mood = "idle", size = 92, className = "" }) {
	const lookingUp = mood === "celebrate" || mood === "happy" || mood === "jump" || mood === "cheer";
	const surprised = mood === "surprise";
	const pupilY = surprised ? 44 : lookingUp ? 43.2 : 45.4;
	const pupilR = surprised ? 3.6 : 2.8;
	const mouth = surprised ? "M 44 62 Q 50 58 56 62" : lookingUp ? "M 43 59 Q 50 68 57 59" : "M 44 61 Q 50 65.5 56 61";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: `turtle turtle-${mood} ${className}`,
		width: size,
		height: size,
		viewBox: "0 0 100 100",
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "50",
				cy: "92",
				rx: "24",
				ry: "4.5",
				fill: "rgba(44,36,22,0.14)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "50",
				cy: "68",
				rx: "30",
				ry: "22",
				fill: "#5FA75A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "50",
				cy: "70",
				rx: "22",
				ry: "16",
				fill: "#E8D37A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M28 62 Q50 42 72 62 Q74 78 50 86 Q26 78 28 62",
				fill: "#7BC96F"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M50 50 L60 64 L50 60 L40 64 Z",
				fill: "#4F9A4A",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "34",
				cy: "78",
				r: "6.2",
				fill: "#6DB86A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "66",
				cy: "78",
				r: "6.2",
				fill: "#6DB86A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "40",
				cy: "88",
				r: "6.6",
				fill: "#6DB86A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "88",
				r: "6.6",
				fill: "#6DB86A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "46",
				r: "21",
				fill: "#8FD37A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M46 18 C43 6 34 8 36 16 C40 12 44 16 47 24 Z",
				fill: "#5FA75A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M54 17 C60 5 70 10 66 18 C62 12 57 16 54 24 Z",
				fill: "#A8DB78"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "41.5",
				cy: "44",
				r: "7.4",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "58.5",
				cy: "44",
				r: "7.4",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "42.6",
				cy: pupilY,
				r: pupilR,
				fill: "#2C2416"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "59.6",
				cy: pupilY,
				r: pupilR,
				fill: "#2C2416"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44.4",
				cy: "42.4",
				r: "1.3",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "61.4",
				cy: "42.4",
				r: "1.3",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "35.5",
				cy: "52",
				rx: "4.8",
				ry: "3.1",
				fill: "#F4B4A0",
				opacity: "0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "64.5",
				cy: "52",
				rx: "4.8",
				ry: "3.1",
				fill: "#F4B4A0",
				opacity: "0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: mouth,
				fill: "none",
				stroke: "#2C2416",
				strokeWidth: "2.2",
				strokeLinecap: "round"
			}),
			mood === "wave" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				className: "turtle-hand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "20",
					cy: "58",
					r: "7.2",
					fill: "#7BC96F"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "58",
				r: "6.4",
				fill: "#7BC96F"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "68",
				cy: "58",
				r: "6.4",
				fill: "#7BC96F"
			})] })
		]
	});
}
function randomColor(except) {
	const pool = except ? COLORS.filter((c) => c.id !== except) : COLORS;
	return pool[Math.floor(Math.random() * pool.length)];
}
/** 出題：字義與視覺顏色永遠不能相同 */
function nextQuestion() {
	const meaning = randomColor();
	return {
		meaning,
		visual: randomColor(meaning.id)
	};
}
function createLiveGame(now = Date.now()) {
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
		question: nextQuestion()
	};
}
function remainingSeconds(game, now = Date.now()) {
	const elapsed = (now - game.startTime) / 1e3;
	return Math.max(0, 60 - elapsed);
}
function correctId(game) {
	return game.mode === "meaning" ? game.question.meaning.id : game.question.visual.id;
}
var SWITCH_GUARD_MS = 420;
/** 判分 + Combo。連續 3 題或距上次切換滿 3 秒會換模式。 */
function judgeAnswer(game, picked, now = Date.now()) {
	if (game.ended) return {
		ok: false,
		delta: 0,
		combo: game.combo,
		switched: false
	};
	const ok = picked === correctId(game);
	let delta = 0;
	let switched = false;
	if (ok) {
		game.correct += 1;
		game.combo += 1;
		if (game.combo > game.maxCombo) game.maxCombo = game.combo;
		delta = game.combo >= 5 ? 200 : 100;
		game.score += delta;
		if (game.combo > 0 && game.combo % 3 === 0) switched = trySwitchMode(game, now);
	} else {
		game.wrong += 1;
		game.combo = 0;
		delta = -50;
		game.score = Math.max(0, game.score - 50);
	}
	game.question = nextQuestion();
	return {
		ok,
		delta,
		combo: game.combo,
		switched
	};
}
function trySwitchMode(game, now = Date.now()) {
	if (now - game.lastModeSwitch < SWITCH_GUARD_MS) return false;
	game.mode = game.mode === "meaning" ? "visual" : "meaning";
	game.lastModeSwitch = now;
	return true;
}
function maybeTimedSwitch(game, now = Date.now()) {
	if (game.ended) return false;
	if (now - game.lastModeSwitch < 3e3) return false;
	return trySwitchMode(game, now);
}
function colorByKey(key) {
	const k = key.toLowerCase();
	for (const c of COLORS) if (c.key[0] === k || c.key[1] === k) return c.id;
	return null;
}
function taipeiTime(date = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("sv-SE", {
		timeZone: "Asia/Taipei",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).format(date).replace(/-/g, "/");
}
function buildResult(player, game, userAgent = "") {
	const total = game.correct + game.wrong;
	const accuracy = total ? Math.round(game.correct / total * 100) : 0;
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
		duration: 60,
		userAgent
	};
}
function emptyPlayer() {
	return {
		name: "",
		department: "",
		phone: "",
		email: ""
	};
}
function Home() {
	const [screen, setScreen] = (0, import_react.useState)("register");
	const [player, setPlayer] = (0, import_react.useState)(emptyPlayer);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [remaining, setRemaining] = (0, import_react.useState)(60);
	const [mood, setMood] = (0, import_react.useState)("wave");
	const [modePulse, setModePulse] = (0, import_react.useState)(0);
	const [pops, setPops] = (0, import_react.useState)([]);
	const [save, setSave] = (0, import_react.useState)({ kind: "idle" });
	const [club, setClub] = (0, import_react.useState)(CLUB_NAME_DEFAULT);
	const [lb, setLb] = (0, import_react.useState)([]);
	const [tick, setTick] = (0, import_react.useState)(0);
	const gameRef = (0, import_react.useRef)(createLiveGame());
	const playerRef = (0, import_react.useRef)(player);
	const moodTimer = (0, import_react.useRef)(0);
	const audioRef = (0, import_react.useRef)(null);
	playerRef.current = player;
	(0, import_react.useEffect)(() => {
		fetch("/api/leaderboard").then((r) => r.json()).then((d) => {
			if (Array.isArray(d.rows)) setLb(d.rows.slice(0, 5));
		}).catch(() => {});
	}, []);
	const bumpMood = (0, import_react.useCallback)((next, ms = 420) => {
		setMood(next);
		window.clearTimeout(moodTimer.current);
		moodTimer.current = window.setTimeout(() => setMood("idle"), ms);
	}, []);
	const beep = (0, import_react.useCallback)((ok) => {
		try {
			const C = window.AudioContext || window.webkitAudioContext;
			if (!C) return;
			if (!audioRef.current) audioRef.current = new C();
			const ctx = audioRef.current;
			if (ctx.state === "suspended") ctx.resume();
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.type = "sine";
			o.frequency.value = ok ? 784 : 196;
			g.gain.value = .04;
			o.connect(g);
			g.connect(ctx.destination);
			o.start();
			g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .12);
			o.stop(ctx.currentTime + .13);
		} catch {}
	}, []);
	const flashMode = (0, import_react.useCallback)(() => {
		setModePulse((n) => n + 1);
		try {
			navigator.vibrate?.(30);
		} catch {}
	}, []);
	const endGame = (0, import_react.useCallback)(() => {
		const g = gameRef.current;
		if (g.ended) return;
		g.ended = true;
		setRemaining(0);
		setMood("celebrate");
		setScreen("result");
		setSave({ kind: "saving" });
		if (g.resultSubmitted) return;
		g.resultSubmitted = true;
		const payload = buildResult(playerRef.current, g, typeof navigator !== "undefined" ? navigator.userAgent : "");
		fetch("/api/result", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		}).then(async (r) => {
			const d = await r.json().catch(() => ({}));
			setClub(d.clubName || "淡江大學禪學社");
			if (!r.ok) {
				setSave({ kind: "offline" });
				return;
			}
			setSave({
				kind: "ok",
				sheet: Boolean(d.sheetSaved),
				email: Boolean(d.emailSent),
				sheetsConfigured: Boolean(d.sheetsConfigured),
				smtpConfigured: Boolean(d.smtpConfigured)
			});
		}).catch(() => setSave({ kind: "offline" }));
	}, []);
	(0, import_react.useEffect)(() => {
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
	}, [
		screen,
		endGame,
		flashMode
	]);
	const answer = (0, import_react.useCallback)((id) => {
		const g = gameRef.current;
		if (g.ended || screen !== "game") return;
		const res = judgeAnswer(g, id);
		beep(res.ok);
		const popId = Date.now() + Math.random();
		if (res.ok) {
			const comboHit = res.combo >= 5;
			setPops((list) => [...list.slice(-2), {
				id: popId,
				text: comboHit ? "+200 COMBO!" : "+100",
				kind: comboHit ? "combo" : "good"
			}]);
			bumpMood(res.combo >= 5 ? "happy" : "jump");
			try {
				navigator.vibrate?.(12);
			} catch {}
		} else {
			setPops((list) => [...list.slice(-2), {
				id: popId,
				text: "-50",
				kind: "bad"
			}]);
			bumpMood("surprise", 320);
			try {
				navigator.vibrate?.(40);
			} catch {}
		}
		if (res.switched) flashMode();
		window.setTimeout(() => {
			setPops((list) => list.filter((p) => p.id !== popId));
		}, 620);
		setTick((n) => n + 1);
	}, [
		screen,
		beep,
		bumpMood,
		flashMode
	]);
	(0, import_react.useEffect)(() => {
		window.__focusChallenge = {
			endNow: () => {
				gameRef.current.startTime = Date.now() - 6e4;
			},
			getState: () => ({
				...gameRef.current,
				screen
			}),
			answer
		};
	}, [answer, screen]);
	(0, import_react.useEffect)(() => {
		if (screen !== "game") return;
		const onKey = (e) => {
			if (e.repeat) return;
			const id = colorByKey(e.key);
			if (!id) return;
			e.preventDefault();
			answer(id);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [screen, answer]);
	function setField(key, value) {
		setPlayer((p) => ({
			...p,
			[key]: value
		}));
		setErrors((e) => ({
			...e,
			[key]: void 0
		}));
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
				signal: ctrl.signal
			});
			window.clearTimeout(t);
			const d = await r.json().catch(() => ({}));
			if (d.clubName) setClub(d.clubName);
		} catch {}
		gameRef.current = createLiveGame();
		setRemaining(60);
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
		setRemaining(60);
		setPops([]);
		setSave({ kind: "idle" });
		setMood("wave");
		setScreen("register");
	}
	const g = gameRef.current;
	const timeShow = Math.ceil(remaining);
	const q = g.question;
	const timeRatio = Math.max(0, Math.min(1, remaining / 60));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-root",
		"data-screen": screen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyDecor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shell",
			children: [
				screen === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "screen screen-register active",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterScreen, {
						player,
						errors,
						busy,
						lb,
						onChange: setField,
						onStart: () => void startChallenge()
					})
				}) : null,
				screen === "game" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "screen screen-game active",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hud",
							"aria-live": "polite",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hud-item",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "玩家" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: player.name || "—" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `hud-item${timeShow <= 10 ? " warn" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "時間" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: timeShow })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hud-item",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "分數" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: g.score })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hud-item",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Combo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["x", g.combo] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `time-rail${timeShow <= 10 ? " is-warn" : ""}`,
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { transform: `scaleX(${timeRatio})` } })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mode-card${modePulse ? " switch" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "請點擊" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: g.mode === "meaning" ? "【字面意思】" : "【視覺顏色】" })
							]
						}, modePulse),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "play-area",
							children: [
								pops.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `float-pop ${p.kind}`,
									children: p.text
								}, p.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "stroop-card",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "stroop",
										style: { color: q.visual.hex },
										children: q.meaning.label
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Turtle, {
									mood,
									size: 86
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "deck-tray",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "answers",
								children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `ans ans-${c.id}`,
									"aria-label": c.label,
									disabled: g.ended,
									onClick: () => answer(c.id),
									children: c.label
								}, c.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "keys-hint",
								children: "鍵盤 1 紅 · 2 藍 · 3 綠 · 4 黃"
							})]
						})
					]
				}) : null,
				screen === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "screen screen-result active",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultScreen, {
						player,
						game: g,
						save,
						club,
						onAgain: playAgain
					})
				}) : null
			]
		})]
	});
}
function RegisterScreen({ player, errors, busy, lb, onChange, onStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneHero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lintel",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "masthead",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "淡江大學禪學社 · 社團博覽會"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "hero-title",
							children: "專注力挑戰賽"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "subtitle",
							children: "60 秒，看看你能不能讓眼睛和大腦合作。"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prize",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prize-badge",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
							size: 22,
							strokeWidth: 2.2
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "社博當天最高分前 5 名" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "免費送手搖杯。來看清楚、再出手。" })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tips",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
							size: 14,
							strokeWidth: 2.2
						}), "規則一"] }), "你有 60 秒。"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
							size: 14,
							strokeWidth: 2.2
						}), "規則二"] }), "看清楚指令，再做選擇。"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "panel form",
					onSubmit: (e) => {
						e.preventDefault();
						onStart();
					},
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "field-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "姓名",
									id: "name",
									value: player.name,
									placeholder: "你的名字",
									error: errors.name,
									autoComplete: "name",
									onChange: (v) => onChange("name", v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "系級",
									id: "department",
									value: player.department,
									placeholder: "資工一A",
									error: errors.department,
									autoComplete: "organization-title",
									onChange: (v) => onChange("department", v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "電話",
									id: "phone",
									value: player.phone,
									placeholder: "09xxxxxxxx",
									error: errors.phone,
									inputMode: "tel",
									autoComplete: "tel",
									className: "span-2",
									onChange: (v) => onChange("phone", v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									id: "email",
									value: player.email,
									placeholder: "example@email.com",
									error: errors.email,
									inputMode: "email",
									autoComplete: "email",
									className: "span-2",
									onChange: (v) => onChange("email", v)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "cta",
							type: "submit",
							disabled: busy,
							children: [busy ? "準備中…" : "開始 60 秒挑戰", busy ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								size: 18,
								strokeWidth: 2.4
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "privacy",
							children: "資料僅供本次活動聯絡、成績紀錄與活動相關通知使用。"
						})
					]
				}),
				lb.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel lb",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "今日 TOP 5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: lb.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "who",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rank",
								children: i + 1
							}),
							row.name,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "dept",
								children: [" · ", row.department]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "score",
						children: row.score
					})] }, `${row.name}-${i}`)) })]
				}) : null
			]
		})
	] });
}
function Field({ label, id, value, placeholder, error, onChange, inputMode, autoComplete, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `field ${className}`.trim(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: id,
				children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "req",
					children: "*"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				name: id,
				value,
				placeholder,
				className: error ? "invalid" : "",
				"aria-invalid": Boolean(error),
				"aria-describedby": error ? `${id}-err` : void 0,
				inputMode,
				autoComplete,
				onChange: (e) => onChange(e.target.value)
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "err",
				id: `${id}-err`,
				children: error
			}) : null
		]
	});
}
function ResultScreen({ player, game, save, club, onAgain }) {
	const total = game.correct + game.wrong;
	const accuracy = total ? Math.round(game.correct / total * 100) : 0;
	const title = game.score >= 3e3 ? "Lv.4 卓越領袖" : game.score >= 2e3 ? "Lv.3 穩定領航者" : game.score >= 1e3 ? "Lv.2 潛力領袖" : "Lv.1 心靈修煉者";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneRibbon, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lintel",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet result-sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "result-hero",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Turtle, {
							mood: "celebrate",
							size: 84
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "完成！" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: player.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "score-xl",
							children: game.score
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "title-chip",
							children: title
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "答對率" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [accuracy, "%"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "最高連擊" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["x", game.maxCombo] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "答對" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: game.correct })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stat",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "答錯" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: game.wrong })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveStatus, { save }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "result-actions",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "cta secondary",
						type: "button",
						onClick: onAgain,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
							size: 16,
							strokeWidth: 2.4
						}), "再挑戰一次"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel join-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "seal",
							"aria-hidden": "true",
							children: "禪"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "剛剛的 60 秒，不只是反應速度。當資訊變多、壓力變大，真正重要的是：你還能不能知道自己正在做什麼。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "在大學裡，領導力不只是帶領別人，也包括專注、溝通、認識自己，以及與不同的人合作。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "如果你想在大學期間認識一群夥伴，一起體驗更多活動、成長與挑戰，歡迎來認識我們。" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "join-cta",
							children: ["認識", club]
						})
					]
				})
			]
		})
	] });
}
function SaveStatus({ save }) {
	if (save.kind === "saving") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "status-line",
		children: "正在儲存成績…"
	});
	if (save.kind === "offline") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "status-line warn",
		children: "目前尚未連接成績資料庫，本次成績僅供現場查看。"
	});
	if (save.kind === "ok") {
		const lines = [];
		if (save.sheet) lines.push("成績已記錄");
		else if (!save.sheetsConfigured) lines.push("目前尚未設定成績後端，本次成績僅供現場查看。");
		else lines.push("目前尚未連接成績資料庫，本次成績僅供現場查看。");
		if (save.email) lines.push("結果已寄到你的 Email");
		else if (save.smtpConfigured) lines.push("成績已完成，但結果信目前無法寄送。");
		else lines.push("成績已完成，但 Email 暫時無法寄送。");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `status-line${l.includes("已") ? " ok" : " warn"}`,
			children: l.includes("已") ? `✓ ${l}` : l
		}, l)) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "status-line" });
}
//#endregion
export { Home as component };
