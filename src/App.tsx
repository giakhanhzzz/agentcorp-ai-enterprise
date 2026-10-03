import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Rocket,
  MessageSquare,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ServerCrash,
  Headphones,
  Sliders,
  Award,
  Tv,
  Send,
  FolderKanban,
  Edit3,
  Plus,
  Trash2,
  Check,
  Copy,
  Zap,
  Flame,
  Crosshair,
  ExternalLink,
} from "lucide-react";
import {
  Agent,
  CompanyTask,
  DebateMessage,
  FinalSynthesis,
  AISettings,
  MissionPreset,
  EnterpriseProject,
  AgentProposal,
} from "./types";
import { DEFAULT_AGENTS, PRESET_MISSIONS } from "./data/defaultCompany";
import { Navbar } from "./components/Navbar";
import { MainTopNav, MainViewMode } from "./components/MainTopNav";
import { AgentRequestChatBox } from "./components/AgentRequestChatBox";
import { Boardroom } from "./components/Boardroom";
import { TaskBoard } from "./components/TaskBoard";
import { DeliverableModal } from "./components/DeliverableModal";
import { OrgChartModal } from "./components/OrgChartModal";
import { AIEngineModal } from "./components/AIEngineModal";
import { GPTBridgeModal } from "./components/GPTBridgeModal";
import { ChairmanBar } from "./components/ChairmanBar";
import { ExecutiveReportModal } from "./components/ExecutiveReportModal";
import { ProjectLivePreview } from "./components/ProjectLivePreview";
import { TelegramBotModal, TelegramConfig } from "./components/TelegramBotModal";
import { ExportProjectModal } from "./components/ExportProjectModal";
import { ProjectManagerModal } from "./components/ProjectManagerModal";
import { ShareProjectModal } from "./components/ShareProjectModal";
import { SplitScreenLinksModal } from "./components/SplitScreenLinksModal";
import { PasscodeGate } from "./components/PasscodeGate";
import { BlueprintVaultModal } from "./components/BlueprintVaultModal";
import { DEFAULT_BLUEPRINTS } from "./data/defaultBlueprints";
import { isAccessUnlocked, isOwnerAuthenticated } from "./utils/shareSecurity";
import { ArchitectureBlueprint } from "./types";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { agentVoice } from "./utils/speech";
import { generateRandomProjectName } from "./utils/nameGenerator";

const STORAGE_KEY = "agentcorp_session_v2";
const PROJECTS_STORAGE_KEY = "agentcorp_enterprise_projects_v3";
const ACTIVE_PROJECT_ID_KEY = "agentcorp_active_project_id_v3";

function loadSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Lỗi đọc session lưu trữ:", e);
    return null;
  }
}

const defaultApexTasks: CompanyTask[] = [
    {
      id: "task-apex-1",
      title: "Thiết kế kiến trúc EA Telemetry Gateway & Circuit Breaker 120Hz",
      department: "Kỹ Thuật & AI Dev",
      assignedAgentId: "architect",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Xây dựng backend proxy giấu EA API Key, bộ đệm Redis và ngắt mạch circuit breaker khi máy chủ EA quá tải.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "Kiến trúc EA Telemetry Gateway & Bộ đệm Edge Cache",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống",
        executiveNotes: "Đã hoàn thành module Gateway chịu tải 10,000 req/s, tích hợp Token Bucket chống scraping.",
        content: "Hệ thống gateway phân tán xử lý 10,000 req/s, ngắt mạch circuit breaker khi EA API bảo trì, hỗ trợ cross-play PC/PS5/Xbox.",
        completedAt: "10:30",
        artifacts: [
          {
            name: "eaTelemetryGateway.ts",
            type: "code",
            content: "// EA Telemetry Gateway Proxy with Circuit Breaker\nexport class EATelemetryGateway {\n  private circuitOpen = false;\n  async fetchPlayerStats(tag: string, platform: string) {\n    if (this.circuitOpen) return this.getCachedFallback(tag);\n    return fetch(`https://api.apexlegendsstatus.com/v2/bridge?player=${tag}&platform=${platform}`);\n  }\n}"
          }
        ]
      }
    },
    {
      id: "task-apex-2",
      title: "Thuật toán tính điểm RP & Radar theo dõi rank Predator thời gian thực",
      department: "Kỹ Thuật & AI Dev",
      assignedAgentId: "architect",
      priority: "high",
      estimatedTime: "1 giờ",
      description: "Tính toán ngưỡng RP tối thiểu vào top 750 Predator (Cutoff 52,450 RP), dự báo nguy cơ tụt rank.",
      status: "completed",
      dependencies: ["task-apex-1"],
      deliverable: {
        deliverableTitle: "Thuật toán Predator Cutoff Tracker & Live RP Feed",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống",
        executiveNotes: "Bảng xếp hạng Top 750 tuyển thủ toàn cầu cập nhật mỗi 15 giây.",
        content: "Công thức dự báo ngưỡng Predator Cutoff (52,450 RP), bảng xếp hạng Top 750 tuyển thủ toàn cầu, cảnh báo tụt rank realtime.",
        completedAt: "10:45",
        artifacts: [
          {
            name: "predatorRankEngine.ts",
            type: "code",
            content: "export function calculatePredatorSafetyMargin(currentRp: number, cutoffRp: number) {\n  const delta = currentRp - cutoffRp;\n  return { safe: delta > 1500, margin: delta, dangerLevel: delta < 500 ? 'CRITICAL' : 'STABLE' };\n}"
          }
        ]
      }
    },
    {
      id: "task-apex-3",
      title: "Radar Meta Tướng Season 23 & Thang điểm ALGS Synergy",
      department: "Sản Phẩm & UX",
      assignedAgentId: "cpo",
      priority: "high",
      estimatedTime: "45 phút",
      description: "Biểu đồ phân loại Tier S/A/B/C các Legend Season 23, tính điểm phối hợp đội hình 3 người.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "Radar Meta Tướng Season 23 & ALGS Composition",
        agentName: "Lê Hoàng Nam",
        agentRole: "Giám Đốc Sản Phẩm CPO",
        executiveNotes: "Horizon, Revenant, Conduit và Bangalore dẫn đầu meta giải đấu ALGS.",
        content: "Bộ chỉ số Pick Rate, Win Rate, K/D tỷ lệ tướng S-Tier và công thức tính điểm phối hợp đội hình 3 người.",
        completedAt: "11:00",
        artifacts: []
      }
    },
    {
      id: "task-apex-4",
      title: "Bộ mô phỏng sát thương TTK (Time-To-Kill) & DPS vũ khí",
      department: "Sản Phẩm & UX",
      assignedAgentId: "cpo",
      priority: "medium",
      estimatedTime: "45 phút",
      description: "Bộ trắc nghiệm sát thương vũ khí theo các loại giáp (White/Blue/Purple/Red/Mythic) và khoảng cách giao tranh.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "Bảng Mô Phỏng TTK Vũ Khí & Tỉ Lệ Headshot",
        agentName: "Lê Hoàng Nam",
        agentRole: "Giám Đốc Sản Phẩm CPO",
        executiveNotes: "Havoc Turbocharger đạt TTK 0.82s vô đối ở cự ly gần; Nemesis áp đảo tầm trung.",
        content: "Bảng tính thời gian hạ gục chính xác theo từng loại giáp, so sánh recoil và DPS giữa Havoc, Nemesis, Flatline, R-99.",
        completedAt: "11:15",
        artifacts: []
      }
    },
    {
      id: "task-apex-5",
      title: "Kiểm thử bảo mật, chống scraping dữ liệu & Pentest API Gateway",
      department: "Cyber Security & QA",
      assignedAgentId: "security_hacker",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Pentest bảo mật 4 chuẩn: Che giấu API token, kiểm thử 10,000 requests đồng thời, rà soát lỗ hổng IDOR.",
      status: "completed",
      dependencies: ["task-apex-1"],
      deliverable: {
        deliverableTitle: "Báo Cáo Pentest & Kiểm Thử Tải 10,000 Req/s",
        agentName: "Lâm Quốc Bảo",
        agentRole: "Trưởng Ban Tác Chiến An Ninh",
        executiveNotes: "Đã vượt qua 100% kịch bản ISTQB, không lộ EA API Key, rate limit hoạt động chuẩn xác.",
        content: "Bảo vệ khóa bí mật EA API Key trên server proxy, thiết lập Token Bucket Rate Limiter 10 req/s/IP, rà soát lỗ hổng IDOR.",
        completedAt: "11:30",
        artifacts: []
      }
    },
    {
      id: "task-apex-6",
      title: "Chiến lược tăng trưởng cộng đồng Esports & Tối ưu chi phí Cloud $0",
      department: "Marketing & Tài Chính",
      assignedAgentId: "cmo",
      priority: "medium",
      estimatedTime: "30 phút",
      description: "Phát hành Discord Bot kết nối 50+ clan ALGS, triển khai Cloudflare Workers Edge Cache chi phí $0.",
      status: "completed",
      dependencies: ["task-apex-3"],
      deliverable: {
        deliverableTitle: "Chiến Lược GTM Esports & Hạ Tầng Serverless $0",
        agentName: "Phạm Mai Linh",
        agentRole: "Giám Đốc Tiếp Thị CMO",
        executiveNotes: "Đạt mục tiêu thu hút 50,000 game thủ trong tháng đầu tiên không tốn chi phí máy chủ.",
        content: "Kế hoạch phân phối qua Discord Bot cho 50+ clan ALGS, tích hợp thẻ chia sẻ thành tích lên X/TikTok, vận hành serverless chi phí $0.",
        completedAt: "11:45",
        artifacts: []
      }
    }
  ];

  const defaultMotfilmTasks: CompanyTask[] = [
    {
      id: "task-motfilm-1",
      title: "Kiến trúc luồng phát HLS 60FPS & CDN phân phối đa độ phân giải",
      department: "Kỹ Thuật & AI Dev",
      assignedAgentId: "architect",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Đặc tả hạ tầng lưu trữ S3/Wasabi, phân giải video m3u8 (360p, 720p, 1080p, 4K), proxy ẩn nguồn gốc video.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "Kiến trúc HLS Stream & CDN Caching Edge",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống",
        executiveNotes: "Bảo đảm thời gian đệm ban đầu dưới 0.3 giây, tự thích ứng băng thông ABR.",
        content: "Hạ tầng phân phối video HLS/m3u8 thích ứng băng thông, bộ nhớ đệm Cloudflare Edge Cache, nén video codec H.264/HEVC.",
        completedAt: "09:30",
        artifacts: [
          {
            name: "hlsStreamingEngine.ts",
            type: "code",
            content: "// HLS Multi-bitrate Streaming Engine with adaptive bitrate\nexport const HLS_CONFIG = { maxBufferLength: 30, liveSyncDuration: 3, enableWorker: true };"
          }
        ]
      }
    },
    {
      id: "task-motfilm-2",
      title: "Trình phát video chuẩn Cinema Player HLS.js & Giao diện Rạp",
      department: "Sản Phẩm & UX",
      assignedAgentId: "cpo",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Web Player tích hợp HLS.js, phím tắt rạp chiếu (f, space, mũi tên tua), chọn server dự phòng, lưu mốc thời gian xem và Ambient Light.",
      status: "completed",
      dependencies: ["task-motfilm-1"],
      deliverable: {
        deliverableTitle: "Trình Phát Cinema Player & Trải Nghiệm Khán Giả",
        agentName: "Lê Hoàng Nam",
        agentRole: "Giám Đốc Sản Phẩm CPO",
        executiveNotes: "Player hỗ trợ phím tắt, ghi nhớ tập đang xem, không gián đoạn bởi quảng cáo độc hại.",
        content: "Cinema Web Player chuẩn 60FPS tích hợp HLS.js, phím tắt rạp phim, Ambient Glow ánh sáng phòng chiếu, tự chuyển tập.",
        completedAt: "10:00",
        artifacts: []
      }
    },
    {
      id: "task-motfilm-3",
      title: "Tích hợp kho 30,000+ phim KKPhim Cloud & Tìm kiếm Realtime",
      department: "Kỹ Thuật & AI Dev",
      assignedAgentId: "architect",
      priority: "high",
      estimatedTime: "45 phút",
      description: "Đồng bộ API kho phim KKPhim Cloud, tự động cập nhật tập mới, lọc theo thể loại, quốc gia, năm phát hành và phim chiếu rạp.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "API Đồng Bộ Kho Phim & Elastic Search",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống",
        executiveNotes: "Kho phim tự động cập nhật mỗi 30 phút, tìm kiếm phản hồi trong 25ms.",
        content: "Hệ thống kết nối kho KKPhim 30,000+ phim chuẩn 1080p/4K, server VIP và server dự phòng CDN.",
        completedAt: "10:30",
        artifacts: []
      }
    },
    {
      id: "task-motfilm-4",
      title: "Tường lửa chặn trộm băng thông (Anti-Leech) & Chống đánh cắp m3u8",
      department: "Cyber Security & QA",
      assignedAgentId: "security_hacker",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Ký token Signed URL cho từng m3u8 playlist, kiểm tra Referer header, chặn nhúng iframe lậu từ web rác bên ngoài.",
      status: "completed",
      dependencies: ["task-motfilm-1"],
      deliverable: {
        deliverableTitle: "Hệ Thống Tường Lửa Chống Leech m3u8",
        agentName: "Lâm Quốc Bảo",
        agentRole: "Trưởng Ban Tác Chiến An Ninh",
        executiveNotes: "Ngăn chặn 100% các trang web rác nhúng trộm băng thông video.",
        content: "Cơ chế Signed URL hết hạn sau 2 giờ, mã hóa Referer Validation và CORS strict origin.",
        completedAt: "11:00",
        artifacts: []
      }
    },
    {
      id: "task-motfilm-5",
      title: "Tối ưu hóa SEO Movie Schema, Watchlist Cá Nhân & Đăng Ký VIP",
      department: "Tiếp Thị & Tăng Trưởng",
      assignedAgentId: "cmo",
      priority: "medium",
      estimatedTime: "45 phút",
      description: "Thẻ Movie Schema chuẩn Google Rich Snippets, tính năng Danh Sách Phim Yêu Thích và gói thành viên VIP trải nghiệm 4K.",
      status: "completed",
      dependencies: ["task-motfilm-2"],
      deliverable: {
        deliverableTitle: "Chiến Lược Giữ Chân Khán Giả & SEO Schema",
        agentName: "Phạm Mai Linh",
        agentRole: "Giám Đốc Tiếp Thị CMO",
        executiveNotes: "Tăng 85% tỷ lệ quay lại của khán giả nhờ tính năng lưu phim và tiếp tục xem dở.",
        content: "Cấu hình Schema.org Movie & TVSeries, tính năng Watchlist lưu vào LocalStorage/Cloud, thông báo tập mới.",
        completedAt: "11:30",
        artifacts: []
      }
    },
    {
      id: "task-motfilm-6",
      title: "Mô hình chi phí máy chủ $0 & Dự toán hòa vốn",
      department: "Tài Chính & Vận Hành",
      assignedAgentId: "cfo",
      priority: "medium",
      estimatedTime: "30 phút",
      description: "Tận dụng CDN miễn phí Cloudflare, lưu trữ Wasabi $6/TB và mô hình doanh thu đăng ký không dùng quảng cáo phiền toái.",
      status: "completed",
      dependencies: ["task-motfilm-3"],
      deliverable: {
        deliverableTitle: "Dự Toán Ngân Sách Hạ Tầng Băng Thông",
        agentName: "Đoàn Thu Hương",
        agentRole: "Giám Đốc Tài Chính CFO",
        executiveNotes: "Vận hành hệ thống phục vụ 50,000 lượt xem/ngày với chi phí dưới $50/tháng.",
        content: "Chi tiết bảng tính băng thông CDN, chi phí lưu trữ S3 và chiến lược hòa vốn trong 3 tháng đầu.",
        completedAt: "11:45",
        artifacts: []
      }
    }
  ];

  const defaultTFTTasks: CompanyTask[] = [
    {
      id: "task-tft-1",
      title: "Thu thập Meta Đội Hình TFT Mùa 18 & Tỷ lệ Top 4 / Thắng từ Riot API",
      department: "Kỹ Thuật & AI Dev",
      assignedAgentId: "architect",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Đồng bộ dữ liệu trận đấu bậc Cao Thủ / Thách Đấu Mùa 18, tính toán tỷ lệ Top 4 và phân loại tier S/A/B các đội hình Cơ Giáp Tương Lai, Hắc Tinh Đột Biến, Học Viện Siêu Âm.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "API Connector Riot Games & Bảng Dữ Liệu Meta 15+ Đội Hình S-Tier Mùa 18",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống",
        executiveNotes: "Dữ liệu được cập nhật từ 10,000 trận đấu rank Thách Đấu Mùa 18, hỗ trợ chuyển đổi song song Mùa 13.",
        content: "Phân tích các bài meta Mùa 18 dẫn đầu: Cơ Giáp Tương Lai (Viktor & Jayce 62.4% Top 4), Hắc Tinh Đột Biến (Kai'Sa & Cho'Gath 59.5%), Học Viện Siêu Âm (Ahri & Lux 54.8%).",
        completedAt: "09:30",
        artifacts: []
      }
    },
    {
      id: "task-tft-2",
      title: "Bảng tính xác suất Roll tướng & Mô phỏng chuỗi kinh tế 50 Vàng Mùa 18",
      department: "Sản Phẩm & UX",
      assignedAgentId: "cpo",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Máy tính hiển thị chính xác % ra tướng 1-5 vàng từ cấp 3 đến cấp 10 Mùa 18, công cụ tính số vàng kỳ vọng để dát vàng 2 sao và 3 sao.",
      status: "completed",
      dependencies: ["task-tft-1"],
      deliverable: {
        deliverableTitle: "Bộ Máy Tính Roll Tướng & Quản Lý Kinh Tế Chuỗi Thắng/Thua Mùa 18",
        agentName: "Lê Hoàng Nam",
        agentRole: "Giám Đốc Sản Phẩm CPO",
        executiveNotes: "Hỗ trợ game thủ căn thời điểm Roll Down ở level 8 (32% tướng 4 tiền) để tối ưu xác suất bắt Viktor & Kai'Sa.",
        content: "Công thức tính xác suất Hyperroll, Fast 8 và Slow Roll 50 vàng, hướng dẫn quản lý chuỗi thắng thua và tính lãi suất tối đa.",
        completedAt: "10:15",
        artifacts: []
      }
    },
    {
      id: "task-tft-3",
      title: "Bản đồ tra cứu ghép trang bị chuẩn (BiS) & Lõi Công Nghệ Mùa 18",
      department: "Sản Phẩm & UX",
      assignedAgentId: "cpo",
      priority: "high",
      estimatedTime: "45 phút",
      description: "Giao diện ma trận ghép đồ 8 trang bị thành phần, gợi ý trang bị trấn phái cho từng carry và phân cấp Lõi Bạc, Vàng, Kim Cương Mùa 18.",
      status: "completed",
      dependencies: [],
      deliverable: {
        deliverableTitle: "Cẩm Nang Trang Bị Trấn Phái BiS & Phân Cấp Lõi Nâng Cấp Mùa 18",
        agentName: "Lê Hoàng Nam",
        agentRole: "Giám Đốc Sản Phẩm CPO",
        executiveNotes: "Bảng tra cứu trực quan hỗ trợ lọc theo mảnh trang bị đang sở hữu trên bàn cờ.",
        content: "Ma trận 36 trang bị hoàn chỉnh, danh sách trang bị Ánh Sáng và Xếp hạng sức mạnh Lõi Công Nghệ Mùa 18 & Mùa 13.",
        completedAt: "10:45",
        artifacts: []
      }
    },
    {
      id: "task-tft-4",
      title: "Tối ưu hóa độ trễ thời gian thực & Caching Edge 15 Giây",
      department: "Kỹ Thuật & AI Dev",
      assignedAgentId: "architect",
      priority: "urgent",
      estimatedTime: "1 giờ",
      description: "Hạ tầng phân phối dữ liệu qua Edge Cache, giảm tải cho Riot API Rate Limit, tốc độ phản hồi trang đạt < 50ms.",
      status: "completed",
      dependencies: ["task-tft-1"],
      deliverable: {
        deliverableTitle: "Kiến Trúc Cache Cực Tốc & Rate Limit Riot API",
        agentName: "Trần Tuấn Anh",
        agentRole: "Kiến Trúc Sư Hệ Thống",
        executiveNotes: "Hệ thống đáp ứng 20,000 lượt tra cứu cùng lúc mà không chạm trần giới hạn API Riot.",
        content: "Triển khai Redis In-Memory Cache kết hợp Cloudflare Workers Edge, TTL 15s cho dữ liệu leaderboard.",
        completedAt: "11:15",
        artifacts: []
      }
    },
    {
      id: "task-tft-5",
      title: "Tường lửa bảo mật, Pentest & Bảo vệ khóa Riot API Key",
      department: "Cyber Security & QA",
      assignedAgentId: "security_hacker",
      priority: "urgent",
      estimatedTime: "45 phút",
      description: "Che giấu Riot Games Developer Key qua proxy nội bộ, chống scraping dữ liệu meta tự động và chặn tấn công DDOS.",
      status: "completed",
      dependencies: ["task-tft-1"],
      deliverable: {
        deliverableTitle: "Báo Cáo An Ninh Mạng & Proxy API Key Bí Mật",
        agentName: "Lâm Quốc Bảo",
        agentRole: "Trưởng Ban Tác Chiến An Ninh",
        executiveNotes: "Đảm bảo 0% khả năng rò rỉ API token, tích hợp Token Bucket hạn chế 15 request/giây/IP.",
        content: "Reverse proxy che giấu header upstream, kiểm tra toàn bộ lỗ hổng OWASP Top 10 và bảo mật CORS.",
        completedAt: "11:30",
        artifacts: []
      }
    },
    {
      id: "task-tft-6",
      title: "Chiến dịch tăng trưởng cộng đồng cờ thủ TFT Việt Nam & SEO Meta",
      department: "Tiếp Thị & Tăng Trưởng",
      assignedAgentId: "cmo",
      priority: "medium",
      estimatedTime: "30 phút",
      description: "Thẻ chia sẻ đội hình Top 1 lên Facebook/Discord, cấu hình SEO Schema VideoGame và giải đấu giao hữu ra mắt.",
      status: "completed",
      dependencies: ["task-tft-3"],
      deliverable: {
        deliverableTitle: "Chiến Lược GTM Cộng Đồng TFT & SEO Rich Snippets",
        agentName: "Phạm Mai Linh",
        agentRole: "Giám Đốc Tiếp Thị CMO",
        executiveNotes: "Thu hút 30,000 cờ thủ sử dụng cẩm nang trong tuần đầu tiên ra mắt.",
        content: "Tạo công cụ xuất ảnh đội hình 1-click chia sẻ mạng xã hội, tích hợp Schema.org GamingApp và kế hoạch truyền thông.",
        completedAt: "11:45",
        artifacts: []
      }
    }
  ];

  const defaultTFTProposals: AgentProposal[] = [
    {
      id: "prop-tft-1",
      projectId: "proj-tft",
      title: "Cập nhật dữ liệu Meta Đội Hình S-Tier Mùa 18 (Cơ Giáp Tương Lai, Hắc Tinh)",
      description: "Đồng bộ tỷ lệ thắng từ rank Thách Đấu Mùa 18, cập nhật 3 trang bị chuẩn (BiS) cho Viktor, Jayce & Kai'Sa.",
      department: "Kỹ Thuật & AI Dev",
      agentId: "architect",
      agentName: "Trần Tuấn Anh",
      agentRole: "Kiến Trúc Sư Hệ Thống",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã tổng hợp tỷ lệ Top 4 và trang bị chuẩn Mùa 18",
      keyPoints: [
        "Cập nhật tỷ lệ thắng 62.4% đội hình Cơ Giáp Tương Lai (Viktor Carry)",
        "Thêm gợi ý 3 món chuẩn: Bùa Xanh, Mũ Phù Thủy, Kiếm Súng Hextech cho Viktor",
        "Gợi ý lõi công nghệ bậc Kim Cương: Vương Miện Cơ Giáp Tương Lai"
      ]
    },
    {
      id: "prop-tft-2",
      projectId: "proj-tft",
      title: "Bổ sung máy tính xác suất Roll tướng Mùa 18 theo cấp 7/8/9 & Chuỗi kinh tế",
      description: "Hiển thị tỷ lệ xuất hiện tướng 4 tiền & 5 tiền theo từng level và tính số vàng kỳ vọng để dát vàng 2 sao Mùa 18.",
      department: "Sản Phẩm & UX",
      agentId: "cpo",
      agentName: "Lê Hoàng Nam",
      agentRole: "Giám Đốc Sản Phẩm CPO",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã tích hợp module xác suất Roll Mùa 18 và chuỗi 50 vàng",
      keyPoints: [
        "Mô phỏng xác suất Roll tướng 4 tiền ở Level 8 đạt 32%",
        "Tự động tính toán số vàng cần thiết để lên 2 sao / 3 sao",
        "Gợi ý thời điểm bung tiền roll down khi máu dưới 30"
      ]
    },
    {
      id: "prop-tft-3",
      projectId: "proj-tft",
      title: "Thêm bộ lọc thông minh theo Trang Bị Khởi Đầu & Tướng Ra Sớm",
      description: "Tự động gợi ý đội hình phù hợp dựa trên các mảnh trang bị Kiếm, Gậy, Cung đang có trên bàn cờ.",
      department: "Sản Phẩm & UX",
      agentId: "cpo",
      agentName: "Lê Hoàng Nam",
      agentRole: "Giám Đốc Sản Phẩm CPO",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã hoàn tất thuật toán gợi ý đội hình theo trang bị",
      keyPoints: [
        "Gợi ý bài đánh theo đồ khởi đầu (AD, AP, hoặc Thuần Tank)",
        "Cảnh báo khi bị tranh bài với đối thủ cùng lobby",
        "Lưu đội hình yêu thích vào bộ nhớ người dùng"
      ]
    }
  ];

  const defaultMotfilmProposals: AgentProposal[] = [
    {
      id: "prop-mot-1",
      projectId: "proj-motfilm",
      title: "Tối ưu hóa bộ đệm HLS 60FPS & Bổ sung chuyển đổi chất lượng 4K",
      description: "Nâng cấp player Cinema hỗ trợ tự động nhận diện băng thông đường truyền ABR, giảm độ trễ đệm ban đầu từ 1.2s xuống 0.25s.",
      department: "Kỹ Thuật & AI Dev",
      agentId: "architect",
      agentName: "Trần Tuấn Anh",
      agentRole: "Kiến Trúc Sư Hệ Thống",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã tối ưu cấu hình hls.js và cache CDN",
      keyPoints: [
        "Bật worker đa luồng giải mã video trên trình duyệt",
        "Thêm menu chọn độ phân giải 4K / 1080p / 720p / Tự động",
        "Tích hợp phím tắt tua nhanh 10s và chỉnh tốc độ phát 1.5x/2.0x"
      ]
    },
    {
      id: "prop-mot-2",
      projectId: "proj-motfilm",
      title: "Thiết lập tường lửa chống leech link m3u8 & Chặn nhúng trộm",
      description: "Bảo vệ tài nguyên máy chủ bằng token Signed URL có hạn sử dụng và kiểm soát Referer header nghiêm ngặt.",
      department: "Cyber Security & QA",
      agentId: "security_hacker",
      agentName: "Lâm Quốc Bảo",
      agentRole: "Trưởng Ban Tác Chiến An Ninh",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã kích hoạt Token Bucket và CORS strict",
      keyPoints: [
        "Chặn các trang web rác nhúng trộm luồng phát video",
        "Tự động xoay khóa bí mật API token mỗi 60 phút",
        "Rà soát 0 lỗi IDOR và bảo vệ bản quyền DMCA"
      ]
    },
    {
      id: "prop-mot-3",
      projectId: "proj-motfilm",
      title: "Bổ sung Danh sách xem sau (Watchlist) & Tiếp tục xem tập dở",
      description: "Tăng trải nghiệm giữ chân khán giả, lưu mốc thời gian đã xem chính xác đến từng giây vào bộ nhớ người dùng.",
      department: "Sản Phẩm & UX",
      agentId: "cpo",
      agentName: "Lê Hoàng Nam",
      agentRole: "Giám Đốc Sản Phẩm CPO",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã tích hợp Watch History vào Web Player",
      keyPoints: [
        "Lưu tự động thanh tiến trình xem phim dở",
        "Tạo tab Danh Sách Phim Yêu Thích 1-click",
        "Gợi ý tập phim tiếp theo khi gần kết thúc"
      ]
    }
  ];

  const defaultApexProposals: AgentProposal[] = [
    {
      id: "prop-apex-1",
      projectId: "proj-apex",
      title: "Cập nhật Radar Meta Tướng Season 23 ALGS & Pick Rate",
      description: "Đồng bộ tỷ lệ chọn và tỷ lệ thắng các tướng Banglore, Conduit, Pathfinder từ các trận đấu Apex Predator.",
      department: "Sản Phẩm & UX",
      agentId: "cpo",
      agentName: "Lê Hoàng Nam",
      agentRole: "Giám Đốc Sản Phẩm CPO",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã cập nhật dữ liệu Season 23",
      keyPoints: [
        "Bổ sung chỉ số Synergy phối hợp giữa Pathfinder và Conduit",
        "Biểu đồ Radar trực quan đánh giá Cơ động, Hỗ trợ, Sát thương",
        "Gợi ý meta leo rank đơn (Solo Queue) hiệu quả nhất"
      ]
    },
    {
      id: "prop-apex-2",
      projectId: "proj-apex",
      title: "Bảng tính thời gian hạ gục TTK vũ khí Havoc, Nemesis, Flatline",
      description: "Mô phỏng thời gian hạ gục chính xác theo từng loại giáp trắng (150HP) đến giáp đỏ (225HP).",
      department: "Kỹ Thuật & AI Dev",
      agentId: "architect",
      agentName: "Trần Tuấn Anh",
      agentRole: "Kiến Trúc Sư Hệ Thống",
      status: "pending",
      timestamp: "Hôm nay",
      actionSummary: "Đã tính toán chi tiết TTK vũ khí",
      keyPoints: [
        "Havoc Turbocharger đạt TTK 0.82s vô đối tầm gần",
        "So sánh DPS và độ giật recoil Nemesis tầm trung",
        "Bổ sung công cụ chọn phụ kiện nòng súng và báng súng"
      ]
    }
  ];

  const defaultTFTProject: EnterpriseProject = {
    id: "proj-tft",
    name: "TFT Meta Pro (ĐTCL Mùa 18 & Mùa 13)",
    category: "Gaming & TFT Meta Analytics",
    description:
      "Cẩm nang và hệ thống phân tích Meta Đấu Trường Chân Lý (TFT) Mùa 18 (Mới Nhất) & Mùa 13: Tier list đội hình S-Tier, tỷ lệ top 4, máy tính xác suất Roll tướng và bản đồ trang bị BiS chuẩn Thách Đấu.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    tasks: defaultTFTTasks,
    debateMessages: [],
    proposals: defaultTFTProposals,
    synthesis: null,
    activeMission: "Xây dựng hệ thống phân tích Meta Đấu Trường Chân Lý (TFT) Mùa 18 Pro: Tier list S-Tier, máy tính xác suất Roll tướng và trang bị BiS",
    missionPrompt: "Xây dựng hệ thống phân tích Meta Đấu Trường Chân Lý (TFT) Mùa 18 Pro: Tier list S-Tier, máy tính xác suất Roll tướng và trang bị BiS",
    activePhase: "Đã xuất xưởng (Live TFT Meta Mùa 18)",
    customSettings: {
      tftSeason: "18",
    },
  };

  const defaultMotfilmProject: EnterpriseProject = {
    id: "proj-motfilm",
    name: "Motfilm Pro 4K (Streaming OTT)",
    category: "Media & Streaming",
    description:
      "Nền tảng xem phim trực tuyến tốc độ cao HLS 60FPS kết nối kho KKPhim Cloud 30,000+ phim, chặn trộm m3u8, đánh chặn gói tin và tối ưu trải nghiệm rạp chiếu phim không quảng cáo.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    tasks: defaultMotfilmTasks,
    debateMessages: [],
    proposals: defaultMotfilmProposals,
    synthesis: null,
    activeMission: "Xây dựng nền tảng chiếu phim trực tuyến Motfilm Pro 4K tốc độ cao HLS 60FPS",
    missionPrompt: "Xây dựng nền tảng chiếu phim trực tuyến Motfilm Pro 4K tốc độ cao HLS 60FPS",
    activePhase: "Đã xuất xưởng (Live OTT 4K)",
  };

  const defaultApexProject: EnterpriseProject = {
    id: "proj-apex",
    name: "Apex Legends Pro Tracker (Esports Telemetry)",
    category: "Gaming & Esports Analytics",
    description:
      "Hệ thống theo dõi rank Apex Predator thời gian thực 120Hz, radar meta tướng Season 23, mô phỏng TTK vũ khí và tính điểm synergy ALGS.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    tasks: defaultApexTasks,
    debateMessages: [],
    proposals: defaultApexProposals,
    synthesis: null,
    activeMission: "Xây dựng hệ thống Apex Legends Pro Tracker theo dõi rank Predator 120Hz, radar meta Season 23 và mô phỏng sát thương TTK vũ khí",
    missionPrompt: "Xây dựng hệ thống Apex Legends Pro Tracker theo dõi rank Predator 120Hz, radar meta Season 23 và mô phỏng sát thương TTK vũ khí",
    activePhase: "Đã xuất xưởng (Live Telemetry)",
  };

function getInitialProjects(_savedSession?: any): EnterpriseProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // 1. Ensure proj-tft is always present and enriched with its own tasks & proposals
        const tftIdx = parsed.findIndex(
          (p: any) =>
            p.id === "proj-tft" ||
            p.name?.toLowerCase().includes("tft") ||
            p.name?.toLowerCase().includes("đấu trường") ||
            p.name?.toLowerCase().includes("dau truong")
        );
        if (tftIdx < 0) {
          parsed.unshift(defaultTFTProject);
        } else {
          // Gracefully upgrade naming & description to Season 18
          if (parsed[tftIdx].name?.includes("13") || !parsed[tftIdx].name?.includes("18")) {
            parsed[tftIdx].name = "TFT Meta Pro (ĐTCL Mùa 18 & Mùa 13)";
          }
          if (parsed[tftIdx].description?.includes("Mùa 13/") || !parsed[tftIdx].description?.includes("18")) {
            parsed[tftIdx].description =
              "Cẩm nang và hệ thống phân tích Meta Đấu Trường Chân Lý (TFT) Mùa 18 (Mới Nhất) & Mùa 13: Tier list đội hình S-Tier, tỷ lệ top 4, máy tính xác suất Roll tướng và bản đồ trang bị BiS chuẩn Thách Đấu.";
          }
          parsed[tftIdx].customSettings = {
            tftSeason: "18",
            ...parsed[tftIdx].customSettings,
          };
          // Cleanse any corrupted tasks or film contamination from proj-tft
          if (
            !parsed[tftIdx].tasks ||
            parsed[tftIdx].tasks.length === 0 ||
            parsed[tftIdx].tasks.some((t: any) =>
              t.title?.toLowerCase().includes("phim") ||
              t.title?.toLowerCase().includes("hls") ||
              t.title?.toLowerCase().includes("motfilm") ||
              t.description?.toLowerCase().includes("m3u8")
            )
          ) {
            parsed[tftIdx].tasks = defaultTFTTasks;
            parsed[tftIdx].synthesis = null;
          }
          if (parsed[tftIdx].synthesis && (
            parsed[tftIdx].synthesis.masterPlanTitle?.toLowerCase().includes("phim") ||
            parsed[tftIdx].synthesis.synthesisMarkdown?.toLowerCase().includes("phim")
          )) {
            parsed[tftIdx].synthesis = null;
          }
          if (!parsed[tftIdx].proposals || parsed[tftIdx].proposals.length === 0) {
            parsed[tftIdx].proposals = defaultTFTProposals;
          }
          if (!parsed[tftIdx].activeMission || parsed[tftIdx].activeMission.toLowerCase().includes("phim")) {
            parsed[tftIdx].activeMission = defaultTFTProject.activeMission;
          }
        }

        // 2. Ensure proj-apex is always present
        const hasApex = parsed.some((p: any) => p.id === "proj-apex" || p.name?.toLowerCase().includes("apex"));
        if (!hasApex) {
          parsed.push(defaultApexProject);
        } else {
          const apexIdx = parsed.findIndex((p: any) => p.id === "proj-apex");
          if (apexIdx >= 0) {
            if (!parsed[apexIdx].tasks || parsed[apexIdx].tasks.length === 0) {
              parsed[apexIdx].tasks = defaultApexTasks;
            }
            if (!parsed[apexIdx].proposals || parsed[apexIdx].proposals.length === 0) {
              parsed[apexIdx].proposals = defaultApexProposals;
            }
          }
        }

        // 3. Ensure proj-motfilm is always present
        const hasMotfilm = parsed.some((p: any) => p.id === "proj-motfilm" || p.name?.toLowerCase().includes("motfilm"));
        if (!hasMotfilm) {
          parsed.push(defaultMotfilmProject);
        } else {
          const motfilmIdx = parsed.findIndex((p: any) => p.id === "proj-motfilm");
          if (motfilmIdx >= 0) {
            if (!parsed[motfilmIdx].tasks || parsed[motfilmIdx].tasks.length === 0) {
              parsed[motfilmIdx].tasks = defaultMotfilmTasks;
            }
            if (!parsed[motfilmIdx].proposals || parsed[motfilmIdx].proposals.length === 0) {
              parsed[motfilmIdx].proposals = defaultMotfilmProposals;
            }
          }
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Lỗi đọc danh mục projects:", e);
  }

  // Default initial projects catalog (Cleanly isolated!)
  return [
    defaultTFTProject,
    defaultMotfilmProject,
    defaultApexProject,
    {
      id: "proj-saas-launch",
      name: "HyperScale 30D (SaaS AI B2B)",
      category: "SaaS AI & B2B",
      description:
        "Chiến lược kiến trúc microservices, mô hình định giá subscription và chiến dịch Go-To-Market tinh gọn trong 30 ngày.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      tasks: [],
      debateMessages: [],
      proposals: [],
      synthesis: null,
      activeMission: "",
      missionPrompt: "",
      activePhase: "Bản thảo (Chờ chỉ đạo)",
    },
    {
      id: "proj-cskh-swarm",
      name: "SwarmSupport AI (Tổng Đài Tác Nhân)",
      category: "CRM & CSKH Swarm",
      description:
        "Tự động hóa 80% chăm sóc khách hàng đa kênh: phân loại ticket, tra cứu cơ sở tri thức RAG và xử lý sự cố cấp 1.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      tasks: [],
      debateMessages: [],
      proposals: [],
      synthesis: null,
      activeMission: "",
      missionPrompt: "",
      activePhase: "Bản thảo (Chờ chỉ đạo)",
    },
  ];
}

function getInitialActiveProjectId(projects: EnterpriseProject[]): string {
  if (typeof window !== "undefined") {
    const search = window.location.search || "";
    const hash = window.location.hash || "";
    if (search.includes("tft") || hash.includes("tft") || search.includes("dau-truong")) {
      const tftP = projects.find((p) => p.id === "proj-tft" || p.name.toLowerCase().includes("tft"));
      if (tftP) return tftP.id;
    }
    if (search.includes("apex") || hash.includes("apex")) {
      return "proj-apex";
    }
    if (search.includes("motfilm") || hash.includes("movie") || hash.includes("motfilm")) {
      return "proj-motfilm";
    }
  }
  try {
    const raw = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
    if (raw && projects.some((p) => p.id === raw)) {
      return raw;
    }
  } catch (e) {}
  // Default to first project
  return projects[0]?.id || "proj-tft";
}

export default function App() {
  const saved = useMemo(() => loadSavedSession(), []);

  // Core State (initialized with saved state if available)
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [missionInput, setMissionInput] = useState<string>(() => saved?.missionInput || "");
  const [activeMission, setActiveMission] = useState<string>(() => saved?.activeMission || "");
  const [tasks, setTasks] = useState<CompanyTask[]>(() => saved?.tasks || []);
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>(() => saved?.debateMessages || []);
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string | null>(null);
  // Verify if current session is the authorized Owner/Creator
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    return isOwnerAuthenticated();
  });

  const [isCinemaModeOnly, setIsCinemaModeOnly] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search || "";
      const hash = window.location.hash || "";

      if (
        search.includes("mode=movie") ||
        search.includes("mode=cinema") ||
        search.includes("mode=standalone") ||
        hash === "#movie" ||
        hash === "#cinema" ||
        hash === "#standalone"
      ) {
        return true;
      }
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<"boardroom" | "tasks" | "preview">(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#preview" || window.location.search.includes("tab=preview")) {
        return "preview";
      }
      if (window.location.hash === "#tasks") {
        return "tasks";
      }
      if (window.location.hash === "#boardroom" || window.location.search.includes("mode=boardroom")) {
        return "boardroom";
      }
    }
    return saved?.activeTab || "preview";
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || "";
      if (hash === "#movie" || hash === "#cinema" || hash === "#standalone") {
        setIsCinemaModeOnly(true);
      } else if (hash === "#preview") {
        setIsCinemaModeOnly(false);
        setActiveTab("preview");
      } else if (hash === "#tasks") {
        setIsCinemaModeOnly(false);
        setActiveTab("tasks");
      } else if (hash === "#boardroom") {
        setIsCinemaModeOnly(false);
        setActiveTab("boardroom");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Workflow & Execution States
  const [activePhase, setActivePhase] = useState<string>(() => saved?.activePhase || "Sẵn sàng");
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [isDebating, setIsDebating] = useState(false);
  const [isExecutingTasks, setIsExecutingTasks] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [chairmanNote, setChairmanNote] = useState<string | null>(null);
  const [maxAllowedMessages, setMaxAllowedMessages] = useState<number>(() => {
    return Math.max(6, (saved?.debateMessages?.length || 0) + 6);
  });

  // Modals & Inspection
  const [selectedTask, setSelectedTask] = useState<CompanyTask | null>(null);
  const [synthesis, setSynthesis] = useState<FinalSynthesis | null>(() => saved?.synthesis || null);
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showGPTBridge, setShowGPTBridge] = useState(false);
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [blueprints, setBlueprints] = useState<ArchitectureBlueprint[]>(DEFAULT_BLUEPRINTS);
  const [unlockedForSession, setUnlockedForSession] = useState<boolean>(() => {
    return isAccessUnlocked("proj-motfilm");
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectModalTab, setProjectModalTab] = useState<"catalog" | "create" | "rename">("catalog");
  const [projects, setProjects] = useState<EnterpriseProject[]>(() =>
    getInitialProjects(saved)
  );
  const [activeProjectId, setActiveProjectId] = useState<string>(() =>
    getInitialActiveProjectId(projects)
  );

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  useEffect(() => {
    const projName = activeProject?.name || "Apex Legends Pro Tracker";
    document.title = `${projName} - AgentCorp Autonomous AI`;
  }, [activeProject, isCinemaModeOnly]);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig | null>(() => {
    try {
      const raw = localStorage.getItem("agentcorp_telegram_config");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState<{ message: string; type: "error" | "info" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "info" | "success" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const [currentView, setCurrentView] = useState<MainViewMode>(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      if (search.includes("view=motfilm") || search.includes("project=proj-motfilm") || hash.includes("movie") || hash.includes("motfilm")) {
        return "web_movie";
      }
      if (search.includes("view=apex") || search.includes("project=proj-apex") || hash.includes("apex")) {
        return "web_apex";
      }
      if (search.includes("view=tasks") || hash.includes("tasks")) {
        return "tasks";
      }
      if (search.includes("view=boardroom") || hash.includes("boardroom") || search.includes("view=agent")) {
        return "agent_room";
      }
    }
    return "agent_room";
  });

  const [proposals, setProposals] = useState<AgentProposal[]>(() => {
    const curP = projects.find((p) => p.id === activeProjectId) || projects[0];
    if (curP?.proposals && curP.proposals.length > 0) {
      return curP.proposals;
    }
    if (curP?.id === "proj-tft" || curP?.name?.toLowerCase().includes("tft")) {
      return defaultTFTProposals;
    }
    if (curP?.id === "proj-motfilm" || curP?.name?.toLowerCase().includes("motfilm")) {
      return defaultMotfilmProposals;
    }
    if (curP?.id === "proj-apex" || curP?.name?.toLowerCase().includes("apex")) {
      return defaultApexProposals;
    }
    return [];
  });

  const handleSelectView = (view: MainViewMode) => {
    setCurrentView(view);
    setIsCinemaModeOnly(false);

    if (view === "agent_room") {
      setActiveTab("boardroom");
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("view", "boardroom");
        url.searchParams.delete("mode");
        window.history.pushState({}, "", url.toString());
      }
    } else if (view === "web_preview") {
      setActiveTab("preview");
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("view", "preview");
        url.searchParams.delete("mode");
        window.history.pushState({}, "", url.toString());
      }
      showToast(`Đang mở Bản Chạy Thử Live của "${activeProject.name}"...`, "info");
    } else if (view === "web_tft") {
      const tftProj = projects.find((p) => p.id === "proj-tft" || p.name.toLowerCase().includes("tft"));
      if (tftProj) handleSelectProject(tftProj.id);
      setActiveTab("preview");
      showToast("Đang mở Web TFT Meta Pro Live...", "info");
    } else if (view === "web_movie") {
      handleSelectProject("proj-motfilm");
      setActiveTab("preview");
      showToast("Đang mở Web Phim Motfilm Pro 4K Live...", "info");
    } else if (view === "web_apex") {
      handleSelectProject("proj-apex");
      setActiveTab("preview");
      showToast("Đang mở Web Apex Legends Pro Tracker Live...", "info");
    } else if (view === "tasks") {
      setActiveTab("tasks");
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("view", "tasks");
        url.searchParams.delete("mode");
        window.history.pushState({}, "", url.toString());
      }
    }
  };

  const handleSendDirective = async (directive: string) => {
    setIsBreakingDown(true);
    const lower = directive.toLowerCase();
    const isSeason18 = lower.includes("18") || lower.includes("mùa 18") || lower.includes("s18");
    const isTftRelated = isSeason18 || lower.includes("tft") || lower.includes("đấu trường") || lower.includes("cơ giáp") || lower.includes("hắc tinh");

    // If directive is about Season 18 or TFT season update, apply immediately to project settings and tasks!
    if (isTftRelated) {
      const seasonStr = lower.includes("13") && !isSeason18 ? "13" : "18";
      handleUpdateProject(activeProjectId === "proj-tft" ? "proj-tft" : activeProjectId, {
        customSettings: { ...activeProject?.customSettings, tftSeason: seasonStr },
        name: `TFT Meta Pro (ĐTCL Mùa ${seasonStr})`,
        description: `Hệ thống phân tích Meta Đấu Trường Chân Lý (TFT) Mùa ${seasonStr} (Mới Nhất): Tier list đội hình S-Tier, tỷ lệ top 4, máy tính xác suất Roll tướng và bản đồ trang bị BiS chuẩn Thách Đấu.`,
      });

      if (isSeason18) {
        const s18Task: CompanyTask = {
          id: `task-s18-${Date.now()}`,
          title: "Cập nhật dữ liệu Meta Đội Hình TFT Mùa 18 (Patch 15.2)",
          department: "Kỹ Thuật & AI Dev",
          assignedAgentId: "architect",
          priority: "urgent",
          estimatedTime: "Đã xuất xưởng",
          status: "completed",
          description: "Nạp toàn bộ đội hình S-Tier Cơ Giáp Tương Lai, Hắc Tinh Đột Biến, Học Viện Siêu Âm và bảng tính Roll level 8/9 theo chỉ đạo.",
          dependencies: [],
          deliverable: {
            taskId: `task-s18-${Date.now()}`,
            taskTitle: "Cập nhật dữ liệu Meta Đội Hình TFT Mùa 18 (Patch 15.2)",
            agentName: "Trần Tuấn Anh",
            agentRole: "Kiến Trúc Sư Hệ Thống",
            agentId: "architect",
            deliverableTitle: "Bản vá TFT Mùa 18: Đội hình S-Tier & Cơ chế mới",
            executiveNotes: "Đã nạp trực tiếp vào Bản Chạy Thử Web và bộ nhớ dự án.",
            content: "• Kích hoạt bài Cơ Giáp Tương Lai (Viktor Carry 62.4% Top 4)\n• Cập nhật Hắc Tinh Đột Biến (Kai'Sa & Cho'Gath 59.5%)\n• Bảng xác suất Roll tướng Mùa 18 chuẩn Riot Games.",
            completedAt: new Date().toLocaleTimeString("vi-VN"),
            artifacts: [],
          },
        };
        setTasks((prev) => [s18Task, ...prev.filter((t) => t.id !== s18Task.id)]);
      }
    }

    const chairMsg: DebateMessage = {
      id: `msg-chair-${Date.now()}`,
      agentId: "chairman",
      agentName: "Chủ Tịch HĐQT (Bạn)",
      role: "Chủ Tịch",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      speech: `📢 CHỈ ĐẠO MỚI: "${directive}". Đề nghị các phòng ban xây dựng phương án thi công cụ thể và nạp bản vá ngay!`,
      thinking: "Yêu cầu hành động tức thì từ Hội Đồng Tác Nhân AI.",
      sentiment: "constructive",
      round: debateMessages.length + 1,
    };
    setDebateMessages((prev) => [...prev, chairMsg]);

    const newPropId = `prop-${Date.now()}`;
    const newProposal: AgentProposal = {
      id: newPropId,
      projectId: activeProjectId,
      title: isSeason18 ? "Cập nhật toàn diện sang TFT Mùa 18 (Set 18)" : `Yêu cầu thi công: ${directive}`,
      description: `Hội đồng AI đã phân tích yêu cầu "${directive}" và đã nạp phương án tích hợp riêng vào ${activeProject.name}.`,
      department: "Kỹ Thuật & Sản Phẩm",
      agentId: "architect",
      agentName: "Trần Tuấn Anh",
      agentRole: "Kiến Trúc Sư Hệ Thống",
      status: isSeason18 ? "approved" : "pending",
      timestamp: "Vừa xong",
      actionSummary: `Triển khai yêu cầu: ${directive}`,
      keyPoints: [
        `Phân tích logic và nạp mã nguồn module cho "${directive.slice(0, 40)}"`,
        "Biên dịch và kiểm thử bảo mật 0 xung đột với dự án khác",
        `Nạp trực tiếp vào Bản Chạy Thử Web của ${activeProject.name}`
      ]
    };

    setProposals((prev) => [newProposal, ...prev]);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? { ...p, proposals: [newProposal, ...(p.proposals || [])] }
          : p
      )
    );

    try {
      const resp = await fetch("/api/orchestrate/debate-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeMission || activeProject.name,
          speaker: agents[1] || agents[0],
          history: debateMessages.slice(-4),
          directive,
        }),
      });
      if (resp.ok) {
        const turnData = await resp.json();
        const agentMsg: DebateMessage = {
          id: `msg-agent-${Date.now()}`,
          agentId: turnData.agentId || "architect",
          agentName: turnData.agentName || "Trần Tuấn Anh",
          role: turnData.role || "Kỹ Sư Trưởng",
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          speech: turnData.speech || `Thưa Chủ tịch, tôi đã chuẩn bị xong phương án thi công cho "${directive}". Đã tạo hộp nút bấm phê duyệt bên trên để Chủ tịch quyết định!`,
          thinking: turnData.thinking || "Sẵn sàng nạp mã nguồn ngay khi được phê duyệt.",
          sentiment: "constructive",
          round: debateMessages.length + 2,
        };
        setDebateMessages((prev) => [...prev, agentMsg]);
      }
    } catch (e) {
      console.warn("Lỗi gọi phản hồi agent:", e);
    } finally {
      setIsBreakingDown(false);
    }

    showToast(`Đã tạo hộp phê duyệt [Đồng ý] / [Không] cho yêu cầu này!`, "success");
  };

  const handleApproveProposal = (propId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === propId ? { ...p, status: "approved" as const } : p))
    );

    const targetProp = proposals.find((p) => p.id === propId);
    if (targetProp) {
      const newTask: CompanyTask = {
        id: `task-approved-${Date.now()}`,
        title: targetProp.title,
        department: targetProp.department,
        assignedAgentId: targetProp.agentId,
        priority: "urgent",
        estimatedTime: "Hoàn tất tức thì",
        description: targetProp.description,
        dependencies: [],
        status: "completed",
        deliverable: {
          taskId: `task-approved-${Date.now()}`,
          taskTitle: targetProp.title,
          agentId: targetProp.agentId,
          agentName: targetProp.agentName,
          agentRole: targetProp.agentRole,
          deliverableTitle: `Sản Phẩm Nghiệm Thu: ${targetProp.title}`,
          executiveNotes: `Đã được Chủ tịch HĐQT phê duyệt [Đồng Ý] trong dự án "${activeProject.name}".`,
          content: targetProp.keyPoints.join("\n• "),
          completedAt: new Date().toLocaleTimeString("vi-VN"),
          artifacts: [],
        }
      };

      setTasks((prev) => [newTask, ...prev]);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? {
                ...p,
                tasks: [newTask, ...(p.tasks || [])],
                proposals: (p.proposals || []).map((prop) =>
                  prop.id === propId ? { ...prop, status: "approved" as const } : prop
                ),
              }
            : p
        )
      );

      fetch("/api/orchestrate/live-mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directive: targetProp.title, projectId: activeProjectId }),
      }).catch(() => {});

      showToast(`✅ Đã đồng ý phê duyệt! Tính năng đã được nạp riêng vào bản web của ${activeProject.name}.`, "success");
    }
  };

  const handleRejectProposal = (propId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === propId ? { ...p, status: "rejected" as const } : p))
    );
    showToast("Đã từ chối đề xuất và giữ nguyên trạng thái cũ.", "info");
  };

  const handleInheritBlueprint = (blueprint: ArchitectureBlueprint) => {
    const newTask: CompanyTask = {
      id: `task-inherited-${Date.now()}`,
      title: blueprint.taskData.title,
      department: blueprint.taskData.department,
      assignedAgentId: blueprint.taskData.assignedAgentId,
      priority: "high",
      estimatedTime: "Hoàn tất tức thì",
      status: "completed",
      description: blueprint.taskData.description,
      dependencies: [],
      deliverable: {
        taskId: `task-inherited-${Date.now()}`,
        taskTitle: blueprint.taskData.title,
        agentId: blueprint.taskData.assignedAgentId,
        agentName: "Hội Đồng Kế Thừa",
        agentRole: blueprint.taskData.department,
        deliverableTitle: blueprint.taskData.deliverableTitle,
        content: blueprint.taskData.description,
        artifacts: blueprint.taskData.artifacts,
        completedAt: new Date().toISOString(),
      },
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`⚡ Đã kế thừa thành công thành tựu: ${blueprint.title}`, "success");
  };

  // Helper to send updates to Telegram if connected
  const notifyTelegram = async (text: string) => {
    try {
      const raw = localStorage.getItem("agentcorp_telegram_config");
      if (!raw) return;
      const cfg = JSON.parse(raw);
      if (!cfg.botToken || !cfg.chatId || !cfg.notifyOnComplete) return;

      await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: cfg.botToken,
          chatId: cfg.chatId,
          text,
        }),
      });
    } catch (e) {
      console.warn("Telegram notification error:", e);
    }
  };

  // AI Configuration Settings
  const [aiSettings, setAiSettings] = useState<AISettings>({
    activeProvider: "gemini",
    singleAIEmulationMode: true,
    ttsEnabled: false,
    geminiModel: "gemini-3.8-flash",
  });

  // Reference to stop ongoing loops if needed
  const isDebateActiveRef = useRef(false);
  isDebateActiveRef.current = isDebating;

  const isTurnInProgressRef = useRef(false);
  const debateMessagesRef = useRef<DebateMessage[]>(debateMessages);
  debateMessagesRef.current = debateMessages;

  // Auto-persist session to localStorage so reloading (F5) never loses data
  useEffect(() => {
    try {
      const stateToSave = {
        missionInput,
        activeMission,
        tasks,
        debateMessages,
        activeTab,
        activePhase,
        synthesis,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Could not save session to localStorage:", e);
    }
  }, [missionInput, activeMission, tasks, debateMessages, activeTab, activePhase, synthesis]);

  // ⚡ Keep active project in `projects` state AND `PROJECTS_STORAGE_KEY` synchronized in realtime!
  // This permanently eliminates "cứ thêm này mất kia" when switching tabs or refreshing!
  useEffect(() => {
    if (!activeProjectId) return;
    setProjects((prevProjects) => {
      const idx = prevProjects.findIndex((p) => p.id === activeProjectId);
      if (idx === -1) return prevProjects;

      const target = prevProjects[idx];
      // Compare if key attributes actually changed to prevent useless re-renders
      const isTasksSame = target.tasks === tasks;
      const isDebateSame = target.debateMessages === debateMessages;
      const isProposalsSame = target.proposals === proposals;
      const isMissionSame = target.activeMission === activeMission;
      const isPhaseSame = target.activePhase === activePhase;

      if (isTasksSame && isDebateSame && isProposalsSame && isMissionSame && isPhaseSame) {
        return prevProjects;
      }

      const updated = [...prevProjects];
      updated[idx] = {
        ...target,
        tasks,
        debateMessages,
        proposals,
        activeMission,
        missionPrompt: missionInput,
        synthesis,
        activePhase,
        updatedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });
  }, [activeProjectId, tasks, debateMessages, proposals, activeMission, missionInput, synthesis, activePhase]);

  // Auto-sync telegram active mission into App state if initialized from Telegram bot
  useEffect(() => {
    const syncTelegramStatus = async () => {
      try {
        const resp = await fetch("/api/telegram/status");
        const data = await resp.json();
        if (data.success && data.activeMission?.tasks && data.activeMission.tasks.length > 0) {
          // If app has no active mission yet, sync from telegram
          if (!activeMission) {
            setActiveMission(data.activeMission.mission);
            const mappedTasks: CompanyTask[] = data.activeMission.tasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              department: t.department,
              assignedAgentId: t.assignedAgentId,
              priority: "high",
              estimatedTime: "2-4h",
              description: t.description,
              dependencies: [],
              status: t.status || "in_progress",
            }));
            setTasks(mappedTasks);
            setActivePhase("Đồng bộ từ Telegram");
          }
        }
      } catch (e) {
        // ignore sync failure
      }
    };
    syncTelegramStatus();
  }, [activeMission]);
  // Multi-Project Catalog Handlers
  const handleSelectProject = (newProjectId: string) => {
    if (newProjectId === activeProjectId) return;

    setIsDebating(false);
    agentVoice.stop();

    // 1. Sync current project working state (INCLUDING PROPOSALS!)
    const updatedProjects = projects.map((p) => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          tasks,
          debateMessages,
          proposals,
          activeMission,
          missionPrompt: missionInput,
          synthesis,
          activePhase,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    // 2. Find target project
    const target = updatedProjects.find((p) => p.id === newProjectId);
    if (!target) return;

    // 3. Switch workspace cleanly WITHOUT auto-running AI mission!
    setActiveProjectId(newProjectId);
    setProjects(updatedProjects);
    setTasks(target.tasks || []);
    setDebateMessages(target.debateMessages || []);

    // Set target proposals or defaults
    let targetProposals = target.proposals;
    if (!targetProposals || targetProposals.length === 0) {
      if (target.id === "proj-tft" || target.name?.toLowerCase().includes("tft") || target.name?.toLowerCase().includes("đấu trường")) {
        targetProposals = defaultTFTProposals;
      } else if (target.id === "proj-motfilm" || target.name?.toLowerCase().includes("motfilm")) {
        targetProposals = defaultMotfilmProposals;
      } else if (target.id === "proj-apex" || target.name?.toLowerCase().includes("apex")) {
        targetProposals = defaultApexProposals;
      } else {
        targetProposals = [];
      }
    }
    setProposals(targetProposals || []);

    setActiveMission(target.activeMission || "");
    setMissionInput(target.missionPrompt || "");
    setSynthesis(target.synthesis || null);
    setActivePhase(
      target.activePhase || (target.tasks?.length ? "Đã nghiệm thu" : "Bản thảo (Chờ chỉ đạo)")
    );
    setCurrentSpeakerId(null);
    setChairmanNote(null);

    // If new project has no tasks or is in draft, switch to boardroom to give user clear focus
    if (!target.tasks || target.tasks.length === 0) {
      setActiveTab("boardroom");
    }

    try {
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, newProjectId);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    } catch (e) {}

    showToast(`Đã chuyển sang dự án: "${target.name}"`, "info");
  };

  const handleCreateProject = (data: { name: string; category: string; description: string }) => {
    setIsDebating(false);
    agentVoice.stop();

    const newId = `proj-${Date.now()}`;
    const newProj: EnterpriseProject = {
      id: newId,
      name: data.name,
      category: data.category,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      tasks: [],
      debateMessages: [],
      proposals: [],
      activeMission: "",
      missionPrompt: "",
      synthesis: null,
      activePhase: "Bản thảo (Chờ chỉ đạo)",
    };

    const updatedProjects = [
      ...projects.map((p) => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            tasks,
            debateMessages,
            proposals,
            activeMission,
            missionPrompt: missionInput,
            synthesis,
            activePhase,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }),
      newProj,
    ];

    setProjects(updatedProjects);
    setActiveProjectId(newId);

    // Switch workspace to fresh state
    setTasks([]);
    setDebateMessages([]);
    setProposals([]);
    setActiveMission("");
    setMissionInput("");
    setSynthesis(null);
    setActivePhase("Bản thảo (Chờ chỉ đạo)");
    setCurrentSpeakerId(null);
    setActiveTab("boardroom");

    try {
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, newId);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    } catch (e) {}

    showToast(
      `Đã tạo dự án mới: "${data.name}"! Bạn có thể quản lý, xem sản phẩm hoặc chỉ đạo AI bất cứ lúc nào.`,
      "success"
    );
  };

  const handleUpdateProject = (projectId: string, updates: Partial<EnterpriseProject>) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === projectId);
      let updatedProjects: EnterpriseProject[];
      if (exists) {
        updatedProjects = prev.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        });
      } else {
        const newProj: EnterpriseProject = {
          id: projectId,
          name: updates.name || "Dự án mới",
          category: updates.category || "Công Nghệ",
          description: updates.description || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "active",
          tasks: updates.tasks || [],
          debateMessages: updates.debateMessages || [],
          synthesis: updates.synthesis || null,
          activeMission: updates.activeMission || "",
          missionPrompt: updates.missionPrompt || "",
          activePhase: updates.activePhase || "Sẵn sàng",
          ...updates,
        };
        updatedProjects = [newProj, ...prev];
      }

      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
      } catch (e) {}

      return updatedProjects;
    });

    showToast("Đã lưu cập nhật dự án thành công!", "success");
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      showToast("Không thể xoá dự án duy nhất còn lại trong hệ thống!", "error");
      return;
    }

    const filtered = projects.filter((p) => p.id !== projectId);
    setProjects(filtered);

    if (activeProjectId === projectId) {
      const nextActive = filtered[0];
      setActiveProjectId(nextActive.id);
      setTasks(nextActive.tasks || []);
      setDebateMessages(nextActive.debateMessages || []);
      setActiveMission(nextActive.activeMission || "");
      setMissionInput(nextActive.missionPrompt || "");
      setSynthesis(nextActive.synthesis || null);
      setActivePhase(nextActive.activePhase || "Sẵn sàng");
    }

    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {}

    showToast("Đã xoá dự án khỏi danh mục.", "info");
  };

  const handleAutoSuggestActiveProjectName = () => {
    const suggested = generateRandomProjectName(activeProject.category);
    handleUpdateProject(activeProjectId, { name: suggested });
    showToast(`Đã tự động đề xuất và đổi tên thành: "${suggested}"!`, "success");
  };

  const handleResetSession = () => {
    setIsDebating(false);
    agentVoice.stop();
    setActiveMission("");
    setMissionInput("");
    setTasks([]);
    setDebateMessages([]);
    setSynthesis(null);
    setActivePhase("Sẵn sàng");
    setCurrentSpeakerId(null);
    setActiveTab("boardroom");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    showToast("Đã khởi tạo không gian làm việc mới!", "info");
  };

  // 1. Kickoff Mission: Breakdown problem into WBS
  const handleStartMission = async (customText?: string) => {
    const textToRun = customText || missionInput;
    if (!textToRun.trim()) return;

    setActiveMission(textToRun.trim());
    setIsBreakingDown(true);
    setActivePhase("CEO Phân rã WBS");
    setTasks([]);
    setDebateMessages([]);
    setSynthesis(null);
    setCurrentSpeakerId("ceo");

    try {
      const resp = await fetch("/api/orchestrate/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission: textToRun.trim(),
          companyContext: "AgentCorp Autonomous Multi-Agent Virtual Corporation",
          agents,
        }),
      });

      if (!resp.ok) throw new Error("Không thể phân rã bài toán");
      const data = await resp.json();

      const mappedTasks: CompanyTask[] = (data.tasks || []).map((t: any) => ({
        id: t.id || `task-${Date.now()}-${Math.random()}`,
        title: t.title,
        department: t.department || "General",
        assignedAgentId: t.assignedAgentId || "architect",
        priority: t.priority || "medium",
        estimatedTime: t.estimatedTime || "1 giờ",
        description: t.description || "",
        dependencies: t.dependencies || [],
        status: "pending",
      }));

      setTasks(mappedTasks);
      setMaxAllowedMessages(agents.length + 1);

      // Dynamically detect project topic and update activeProject
      const lower = textToRun.toLowerCase();
      let targetProjId = activeProjectId;
      let projName = activeProject?.name || textToRun.slice(0, 45);
      let projCategory = activeProject?.category || "Công Nghệ & Sản Phẩm";
      let projDesc = "";

      if (
        lower.includes("tft") ||
        lower.includes("đấu trường") ||
        lower.includes("chân lý") ||
        lower.includes("dtcl") ||
        lower.includes("mùa 18") ||
        lower.includes("s18") ||
        lower.includes("mùa 13") ||
        lower.includes("cơ giáp") ||
        lower.includes("hắc tinh")
      ) {
        targetProjId = "proj-tft";
        const seasonNum = lower.includes("13") && !lower.includes("18") ? "13" : "18";
        projName = `TFT Meta Pro (ĐTCL Mùa ${seasonNum})`;
        projCategory = "Gaming & TFT Meta Analytics";
        projDesc = `Hệ thống phân tích Meta Đấu Trường Chân Lý Mùa ${seasonNum}: Tier list S-Tier, tỷ lệ top 4, máy tính xác suất Roll tướng và trang bị BiS chuẩn Thách Đấu.`;
        setActiveProjectId("proj-tft");
      } else if (
        lower.includes("apex") ||
        lower.includes("esport") ||
        ((lower.includes("game") || lower.includes("gaming")) && !lower.includes("tft"))
      ) {
        targetProjId = "proj-apex";
        projName = "Apex Legends Pro Tracker & Analytics (Apex Pro)";
        projCategory = "Gaming & Esports Analytics";
        projDesc = "Hệ thống theo dõi rank Apex Predator thời gian thực 120Hz, radar meta Season 23 và mô phỏng sát thương TTK vũ khí.";
        setActiveProjectId("proj-apex");
      } else if (lower.includes("film") || lower.includes("phim") || lower.includes("motfilm")) {
        targetProjId = "proj-motfilm";
        projName = "Motfilm Pro 4K (Streaming OTT)";
        projCategory = "Media & Streaming";
        projDesc = "Nền tảng streaming phim chất lượng 4K/1080p, giao diện Dark Mode 0 lag.";
        setActiveProjectId("proj-motfilm");
      } else if (lower.includes("saas") || lower.includes("b2b")) {
        targetProjId = "proj-saas-launch";
        projName = "HyperScale 30D (SaaS AI B2B)";
        projCategory = "SaaS AI & B2B";
        setActiveProjectId("proj-saas-launch");
      } else if (lower.includes("crm") || lower.includes("cskh") || lower.includes("support")) {
        targetProjId = "proj-cskh-swarm";
        projName = "SwarmSupport AI (Tổng Đài Tác Nhân)";
        projCategory = "CRM & CSKH Swarm";
        setActiveProjectId("proj-cskh-swarm");
      }

      handleUpdateProject(targetProjId, {
        name: projName,
        category: projCategory,
        description: data.executiveSummary || projDesc,
        activeMission: textToRun.trim(),
        missionPrompt: textToRun.trim(),
        tasks: mappedTasks,
      });

      // Add CEO opening speech to debate
      const ceoAgent = agents.find((a) => a.roleType === "ceo") || agents[0];
      const openingMsg: DebateMessage = {
        id: `msg-${Date.now()}`,
        agentId: ceoAgent.id,
        agentName: ceoAgent.name,
        role: ceoAgent.role,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        speech: `${data.executiveSummary || `Chào các thành viên ban điều hành. Hôm nay chúng ta tập trung giải quyết bài toán: "${textToRun}". Tôi đã phân chia sơ bộ ${mappedTasks.length} nhiệm vụ trọng tâm.`} Đề nghị các trưởng bộ phận cho ý kiến đánh giá và phản biện ngay bây giờ!`,
        thinking: "Đã thiết lập khung mục tiêu và phân công sơ bộ cho từng ban ngành.",
        sentiment: "constructive",
        actionProposal: "Mời CPO và Kỹ sư trưởng bắt đầu phản biện tính khả thi",
        round: 1,
      };

      setDebateMessages([openingMsg]);

      if (aiSettings.ttsEnabled) {
        agentVoice.speak(openingMsg.speech, "ceo");
      }

      setActivePhase("Tranh luận Hội đồng");
      // Auto-start debate loop
      setIsDebating(true);
    } catch (err: any) {
      console.error("Lỗi khởi tạo bài toán:", err);
      showToast("Lỗi kết nối hoặc xử lý: " + (err.message || "Vui lòng thử lại"), "error");
    } finally {
      setIsBreakingDown(false);
    }
  };

  // 2. Perform a Single Turn in Debate
  const executeNextTurn = async (forcedSpeakerId?: string, overrideHumanNote?: string): Promise<boolean> => {
    if (!activeMission || tasks.length === 0) return false;
    if (isTurnInProgressRef.current) return false;
    isTurnInProgressRef.current = true;

    try {
      const currentHistory = debateMessagesRef.current;

      // Stop Condition: Stops when reaching maxAllowedMessages (or 1 full round per phase)
      if (!forcedSpeakerId && !overrideHumanNote && !chairmanNote && currentHistory.length >= maxAllowedMessages) {
        setIsDebating(false);
        setActivePhase("Đã đồng thuận (Sẵn sàng nghiệm thu)");
        showToast("Hội đồng đã hoàn tất tranh luận! Kỹ sư trưởng & AI Dev đã xuất xưởng bản vá.", "success");
        return false;
      }

      // Determine next speaker: Find the last agent who spoke (excluding chairman), then pick (lastIndex + 1) % agents.length
      let speaker: Agent;
      if (forcedSpeakerId) {
        speaker = agents.find((a) => a.id === forcedSpeakerId) || agents[0];
      } else {
        const lastAgentMsg = [...currentHistory].reverse().find((m) => m.agentId !== "chairman");
        let nextIndex = 0;
        if (lastAgentMsg) {
          const lastIdx = agents.findIndex((a) => a.id === lastAgentMsg.agentId);
          nextIndex = lastIdx !== -1 ? (lastIdx + 1) % agents.length : 0;
        }
        speaker = agents[nextIndex] || agents[0];
      }

      setCurrentSpeakerId(speaker.id);

      const resp = await fetch("/api/orchestrate/debate-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission: activeMission,
          currentSpeaker: speaker,
          previousMessages: currentHistory,
          topicFocus: "Đánh giá tính khả thi, phân tích rủi ro, đóng góp giải pháp chuyên sâu",
          humanIntervention: overrideHumanNote || chairmanNote,
        }),
      });

      if (!resp.ok) throw new Error("Lỗi tạo lượt phát biểu");
      const data = await resp.json();

      const newMsg: DebateMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        agentId: speaker.id,
        agentName: speaker.name,
        role: speaker.role,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        speech: data.speech,
        thinking: data.thinking,
        sentiment: data.sentiment || "constructive",
        actionProposal: data.actionProposal,
        round: Math.floor(currentHistory.length / agents.length) + 1,
      };

      setDebateMessages((prev) => {
        const updated = [...prev, newMsg];
        debateMessagesRef.current = updated;
        return updated;
      });

      if (aiSettings.ttsEnabled) {
        agentVoice.speak(newMsg.speech, speaker.roleType);
      }

      if (overrideHumanNote || chairmanNote) {
        setChairmanNote(null);
      }

      setCurrentSpeakerId(null);

      // Check if after this turn, target count is reached
      if (currentHistory.length + 1 >= maxAllowedMessages) {
        setIsDebating(false);
        setActivePhase("Đã đồng thuận (Sẵn sàng nghiệm thu)");
        showToast("Hội đồng đã hoàn tất tranh luận! Kỹ sư trưởng & AI Dev đã xuất xưởng bản vá.", "success");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Lỗi lượt phát biểu:", err);
      setCurrentSpeakerId(null);
      return false;
    } finally {
      isTurnInProgressRef.current = false;
    }
  };

  // Trigger a full new council debate round for an update/iteration directive
  const startUpdateDebate = (directive: string, createdTask?: CompanyTask) => {
    const lower = directive.toLowerCase();
    const isTftDirective = lower.includes("tft") || lower.includes("đấu trường") || lower.includes("mùa 18") || lower.includes("s18") || lower.includes("mùa 13") || lower.includes("cơ giáp") || lower.includes("hắc tinh");

    if (isTftDirective) {
      const seasonStr = lower.includes("13") && !lower.includes("18") ? "13" : "18";
      handleUpdateProject(activeProjectId === "proj-tft" ? "proj-tft" : activeProjectId, {
        customSettings: {
          ...activeProject?.customSettings,
          tftSeason: seasonStr,
        },
        name: `TFT Meta Pro (ĐTCL Mùa ${seasonStr})`,
        description: `Hệ thống phân tích Meta Đấu Trường Chân Lý Mùa ${seasonStr}: Tier list S-Tier, tỷ lệ top 4, máy tính xác suất Roll tướng và trang bị BiS chuẩn Thách Đấu.`,
      });
    }

    if (createdTask) {
      setTasks((prev) => {
        const exists = prev.some((t) => t.id === createdTask.id);
        return exists ? prev : [createdTask, ...prev];
      });
    } else {
      // ⚡ AUTONOMOUS AGENT MUTATION ENGINE: Call backend to compile & patch real features instantly!
      fetch("/api/orchestrate/live-mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directive }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.createdTask) {
            setTasks((prev) => {
              const exists = prev.some((t) => t.id === data.createdTask.id);
              return exists ? prev : [data.createdTask, ...prev];
            });
            if (data.patch?.actionSummary) {
              showToast(`⚡ Tác nhân Kỹ Sư Trưởng & Argent đã nạp bản vá: ${data.patch.actionSummary}`, "success");
            }
          }
        })
        .catch((err) => console.warn("Live mutate background error:", err));
    }

    const currentMsgCount = debateMessages.length;
    const chairMsg: DebateMessage = {
      id: `msg-chair-${Date.now()}`,
      agentId: "chairman",
      agentName: "Chủ Tịch HĐQT (Bạn)",
      role: "Chủ Tịch Hội Đồng Quản Trị",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      speech: `📢 CHỈ ĐẠO NÂNG CẤP TỪ CHỦ TỊCH: "${directive}". Đề nghị toàn thể Ban Giám Đốc họp khẩn và phản biện giải pháp: CPO định nghĩa tính năng, Kỹ Sư Trưởng & AI Dev đưa giải pháp mã nguồn thi công, QA rà soát rủi ro!`,
      thinking: "Chỉ đạo tối cao yêu cầu toàn bộ hội đồng phải trao đổi và phản biện thực thi.",
      sentiment: "constructive",
      actionProposal: `Họp bàn và thi công nâng cấp: ${directive}`,
      round: Math.floor(currentMsgCount / agents.length) + 1,
    };

    setDebateMessages((prev) => [...prev, chairMsg]);
    setChairmanNote(directive);
    setMaxAllowedMessages(currentMsgCount + agents.length + 1);
    setActivePhase(`Họp khẩn nâng cấp: "${directive.slice(0, 30)}..."`);
    setIsDebating(true);
    showToast(`Hội đồng AI đang họp khẩn để thảo luận và thi công chỉ đạo của bạn!`, "info");

    notifyTelegram(`📢 <b>CHỦ TỊCH VỪA CHỈ ĐẠO NÂNG CẤP:</b>\n"<i>${directive}</i>"\n\n🏛️ Hội đồng AI gồm 6 phòng ban đang họp khẩn và Kỹ sư trưởng & AI Dev đang tiến hành thi công!`);
  };

  // Automated Debate Loop - Single, controlled timer with zero duplicate triggers
  useEffect(() => {
    if (!isDebating) return;

    let timer: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const runDebateStep = async () => {
      if (isCancelled || !isDebateActiveRef.current) return;
      const keepGoing = await executeNextTurn();
      if (keepGoing && isDebateActiveRef.current && !isCancelled) {
        timer = setTimeout(runDebateStep, 3500);
      }
    };

    timer = setTimeout(runDebateStep, 1500);

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [isDebating, activeMission]);

  // ⚡ Auto-sync new projects or directives received from Telegram bot
  useEffect(() => {
    let lastKnownMission = activeMission;

    const syncFromTelegram = async () => {
      try {
        const resp = await fetch("/api/telegram/sync-latest");
        if (!resp.ok) return;
        const data = await resp.json();
        if (data.success && data.activeMission?.mission && data.activeMission.mission !== lastKnownMission) {
          lastKnownMission = data.activeMission.mission;
          const newM = data.activeMission.mission;
          const lower = newM.toLowerCase();

          let targetId = activeProjectId;
          let pName = activeProject?.name || "Dự án";
          let pCat = activeProject?.category || "Chung";

          if (
            lower.includes("tft") ||
            lower.includes("đấu trường") ||
            lower.includes("chân lý") ||
            lower.includes("dtcl") ||
            lower.includes("mùa 18") ||
            lower.includes("s18") ||
            lower.includes("mùa 13")
          ) {
            targetId = "proj-tft";
            const seasonNum = lower.includes("13") && !lower.includes("18") ? "13" : "18";
            pName = `TFT Meta Pro (ĐTCL Mùa ${seasonNum})`;
            pCat = "Gaming & TFT Meta Analytics";
          } else if (lower.includes("film") || lower.includes("phim") || lower.includes("motfilm")) {
            targetId = "proj-motfilm";
            pName = "Motfilm Pro 4K (Streaming OTT)";
            pCat = "Media & Streaming";
          } else if (lower.includes("apex")) {
            targetId = "proj-apex";
            pName = "Apex Legends Pro Tracker (Esports Telemetry)";
            pCat = "Gaming & Esports Analytics";
          }

          setActiveMission(newM);
          if (targetId !== activeProjectId) {
            setActiveProjectId(targetId);
          }

          if (Array.isArray(data.activeMission.tasks) && data.activeMission.tasks.length > 0) {
            setTasks(data.activeMission.tasks.map((t: any) => ({
              id: t.id || `task-${Date.now()}-${Math.random()}`,
              title: t.title,
              department: t.department || "General",
              assignedAgentId: t.assignedAgentId || "architect",
              priority: t.priority || "high",
              estimatedTime: t.estimatedTime || "1 giờ",
              description: t.description || "",
              dependencies: t.dependencies || [],
              status: t.status || "completed",
            })));
          }

          handleUpdateProject(targetId, {
            name: pName,
            category: pCat,
            activeMission: newM,
            missionPrompt: newM,
            status: "active",
          });

          showToast(`⚡ Đã đồng bộ bài toán từ Telegram: "${newM.slice(0, 40)}..."!`, "info");
        }
      } catch {}
    };

    syncFromTelegram();
    const interval = setInterval(syncFromTelegram, 2000);

    return () => clearInterval(interval);
  }, [activeMission]);

  // 3. Execute a Specific Task
  const executeSingleTask = async (task: CompanyTask) => {
    const assignedAgent = agents.find((a) => a.id === task.assignedAgentId) || agents[0];

    // Set task to in_progress
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "in_progress" } : t))
    );

    try {
      const resp = await fetch("/api/orchestrate/task-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          agent: assignedAgent,
          mission: activeMission,
          context: `Biên bản họp phòng hội đồng ghi nhận ${debateMessages.length} ý kiến thảo luận.`,
        }),
      });

      if (!resp.ok) throw new Error("Lỗi thực thi nhiệm vụ");
      const data = await resp.json();

      const deliverable = {
        taskId: task.id,
        taskTitle: task.title,
        agentId: assignedAgent.id,
        agentName: assignedAgent.name,
        agentRole: assignedAgent.role,
        deliverableTitle: data.deliverableTitle || `Báo cáo bàn giao: ${task.title}`,
        executiveNotes: data.executiveNotes,
        content: data.content,
        artifacts: data.artifacts || [],
        completedAt: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, status: "completed", deliverable }
            : t
        )
      );
    } catch (err) {
      console.error("Lỗi thực thi task:", err);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: "pending" } : t))
      );
    }
  };

  // 4. Execute All Pending Tasks in Parallel for Maximum Speed!
  const handleExecuteAllTasks = async () => {
    setIsDebating(false);

    const pendingTasks = tasks.filter((t) => t.status !== "completed");
    if (pendingTasks.length === 0) {
      // All tasks already completed, user navigated to view deliverables / live preview
      setActiveTab("preview");
      showToast("Đang mở Bản Chạy Thử Web...", "info");
      return;
    }

    // Switch to tasks tab immediately so user visually sees the parallel execution
    setActiveTab("tasks");
    setIsExecutingTasks(true);
    setActivePhase("Thực thi phân rã WBS (Xử lý song song)");

    // Run all tasks in parallel using Promise.all - 6x FASTER!
    await Promise.all(pendingTasks.map((task) => executeSingleTask(task)));

    setIsExecutingTasks(false);
    setActivePhase("Hoàn tất thực thi");
    showToast("Đã xuất xưởng 6/6 sản phẩm! Đang mở Bản Chạy Thử Web...", "success");

    // Send Telegram Notification
    notifyTelegram(
      `🚀 <b>XUẤT XƯỞNG TOÀN BỘ 6/6 SẢN PHẨM WBS!</b>\n\nBài toán: "<i>${activeMission}</i>"\n• Bản Chạy Thử Web (Live App) đã sẵn sàng!\n• Mã nguồn & tài liệu kiến trúc đã được hoàn tất.`
    );

    // Automatically transition to the Live Web Preview!
    setTimeout(() => {
      setActiveTab("preview");
    }, 600);
  };

  // 5. Final Synthesis: CEO synthesizes Master Dossier
  const handleFinalizeSynthesis = async () => {
    setIsSynthesizing(true);
    setActivePhase("CEO Tổng kết & Phê chuẩn");
    setIsDebating(false);

    try {
      const deliverables = tasks
        .filter((t) => t.deliverable)
        .map((t) => t.deliverable);

      const resp = await fetch("/api/orchestrate/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission: activeMission,
          deliverables,
          debateHighlights: debateMessages.slice(-5).map((m) => `${m.agentName}: ${m.speech}`),
        }),
      });

      if (!resp.ok) throw new Error("Lỗi tổng kết hồ sơ");
      const data = await resp.json();

      const finalReport: FinalSynthesis = {
        masterPlanTitle: data.masterPlanTitle || `Hồ sơ Chiến lược Toàn diện: ${activeMission}`,
        ceoVerdict: data.ceoVerdict || "Hội đồng AI đã hoàn tất phản biện và phê duyệt giải pháp.",
        readinessScore: data.readinessScore || 95,
        nextSteps: data.nextSteps || [],
        synthesisMarkdown: data.synthesisMarkdown || "",
        generatedAt: new Date().toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      setSynthesis(finalReport);
      setShowExecutiveReport(true);
      setActivePhase("Đã ban hành Nghị quyết");

      // Send CEO report notification to Telegram
      notifyTelegram(
        `📜 <b>NGHỊ QUYẾT TỔNG GIÁM ĐỐC (CEO):</b>\n\nBài toán: "<i>${activeMission}</i>"\n• Điểm sẵn sàng triển khai: <b>${finalReport.readinessScore}/100</b>\n• Phê chuẩn: <i>${finalReport.ceoVerdict}</i>\n\n👉 Chi tiết hồ sơ đã được lưu trữ trong hệ thống AgentCorp.`
      );
    } catch (err: any) {
      console.error("Lỗi tổng kết:", err);
      showToast("Không thể tạo báo cáo tổng kết: " + (err.message || "Vui lòng kiểm tra lại"), "error");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  // Pure Standalone Live App Experience (Chỉ kích hoạt khi có tham số ?mode=movie hoặc mode=cinema hoặc mode=standalone)
  if (isCinemaModeOnly) {
    const fallbackProj: EnterpriseProject =
      activeProject ||
      projects.find((p) => p.id === activeProjectId) ||
      projects.find((p) => p.id === "proj-apex") || {
        id: activeProjectId || "proj-apex",
        name: activeMission || "Apex Legends Pro Tracker (Esports Telemetry)",
        category: "Gaming & Esports Analytics",
        description: "Hệ thống theo dõi rank Apex Predator 120Hz, radar meta Season 23 và mô phỏng sát thương TTK vũ khí.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        tasks,
        debateMessages,
        activeMission,
      };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <ErrorBoundary fallbackTitle={`Đã bảo vệ phiên trình chiếu ${fallbackProj.name}`}>
          <ProjectLivePreview
            project={fallbackProj}
            tasks={tasks}
            onOpenCode={() => {
              setIsCinemaModeOnly(false);
              setActiveTab("tasks");
            }}
            onRequestIteration={(directive, createdTask) => {
              startUpdateDebate(directive, createdTask);
            }}
            isStandalone={true}
            onExitStandalone={() => {
              setIsCinemaModeOnly(false);
              setActiveTab("boardroom");
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("mode");
                window.history.replaceState({}, "", url.pathname);
              }
            }}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-top-3 duration-300">
          <div
            className={`p-4 rounded-xl shadow-2xl border flex items-start space-x-3 ${
              toast.type === "error"
                ? "bg-rose-950/90 border-rose-800/80 text-rose-200"
                : "bg-slate-900/90 border-cyan-800/80 text-cyan-200"
            } backdrop-blur-md`}
          >
            <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-auto"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* 1. Crystal-Clear Primary Navigation Bar with Project Switcher */}
      <MainTopNav
        currentView={currentView}
        onSelectView={handleSelectView}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        pendingProposalsCount={
          proposals.filter((p) => (!p.projectId || p.projectId === activeProjectId) && p.status === "pending").length
        }
        completedTasksCount={completedCount}
        totalTasksCount={tasks.length}
        aiSettings={aiSettings}
        onToggleTTS={() =>
          setAiSettings((prev) => ({ ...prev, ttsEnabled: !prev.ttsEnabled }))
        }
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenProjectCatalog={() => {
          setProjectModalTab("catalog");
          setShowProjectModal(true);
        }}
        onRenameProject={() => {
          setProjectModalTab("rename");
          setShowProjectModal(true);
        }}
      />

      {/* 2. Main Body Displayed According to currentView */}
      <main className={`flex-1 w-full mx-auto py-5 space-y-6 ${currentView === "web_preview" ? "max-w-[1600px] px-2 sm:px-4 lg:px-6" : "max-w-7xl px-3 sm:px-6 lg:px-8"}`}>
        {currentView === "agent_room" ? (
          <div className="space-y-6">
            {/* The Dedicated Autonomous Agent Chat & Skill Console */}
            <AgentRequestChatBox
              agents={agents}
              proposals={proposals.filter((p) => !p.projectId || p.projectId === activeProjectId)}
              onSendDirective={handleSendDirective}
              onApproveProposal={handleApproveProposal}
              onRejectProposal={handleRejectProposal}
              isProcessing={isBreakingDown}
              activeProjectName={activeProject.name}
              activeProjectId={activeProject.id}
              onSwitchSeason={(season) => {
                handleUpdateProject(activeProjectId === "proj-tft" ? "proj-tft" : activeProjectId, {
                  customSettings: { ...activeProject?.customSettings, tftSeason: season },
                  name: `TFT Meta Pro (ĐTCL Mùa ${season})`,
                });
                showToast(`Đã chuyển đổi sang ĐTCL Mùa ${season}!`, "success");
              }}
              onOpenPreview={() => handleSelectView("web_preview")}
              aiSettings={aiSettings}
              onOpenAISettings={() => setShowAISettings(true)}
              onOpenGPTBridge={() => setShowGPTBridge(true)}
              onUpdateAISettings={(updated) => setAiSettings(updated)}
            />

            {/* The AI Council War Room Boardroom */}
            <Boardroom
              agents={agents}
              messages={debateMessages}
              currentSpeakerId={currentSpeakerId}
              isDebating={isDebating}
              topic={activeMission || activeProject.name}
              ttsEnabled={aiSettings.ttsEnabled}
              onOpenExportModal={() => setShowExportModal(true)}
            />

            {/* Floating / Bottom Chairman Control Bar */}
            <ChairmanBar
              isDebating={isDebating}
              onToggleDebate={() => setIsDebating(!isDebating)}
              onNextDebateTurn={() => executeNextTurn()}
              onExecuteAllTasks={handleExecuteAllTasks}
              onFinalizeSynthesis={handleFinalizeSynthesis}
              onOpenLivePreview={() => handleSelectView("web_preview")}
              onInjectChairmanNote={(note) => {
                handleSendDirective(note);
              }}
              hasTasks={tasks.length > 0}
              hasDebateMessages={debateMessages.length > 0}
              isExecutingTasks={isExecutingTasks}
              isSynthesizing={isSynthesizing}
              taskCount={tasks.length}
              completedTaskCount={completedCount}
            />
          </div>
        ) : currentView === "tasks" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">📋 Cơ Cấu Nhiệm Vụ WBS & Nghiệm Thu — {activeProject.name}</span>
                <span className="text-slate-500 font-mono">({tasks.length} hạng mục)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectView("agent_room")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 font-bold transition-all text-xs cursor-pointer"
                >
                  🏛️ Về Web Agent
                </button>
                <button
                  onClick={() => handleSelectView("web_preview")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 font-bold transition-all text-xs cursor-pointer"
                >
                  🖥️ Xem Bản Chạy Thử
                </button>
              </div>
            </div>
            <TaskBoard
              tasks={tasks}
              agents={agents}
              onSelectTask={(task) => setSelectedTask(task)}
              onExecuteTask={(task) => executeSingleTask(task)}
              isExecutingAny={isExecutingTasks}
            />
          </div>
        ) : (
          /* Live Web Preview for activeProject (TFT, Motfilm, Apex, or any custom project) */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">🖥️ Đang mở: {activeProject.name} (Bản Chạy Thử Live)</span>
                <span className="text-slate-500 hidden sm:inline">• {activeProject.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectView("agent_room")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 font-bold transition-all text-xs cursor-pointer"
                >
                  🏛️ Về Web Agent
                </button>
                <button
                  onClick={() => handleSelectView("tasks")}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all text-xs cursor-pointer"
                >
                  📋 Xem Nhiệm Vụ ({tasks.length})
                </button>
              </div>
            </div>
            <ErrorBoundary fallbackTitle={`Đã cách ly sự cố và bảo vệ bản web ${activeProject.name}`}>
              <ProjectLivePreview
                project={activeProject}
                tasks={tasks}
                onOpenCode={() => handleSelectView("tasks")}
                onRequestIteration={(dir) => handleSendDirective(dir)}
                isStandalone={false}
                onExitStandalone={() => handleSelectView("agent_room")}
              />
            </ErrorBoundary>
          </div>
        )}
      </main>

      {/* 6. Modals */}
      {/* Deliverable Inspection Modal */}
      <DeliverableModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Corporate Org Chart Modal */}
      <OrgChartModal
        agents={agents}
        isOpen={showOrgChart}
        onClose={() => setShowOrgChart(false)}
        onUpdateAgents={(updated) => setAgents(updated)}
      />

      {/* Free AI Engine Configuration Modal */}
      <AIEngineModal
        settings={aiSettings}
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
        onSave={(updated) => setAiSettings(updated)}
        onOpenGPTBridge={() => {
          setShowAISettings(false);
          setShowGPTBridge(true);
        }}
      />

      {/* ChatGPT / Custom GPT Integration Bridge Modal */}
      <GPTBridgeModal
        isOpen={showGPTBridge}
        onClose={() => setShowGPTBridge(false)}
        activeProjectName={activeProject.name}
      />

      {/* Master Executive Dossier Modal */}
      <ExecutiveReportModal
        synthesis={synthesis}
        isOpen={showExecutiveReport}
        onClose={() => setShowExecutiveReport(false)}
      />

      {/* Telegram Remote Commander Modal */}
      <TelegramBotModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onConfigSaved={(cfg) => setTelegramConfig(cfg)}
        onSendMissionFromTelegram={(mission) => {
          setMissionInput(mission);
          handleStartMission(mission);
        }}
      />

      {/* Export Project & Git Packaging Modal */}
      <ExportProjectModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        projectName={activeProject.name}
        projectId={activeProject.id}
        tasks={tasks}
        onOpenShareModal={() => {
          setShowExportModal(false);
          setShowShareModal(true);
        }}
      />

      {/* 12-Hour Reset Passcode Share Modal */}
      <ShareProjectModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        projectId={activeProject.id}
        projectName={activeProject.name}
      />

      {/* Split Screen & Pop-out Links Modal */}
      <SplitScreenLinksModal
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        projectName={activeProject.name}
      />

      {/* Solution Inheritance Vault Modal */}
      <BlueprintVaultModal
        isOpen={showBlueprintModal}
        onClose={() => setShowBlueprintModal(false)}
        blueprints={blueprints}
        currentProject={activeProject}
        onInheritBlueprint={handleInheritBlueprint}
      />

      {/* Multi-Project Manager & Catalog Modal */}
      <ProjectManagerModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        initialTab={projectModalTab}
      />
    </div>
  );
}
