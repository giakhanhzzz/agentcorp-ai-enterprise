import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import {
  verifySharePasscodeAsync,
  formatRemainingTime,
  fetchServerShareConfig,
  getShareSecurityConfig,
  authenticateAsOwner,
} from "../utils/shareSecurity";

interface PasscodeGateProps {
  projectId: string;
  projectName: string;
  onUnlocked: () => void;
  onOwnerAuthenticated?: () => void;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({
  projectId,
  projectName,
  onUnlocked,
  onOwnerAuthenticated,
}) => {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [ownerKeyInput, setOwnerKeyInput] = useState("");
  const [ownerKeyError, setOwnerKeyError] = useState<string | null>(null);

  useEffect(() => {
    fetchServerShareConfig(projectId).then((config) => {
      setRemainingTime(formatRemainingTime(config.expiresAt));
    });

    const interval = setInterval(() => {
      const config = getShareSecurityConfig(projectId);
      setRemainingTime(formatRemainingTime(config.expiresAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [projectId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setError("Vui lòng nhập mật khẩu truy cập do người sáng lập cấp.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifySharePasscodeAsync(projectId, passcode);
      setIsVerifying(false);

      if (result.valid) {
        setIsSuccess(true);
        setTimeout(() => {
          onUnlocked();
        }, 500);
      } else {
        setError(result.reason || "Mật khẩu không đúng. Vui lòng thử lại.");
      }
    } catch {
      setIsVerifying(false);
      setError("Lỗi kết nối xác thực. Vui lòng kiểm tra mạng và thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-7 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
              isSuccess
                ? "bg-emerald-500 text-white scale-110 shadow-emerald-500/30"
                : error
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/25"
            }`}
          >
            {isSuccess ? (
              <Unlock className="w-8 h-8 animate-bounce" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bản Xem Thử Được Bảo Mật</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {projectName || "Sản Phẩm Trực Tuyến"}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Liên kết này được bảo vệ bởi mật khẩu truy cập tạm thời. Vui lòng nhập mã PIN để mở khóa.
            </p>
          </div>
        </div>

        {/* Security Tag Info */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Thời hạn mã PIN:</span>
          </div>
          <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            Tự động reset sau 12h
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Mật khẩu truy cập (Passcode):
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value.toUpperCase());
                  if (error) setError(null);
                }}
                placeholder="VD: ABC-1234..."
                autoFocus
                className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-widest text-lg placeholder:text-slate-600 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all uppercase"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying || isSuccess}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              isSuccess
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 active:scale-[0.98]"
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Mở Khóa Thành Công! Đang tải...</span>
              </>
            ) : isVerifying ? (
              <span>Đang kiểm tra bảo mật...</span>
            ) : (
              <>
                <span>Mở Khóa Xem Bản Thử</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/80 pt-4 space-y-3">
          <p>Nếu bạn chưa có mật khẩu hoặc mật khẩu đã quá 12 giờ, vui lòng liên hệ người tạo dự án để nhận mã mới.</p>

          {/* Discrete Chairman Auth for Owner only */}
          <div className="pt-1">
            {!showOwnerLogin ? (
              <button
                type="button"
                onClick={() => setShowOwnerLogin(true)}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                title="Dành riêng cho Chủ Tịch / Người sáng lập dự án"
              >
                <span>👑</span>
                <span>Chủ sở hữu / Người sáng lập</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 text-left space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300">🔑 Khóa Chủ Tịch (Owner Key):</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOwnerLogin(false);
                      setOwnerKeyError(null);
                    }}
                    className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="password"
                    value={ownerKeyInput}
                    onChange={(e) => {
                      setOwnerKeyInput(e.target.value);
                      if (ownerKeyError) setOwnerKeyError(null);
                    }}
                    placeholder="Nhập khóa bí mật..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (authenticateAsOwner(ownerKeyInput)) {
                          if (onOwnerAuthenticated) onOwnerAuthenticated();
                        } else {
                          setOwnerKeyError("Khóa Chủ Tịch không đúng.");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (authenticateAsOwner(ownerKeyInput)) {
                        if (onOwnerAuthenticated) onOwnerAuthenticated();
                      } else {
                        setOwnerKeyError("Khóa Chủ Tịch không đúng.");
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer"
                  >
                    Xác Thực
                  </button>
                </div>
                {ownerKeyError && (
                  <p className="text-[10px] text-rose-400">{ownerKeyError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
