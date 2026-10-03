import React, { useState } from "react";
import {
  X,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Globe,
  HardDrive,
  Key,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { AISettings, AIProvider } from "../types";

interface AIEngineModalProps {
  settings: AISettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AISettings) => void;
  onOpenGPTBridge?: () => void;
}

export const AIEngineModal: React.FC<AIEngineModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
  onOpenGPTBridge,
}) => {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const resp = await fetch("/api/free-ai/test-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: localSettings.activeProvider,
          apiKey:
            localSettings.activeProvider === "openai"
              ? localSettings.openAiApiKey
              : localSettings.activeProvider === "deepseek"
              ? localSettings.deepseekApiKey
              : localSettings.activeProvider === "groq"
              ? localSettings.groqApiKey
              : localSettings.activeProvider === "openrouter"
              ? localSettings.openRouterApiKey
              : localSettings.customApiKey,
          customBaseUrl: localSettings.customEndpoint,
          model:
            localSettings.activeProvider === "openai"
              ? localSettings.openAiModel || "gpt-4o-mini"
              : localSettings.activeProvider === "deepseek"
              ? localSettings.deepseekModel || "deepseek-chat"
              : localSettings.activeProvider === "groq"
              ? localSettings.groqModel
              : localSettings.activeProvider === "openrouter"
              ? localSettings.openRouterModel
              : localSettings.customModel,
        }),
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({
          success: false,
          message: data.message || "Lỗi kiểm tra kết nối",
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Không thể kết nối đến máy chủ",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAndClose = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cấu Hình Động Cơ AI & Tích Hợp AI Miễn Phí (Free AI Hub)
              </h3>
              <p className="text-xs text-slate-400">
                Linh hoạt chuyển đổi giữa Gemini tích hợp sẵn, Groq, OpenRouter hoặc AI cục bộ (Ollama)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {/* Highlight Card: Single AI Emulation Mechanism */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-200">
                  Cơ chế &quot;1 AI Vận Hành Toàn Bộ Doanh Nghiệp&quot;
                </span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                  Tự động phân vai
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Khi kích hoạt, dù chỉ có <strong>1 mô hình AI miễn phí</strong>, hệ thống sẽ tự động thực hiện chuỗi tư duy đa góc nhìn (Round-robin Multi-Persona). AI sẽ lần lượt hoán đổi vai trò thành CEO định hướng, CPO chia nhỏ nhiệm vụ, Kỹ sư trưởng viết mã, CMO tiếp thị và QA Critic phản biện lỗ hổng để đạt hiệu suất cao nhất!
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">
                Chế độ Tự động Phân vai (1 AI Hoá thân Cả Công ty)
              </p>
              <p className="text-[11px] text-slate-400">
                Khuyên dùng khi bạn muốn tiết kiệm API và sử dụng 1 mô hình duy nhất cho cả phòng họp
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.singleAIEmulationMode}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    singleAIEmulationMode: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Provider Selection Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Chọn Nhà Cung Cấp AI Cốt Lõi:
              </label>
              {onOpenGPTBridge && (
                <button
                  type="button"
                  onClick={onOpenGPTBridge}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Kết Nối GPT của bạn (ChatGPT Actions)</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* 1. Built-in Gemini */}
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({ ...localSettings, activeProvider: "gemini" })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.activeProvider === "gemini"
                    ? "bg-indigo-600/20 border-indigo-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">Google Gemini</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-indigo-300 font-semibold">Tích hợp sẵn</p>
                <p className="text-[10px] text-slate-500">Gemini 3.8 Flash</p>
              </button>

              {/* 2. OpenAI (ChatGPT / GPT-4o) */}
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({ ...localSettings, activeProvider: "openai" })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.activeProvider === "openai"
                    ? "bg-emerald-600/20 border-emerald-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">OpenAI / GPT</span>
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[10px] text-emerald-300 font-semibold">ChatGPT Engine</p>
                <p className="text-[10px] text-slate-500">GPT-4o / GPT-4o-mini</p>
              </button>

              {/* 3. DeepSeek */}
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({ ...localSettings, activeProvider: "deepseek" })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.activeProvider === "deepseek"
                    ? "bg-blue-600/20 border-blue-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">DeepSeek</span>
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-[10px] text-blue-300 font-semibold">Siêu suy luận</p>
                <p className="text-[10px] text-slate-500">V3 / Reasoner R1</p>
              </button>

              {/* 4. Groq Cloud */}
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({ ...localSettings, activeProvider: "groq" })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.activeProvider === "groq"
                    ? "bg-amber-600/20 border-amber-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">Groq Free</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[10px] text-amber-300 font-semibold">Tốc độ siêu nhanh</p>
                <p className="text-[10px] text-slate-500">Llama 3.3 70B</p>
              </button>

              {/* 5. OpenRouter Free */}
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({ ...localSettings, activeProvider: "openrouter" })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.activeProvider === "openrouter"
                    ? "bg-cyan-600/20 border-cyan-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">OpenRouter</span>
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[10px] text-cyan-300 font-semibold">Đa dạng Model</p>
                <p className="text-[10px] text-slate-500">Claude / Llama</p>
              </button>

              {/* 6. Ollama / Custom Local */}
              <button
                type="button"
                onClick={() =>
                  setLocalSettings({ ...localSettings, activeProvider: "ollama" })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localSettings.activeProvider === "ollama"
                    ? "bg-purple-600/20 border-purple-500 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white">Ollama / Local</span>
                  <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[10px] text-purple-300 font-semibold">Riêng tư tuyệt đối</p>
                <p className="text-[10px] text-slate-500">Localhost:11434</p>
              </button>
            </div>
          </div>

          {/* Provider Specific Settings */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
            {localSettings.activeProvider === "gemini" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã kết nối trực tiếp với máy chủ Google AI Studio</span>
                </div>
                <p className="text-slate-300">
                  AgentCorp đang vận hành bằng mô hình <strong>Gemini 3.8 Flash</strong> phía server. Mô hình này hoàn toàn miễn phí trong hạn mức tiêu chuẩn của AI Studio, sở hữu khả năng xuất JSON có cấu trúc và suy luận tốc độ cao.
                </p>
              </div>
            )}

            {localSettings.activeProvider === "openai" && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-300">
                      OpenAI API Key (ChatGPT):
                    </label>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Lấy OpenAI Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={localSettings.openAiApiKey || ""}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, openAiApiKey: e.target.value })
                    }
                    placeholder="sk-proj-..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Mô hình OpenAI:
                  </label>
                  <select
                    value={localSettings.openAiModel || "gpt-4o-mini"}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, openAiModel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini (Nhanh & Tối ưu chi phí - Khuyên dùng)</option>
                    <option value="gpt-4o">gpt-4o (Thông minh toàn diện & Vision)</option>
                    <option value="o3-mini">o3-mini (Lý luận sâu & Toán học)</option>
                    <option value="gpt-4-turbo">gpt-4-turbo</option>
                  </select>
                </div>
              </div>
            )}

            {localSettings.activeProvider === "deepseek" && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-300">
                      DeepSeek API Key:
                    </label>
                    <a
                      href="https://platform.deepseek.com/api_keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Lấy DeepSeek Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={localSettings.deepseekApiKey || ""}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, deepseekApiKey: e.target.value })
                    }
                    placeholder="sk-..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Mô hình DeepSeek:
                  </label>
                  <select
                    value={localSettings.deepseekModel || "deepseek-chat"}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, deepseekModel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="deepseek-chat">deepseek-chat (DeepSeek-V3 Tiêu chuẩn)</option>
                    <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek-R1 Suy luận chuỗi)</option>
                  </select>
                </div>
              </div>
            )}

            {localSettings.activeProvider === "groq" && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-300">
                      Groq API Key (Miễn phí):
                    </label>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Lấy key miễn phí</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={localSettings.groqApiKey || ""}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, groqApiKey: e.target.value })
                    }
                    placeholder="gsk_..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Mô hình Groq:
                  </label>
                  <input
                    type="text"
                    value={localSettings.groqModel || "llama-3.3-70b-versatile"}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, groqModel: e.target.value })
                    }
                    placeholder="llama-3.3-70b-versatile"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {localSettings.activeProvider === "openrouter" && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-300">
                      OpenRouter API Key:
                    </label>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Tạo key OpenRouter</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={localSettings.openRouterApiKey || ""}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, openRouterApiKey: e.target.value })
                    }
                    placeholder="sk-or-v1-..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Mô hình miễn phí (vd: meta-llama/llama-3.3-70b-instruct:free):
                  </label>
                  <input
                    type="text"
                    value={localSettings.openRouterModel || "meta-llama/llama-3.3-70b-instruct:free"}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, openRouterModel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {localSettings.activeProvider === "ollama" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Ollama Local Base URL:
                  </label>
                  <input
                    type="text"
                    value={localSettings.customEndpoint || "http://localhost:11434/v1"}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, customEndpoint: e.target.value })
                    }
                    placeholder="http://localhost:11434/v1"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Tên mô hình đã tải trong Ollama:
                  </label>
                  <input
                    type="text"
                    value={localSettings.customModel || "llama3"}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, customModel: e.target.value })
                    }
                    placeholder="llama3, mistral, qwen2.5:7b"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Test Connection Button & Status */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={testing}
                onClick={handleTestConnection}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{testing ? "Đang kiểm tra..." : "Kiểm Tra Kết Nối"}</span>
              </button>

              {testResult && (
                <div
                  className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                    testResult.success
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span className="truncate max-w-[280px]">{testResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <span className="text-xs text-slate-500">
            Cấu hình được lưu vào bộ nhớ làm việc của phiên này
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Áp Dụng Cấu Hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
