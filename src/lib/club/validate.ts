export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^09\d{8}$/;

export type FieldErrors = Partial<{
  name: string;
  department: string;
  phone: string;
  email: string;
}>;

export function normalizePhone(raw: string): string {
  return String(raw || "").replace(/[\s\-()]/g, "");
}

export function validatePlayer(input: {
  name?: unknown;
  department?: unknown;
  phone?: unknown;
  email?: unknown;
}): { ok: true; data: { name: string; department: string; phone: string; email: string } } | { ok: false; errors: FieldErrors } {
  const name = String(input.name ?? "").trim();
  const department = String(input.department ?? "").trim();
  const phone = normalizePhone(String(input.phone ?? ""));
  const email = String(input.email ?? "").trim().toLowerCase();
  const errors: FieldErrors = {};

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

export function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(Math.round(v), 50000);
}

export function clampInt(n: unknown, max = 10000): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(Math.round(v), max);
}
