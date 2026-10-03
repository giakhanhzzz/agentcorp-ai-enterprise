// Utilities for 12-Hour Reset Passcode & Link Sharing Security

export interface ShareSecurityConfig {
  passcode: string;
  createdAt: number;
  expiresAt: number;
  projectId: string;
}

const STORAGE_PREFIX = "agentcorp_share_sec_";
const UNLOCKED_PREFIX = "agentcorp_unlocked_";
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export function generateRandomPasscode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = "23456789";
  let part1 = "";
  for (let i = 0; i < 3; i++) {
    part1 += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part2 += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return `${part1}-${part2}`;
}

export function getShareSecurityConfig(projectId: string): ShareSecurityConfig {
  const key = `${STORAGE_PREFIX}${projectId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: ShareSecurityConfig = JSON.parse(raw);
      const now = Date.now();
      // If pass is still valid within 12 hours
      if (parsed.expiresAt && parsed.expiresAt > now) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading share security config:", e);
  }

  // Generate fresh 12h passcode if none exists or if expired
  return resetSharePasscode(projectId);
}

export function resetSharePasscode(projectId: string, customPass?: string): ShareSecurityConfig {
  const now = Date.now();
  const config: ShareSecurityConfig = {
    projectId,
    passcode: (customPass || generateRandomPasscode()).trim().toUpperCase(),
    createdAt: now,
    expiresAt: now + TWELVE_HOURS_MS,
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, JSON.stringify(config));
    // Also store globally for standalone viewer if projectId is generic
    localStorage.setItem(`${STORAGE_PREFIX}active`, JSON.stringify(config));
  } catch (e) {
    console.warn("Error writing share security config:", e);
  }

  return config;
}

export async function fetchServerShareConfig(projectId: string): Promise<ShareSecurityConfig> {
  try {
    const res = await fetch("/api/share-security/config");
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, JSON.stringify(data));
      localStorage.setItem(`${STORAGE_PREFIX}active`, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("fetchServerShareConfig error:", e);
  }
  return getShareSecurityConfig(projectId);
}

export async function resetSharePasscodeAsync(projectId: string, customPass?: string): Promise<ShareSecurityConfig> {
  try {
    const res = await fetch("/api/share-security/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customPass }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, JSON.stringify(data));
      localStorage.setItem(`${STORAGE_PREFIX}active`, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("resetSharePasscodeAsync error:", e);
  }
  return resetSharePasscode(projectId, customPass);
}

export async function verifySharePasscodeAsync(projectId: string, inputPass: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    const res = await fetch("/api/share-security/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: inputPass }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.valid) {
        setAccessUnlocked(projectId, data.expiresAt || (Date.now() + TWELVE_HOURS_MS));
        return { valid: true };
      }
      return { valid: false, reason: data.reason || "Mật khẩu không chính xác." };
    }
  } catch (e) {
    console.warn("verifySharePasscodeAsync error:", e);
  }
  return verifySharePasscode(projectId, inputPass);
}

export function verifySharePasscode(projectId: string, inputPass: string): { valid: boolean; reason?: string } {
  const cleanInput = (inputPass || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!cleanInput) {
    return { valid: false, reason: "Vui lòng nhập mật khẩu truy cập" };
  }

  let config = getShareSecurityConfig(projectId);
  // Also check active config fallback
  if (!config.passcode) {
    try {
      const activeRaw = localStorage.getItem(`${STORAGE_PREFIX}active`);
      if (activeRaw) config = JSON.parse(activeRaw);
    } catch (e) {}
  }

  const now = Date.now();
  if (config.expiresAt && config.expiresAt <= now) {
    return { valid: false, reason: "Mật khẩu này đã hết hạn sau 12 giờ. Vui lòng liên hệ người chia sẻ để lấy mã mới." };
  }

  const expectedPass = config.passcode.replace(/-/g, "").toUpperCase();
  const actualPass = cleanInput.replace(/-/g, "");

  if (actualPass === expectedPass || cleanInput === config.passcode) {
    // Save unlocked state valid for remaining hours or 12h
    setAccessUnlocked(projectId, config.expiresAt);
    return { valid: true };
  }

  return { valid: false, reason: "Mật khẩu không chính xác. Vui lòng kiểm tra lại." };
}

export function isAccessUnlocked(projectId: string): boolean {
  try {
    const key = `${UNLOCKED_PREFIX}${projectId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Check global unlocked fallback
      const globalRaw = localStorage.getItem(`${UNLOCKED_PREFIX}active`);
      if (!globalRaw) return false;
      const parsedGlobal = JSON.parse(globalRaw);
      return parsedGlobal.expiresAt && parsedGlobal.expiresAt > Date.now();
    }
    const parsed = JSON.parse(raw);
    return parsed.expiresAt && parsed.expiresAt > Date.now();
  } catch (e) {
    return false;
  }
}

export function setAccessUnlocked(projectId: string, expiresAt: number) {
  try {
    const data = { unlocked: true, expiresAt };
    localStorage.setItem(`${UNLOCKED_PREFIX}${projectId}`, JSON.stringify(data));
    localStorage.setItem(`${UNLOCKED_PREFIX}active`, JSON.stringify(data));
  } catch (e) {}
}

export function lockAccess(projectId: string) {
  try {
    localStorage.removeItem(`${UNLOCKED_PREFIX}${projectId}`);
    localStorage.removeItem(`${UNLOCKED_PREFIX}active`);
  } catch (e) {}
}

export function formatRemainingTime(expiresAt: number): string {
  const diffMs = expiresAt - Date.now();
  if (diffMs <= 0) return "Đã hết hạn";
  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }
  return `${minutes} phút`;
}

export function getSafeOrigin(): string {
  const CLOUD_RUN_ORIGIN = "https://ais-dev-vwktnk6nfyko3vvjp7czty-722673602658.asia-southeast1.run.app";

  if (typeof window !== "undefined" && window.location && window.location.origin) {
    const rawOrigin = window.location.origin;
    // CRITICAL: When running embedded inside Google AI Studio, window.location.origin is "https://aistudio.google.com"
    // Visiting https://aistudio.google.com/?mode=... redirects to aistudio.google.com/404 Page Not Found!
    // We must ALWAYS use the real Cloud Run application origin:
    if (rawOrigin.includes("aistudio.google.com") || rawOrigin === "null" || !rawOrigin.startsWith("http")) {
      return CLOUD_RUN_ORIGIN;
    }

    // If it's a Cloud Run domain, normalize to the active ais-dev- deployment
    if (rawOrigin.includes(".run.app")) {
      return rawOrigin.replace("ais-pre-", "ais-dev-");
    }
    return rawOrigin;
  }
  return CLOUD_RUN_ORIGIN;
}

export async function copyToClipboardSafely(text: string): Promise<boolean> {
  // Method 1: Modern navigator.clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn("navigator.clipboard.writeText failed, falling back to execCommand", e);
    }
  }

  // Method 2: document.execCommand('copy') with textarea fallback
  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch (e) {
      console.error("execCommand copy error:", e);
    }
  }

  return false;
}

export const CLOUD_RUN_DEV_ORIGIN = "https://ais-dev-vwktnk6nfyko3vvjp7czty-722673602658.asia-southeast1.run.app";

export function isEmbeddedInAIStudio(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // In Google AI Studio Build, the app is rendered inside an iframe
    if (window.self !== window.top) return true;
    // Check referrer
    if (document.referrer && document.referrer.includes("aistudio.google.com")) return true;
    // Ancestor origins (Chromium)
    const ancestors = (window.location as any)?.ancestorOrigins;
    if (ancestors && ancestors.length > 0) {
      for (let i = 0; i < ancestors.length; i++) {
        if (ancestors[i].includes("aistudio.google.com")) return true;
      }
    }
  } catch (e) {
    // Cross-origin iframe security block -> means inside Google iframe
    return true;
  }
  return false;
}

export const OWNER_STORAGE_KEY = "agentcorp_owner_auth_token_v3";

export function isOwnerAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // 1. Inside Google AI Studio: Always authorized as the Owner/Engineer
    if (isEmbeddedInAIStudio()) return true;

    // 2. Explicitly authenticated with Master Key in this browser
    if (localStorage.getItem(OWNER_STORAGE_KEY) === "authorized") return true;

    // 3. Authenticated via URL secret query (e.g. ?owner_secret=phamgiakhanh or ?admin=CHAIRMAN2026)
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("owner_secret") || params.get("admin") || params.get("owner_key");
    if (secret) {
      const clean = secret.trim().toLowerCase();
      if (clean === "chairman2026" || clean === "phamgiakhanh" || clean === "chairman") {
        localStorage.setItem(OWNER_STORAGE_KEY, "authorized");
        return true;
      }
    }
  } catch {}
  return false;
}

export function authenticateAsOwner(inputKey: string): boolean {
  const clean = (inputKey || "").trim();
  // Valid owner keys
  if (
    clean === "CHAIRMAN2026" ||
    clean.toLowerCase() === "chairman2026" ||
    clean.toLowerCase() === "phamgiakhanh" ||
    clean === "admin"
  ) {
    try {
      localStorage.setItem(OWNER_STORAGE_KEY, "authorized");
      return true;
    } catch {}
  }
  return false;
}

export function logoutOwner(): void {
  try {
    localStorage.removeItem(OWNER_STORAGE_KEY);
  } catch {}
}

export function getPublicProductUrl(projectId?: string): string {
  const origin = getSafeOrigin();
  const pid = projectId || "proj-motfilm";
  return `${origin}/?mode=standalone&p=${encodeURIComponent(pid)}`;
}

export const PUBLIC_PRODUCT_URL = `${CLOUD_RUN_DEV_ORIGIN}/?mode=standalone`;

export function getShareableUrl(projectId: string): string {
  return getPublicProductUrl(projectId);
}

export function getDirectDevUrl(projectId: string): string {
  return getPublicProductUrl(projectId);
}
