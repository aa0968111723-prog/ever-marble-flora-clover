import type { TurtleMood } from "@/lib/club/constants";

export function Turtle({
  mood = "idle",
  size = 92,
  className = "",
}: {
  mood?: TurtleMood;
  size?: number;
  className?: string;
}) {
  const lookingUp =
    mood === "celebrate" || mood === "happy" || mood === "jump" || mood === "cheer";
  const surprised = mood === "surprise";
  const pupilY = surprised ? 44 : lookingUp ? 43.2 : 45.4;
  const pupilR = surprised ? 3.6 : 2.8;
  const mouth =
    surprised
      ? "M 44 62 Q 50 58 56 62"
      : lookingUp
        ? "M 43 59 Q 50 68 57 59"
        : "M 44 61 Q 50 65.5 56 61";

  return (
    <svg
      className={`turtle turtle-${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="50" cy="92" rx="24" ry="4.5" fill="rgba(44,36,22,0.14)" />
      <ellipse cx="50" cy="68" rx="30" ry="22" fill="#5FA75A" />
      <ellipse cx="50" cy="70" rx="22" ry="16" fill="#E8D37A" />
      <path
        d="M28 62 Q50 42 72 62 Q74 78 50 86 Q26 78 28 62"
        fill="#7BC96F"
      />
      <path d="M50 50 L60 64 L50 60 L40 64 Z" fill="#4F9A4A" opacity="0.55" />
      <circle cx="34" cy="78" r="6.2" fill="#6DB86A" />
      <circle cx="66" cy="78" r="6.2" fill="#6DB86A" />
      <circle cx="40" cy="88" r="6.6" fill="#6DB86A" />
      <circle cx="60" cy="88" r="6.6" fill="#6DB86A" />
      <circle cx="50" cy="46" r="21" fill="#8FD37A" />
      <path d="M46 18 C43 6 34 8 36 16 C40 12 44 16 47 24 Z" fill="#5FA75A" />
      <path d="M54 17 C60 5 70 10 66 18 C62 12 57 16 54 24 Z" fill="#A8DB78" />
      <circle cx="41.5" cy="44" r="7.4" fill="#fff" />
      <circle cx="58.5" cy="44" r="7.4" fill="#fff" />
      <circle cx="42.6" cy={pupilY} r={pupilR} fill="#2C2416" />
      <circle cx="59.6" cy={pupilY} r={pupilR} fill="#2C2416" />
      <circle cx="44.4" cy="42.4" r="1.3" fill="#fff" />
      <circle cx="61.4" cy="42.4" r="1.3" fill="#fff" />
      <ellipse cx="35.5" cy="52" rx="4.8" ry="3.1" fill="#F4B4A0" opacity="0.9" />
      <ellipse cx="64.5" cy="52" rx="4.8" ry="3.1" fill="#F4B4A0" opacity="0.9" />
      <path
        d={mouth}
        fill="none"
        stroke="#2C2416"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {mood === "wave" ? (
        <g className="turtle-hand">
          <circle cx="20" cy="58" r="7.2" fill="#7BC96F" />
        </g>
      ) : (
        <>
          <circle cx="32" cy="58" r="6.4" fill="#7BC96F" />
          <circle cx="68" cy="58" r="6.4" fill="#7BC96F" />
        </>
      )}
    </svg>
  );
}
