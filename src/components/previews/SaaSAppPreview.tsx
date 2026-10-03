import React, { useState } from "react";
import {
  Cpu,
  Zap,
  Key,
  CreditCard,
  Layers,
  Activity,
  Server,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Plus,
  Compass,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  Terminal,
  ExternalLink,
  Code2,
  Sliders,
  DollarSign,
  Users,
} from "lucide-react";
import { CompanyTask } from "../../types";

interface SaaSAppPreviewProps {
  mission: string;
  tasks: CompanyTask[];
  onOpenCode: () => void;
  onRequestIteration?: (directive: string) => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

export const SaaSAppPreview: React.FC<SaaSAppPreviewProps> = ({
  mission,
  tasks,
  onOpenCode,
  onRequestIteration,
  isStandalone,
  onExitStandalone,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "apikeys" | "playground" | "pricing" | "infra">("overview");
  const [directive, setDirective] = useState("");
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(true);
  const [isScanningRadar, setIsScanningRadar] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Playground state
  const [playgroundPrompt, setPlaygroundPrompt] = useState("Phân tích dữ liệu doanh thu quý 3 và đề xuất 3 giải pháp tăng trưởng");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // API keys state
  const [apiKeys, setApiKeys] = useState([
    { id: "key_live_01", name: "Production Gateway", key: "sk-live_hyperscale_89412af89c02", created: "2 ngày trước", status: "Active", calls: "148,200 / 500k" },
    { id: "key_staging_02", name: "Staging Testing", key: "sk-test_hyperscale_0912ab8983cf", created: "5 ngày trước", status: "Active", calls: "12,400 / 50k" },
  ]);

  const handleCreateNewKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: `Custom API Key #${apiKeys.length + 1}`,
      key: `sk-live_hyperscale_${Math.random().toString(36).substring(2, 12)}`,
      created: "Vừa tạo",
      status: "Active",
      calls: "0 / 200k",
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTestPlayground = () => {
    if (!playgroundPrompt.trim()) return;
    setIsGenerating(true);
    setPlaygroundOutput("");
    setTimeout(() => {
      setPlaygroundOutput(
        `[HyperScale Engine 3.8 - Latency: 132ms - Tokens: 420]\n\n` +
        `DỰA TRÊN PHÂN TÍCH DOANH THU QUÝ 3:\n` +
        `1. Tỷ lệ chuyển đổi phễu tăng 18% khi áp dụng micro-billing theo token thực tế.\n` +
        `2. Điểm nghẽn churn rơi vào tuần thứ 3 sau khi người dùng vượt quá tier dùng thử 10k request.\n` +
        `3. Khuyến nghị: Bật gói Growth Tier $99/tháng kèm tính năng rate-limit thông minh và hỗ trợ webhook thời gian thực.`
      );
      setIsGenerating(false);
    }, 900);
  };

  const handleSubmitDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directive.trim() || !onRequestIteration) return;
    onRequestIteration(directive.trim());
    setDirective("");
  };

  return (
    <div className="space-y-6">
      {/* 1. Chairman Control & Directive Bar for SaaS */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Phòng Điều Hành Trực Tiếp Của Chủ Tịch
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  SaaS B2B Live Engine v3.0
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Chỉ Đạo Bắt Hội Đồng AI Nâng Cấp Nền Tảng SaaS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Xem Code & WBS ({tasks.length})</span>
            </button>
            {isStandalone && onExitStandalone && (
              <button
                onClick={onExitStandalone}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/80"
              >
                ✕ Thoát Toàn Màn Hình
              </button>
            )}
          </div>
        </div>

        {/* Input field for Chairman */}
        <form onSubmit={handleSubmitDirective} className="flex gap-2">
          <input
            type="text"
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            placeholder="Chủ tịch chê điểm nào? Nhập yêu cầu sửa (vd: Thêm gói Enterprise $499/tháng, bật Rate Limit 10,000 RPM, tích hợp Claude 3.5, kiểm tra rủi ro bảo mật API Key...)"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-indigo-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-all"
          />
          <button
            type="submit"
            disabled={!directive.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bắt AI Nâng Cấp Ngay</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-[11px] text-slate-400 font-semibold">Chỉ đạo nhanh:</span>
          {[
            "Bật gói Enterprise $499/tháng kèm SLA 99.99%",
            "Tích hợp Webhook Stripe tự động gia hạn token",
            "Tối ưu hóa Rate-Limit 10,000 req/min chống DDoS",
            "Bổ sung SDK TypeScript và Python cho khách hàng B2B",
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setDirective(chip);
                if (onRequestIteration) onRequestIteration(chip);
              }}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/40 transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* SaaS Competitor Discovery Radar */}
        <div className="mt-4 pt-3 border-t border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDiscoveryMode(!isDiscoveryMode)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>🌐 Radar Đối Thủ SaaS B2B: {isDiscoveryMode ? "BẬT" : "TẮT"}</span>
            </button>
            <span className="text-slate-400 text-[11px]">
              (Soi chiếu: OpenAI Platform, LangChain Hub, Anthropic Console, AWS Bedrock)
            </span>
          </div>

          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Đang soi chiếu mảng: Nền tảng SaaS AI B2B & API Engine</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive SaaS Live Product Workspace */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
        {/* SaaS App Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">HyperScale 30D</h3>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  AI B2B Platform v1.2
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Nền tảng API AI Microservices & Cổng quản trị phân quyền đa khách hàng (Multi-Tenant)
              </p>
            </div>
          </div>

          {/* Navigation Tabs within SaaS App */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: "overview", label: "Tổng Quan (Dashboard)", icon: Activity },
              { id: "apikeys", label: "Quản Lý API Key", icon: Key },
              { id: "playground", label: "AI Playground", icon: Terminal },
              { id: "pricing", label: "Bảng Giá SaaS", icon: CreditCard },
              { id: "infra", label: "Hạ Tầng Microservices", icon: Server },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === "overview" && (
          <div className="p-6 space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Doanh Thu Tháng (MRR)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">$42,850</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +28.4% so với tháng trước
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>API Keys Hoạt Động</span>
                  <Key className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">1,420</div>
                <div className="text-[11px] text-indigo-400">+120 key mới tuần này</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Lượng Token Đã Xử Lý</span>
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">184.2M</div>
                <div className="text-[11px] text-blue-400">Trung bình 6.1M token/ngày</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Độ Trễ P99 / Uptime</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">128ms</div>
                <div className="text-[11px] text-emerald-400">Uptime 99.98% SLA</div>
              </div>
            </div>

            {/* Architecture Flow & Key Features */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Kiến Trúc Microservices Đã Triển Khai (Go-To-Market 30 Ngày)</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống gồm API Gateway cân bằng tải, bộ nhớ đệm đa tầng Redis Cache chống nghẽn, dịch vụ tính cước vi mô (Micro-Billing) đồng bộ với Stripe và cụm Vector Database RAG hỗ trợ tri thức doanh nghiệp độc quyền.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white mb-1">Cổng API Gateway</div>
                  <div className="text-[11px] text-slate-400">Định tuyến động, giải mã JWT và giới hạn tần suất 10k RPM tự động.</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white mb-1">Mô Hình Đa Phân Quyền (Multi-Tenant)</div>
                  <div className="text-[11px] text-slate-400">Cô lập dữ liệu tuyệt đối giữa các công ty khách hàng, đạt chuẩn ISO 27001.</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white mb-1">Đồng Bộ Token & Doanh Thu</div>
                  <div className="text-[11px] text-slate-400">Đo lường chi phí suy luận theo thời gian thực, đảm bảo biên lợi nhuận &gt;65%.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: API Keys Management */}
        {activeTab === "apikeys" && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Khóa Truy Cập API (API Keys)</h4>
                <p className="text-xs text-slate-400">Sử dụng khóa này trong Bearer Authorization Header để gọi API từ hệ thống của bạn.</p>
              </div>
              <button
                onClick={handleCreateNewKey}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tạo Khóa Mới</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
              {apiKeys.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                        {item.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block">
                      {item.key}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tạo: {item.created} • Hạn ngạch: {item.calls}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyKey(item.key)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      {copiedKey === item.key ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <span className="text-slate-500">// Mẫu gọi API từ cURL:</span>
              <pre className="text-indigo-300 overflow-x-auto">
                {`curl -X POST https://api.hyperscale.ai/v1/chat/completions \\
  -H "Authorization: Bearer sk-live_hyperscale_89412af89c02" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "hyperscale-ultra", "prompt": "Xin chào thế giới"}'`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: AI Model Playground */}
        {activeTab === "playground" && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">Kiểm Thử Mô Hình AI (Playground Sandbox)</h4>
              <p className="text-xs text-slate-400">Môi trường kiểm tra phản hồi thời gian thực, đo lường tốc độ token và độ chính xác của mô hình.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Prompt đầu vào:</label>
                <textarea
                  rows={3}
                  value={playgroundPrompt}
                  onChange={(e) => setPlaygroundPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Mô hình: HyperScale Engine 3.8-Flash (Zero-Latency)</span>
                <button
                  onClick={handleTestPlayground}
                  disabled={isGenerating || !playgroundPrompt.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? "Đang suy luận..." : "Gửi Request Thử Nghiệm"}</span>
                </button>
              </div>

              {playgroundOutput && (
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
                  <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Phản hồi từ cụm API:
                  </div>
                  <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {playgroundOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Pricing & Subscription */}
        {activeTab === "pricing" && (
          <div className="p-6 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h4 className="text-lg font-extrabold text-white">Mô Hình Bảng Giá Subscription B2B</h4>
              <p className="text-xs text-slate-400">Được tối ưu hoá biên lợi nhuận trên từng khách hàng và tỷ lệ giữ chân khách hàng (Retention Rate).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h5 className="text-sm font-bold text-white">Gói Khởi Nghiệp (Starter)</h5>
                  <div className="mt-2 text-2xl font-black text-white">$29 <span className="text-xs text-slate-400 font-normal">/ tháng</span></div>
                  <p className="text-xs text-slate-400 mt-1">Dành cho cá nhân & MVP mới khởi chạy.</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-1.5">✓ 500,000 token AI / tháng</li>
                  <li className="flex items-center gap-1.5">✓ 3 API Key đồng thời</li>
                  <li className="flex items-center gap-1.5">✓ Hỗ trợ cộng đồng Discord</li>
                </ul>
                <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                  Chọn Gói Starter
                </button>
              </div>

              {/* Growth */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-950 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 space-y-4 relative">
                <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase">
                  Phổ Biến Nhất
                </span>
                <div>
                  <h5 className="text-sm font-bold text-white">Gói Tăng Trưởng (Growth)</h5>
                  <div className="mt-2 text-2xl font-black text-white">$99 <span className="text-xs text-slate-400 font-normal">/ tháng</span></div>
                  <p className="text-xs text-slate-400 mt-1">Dành cho startup SaaS đang scale người dùng.</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-1.5 font-semibold text-indigo-300">✓ 5,000,000 token AI / tháng</li>
                  <li className="flex items-center gap-1.5">✓ 20 API Key & Webhook Stripe</li>
                  <li className="flex items-center gap-1.5">✓ Đảm bảo SLA P99 &lt; 150ms</li>
                  <li className="flex items-center gap-1.5">✓ Hỗ trợ kỹ thuật 24/7 qua Telegram</li>
                </ul>
                <button className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30">
                  Nâng Cấp Gói Growth
                </button>
              </div>

              {/* Enterprise */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h5 className="text-sm font-bold text-white">Doanh Nghiệp (Enterprise)</h5>
                  <div className="mt-2 text-2xl font-black text-white">$499 <span className="text-xs text-slate-400 font-normal">/ tháng</span></div>
                  <p className="text-xs text-slate-400 mt-1">Dành cho tập đoàn cần hạ tầng riêng biệt.</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-1.5">✓ Không giới hạn token AI</li>
                  <li className="flex items-center gap-1.5">✓ Triển khai cụm máy chủ Private VPC</li>
                  <li className="flex items-center gap-1.5">✓ Hợp đồng SLA 99.99%</li>
                  <li className="flex items-center gap-1.5">✓ Chuyên gia kiến trúc AI đồng hành</li>
                </ul>
                <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                  Liên Hệ Doanh Nghiệp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Infrastructure Status */}
        {activeTab === "infra" && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white">Trạng Thái Hạ Tầng Microservices</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Authentication Gateway (JWT/OAuth)", status: "Operational", ping: "24ms" },
                { name: "Rate Limiter Cluster (Redis Sentinel)", status: "Operational", ping: "12ms" },
                { name: "Vector Database Cluster (Pinecone / Qdrant)", status: "Operational", ping: "45ms" },
                { name: "Stripe Billing & Webhook Dispatcher", status: "Operational", ping: "88ms" },
                { name: "Telemetry & Zero-Log Audit Node", status: "Operational", ping: "18ms" },
              ].map((node) => (
                <div key={node.name} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">{node.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 font-mono">{node.ping}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      {node.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
