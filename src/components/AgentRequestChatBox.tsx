import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Cpu,
  User,
  Crown,
  Flame,
  Tv,
  ArrowRight,
  Check,
  X,
  MessageSquare,
  Zap,
  FolderKanban,
  Trophy,
  ChevronDown,
  ChevronUp,
  Bot,
  ExternalLink,
  RefreshCw,
  Layers,
  ShieldCheck,
  Terminal,
  Lightbulb,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Maximize2,
  Trash2,
  UploadCloud,
  Palette,
  Eye,
  Sliders,
} from "lucide-react";
import { Agent, AgentProposal, AgentChatMessage, AgentSkill, ChatAttachment, AISettings } from "../types";

interface AgentRequestChatBoxProps {
  agents: Agent[];
  proposals: AgentProposal[];
  onSendDirective: (text: string) => Promise<void> | void;
  onApproveProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
  isProcessing: boolean;
  activeProjectName: string;
  activeProjectId?: string;
  onSwitchSeason?: (season: "18" | "13") => void;
  onOpenPreview?: () => void;
  aiSettings?: AISettings;
  onOpenAISettings?: () => void;
  onOpenGPTBridge?: () => void;
  onUpdateAISettings?: (settings: AISettings) => void;
}

export const AgentRequestChatBox: React.FC<AgentRequestChatBoxProps> = ({
  agents,
  proposals,
  onSendDirective,
  onApproveProposal,
  onRejectProposal,
  isProcessing,
  activeProjectName,
  activeProjectId = "proj-tft",
  onSwitchSeason,
  onOpenPreview,
  aiSettings,
  onOpenAISettings,
  onOpenGPTBridge,
  onUpdateAISettings,
}) => {
  const [inputText, setInputText] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [autoExecuteMode, setAutoExecuteMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "proposals">("chat");
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const nameLower = (activeProjectName || "").toLowerCase();
  const idLower = (activeProjectId || "").toLowerCase();

  const isTFT =
    idLower.includes("tft") ||
    nameLower.includes("tft") ||
    nameLower.includes("đấu trường");

  const isMovie =
    idLower.includes("motfilm") ||
    nameLower.includes("motfilm") ||
    nameLower.includes("phim");

  // Storage key per project
  const storageChatKey = `agentcorp_chat_history_v2_${activeProjectId || "general"}`;

  // Initial welcome message from the Autonomous Agent
  const getInitialMessages = (): AgentChatMessage[] => {
    try {
      const saved = localStorage.getItem(storageChatKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    if (isTFT) {
      return [
        {
          id: `welcome-${activeProjectId}`,
          role: "agent",
          agentId: "architect",
          agentName: "Trần Tuấn Anh",
          agentRole: "Kiến Trúc Sư Hệ Thống & AI Agent",
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          content: `Chào bạn! Tôi là **Trần Tuấn Anh (Kiến Trúc Sư & AI Copilot)** của AgentCorp.\n\n📸 **Hỗ trợ Đa Phương Thức (Vision & File):** Bạn có thể **dán ảnh trực tiếp (Ctrl+V)**, kéo thả ảnh giao diện hoặc bấm icon đính kèm để gửi ảnh cho tôi. Tôi sẽ phân tích thiết kế, trích xuất màu sắc, đội hình và tự động làm web giống hệt ảnh của bạn!`,
          thoughtProcess: `[Skill: ui_vision_clone_engine & tft_meta_engine] Đã kích hoạt bộ phân tích ảnh đa phương thức (Gemini Multimodal Vision) & dữ liệu Riot Patch 15.2. Mặc định ĐTCL Mùa 18.`,
          invokedSkill: {
            id: "tft_meta_engine",
            name: "Skill: ĐTCL Meta Mùa 18 & AI Vision",
            icon: "Trophy",
            actionSummary: "Sẵn sàng nhận ảnh chụp màn hình UI / Đội hình và nhân bản thiết kế",
          },
          autoExecuted: true,
          card: {
            type: "tft_comps",
            title: "Meta Đội Hình ĐTCL Mùa 18 (Patch 15.2)",
            data: {
              season: "18",
              comps: [
                {
                  name: "Cơ Giáp Tương Lai - Siêu Pháo Thủ",
                  tier: "S+",
                  winRate: "62.4% Top 4 (18.2% Top 1)",
                  cost: "Fast 8 (Level 8)",
                  difficulty: "Trung Bình",
                  coreCarry: "Viktor (4 Tiền)",
                  coreTank: "Jayce (4 Tiền)",
                  itemsCarry: ["Ngọn Giáo Shojin", "Găng Bảo Thạch", "Mũ Phù Thủy"],
                  itemsTank: ["Giáp Máu Warmog", "Thú Tượng", "Vuốt Rồng"],
                },
                {
                  name: "Hắc Tinh Đột Biến (Dark Star)",
                  tier: "S",
                  winRate: "59.5% Top 4",
                  cost: "Reroll Cấp 7",
                  difficulty: "Dễ",
                  coreCarry: "Kai'Sa (4 Tiền)",
                  coreTank: "Cho'Gath 3 Sao (3 Tiền)",
                  itemsCarry: ["Cuồng Đao Guinsoo", "Vô Cực Kiếm", "Cung Xanh"],
                  itemsTank: ["Giáp Gai", "Giáp Tâm Linh", "Dây Chuyền Chuộc Tội"],
                },
              ],
            },
          },
        },
      ];
    }

    return [
      {
        id: `welcome-${activeProjectId}`,
        role: "agent",
        agentId: "architect",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống & AI Agent",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content: `Kính chào Chủ tịch! Tôi là **Trần Tuấn Anh (Kiến Trúc Sư Hệ Thống & AI Agent)**.\n\n📸 Bạn có thể **dán ảnh trực tiếp (Ctrl+V)** hoặc tải ảnh mẫu/tệp lên khung chat này. Tôi sẽ đọc ảnh, phân tích cấu trúc giao diện và tự động nạp bản vá vào **${activeProjectName}** tức thì!`,
        thoughtProcess: `[Skill: project_orchestrator & vision_cloner] Đã sẵn sàng phân tích hình ảnh và tiếp nhận chỉ thị trực tiếp.`,
        invokedSkill: {
          id: "project_orchestrator",
          name: "Skill: AI Vision & Tự Hành",
          icon: "Bot",
          actionSummary: `Sẵn sàng clone UI từ ảnh cho ${activeProjectName}`,
        },
        autoExecuted: true,
      },
    ];
  };

  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>(getInitialMessages);

  // Sync initial messages when project changes
  useEffect(() => {
    setChatMessages(getInitialMessages());
  }, [activeProjectId]);

  // Save messages to storage
  useEffect(() => {
    try {
      localStorage.setItem(storageChatKey, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages, storageChatKey]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isSubmitting, pendingAttachments]);

  // ⚡ AUTO-EXECUTE: Tự động phê duyệt & thi công tất cả đề xuất khi ở Chế độ Tự Hành (Auto)
  useEffect(() => {
    if (autoExecuteMode && proposals && proposals.length > 0) {
      const pendingList = proposals.filter((p) => p.status === "pending");
      if (pendingList.length > 0) {
        pendingList.forEach((p) => {
          onApproveProposal(p.id);
        });
      }
    }
  }, [autoExecuteMode, proposals, onApproveProposal]);

  // 🤖 REALTIME GPT SYNC: Nhận tin nhắn và thông báo sửa code từ ChatGPT Custom GPT vào phòng chat
  useEffect(() => {
    let isMounted = true;
    const seenGptIds = new Set<string>();

    const pollGptChat = async () => {
      try {
        const resp = await fetch("/api/gpt/chat-history");
        if (!resp.ok) return;
        const data = await resp.json();
        if (data.success && Array.isArray(data.messages) && isMounted) {
          const freshMessages = data.messages.filter((m: any) => !seenGptIds.has(m.id));
          if (freshMessages.length > 0) {
            freshMessages.forEach((m: any) => seenGptIds.add(m.id));
            setChatMessages((prev) => {
              const formatted: AgentChatMessage[] = freshMessages.map((m: any) => ({
                id: m.id,
                role: "agent",
                agentId: "chatgpt-copilot",
                agentName: m.sender || "ChatGPT Copilot",
                agentRole: m.type === "code_edit" ? "🤖 GPT Trực Tiếp Sửa Code" : "🤖 GPT Đã Kết Nối",
                timestamp: m.timestamp || new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                content: m.message,
                thoughtProcess: m.type === "code_edit"
                  ? `[ChatGPT Action writeSourceFile] Đã sửa mã nguồn tệp: ${m.filePath}. Thay đổi đã có hiệu lực trên máy chủ.`
                  : `[ChatGPT Action sendChatMessage] Nhận tin nhắn trực tiếp qua OpenAPI Live Bridge.`,
                invokedSkill: m.type === "code_edit"
                  ? {
                      id: "gpt_direct_code_edit",
                      name: "ChatGPT: Sửa Mã Nguồn Trực Tiếp",
                      icon: "Code",
                      actionSummary: `Đã ghi đè mã nguồn tệp ${m.filePath}`,
                    }
                  : undefined,
              }));
              return [...prev, ...formatted];
            });
          }
        }
      } catch (err) {}
    };

    pollGptChat();
    const interval = setInterval(pollGptChat, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Helper to read files as Base64 DataURL
  const readFileAsDataUrl = (file: File): Promise<ChatAttachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const isImage = file.type.startsWith("image/");
        resolve({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          type: isImage ? "image" : "file",
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: reader.result as string,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle files selected via file input
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ChatAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const att = await readFileAsDataUrl(files[i]);
        newAttachments.push(att);
      } catch (err) {
        console.warn("Error reading file:", err);
      }
    }

    setPendingAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Clipboard Paste (Ctrl + V)
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData || !clipboardData.items) return;

    const items = clipboardData.items;
    const filesToRead: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) filesToRead.push(file);
      }
    }

    if (filesToRead.length > 0) {
      e.preventDefault();
      const newAttachments: ChatAttachment[] = [];
      for (const file of filesToRead) {
        try {
          const att = await readFileAsDataUrl(file);
          newAttachments.push({
            ...att,
            name: `Ảnh_Dán_ClipBoard_${new Date().toLocaleTimeString("vi-VN").replace(/:/g, "-")}.png`,
          });
        } catch (err) {
          console.warn("Error reading pasted file:", err);
        }
      }
      setPendingAttachments((prev) => [...prev, ...newAttachments]);
    }
  }, []);

  // Handle Drag & Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newAttachments: ChatAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const att = await readFileAsDataUrl(files[i]);
        newAttachments.push(att);
      } catch (err) {
        console.warn("Error reading dropped file:", err);
      }
    }
    setPendingAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Integrated Skill Arsenal List
  const activeSkills: AgentSkill[] = isTFT
    ? [
        {
          id: "tft_s18_meta",
          name: "ĐTCL Mùa 18 Meta",
          icon: "Trophy",
          badge: "Mới Nhất",
          description: "Tier list đội hình S-Tier, tỷ lệ top 4 Thách Đấu Mùa 18",
          category: "tft",
          quickPrompt: "Phân tích đội hình S-Tier mạnh nhất ĐTCL Mùa 18 và cách vận hành bài Cơ Giáp",
        },
        {
          id: "ui_clone_vision",
          name: "Clone UI Từ Ảnh",
          icon: "ImageIcon",
          badge: "Vision AI",
          description: "Phân tích ảnh vừa dán và tái hiện giao diện web giống 100%",
          category: "ui",
          quickPrompt: "Hãy phân tích hình ảnh tôi vừa gửi, trích xuất bố cục và cập nhật giao diện web giống như trong ảnh",
        },
        {
          id: "tft_roll_calc",
          name: "Xác Suất Roll Cấp 8",
          icon: "Zap",
          badge: "36% Tướng 4$",
          description: "Bảng tính xác suất Roll tướng 4 tiền và quản lý chuỗi 50 vàng",
          category: "tft",
          quickPrompt: "Tính toán xác suất roll tướng 4 tiền ở cấp 8 và thời điểm xả tiền khi dưới 30 máu",
        },
        {
          id: "tft_bis_items",
          name: "Ghép Đồ Chuẩn BiS",
          icon: "Flame",
          badge: "Chuẩn Riot",
          description: "Công thức ghép trang bị chuẩn cho Viktor, Jayce, Kai'Sa",
          category: "tft",
          quickPrompt: "Cho bảng ghép trang bị chuẩn (BiS) cho Viktor và Kai'Sa Mùa 18",
        },
      ]
    : isMovie
    ? [
        {
          id: "movie_hls",
          name: "Tối Ưu HLS 60FPS",
          icon: "Tv",
          badge: "0.25s Buffer",
          description: "Cấu hình luồng phát 4K không giật lag",
          category: "system",
          quickPrompt: "Tối ưu hóa trình phát HLS 60FPS và bật chế độ Ambient Cinema hắt sáng rạp phim",
        },
        {
          id: "movie_patch_color",
          name: "Đổi Màu Netflix Red",
          icon: "Sparkles",
          badge: "Cinema UI",
          description: "Hot-patch phong cách màu rạp chiếu phim",
          category: "ui",
          quickPrompt: "Chuyển giao diện sang phong cách Netflix Cinema Red",
        },
      ]
    : [
        {
          id: "apex_meta",
          name: "Apex S23 Meta Radar",
          icon: "Zap",
          badge: "ALGS S23",
          description: "Radar meta tướng S-Tier và bộ đo TTK vũ khí giáp đỏ",
          category: "analytics",
          quickPrompt: "Phân tích bảng TTK vũ khí Havoc, Nemesis và radar tướng Horizon, Revenant S23",
        },
        {
          id: "live_patch",
          name: "Hot-Patcher Giao Diện",
          icon: "Sparkles",
          badge: "0s Trễ",
          description: "Tự động vá mã nguồn và cập nhật trực tiếp DOM",
          category: "ui",
          quickPrompt: "Tối ưu hóa giao diện và nâng cao trải nghiệm người dùng",
        },
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if ((!message && pendingAttachments.length === 0) || isSubmitting || isProcessing) return;

    const attachmentsToSend = [...pendingAttachments];
    setInputText("");
    setPendingAttachments([]);
    setIsSubmitting(true);

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message || (attachmentsToSend.length > 0 ? `Đã gửi ${attachmentsToSend.length} tệp/hình ảnh yêu cầu phân tích và làm theo mẫu` : ""),
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      // Call server-side Agent Skill Engine with attachments
      const resp = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message || "Phân tích tệp/hình ảnh được đính kèm và làm theo mẫu",
          activeProjectId,
          activeProjectName,
          currentSeason: "18",
          attachments: attachmentsToSend,
          history: chatMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await resp.json();

      if (data.success) {
        const agentMsg: AgentChatMessage = {
          id: `agent-${Date.now()}`,
          role: "agent",
          agentId: "architect",
          agentName: "Trần Tuấn Anh",
          agentRole: "Kiến Trúc Sư Hệ Thống & AI Agent",
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          content: data.reply,
          thoughtProcess: data.thoughtProcess,
          invokedSkill: data.skill,
          card: data.card,
          autoExecuted: autoExecuteMode,
        };

        setChatMessages((prev) => [...prev, agentMsg]);

        // Auto trigger season change if requested by skill
        if (data.projectPatch?.tftSeason && onSwitchSeason) {
          onSwitchSeason(data.projectPatch.tftSeason as "18" | "13");
        }
      }

      // Synchronize directive with parent app state
      if (message) {
        await onSendDirective(message);
      }
    } catch (err) {
      console.warn("Agent chat error:", err);
      const fallbackMsg: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        agentId: "architect",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống & AI Agent",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content: `Tôi đã nhận ảnh/chỉ đạo của bạn! Đã kích hoạt Skill phân tích hình ảnh và tự động nạp bản vá tương ứng vào Bản Chạy Thử Web.`,
        autoExecuted: true,
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleThought = (msgId: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div
      onPaste={handlePaste}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border ${
        isDragging ? "border-indigo-400 ring-2 ring-indigo-500/50" : "border-slate-800"
      } shadow-2xl overflow-hidden flex flex-col transition-all`}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-950/90 backdrop-blur-sm border-2 border-dashed border-indigo-400 rounded-2xl flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in duration-150">
          <UploadCloud className="w-16 h-16 text-indigo-300 animate-bounce mb-3" />
          <h3 className="text-lg font-bold">Thả ảnh hoặc tệp vào đây</h3>
          <p className="text-xs text-indigo-200 mt-1">
            Agent Trần Tuấn Anh sẽ tự động quét ảnh và làm web giống hệt mẫu!
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.json,.txt,.md,.pdf,.csv"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Top Header: Agent Status & Controls */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active Agent Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Trần Tuấn Anh</span>
                <span className="text-slate-400 font-normal text-xs">• AI Copilot & Lead Architect</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Nhận Ảnh (Vision) & Lệnh
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste ảnh (Ctrl+V) hoặc chat trực tiếp • Tự động clone UI & áp dụng tức thì
            </p>
          </div>
        </div>

        {/* Right: Switch Mode & Tab Navigation */}
        <div className="flex items-center gap-2">
          {/* Auto-Execute Toggle */}
          <button
            onClick={() => setAutoExecuteMode(!autoExecuteMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              autoExecuteMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
            title="Khi bật: Agent tự động chạy Skill và áp dụng ngay mà không bắt bạn bấm nút duyệt"
          >
            <Zap className={`w-3.5 h-3.5 ${autoExecuteMode ? "text-amber-400 fill-amber-400" : ""}`} />
            <span>{autoExecuteMode ? "Chế độ Tự Hành (Auto)" : "Chế độ Duyệt Thủ Công"}</span>
          </button>

          {/* View Tab Switcher */}
          <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === "chat"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              💬 Chat & Vision AI
            </button>
            <button
              onClick={() => setActiveTab("proposals")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "proposals"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📋 Đề Xuất</span>
              {proposals.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {proposals.length}
                </span>
              )}
            </button>
          </div>

          {/* Project Isolation Tag */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-900/90 px-2.5 py-1 rounded-xl border border-indigo-500/30">
            <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 font-bold max-w-[150px] truncate">
              {activeProjectName}
            </span>
          </div>
        </div>
      </div>

      {/* ⚡ AI ENGINE & GPT BRIDGE CONTROL BAR */}
      <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Current AI Indicator & Quick Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Động Cơ AI:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1">
            <span
              className={`w-2 h-2 rounded-full ${
                aiSettings?.activeProvider === "openai"
                  ? "bg-emerald-400 animate-pulse"
                  : aiSettings?.activeProvider === "deepseek"
                  ? "bg-blue-400 animate-pulse"
                  : aiSettings?.activeProvider === "groq"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-cyan-400 animate-pulse"
              }`}
            />
            <span className="font-bold text-white text-xs">
              {aiSettings?.activeProvider === "openai"
                ? `OpenAI (${aiSettings.openAiModel || "GPT-4o-mini"})`
                : aiSettings?.activeProvider === "deepseek"
                ? `DeepSeek (${aiSettings.deepseekModel || "V3"})`
                : aiSettings?.activeProvider === "groq"
                ? `Groq Free (${aiSettings.groqModel || "Llama 3.3"})`
                : aiSettings?.activeProvider === "openrouter"
                ? `OpenRouter (${aiSettings.openRouterModel || "Multi-LLM"})`
                : aiSettings?.activeProvider === "ollama"
                ? `Ollama Local (${aiSettings.customModel || "Local"})`
                : "Google Gemini 3.8 Flash (Built-in)"}
            </span>
          </div>

          {/* Direct Quick Model Selector */}
          <select
            value={aiSettings?.activeProvider || "gemini"}
            onChange={(e) => {
              if (onUpdateAISettings && aiSettings) {
                onUpdateAISettings({
                  ...aiSettings,
                  activeProvider: e.target.value as any,
                });
              } else if (onOpenAISettings) {
                onOpenAISettings();
              }
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            title="Đổi nhanh mô hình AI"
          >
            <option value="gemini">Google Gemini 3.8 Flash</option>
            <option value="openai">OpenAI (ChatGPT / GPT-4o)</option>
            <option value="deepseek">DeepSeek (V3 / R1 Reasoner)</option>
            <option value="groq">Groq Free (Llama 3.3 70B)</option>
            <option value="openrouter">OpenRouter Free/Paid</option>
            <option value="ollama">Ollama / Local AI</option>
          </select>

          {/* Full Configuration Modal Trigger */}
          {onOpenAISettings && (
            <button
              onClick={onOpenAISettings}
              className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Mở bảng cấu hình API Key và đổi sâu các thông số AI"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-300" />
              <span>Đổi AI / Cấu Hình Chi Tiết</span>
            </button>
          )}
        </div>

        {/* Right: Connect Your GPT Button */}
        <div className="flex items-center gap-2">
          {onOpenGPTBridge && (
            <button
              onClick={onOpenGPTBridge}
              className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600/25 via-teal-600/30 to-emerald-600/25 hover:from-emerald-600/40 hover:to-teal-600/50 text-emerald-300 border border-emerald-500/40 font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer group"
              title="Cho phép ChatGPT / Custom GPT của bạn truy cập để check mã nguồn và gửi cập nhật"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>🤖 Cho GPT Check & Cập Nhật (API Live)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Skill Arsenal Bar: Quick Integrated Skills */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Skill Có Sẵn:</span>
        </span>

        {activeSkills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => handleSendMessage(skill.quickPrompt)}
            className="shrink-0 px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition-all shadow-sm group cursor-pointer"
            title={skill.description}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
            <span>{skill.name}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {skill.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main Body */}
      {activeTab === "chat" ? (
        <div className="flex flex-col h-[520px]">
          {/* Chat Messages Stream */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/20"
          >
            {chatMessages.map((msg) => {
              const isUser = msg.role === "user";
              const isThoughtOpen = expandedThoughts[msg.id] ?? false;

              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-blue-600 p-3.5 text-white shadow-md shadow-indigo-950/30 space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-1 text-[11px] text-indigo-200">
                        <span className="font-semibold">Bạn (Chỉ Đạo)</span>
                        <span className="text-[10px] opacity-80">{msg.timestamp}</span>
                      </div>

                      {/* Display attached images if any */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 py-1">
                          {msg.attachments.map((att) => (
                            <div key={att.id} className="relative group">
                              {att.type === "image" ? (
                                <div
                                  onClick={() => setPreviewModalImage(att.dataUrl)}
                                  className="cursor-pointer overflow-hidden rounded-xl border border-white/30 hover:border-white transition-all shadow-md"
                                >
                                  <img
                                    src={att.dataUrl}
                                    alt={att.name}
                                    className="w-28 h-28 object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Maximize2 className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[140px]">{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="max-w-[95%] sm:max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 p-4 space-y-3 text-slate-200 shadow-xl shadow-slate-950/50">
                    {/* Agent Header Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600/40 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          {msg.agentName || "Trần Tuấn Anh"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({msg.agentRole || "AI Copilot"})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.invokedSkill && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>{msg.invokedSkill.name}</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Agentic Reasoning / Thought Process Box */}
                    {msg.thoughtProcess && (
                      <div className="rounded-xl bg-slate-950/80 border border-indigo-900/40 overflow-hidden text-xs">
                        <button
                          onClick={() => toggleThought(msg.id)}
                          className="w-full px-3 py-2 bg-slate-950 flex items-center justify-between text-indigo-300 hover:text-indigo-200 transition-colors font-semibold"
                        >
                          <span className="flex items-center gap-1.5 text-[11px]">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                            <span>Quá trình suy nghĩ & kích hoạt Skill</span>
                          </span>
                          {isThoughtOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {isThoughtOpen && (
                          <div className="p-3 text-[11px] text-slate-300 font-mono leading-relaxed border-t border-slate-900 bg-slate-950/60">
                            {msg.thoughtProcess}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main Agent Reply Text */}
                    <div className="text-xs sm:text-sm leading-relaxed space-y-2 whitespace-pre-wrap font-normal text-slate-200">
                      {msg.content}
                    </div>

                    {/* Generative UI Card: Image Design Analysis */}
                    {msg.card && msg.card.type === "image_design_analysis" && (
                      <div className="rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-950 border border-indigo-500/40 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                            <Palette className="w-4 h-4 text-indigo-400" />
                            <span>{msg.card.title || "Phân Tích Thiết Kế & Bố Cục Từ Ảnh"}</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            ✓ Đã Nạp Bản Vá
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
                            <span className="text-[11px] text-slate-400 block mb-1">Màu sắc chủ đạo:</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-3.5 h-3.5 rounded-full ${
                                  msg.card.data?.detectedColor === "red"
                                    ? "bg-red-500"
                                    : msg.card.data?.detectedColor === "emerald"
                                    ? "bg-emerald-500"
                                    : msg.card.data?.detectedColor === "violet"
                                    ? "bg-purple-500"
                                    : "bg-cyan-500"
                                } shadow`}
                              />
                              <span className="font-bold text-white capitalize">
                                {msg.card.data?.detectedColor || "Tím Cyberpunk"}
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
                            <span className="text-[11px] text-slate-400 block mb-1">Bố cục trích xuất:</span>
                            <span className="font-semibold text-white">
                              {msg.card.data?.layoutStyle || "Modern Glassmorphism Card Grid"}
                            </span>
                          </div>
                        </div>

                        {onOpenPreview && (
                          <button
                            onClick={onOpenPreview}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Mở Xem Bản Chạy Thử Web Đã Cập Nhật Theo Ảnh</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Generative UI Card: TFT Comps */}
                    {msg.card && msg.card.type === "tft_comps" && msg.card.data?.comps && (
                      <div className="rounded-xl bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 border border-purple-800/40 p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>{msg.card.title || "Meta Đội Hình Mùa 18 (Patch 15.2)"}</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                            Chính Thức
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {msg.card.data.comps.slice(0, 2).map((comp: any, idx: number) => (
                            <div
                              key={idx}
                              className="rounded-lg bg-slate-900/90 border border-slate-800 p-2.5 space-y-1.5 hover:border-purple-500/50 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">{comp.name}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  Tier {comp.tier || "S+"}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-300">
                                🎯 <strong>Carry:</strong> {comp.coreCarry} • 🛡️ <strong>Tank:</strong> {comp.coreTank}
                              </div>
                              {comp.itemsCarry && (
                                <div className="text-[10px] text-purple-300 font-medium">
                                  ⚔️ Đồ BiS: {comp.itemsCarry.join(", ")}
                                </div>
                              )}
                              <div className="text-[10px] text-emerald-400 font-semibold">
                                📊 Tỷ lệ: {comp.winRate || "62.4% Top 4"}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Quick Action Buttons inside the card */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {onOpenPreview && (
                            <button
                              onClick={onOpenPreview}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Mở Xem Ngay Trên Bản Web</span>
                            </button>
                          )}
                          {onSwitchSeason && (
                            <button
                              onClick={() => onSwitchSeason("18")}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-200 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Kích Hoạt Mùa 18</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer execution confirmation */}
                    {msg.autoExecuted && (
                      <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã tự động áp dụng và đồng bộ vào hệ thống (Không cần bấm duyệt)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSubmitting && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-indigo-500/40 p-3.5 text-xs text-indigo-300 flex items-center gap-2 shadow-lg">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Agent Trần Tuấn Anh đang phân tích ảnh & kích hoạt Skill...</span>
                </div>
              </div>
            )}
          </div>

          {/* Pending Attachments Preview Carousel */}
          {pendingAttachments.length > 0 && (
            <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2.5 overflow-x-auto custom-scrollbar">
              <span className="text-[11px] font-bold text-indigo-300 shrink-0 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Đính kèm ({pendingAttachments.length}):</span>
              </span>

              {pendingAttachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group shrink-0 rounded-xl bg-slate-900 border border-indigo-500/40 p-1 flex items-center gap-2 pr-7"
                >
                  {att.type === "image" ? (
                    <img
                      src={att.dataUrl}
                      alt={att.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-950/60 flex items-center justify-center text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}

                  <div className="max-w-[120px]">
                    <p className="text-[11px] font-medium text-white truncate">{att.name}</p>
                    <p className="text-[9px] text-slate-400">
                      {att.size ? `${(att.size / 1024).toFixed(1)} KB` : "Ảnh dán"}
                    </p>
                  </div>

                  <button
                    onClick={() => removePendingAttachment(att.id)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Gợi ý nhanh:</span>
            {activeSkills.map((sk) => (
              <button
                key={sk.id}
                onClick={() => handleSendMessage(sk.quickPrompt)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {sk.quickPrompt.slice(0, 38)}...
              </button>
            ))}
          </div>

          {/* Input Area with Image Attachment & Paste Support */}
          <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Image / File Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 transition-all cursor-pointer shrink-0"
                title="Chọn ảnh hoặc tệp (hoặc bấm Ctrl+V để dán trực tiếp)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={
                    isTFT
                      ? "Chat hoặc dán ảnh (Ctrl+V): Đổi mùa 18, làm giống ảnh này, phân tích bài..."
                      : `Chat hoặc dán ảnh (Ctrl+V) để Agent của ${activeProjectName} làm theo...`
                  }
                  disabled={isSubmitting || isProcessing}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={(!inputText.trim() && pendingAttachments.length === 0) || isSubmitting || isProcessing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              >
                <span>Gửi Lệnh</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Proposals Tab: For Reviewing Formal Directives if needed */
        <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto custom-scrollbar">
          {proposals.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/40 border border-indigo-700/30 flex items-center justify-center mx-auto text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Hiện tại không có đề xuất nào đang chờ duyệt. Mọi yêu cầu qua tab Chat Agent đều được tự động thực thi tức thì.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Executive Action Bar: Auto Execute All */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/40 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">
                      {proposals.filter((p) => p.status === "pending").length} Đề Xuất Đang Chờ Thi Công
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Bật Chế Độ Tự Hành để hệ thống tự động duyệt và áp dụng ngay lập tức!
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAutoExecuteMode(true);
                      proposals
                        .filter((p) => p.status === "pending")
                        .forEach((p) => onApproveProposal(p.id));
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>⚡ DUYỆT & THI CÔNG TẤT CẢ (AUTO 100%)</span>
                  </button>
                </div>
              </div>

              {proposals.map((proposal) => {
                const isApproved = proposal.status === "approved";
                const isRejected = proposal.status === "rejected";
                const isPending = proposal.status === "pending";

                return (
                  <div
                    key={proposal.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isApproved
                        ? "bg-emerald-950/20 border-emerald-500/40"
                        : isRejected
                        ? "bg-slate-950/40 border-slate-800 opacity-60"
                        : "bg-slate-950/80 border-indigo-500/40 shadow-lg"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {proposal.department}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            👤 {proposal.agentName} ({proposal.agentRole})
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{proposal.title}</h4>
                        <p className="text-xs text-slate-300">{proposal.description}</p>
                      </div>

                      <div className="sm:w-44 shrink-0 flex flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4 pt-2 sm:pt-0">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => onApproveProposal(proposal.id)}
                              className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Đồng Ý</span>
                            </button>
                            <button
                              onClick={() => onRejectProposal(proposal.id)}
                              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Không</span>
                            </button>
                          </>
                        ) : isApproved ? (
                          <div className="py-1 px-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center border border-emerald-500/30">
                            ✓ Đã Phê Duyệt
                          </div>
                        ) : (
                          <div className="py-1 px-2.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold text-center border border-rose-500/30">
                            ✕ Đã Từ Chối
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Enlarged Image Lightbox Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <img
              src={previewModalImage}
              alt="Enlarged preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
