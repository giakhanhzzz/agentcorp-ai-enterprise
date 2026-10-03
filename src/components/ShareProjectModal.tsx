import React, { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Clock,
  ExternalLink,
  KeyRound,
  X,
  Sparkles,
  Link,
  MessageSquare,
  Lock,
  CheckCircle2,
  Globe,
} from "lucide-react";
import {
  getShareSecurityConfig,
  resetSharePasscode,
  fetchServerShareConfig,
  resetSharePasscodeAsync,
  formatRemainingTime,
  getShareableUrl,
  getDirectDevUrl,
  getSafeOrigin,
  copyToClipboardSafely,
  ShareSecurityConfig,
  PUBLIC_PRODUCT_URL,
  isOwnerAuthenticated,
} from "../utils/shareSecurity";

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const [shareType, setShareType] = useState<"webapp" | "agentcorp">("webapp");
  const [securityConfig, setSecurityConfig] = useState<ShareSecurityConfig | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchServerShareConfig(projectId).then((config) => {
        setSecurityConfig(config);
        setRemainingTime(formatRemainingTime(config.expiresAt));
      });

      const timer = setInterval(() => {
        const config = getShareSecurityConfig(projectId);
        setRemainingTime(formatRemainingTime(config.expiresAt));
      }, 60000);

      return () => clearInterval(timer);
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const safeOrigin = getSafeOrigin();
  const webAppShareUrl = getShareableUrl(projectId);
  const directDevUrl = getDirectDevUrl(projectId);
  const agentCorpShareUrl = `${safeOrigin}/?mode=boardroom&owner_secret=phamgiakhanh#boardroom`;

  const handleCopy = async (text: string, key: string, label: string = "liên kết") => {
    const success = await copyToClipboardSafely(text);
    setCopiedKey(key);
    setCopyToast(`Đã sao chép ${label} thành công! Bạn có thể dán (Ctrl+V) ngay.`);
    setTimeout(() => {
      setCopiedKey(null);
      setCopyToast(null);
    }, 3500);
  };

  const handleResetPass = async () => {
    setIsResetting(true);
    try {
      const freshConfig = await resetSharePasscodeAsync(projectId);
      setSecurityConfig(freshConfig);
      setRemainingTime(formatRemainingTime(freshConfig.expiresAt));
      setIsResetting(false);
      handleCopy(freshConfig.passcode, "new-pass", "mã PIN mới");
    } catch {
      setIsResetting(false);
    }
  };

  const handleOpenDirectly = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyFullInvite = () => {
    if (shareType === "webapp") {
      if (!securityConfig) return;
      const text = `🚀 [MỜI XEM SẢN PHẨM HOÀN CHỈNH: ${projectName}]
🌐 Link xem công khai (Mở được trên mọi thiết bị / Tab ẩn danh):
${webAppShareUrl}
🔑 Mã PIN bảo mật (Passcode 12h): ${securityConfig.passcode}
⏱️ Thời hạn: Có hiệu lực trong 12 giờ (Hết hạn hoặc khi chủ sở hữu Reset PIN thì web tự động khóa lại).
🛡️ Bảo mật: Người nhận CHỈ XEM ĐƯỢC PHIM. Bàn họp AI & Agent của bạn được khóa chặt 100%!`;
      handleCopy(text, "full-invite", "lời mời trọn gói (Link + PIN)");
    } else {
      const text = `🔒 [PHÒNG ĐIỀU HÀNH AI AGENTCORP - DÀNH RIÊNG CHỦ SỞ HỮU]
🏢 Dự án: ${projectName}
🌐 Link phòng điều hành (Yêu cầu tài khoản chính chủ):
${agentCorpShareUrl}
⚠️ Lưu ý: Chỉ tài khoản Google chính chủ mới truy cập được. Người ngoài mở link này sẽ bị Google chặn 404!`;
      handleCopy(text, "full-invite", "liên kết phòng điều hành nội bộ");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">Tùy Chọn Chia Sẻ Liên Kết</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  2 Chế Độ
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                Dự án: <span className="text-indigo-300 font-semibold">{projectName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Success Toast Banner */}
        {copyToast && (
          <div className="bg-emerald-600/90 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{copyToast}</span>
            </div>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-white/90">Ctrl + V</span>
          </div>
        )}

        {/* Tab Switcher: Web App vs AgentCorp (Only visible to verified Owner) */}
        {isOwnerAuthenticated() && (
          <div className="grid grid-cols-2 p-2 bg-slate-950/90 border-b border-slate-800 gap-2">
            <button
              onClick={() => setShareType("webapp")}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                shareType === "webapp"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🌐</span> <span>Chia Sẻ Web Thành Phẩm</span>
              </span>
              <span className="text-[10px] font-normal opacity-85">Cho Khách Hàng / Khán Giả</span>
            </button>

            <button
              onClick={() => setShareType("agentcorp")}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                shareType === "agentcorp"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🤖</span> <span>Chia Sẻ Phòng Điều Hành AI</span>
              </span>
              <span className="text-[10px] font-normal opacity-85">Cho Team Kỹ Thuật / Co-founder</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar">
          {shareType === "webapp" ? (
            <>
              {/* Explanation Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-relaxed">
                  <strong>Chế độ Web Thành Phẩm (Khuyên dùng):</strong> Người nhận chỉ thấy ứng dụng web chạy thật 100% (xem phim, nghe nhạc, mua sắm...). Toàn bộ bàn họp AI, task và prompt nội bộ được <strong>giấu sạch</strong>. Bắt buộc nhập <strong>Passcode 12h</strong> để mở khóa.
                </div>
              </div>

              {/* Passcode Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Mật Khẩu Truy Cập (Mã PIN 12H):
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hết hạn sau: {remainingTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    onClick={() => securityConfig && handleCopy(securityConfig.passcode, "pass-only", "mã PIN")}
                    className="flex-1 bg-black/80 border border-slate-700/80 rounded-xl px-4 py-3 font-mono font-black text-xl text-center tracking-widest text-amber-300 select-all shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                    title="Bấm vào để sao chép mã PIN"
                  >
                    {securityConfig?.passcode || "Đang tạo..."}
                  </div>

                  <button
                    onClick={() => securityConfig && handleCopy(securityConfig.passcode, "pass-only", "mã PIN")}
                    className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                    title="Sao chép mật khẩu"
                  >
                    {copiedKey === "pass-only" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedKey === "pass-only" ? "Đã chép" : "Copy PIN"}</span>
                  </button>

                  <button
                    onClick={handleResetPass}
                    disabled={isResetting}
                    className="px-3 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                    title="Tạo lại pass mới ngay lập tức (Gia hạn thêm 12h)"
                  >
                    <RotateCcw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Reset PIN</span>
                  </button>
                </div>
              </div>

              {/* Share Link Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Link Chia Sẻ Công Khai (Mọi người / Tab ẩn danh):
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Không cần đăng nhập mail chủ
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webAppShareUrl}
                    onClick={(e) => {
                      e.currentTarget.select();
                      handleCopy(webAppShareUrl, "link-only", "link web công khai");
                    }}
                    className="flex-1 bg-black/80 border border-slate-700 rounded-xl px-3 py-2.5 font-mono text-[11px] text-slate-300 select-all focus:outline-none cursor-pointer hover:border-emerald-500 transition-colors"
                    title="Bấm vào để sao chép link công khai"
                  />

                  <button
                    onClick={() => handleOpenDirectly(webAppShareUrl)}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-md shadow-emerald-600/30"
                    title="Mở sang tab mới để xem ngay"
                  >
                    <span>Mở Ngay ↗</span>
                  </button>

                  <button
                    onClick={() => handleCopy(webAppShareUrl, "link-only", "link web công khai")}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedKey === "link-only" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedKey === "link-only" ? "Đã chép" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* AgentCorp Boardroom Explanation */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-relaxed">
                  <strong>Chế độ Phòng Điều Hành AgentCorp:</strong> Người nhận sẽ thấy toàn bộ hệ thống hậu trường — 7 Giám đốc AI (CEO, CTO, Architect...), bảng tranh luận chiến lược, radar tình báo đối thủ và tiến độ các tác vụ. Phù hợp để trình diễn khả năng làm việc của AI hoặc mời đồng nghiệp vào xem.
                </div>
              </div>

              {/* AgentCorp Share Link Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Link className="w-4 h-4 text-indigo-400" />
                    Link Trực Tiếp Phòng Điều Hành:
                  </span>
                  <span className="text-[10px] text-indigo-400 font-medium">
                    Toàn quyền xem AI Studio
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={agentCorpShareUrl}
                    onClick={(e) => {
                      e.currentTarget.select();
                      handleCopy(agentCorpShareUrl, "agent-link-only", "link phòng điều hành");
                    }}
                    className="flex-1 bg-black/80 border border-slate-700 rounded-xl px-3 py-2.5 font-mono text-[11px] text-indigo-300 select-all focus:outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                    title="Bấm vào để sao chép link"
                  />

                  <button
                    onClick={() => handleOpenDirectly(agentCorpShareUrl)}
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
                    title="Mở Phòng Hội Đồng AI sang tab mới"
                  >
                    <span>Mở Ngay ↗</span>
                  </button>

                  <button
                    onClick={() => handleCopy(agentCorpShareUrl, "agent-link-only", "link phòng điều hành")}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedKey === "agent-link-only" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedKey === "agent-link-only" ? "Đã chép" : "Copy Link"}</span>
                  </button>
                </div>
              </div>

              {/* Comparison Note */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="text-white font-bold flex items-center gap-1">
                  <span>💡 Lưu ý quan trọng:</span>
                </div>
                <p>
                  Nếu gửi link này cho <strong>khách hàng mua web</strong>, họ sẽ thấy thanh công cụ AI và code nội bộ. Vì vậy nếu muốn bàn giao sản phẩm, hãy chuyển sang tab <strong>&quot;Chia Sẻ Web Thành Phẩm&quot;</strong> ở trên!
                </p>
              </div>
            </>
          )}

          {/* Action Row: Open in Tab + Copy Full Invite */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopyFullInvite}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                shareType === "webapp"
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-emerald-600/25"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25"
              }`}
            >
              {copiedKey === "full-invite" ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>ĐÃ SAO CHÉP LỜI MỜI TRỌN GÓI!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>
                    {shareType === "webapp"
                      ? "SAO CHÉP LINK WEB + MÃ PIN (GỬI ZALO / TELEGRAM)"
                      : "SAO CHÉP LỜI MỜI VÀO PHÒNG HỘI ĐỒNG AI"}
                  </span>
                </>
              )}
            </button>

            {/* Quick Open in Browser button */}
            <button
              onClick={() => handleOpenDirectly(shareType === "webapp" ? webAppShareUrl : agentCorpShareUrl)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700/80"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>
                {shareType === "webapp"
                  ? "Hoặc Mở Trực Tiếp Trang Web Thành Phẩm Trong Tab Mới"
                  : "Hoặc Mở Trực Tiếp Phòng Điều Hành AI Trong Tab Mới"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {shareType === "webapp"
              ? "Khóa bảo vệ 12H tự động gia hạn khi bấm 'Reset PIN'."
              : "Người xem có thể trải nghiệm toàn bộ tiến trình điều hành của AI."}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
