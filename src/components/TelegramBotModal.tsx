import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  MessageSquare,
  Key,
  Shield,
  Zap,
  Copy,
  Check,
  RefreshCw,
  Bell,
  Sparkles,
  Lock,
  Trash2,
  Smartphone,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { getSafeOrigin } from "../utils/shareSecurity";

interface TelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMissionFromTelegram?: (mission: string) => void;
  onConfigSaved?: (cfg: TelegramConfig) => void;
}

export interface TelegramConfig {
  botToken: string;
  botUsername?: string;
  botName?: string;
  chatId: string;
  isConnected: boolean;
  notifyOnComplete: boolean;
  webhookConfigured: boolean;
}

const STORAGE_KEY = "agentcorp_telegram_config";

export const TelegramBotModal: React.FC<TelegramBotModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [activeTab, setActiveTab] = useState<"connect" | "security" | "no-token">("connect");

  const [config, setConfig] = useState<TelegramConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      botToken: "",
      chatId: "",
      isConnected: false,
      notifyOnComplete: true,
      webhookConfigured: false,
    };
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/telegram/status")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && data.botToken) {
          setConfig((prev) => ({
            ...prev,
            botToken: prev.botToken || data.botToken,
            chatId: prev.chatId || (data.latestChat?.id ? String(data.latestChat.id) : ""),
            isConnected: Boolean(data.hasToken),
            webhookConfigured: true,
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    if (onConfigSaved) {
      onConfigSaved(config);
    }
  }, [config, onConfigSaved]);

  if (!isOpen) return null;

  const handleVerifyBot = async () => {
    if (!config.botToken.trim()) {
      setStatusMessage({
        type: "error",
        text: "Vui lòng nhập Bot Token từ @BotFather!",
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const resp = await fetch("/api/telegram/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.botToken.trim() }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.message || "Token không hợp lệ");
      }

      setConfig((prev) => ({
        ...prev,
        isConnected: true,
        botUsername: data.bot.username,
        botName: data.bot.first_name,
      }));

      setStatusMessage({
        type: "success",
        text: `Đã xác thực thành công Bot: @${data.bot.username} (${data.bot.first_name})!`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Không thể kết nối với Telegram API",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!config.botToken.trim()) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const resp = await fetch("/api/telegram/delete-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.botToken.trim() }),
      });
      const data = await resp.json();
      setConfig((prev) => ({ ...prev, webhookConfigured: false }));
      setStatusMessage({
        type: "success",
        text: "✅ Đã gỡ Webhook thành công! Đang tự động dò tìm Chat ID cho bạn...",
      });
      setTimeout(() => {
        handleAutoDetectChatId();
      }, 600);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Lỗi gỡ Webhook",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetectChatId = async () => {
    if (!config.botToken.trim()) {
      setStatusMessage({
        type: "error",
        text: "Vui lòng nhập Bot Token trước!",
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      let resp = await fetch("/api/telegram/get-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.botToken.trim() }),
      });

      let data = await resp.json();

      // If webhook conflict, auto-resolve by deleting webhook and retrying
      if (!resp.ok || !data.success) {
        if (data.message && data.message.toLowerCase().includes("webhook")) {
          await fetch("/api/telegram/delete-webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: config.botToken.trim() }),
          });
          resp = await fetch("/api/telegram/get-updates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: config.botToken.trim() }),
          });
          data = await resp.json();
        }
      }

      if (!resp.ok || !data.success) {
        throw new Error(data.message || "Lỗi kiểm tra tin nhắn Telegram");
      }

      if (data.detectedChat) {
        const foundId = String(data.detectedChat.id);
        setConfig((prev) => ({ ...prev, chatId: foundId }));
        setStatusMessage({
          type: "success",
          text: `🎉 Đã tìm thấy Chat ID: ${foundId} (${data.detectedChat.first_name || data.detectedChat.title || "Người dùng"})! Bây giờ bạn có thể gửi thử tin nhắn hoặc bắt đầu giao việc.`,
        });
      } else {
        setStatusMessage({
          type: "info",
          text: "Chưa thấy tin nhắn nào! Bạn hãy mở Telegram, tìm bot của bạn và gõ /start rồi bấm lại nút này nhé.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Lỗi dò tìm Chat ID",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!config.botToken.trim() || !config.chatId.trim()) {
      setStatusMessage({
        type: "error",
        text: "Cần có đủ Bot Token và Chat ID để gửi tin nhắn!",
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const text = `🎉 <b>CHÚC MỪNG CHỦ TỊCH HĐQT!</b>\n\nKết nối giữa <b>AgentCorp Web</b> và <b>Telegram Bot</b> đã hoạt động an toàn.\n\nTừ bây giờ, bạn có thể gửi bài toán bất cứ lúc nào bằng lệnh:\n<code>/mission &lt;bài toán của bạn&gt;</code>\n\nVí dụ:\n• <code>/mission Xây dựng app đặt xe công nghệ</code>\n• <code>/mission Thiết kế website bán quần áo</code>\n\nHội đồng 6 AI sẽ nhận lệnh và lập tức phân rã công việc cho bạn!`;

      const resp = await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: config.botToken.trim(),
          chatId: config.chatId.trim(),
          text,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.message || "Lỗi gửi tin nhắn");
      }

      setStatusMessage({
        type: "success",
        text: "Đã gửi tin nhắn thử nghiệm thành công! Mời bạn mở Telegram để kiểm tra!",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Gửi tin nhắn thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetWebhook = async () => {
    if (!config.botToken.trim()) {
      setStatusMessage({
        type: "error",
        text: "Vui lòng nhập Bot Token trước!",
      });
      return;
    }

    const currentOrigin = getSafeOrigin();
    const webhookUrl = `${currentOrigin}/api/telegram/webhook`;

    setLoading(true);
    setStatusMessage(null);

    try {
      const resp = await fetch("/api/telegram/set-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: config.botToken.trim(),
          webhookUrl,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.message || "Lỗi cài đặt Webhook");
      }

      setConfig((prev) => ({ ...prev, webhookConfigured: true }));
      setStatusMessage({
        type: "success",
        text: `Đã kết nối Webhook thành công! Giờ bạn có thể nhắn tin trực tiếp cho Bot trên Telegram để giao việc tự động.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Cài đặt Webhook thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig({
      botToken: "",
      chatId: "",
      isConnected: false,
      notifyOnComplete: true,
      webhookConfigured: false,
    });
    setStatusMessage({
      type: "info",
      text: "Đã xóa sạch toàn bộ Token và dữ liệu kết nối khỏi trình duyệt máy bạn!",
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/20">
              <Send className="w-5 h-5 -rotate-45 -translate-y-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  TELEGRAM INTEGRATION
                </span>
                {config.isConnected && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Đã liên kết
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Cổng Giao Việc Qua Telegram & Bảo Mật
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab("connect")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "connect"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Kết nối Bot</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "security"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cam Kết An Toàn (Không sợ hack)</span>
          </button>

          <button
            onClick={() => setActiveTab("no-token")}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "no-token"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Giao việc KHÔNG cần Token</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : statusMessage.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-300"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : statusMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
              )}
              <div className="flex-1 space-y-1.5">
                <div className="font-medium">{statusMessage.text}</div>
                {statusMessage.text.toLowerCase().includes("webhook") && (
                  <button
                    onClick={handleDeleteWebhook}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Tự động gỡ xung đột Webhook & Dò lại Chat ID</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: CONNECT BOT */}
          {activeTab === "connect" && (
            <div className="space-y-6">
              {/* Direct Link to Open Bot when configured */}
              {config.botUsername && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 border-2 border-blue-500/60 shadow-xl shadow-blue-500/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                        <Send className="w-6 h-6 -rotate-45 -translate-y-0.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                          Đã liên kết Bot Telegram
                        </div>
                        <div className="text-base font-extrabold text-white flex items-center gap-2">
                          <span>@{config.botUsername}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Đang Trực Tuyến
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://t.me/${config.botUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0 animate-bounce hover:animate-none"
                    >
                      <Send className="w-4 h-4 -rotate-45" />
                      <span>Mở Bot @{config.botUsername} trên Telegram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Vì sao mở Telegram chưa thấy gì?</strong> Vì con Bot vừa tạo là một phòng chat mới, bạn cần <strong>bấm nút màu xanh ở trên</strong> (hoặc gõ tìm <code>@{config.botUsername}</code> trên Telegram) rồi bấm <strong>START</strong> để bắt đầu trò chuyện với nó nhé!
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Security Reassurance Note */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">Hoàn toàn an tâm:</strong> Bot Token chỉ là một con bot riêng biệt, <strong>KHÔNG</strong> thể truy cập danh bạ, ảnh, hay tin nhắn Telegram cá nhân của bạn. Bạn có thể thu hồi bất cứ lúc nào bằng lệnh <code>/revoke</code> tại @BotFather.
                </div>
              </div>

              {/* Quick Guide: 3 Steps to create Telegram Bot */}
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Hướng dẫn tạo Bot Telegram trong 60 giây (Miễn phí):
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                    <span className="font-bold text-blue-400">1. Mở @BotFather</span>
                    <p className="text-slate-400 text-[11px]">
                      Mở Telegram, bấm vào liên kết{" "}
                      <a
                        href="https://t.me/BotFather"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline font-semibold inline-flex items-center gap-0.5"
                      >
                        @BotFather <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                    <span className="font-bold text-indigo-400">2. Tạo Bot mới</span>
                    <p className="text-slate-400 text-[11px]">
                      Gõ lệnh <code className="text-amber-300 font-mono">/newbot</code>, đặt tên cho bot (vd: <code className="text-slate-300">MyAgentCorpBot</code>).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                    <span className="font-bold text-emerald-400">3. Lấy Token & Dán</span>
                    <p className="text-slate-400 text-[11px]">
                      Copy chuỗi mã API Token (dạng <code className="text-slate-300 font-mono">123456:ABC...</code>) và dán vào ô dưới.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Input Section */}
              <div className="space-y-4">
                {/* 1. Bot Token Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-400" />
                      Telegram Bot Token (HTTP API):
                    </span>
                    {config.botUsername && (
                      <a
                        href={`https://t.me/${config.botUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Mở bot: @{config.botUsername} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Ví dụ: 7891234567:AAFmK_4X..."
                      value={config.botToken}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, botToken: e.target.value }))
                      }
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-mono text-white outline-none"
                    />

                    <button
                      disabled={loading || !config.botToken.trim()}
                      onClick={handleVerifyBot}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                      <span>Xác thực Bot</span>
                    </button>
                  </div>
                </div>

                {/* 2. Chat ID Input + Auto Detect */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      Chat ID Của Bạn (ID người nhận):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      (Dùng để nhận báo cáo & kết quả về máy)
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Bấm nút bên cạnh để tự động tìm, hoặc nhập số ID..."
                      value={config.chatId}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, chatId: e.target.value }))
                      }
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-mono text-white outline-none"
                    />

                    <button
                      disabled={loading || !config.botToken.trim()}
                      onClick={handleAutoDetectChatId}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                      title="Tìm tin nhắn gần nhất bạn vừa gửi cho Bot"
                    >
                      <span>Tự động tìm Chat ID</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    disabled={loading || !config.botToken.trim() || !config.chatId.trim()}
                    onClick={handleSendTest}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi tin nhắn thử nghiệm</span>
                  </button>

                  <button
                    disabled={loading || !config.botToken.trim()}
                    onClick={handleSetWebhook}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
                    title="Kích hoạt nhận lệnh tự động từ Telegram về máy chủ"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kích hoạt Webhook Tự Động</span>
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.notifyOnComplete}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        notifyOnComplete: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3 text-amber-400" />
                    Báo cáo về Telegram khi xong bài toán
                  </span>
                </label>
              </div>

              {/* Telegram Command Cheatsheet */}
              <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Cú pháp giao việc qua Telegram:</span>
                  <span className="text-[11px] text-slate-500">Chạm để sao chép</span>
                </h4>

                <div className="space-y-1.5 font-mono text-xs">
                  <div
                    onClick={() =>
                      copyToClipboard(
                        "/mission Xây dựng website xem phim trực tuyến tương tự Motfilm",
                        "cmd1"
                      )
                    }
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="truncate">
                      <span className="text-amber-400 font-bold">/mission</span>{" "}
                      <span className="text-slate-300">
                        Xây dựng website xem phim trực tuyến tương tự Motfilm
                      </span>
                    </div>
                    <button className="text-slate-500 group-hover:text-slate-300 ml-2">
                      {copiedCmd === "cmd1" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div
                    onClick={() => copyToClipboard("/status", "cmd2")}
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div>
                      <span className="text-blue-400 font-bold">/status</span>{" "}
                      <span className="text-slate-400 text-[11px]">
                        - Kiểm tra trạng thái hoạt động của 6 AI
                      </span>
                    </div>
                    <button className="text-slate-500 group-hover:text-slate-300 ml-2">
                      {copiedCmd === "cmd2" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div
                    onClick={() => copyToClipboard("/report", "cmd3")}
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div>
                      <span className="text-emerald-400 font-bold">/report</span>{" "}
                      <span className="text-slate-400 text-[11px]">
                        - Nhận bản tóm tắt điều hành & quyết nghị của CEO
                      </span>
                    </div>
                    <button className="text-slate-500 group-hover:text-slate-300 ml-2">
                      {copiedCmd === "cmd3" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PRIVACY PROMISE */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-300">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Giải Thích Kỹ Thuật: Vì sao Token Bot không thể hack tài khoản của bạn?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rất nhiều người thường nhầm lẫn giữa <strong>Mật khẩu tài khoản Telegram cá nhân</strong> và <strong>Bot Token</strong>. Dưới đây là sự thật về cơ chế bảo mật của Telegram:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    1. Bot Token là một con bot độc lập, không phải tài khoản cá nhân
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Khi bạn vào <code>@BotFather</code> tạo bot, Telegram cấp cho bạn một chương trình rỗng. Bot này <strong>KHÔNG CÓ QUYỀN</strong> xem danh bạ điện thoại, không thể đọc tin nhắn riêng tư, không thấy tài khoản ngân hàng hay bất kỳ đoạn chat cá nhân nào của bạn.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    2. Token chỉ được lưu tại trình duyệt của bạn (Local Storage)
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Hệ thống AgentCorp không có cơ sở dữ liệu bên ngoài thu thập token. Dữ liệu chỉ nằm trong bộ nhớ máy tính/điện thoại bạn đang dùng. Người khác truy cập web cũng hoàn toàn không thể thấy token của bạn.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    3. Lỡ lộ Token thì thu hồi trong 1 giây như thế nào?
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Nếu bạn nghi ngờ token bị lộ, chỉ cần mở Telegram $\rightarrow$ vào <code>@BotFather</code> $\rightarrow$ gõ lệnh <code>/revoke</code> $\rightarrow$ chọn tên con bot. Token cũ sẽ bị tiêu hủy ngay lập tức trên toàn cầu, không ai dùng được nữa!
                  </p>
                </div>
              </div>

              {/* Danger Zone: Clear all local data */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      Xóa sạch dữ liệu kết nối ngay lập tức
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Xóa toàn bộ Bot Token và Chat ID đã lưu khỏi bộ nhớ máy này.
                    </p>
                  </div>

                  <button
                    onClick={handleClearAllData}
                    className="px-3.5 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all shrink-0"
                  >
                    Xóa sạch Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NO TOKEN NEEDED */}
          {activeTab === "no-token" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span>Nếu Bạn Vẫn Lo Ngại? KHÔNG CẦN DÙNG TOKEN VẪN DÙNG RẤT TIỆN!</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Bạn hoàn toàn không bắt buộc phải liên kết Telegram nếu cảm thấy không an tâm. Dưới đây là <strong>2 cách giao việc siêu tiện lợi trên điện thoại mà không cần bất kỳ mã Token nào</strong>:
                </p>
              </div>

              <div className="space-y-3">
                {/* Method 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-extrabold">1</span>
                    Lưu Trang Web ra Màn Hình Chính Điện Thoại (Dùng như App thật)
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    • Mở trình duyệt trên điện thoại (Safari trên iPhone hoặc Chrome trên Android).<br />
                    • Bấm nút <strong>Chia sẻ (Share)</strong> $\rightarrow$ Chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.<br />
                    • Biểu tượng AgentCorp sẽ xuất hiện trên màn hình điện thoại của bạn như một ứng dụng độc lập. Khi nào cần giao việc, chỉ cần chạm 1 cái là mở ra giao việc ngay!
                  </p>
                </div>

                {/* Method 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-extrabold">2</span>
                    Giao việc trực tiếp bằng Giọng Nói hoặc Gõ Nhanh trên Web
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Giao diện Web của AgentCorp đã được tối ưu siêu tốc cho cả Mobile và Desktop:
                    có sẵn <strong>Hội đồng 6 AI</strong>, <strong>Bản Chạy Thử Web Trực Tiếp</strong> và <strong>Đọc giọng nói phản biện (Voice TTS)</strong> mà không cần cài đặt thêm bất kỳ thứ gì!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mã Token lưu cục bộ trên máy bạn. Tuyệt đối không chia sẻ cho bên thứ ba.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
