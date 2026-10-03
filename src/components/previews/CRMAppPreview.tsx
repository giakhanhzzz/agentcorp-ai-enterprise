import React, { useState } from "react";
import {
  Headphones,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Bot,
  Sparkles,
  Zap,
  TrendingUp,
  AlertCircle,
  Code2,
  Compass,
  RefreshCw,
} from "lucide-react";
import { CompanyTask } from "../../types";

interface CRMAppPreviewProps {
  mission: string;
  tasks: CompanyTask[];
  onOpenCode: () => void;
  onRequestIteration?: (directive: string) => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

export const CRMAppPreview: React.FC<CRMAppPreviewProps> = ({
  mission,
  tasks,
  onOpenCode,
  onRequestIteration,
  isStandalone,
  onExitStandalone,
}) => {
  const [directive, setDirective] = useState("");
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(true);

  // Chat simulation state
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "customer", text: "Chào bạn, đơn hàng #VN8921 của tôi đặt 3 ngày trước nhưng chưa nhận được mã vận đơn?", time: "10:14" },
    { sender: "agent", agent: "Triage Bot", text: "Đang tra cứu cơ sở dữ liệu kho vận và kiểm tra tình trạng đóng gói...", time: "10:14" },
    { sender: "agent", agent: "CSKH Swarm Resolver", text: "Dạ em đã kiểm tra, kiện hàng của anh đã đóng gói xong tại kho Tân Bình và đang được đơn vị vận chuyển Viettel Post lấy lúc 11:00 hôm nay. Em gửi anh mã theo dõi: VTP-99214482 ạ!", time: "10:15" },
  ]);

  const [activeTickets, setActiveTickets] = useState([
    { id: "TCK-8812", customer: "Trần Bảo Nam", issue: "Yêu cầu đổi size áo khoác nam", priority: "Bình thường", status: "AI Tự động xử lý", waitTime: "25 giây" },
    { id: "TCK-8813", customer: "Lê Thị Thu Thảo", issue: "Lỗi thanh toán VNPAY trừ tiền 2 lần", priority: "Khẩn cấp", status: "Chuyển giao Chuyên viên", waitTime: "1 phút" },
    { id: "TCK-8814", customer: "Nguyễn Văn Hùng", issue: "Hỏi chính sách bảo hành tai nghe 12 tháng", priority: "Bình thường", status: "Đã giải quyết xong", waitTime: "15 giây" },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: "customer", text: userText, time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      const botResponse = {
        sender: "agent",
        agent: "Swarm AI Agent",
        text: `Dạ em đã tiếp nhận yêu cầu: "${userText}". Dựa trên dữ liệu chính sách mới nhất, hệ thống đã ghi nhận và tự động xử lý ngay cho bạn! Bạn có cần hỗ trợ thêm thông tin gì không ạ?`,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 1000);
  };

  const handleSubmitDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directive.trim() || !onRequestIteration) return;
    onRequestIteration(directive.trim());
    setDirective("");
  };

  return (
    <div className="space-y-6">
      {/* 1. Chairman Control & Directive Bar for CSKH */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-500/40 p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Phòng Điều Hành Trực Tiếp Của Chủ Tịch
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  CSKH Swarm v2.8 Live
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Chỉ Đạo Bắt Hội Đồng AI Nâng Cấp Tổng Đài CSKH
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
            placeholder="Chỉ đạo nâng cấp tổng đài (vd: Tự động phát voucher hoàn tiền 50k khi giao hàng trễ, thêm kịch bản Zalo OA, chấm điểm thái độ khách hàng...)"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
          />
          <button
            type="submit"
            disabled={!directive.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nâng Cấp CSKH Ngay</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-[11px] text-slate-400 font-semibold">Chỉ đạo nhanh:</span>
          {[
            "Tự động giải quyết hoàn tiền dưới 100k",
            "Tích hợp RAG tra cứu bảng size thời trang chuẩn xác",
            "Bật chế độ định tuyến ticket VIP cho khách hạng Kim Cương",
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setDirective(chip);
                if (onRequestIteration) onRequestIteration(chip);
              }}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/40 transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Competitor Radar */}
        <div className="mt-4 pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDiscoveryMode(!isDiscoveryMode)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>🌐 Radar CSKH: {isDiscoveryMode ? "BẬT" : "TẮT"}</span>
            </button>
            <span className="text-slate-400 text-[11px]">
              (Soi chiếu đối thủ: Zendesk AI, Intercom Fin, Freshdesk, Gorgias)
            </span>
          </div>

          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Đang soi chiếu mảng: Hệ Thống CSKH Đa Kênh Tự Động Bằng Multi-Agent</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive CSKH Swarm Console */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold">Tỷ Lệ Tự Động Hóa AI</div>
            <div className="text-2xl font-extrabold text-emerald-400">84.6%</div>
            <div className="text-[11px] text-slate-500">Giảm 75% tải cho nhân sự trực</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold">Thời Gian Phản Hồi TB</div>
            <div className="text-2xl font-extrabold text-cyan-400">1.8s</div>
            <div className="text-[11px] text-emerald-400">Nhanh gấp 40 lần con người</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold">Điểm Hài Lòng (CSAT)</div>
            <div className="text-2xl font-extrabold text-amber-400">4.9 / 5.0</div>
            <div className="text-[11px] text-slate-500">Từ 1,840 lượt đánh giá</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold">Ticket Đã Giải Quyết</div>
            <div className="text-2xl font-extrabold text-indigo-400">5,280</div>
            <div className="text-[11px] text-indigo-400">Hoàn tất trong tháng này</div>
          </div>
        </div>

        {/* Live Simulator & Active Ticket Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Chat Box Simulator */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 flex flex-col h-[420px]">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Khung Chat Khách Hàng (Live Test)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Channel: Web Widget</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "customer" ? "items-end" : "items-start"}`}
                >
                  {m.agent && (
                    <span className="text-[10px] font-bold text-cyan-400 mb-0.5 flex items-center gap-1">
                      <Bot className="w-3 h-3" /> {m.agent}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl ${
                      m.sender === "customer"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5">{m.time}</span>
                </div>
              ))}
              {isBotTyping && (
                <div className="text-[11px] text-cyan-400 flex items-center gap-1.5 animate-pulse">
                  <Bot className="w-3 h-3" /> Swarm AI đang tra cứu tri thức & soạn phản hồi...
                </div>
              )}
            </div>

            {/* Input area */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập câu hỏi test giả lập khách hàng (vd: 'Cho tôi đổi hàng', 'Sản phẩm này bảo hành sao?')..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Active Tickets Queue */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Hàng Đợi Yêu Cầu Hỗ Trợ Đang Xử Lý (Queue)</span>
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono">3 Đang Chạy</span>
              </div>

              <div className="space-y-2">
                {activeTickets.map((tck) => (
                  <div key={tck.id} className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{tck.customer}</span>
                      <span className="font-mono text-[10px] text-cyan-400">{tck.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">{tck.issue}</div>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-slate-400">Trạng thái: <strong className="text-emerald-400">{tck.status}</strong></span>
                      <span className="text-slate-500">Chờ: {tck.waitTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="text-cyan-400 font-bold">✓ Swarm Routing Policy:</span> Tự động phân cấp: Sự cố mức 1 do Swarm giải quyết trong 5 giây, sự cố phức tạp chuyển thẳng chuyên viên cấp cao kèm tóm tắt ngữ cảnh.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
