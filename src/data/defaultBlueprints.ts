import { ArchitectureBlueprint } from "../types";

export const DEFAULT_BLUEPRINTS: ArchitectureBlueprint[] = [
  {
    id: "bp-hls-streaming",
    title: "Trình Phát HLS 60FPS Zero-Bloat & Proxy Chống Leech m3u8",
    sourceProjectName: "Motfilm Pro 4K (Streaming OTT)",
    category: "Media & Streaming",
    tags: ["HLS Stream", "Anti-Leech", "KKPhim Cloud", "Zero-Bloat", "60FPS"],
    description:
      "Giải pháp phát video trực tuyến tốc độ cao với bộ đệm siêu mỏng 0.25s, chặn đứng trộm link stream m3u8 và tự động chuyển server dự phòng khi gặp sự cố mạng.",
    achievements: [
      "Bộ đệm HLS adaptive bitrate 1080p/4K 60FPS mượt mà trên cả mạng yếu",
      "Module Reverse Proxy bảo vệ link video gốc, chống crawl & leech băng thông",
      "Trình kết nối KKPhim API Cloud đồng bộ 30,000+ tựa phim tự động",
      "Tiêu chuẩn Zero-Bloat: Không thư viện thừa, DOM nhẹ hơn 70% so với web đối thủ",
    ],
    recommendedFor: "Các dự án web phim, anime, video portal, nền tảng khóa học trực tuyến",
    taskData: {
      title: "Tích hợp Kiến trúc HLS Player 60FPS & Lá chắn Chống Leech",
      department: "Engineering & Streaming",
      assignedAgentId: "architect",
      description: "Kế thừa toàn bộ module phát video HLS và proxy bảo vệ luồng từ dự án Motfilm Pro.",
      deliverableTitle: "Gói Kế Thừa: HLS Streaming Engine & Security Proxy",
      artifacts: [
        {
          name: "streamingEngine.ts",
          type: "code",
          data: `// Reusable HLS 60FPS Player Engine with Anti-Leech Buffer
export class StreamingEngine {
  private bufferTarget = 0.25; // 250ms zero-lag buffer
  setupPlayer(videoElement: HTMLVideoElement, m3u8Url: string) {
    console.log('[StreamingEngine] Initialized Zero-Bloat player with proxy link:', m3u8Url);
  }
}`,
        },
        {
          name: "nginx-stream-proxy.conf",
          type: "config",
          data: `# Nginx Anti-Leech Proxy Config
location /api/proxy/stream {
  proxy_pass https://v7.kkphimplayer7.com;
  proxy_set_header Referer "https://motfilm.local";
  add_header Cache-Control "no-cache, no-store";
}`,
        },
      ],
    },
  },
  {
    id: "bp-saas-apigateway",
    title: "Cổng Quản Trị API Key & Đồng Bộ Doanh Thu Stripe Token",
    sourceProjectName: "HyperScale 30D (SaaS AI B2B)",
    category: "SaaS AI & B2B",
    tags: ["API Gateway", "Stripe Webhook", "Rate Limit", "Multi-Tenant", "Token Billing"],
    description:
      "Kiến trúc microservices chuyên dụng cho các sản phẩm SaaS B2B: quản lý API Key mã hóa, giới hạn tần suất 10,000 RPM và tự động tính cước doanh thu theo token.",
    achievements: [
      "Phát hành Bearer API Key mã hóa an toàn, phân quyền granular theo từng dự án",
      "Cơ chế Rate Limiter phân tầng chống spam và quá tải máy chủ",
      "Stripe Webhook đồng bộ cước phí gói Starter / Growth / Enterprise tự động",
      "Mô hình Multi-Tenant phân lập dữ liệu khách hàng tuyệt đối",
    ],
    recommendedFor: "Mọi dự án SaaS B2B, Developer Portal, API Gateway, nền tảng Subscription",
    taskData: {
      title: "Triển khai Bộ Khung SaaS API Gateway & Hệ Thống Billing",
      department: "Backend & Strategy",
      assignedAgentId: "architect",
      description: "Kế thừa bộ quản lý API Key và cổng cước phí subscription từ HyperScale 30D.",
      deliverableTitle: "Gói Kế Thừa: SaaS API Gateway & Stripe Token Billing",
      artifacts: [
        {
          name: "apiKeyManager.ts",
          type: "code",
          data: `// SaaS API Key Validator & Rate Limiter
export function validateApiKey(headerKey: string): boolean {
  return headerKey.startsWith('sk-live_') || headerKey.startsWith('sk-test_');
}`,
        },
        {
          name: "stripeWebhookHandler.ts",
          type: "code",
          data: `// Stripe Webhook Event Dispatcher for Subscription Renewals
export async function handleStripeWebhook(event: any) {
  if (event.type === 'invoice.paid') {
    // Renew user token balance
  }
}`,
        },
      ],
    },
  },
  {
    id: "bp-cskh-swarm",
    title: "Tổng Đài Tác Nhân CSKH Tự Động Hóa 84% Với RAG Tri Thức",
    sourceProjectName: "SwarmSupport AI",
    category: "CRM & CSKH Swarm",
    tags: ["Swarm AI", "Customer Care", "RAG Vector", "Auto Triage", "CSAT 4.9"],
    description:
      "Hệ thống điều phối đội ngũ tác nhân AI tiếp nhận và giải quyết yêu cầu hỗ trợ khách hàng đa kênh tự động trong vòng 1.8 giây, tích hợp RAG tra cứu chính sách chuẩn xác.",
    achievements: [
      "Tự động phân loại ticket và trả lời ngay trong 1.8 giây, giảm 75% tải nhân sự",
      "Tra cứu vector tri thức nội bộ không gây bịa đặt thông tin (Anti-Hallucination)",
      "Tự động phát hiện khiếu nại gay gắt để chuyển tiếp chuyên viên cấp cao",
      "Bộ đo lường chỉ số CSAT và nhật ký chăm sóc khách hàng tự động",
    ],
    recommendedFor: "Các sàn thương mại điện tử, dịch vụ đặt vé, CRM chăm sóc khách hàng đa kênh",
    taskData: {
      title: "Tích hợp Đội Ngũ Tác Nhân CSKH Swarm & Bộ Tri Thức RAG",
      department: "Customer Experience & AI",
      assignedAgentId: "cpo",
      description: "Kế thừa engine tự động hóa chăm sóc khách hàng và phản hồi siêu tốc từ SwarmSupport.",
      deliverableTitle: "Gói Kế Thừa: Omnichannel CSKH Swarm Support System",
      artifacts: [
        {
          name: "swarmTriage.ts",
          type: "code",
          data: `// Multi-Agent Triage Router
export function routeCustomerTicket(ticketText: string) {
  return { priority: 'normal', targetAgent: 'SupportBot', resolvedInSec: 1.8 };
}`,
        },
      ],
    },
  },
  {
    id: "bp-cyber-ddos",
    title: "Lá Chắn Phòng Thủ 50,000 QPS & Redis Token Bucket",
    sourceProjectName: "CyberDefense AI",
    category: "Bảo Mật & An Ninh Mạng",
    tags: ["Anti-DDoS", "Redis Sentinel", "Security Hardening", "OWASP", "50k QPS"],
    description:
      "Tường lửa bảo vệ ứng dụng trước các đợt càn quét botnet, brute force mật khẩu và tấn công từ chối dịch vụ phân tán (DDoS L7).",
    achievements: [
      "Thuật toán Token Bucket giới hạn lưu lượng truy cập trên từng dải IP",
      "Tự động gắn cờ và cách ly địa chỉ IP độc hại trong 50ms",
      "Chặn đứng toàn bộ nỗ lực đọc lậu file .env, .git và SQL Injection",
    ],
    recommendedFor: "Mọi website, API hoặc sàn giao dịch cần độ sẵn sàng cao trước tin tặc",
    taskData: {
      title: "Kích hoạt Lá Chắn Bảo Mật Anti-DDoS 50K QPS",
      department: "Security & DevSecOps",
      assignedAgentId: "architect",
      description: "Kế thừa bộ quy tắc bảo mật Nginx, CSP headers và giới hạn lưu lượng Redis Token Bucket.",
      deliverableTitle: "Gói Kế Thừa: Enterprise Cyber Defense Shield",
      artifacts: [
        {
          name: "securityMiddleware.ts",
          type: "code",
          data: `// High-QPS Token Bucket Defense
export function inspectSecurityThreats(req: any) {
  return { isSafe: true, latencyMs: 2 };
}`,
        },
      ],
    },
  },
  {
    id: "bp-argent-deploy",
    title: "Thoát Ly Google Cloud IAP & Triển Khai Độc Lập Vercel (Argent Protocol)",
    sourceProjectName: "Motfilm Pro 4K (Streaming OTT)",
    category: "Cloud Infra & Security Bypass",
    tags: ["IAP Bypass", "Vercel Deploy", "Cloudflare CDN", "Zero-Google Auth", "Argent Tool"],
    description:
      "Giải phóng ứng dụng khỏi rào cản Identity-Aware Proxy của Google Studio, đưa web ra Vercel/Cloudflare Pages để bất kỳ ai trên điện thoại hay Tab Ẩn Danh đều xem được ngay mà không cần tài khoản Google.",
    achievements: [
      "Bypass 100% rào cản Google Cloud IAP redirect khi duyệt web ở chế độ ẩn danh",
      "Cấu hình vercel.json và vite.config.ts chuẩn production không lỗi build",
      "Xuất gói Standalone HTML 0-Server và file .ZIP đầy đủ mã nguồn sạch",
      "Thiết lập DMCA Disclaimer chuẩn quốc tế, bảo vệ an toàn pháp lý bản quyền",
    ],
    recommendedFor: "Các sản phẩm cần chia sẻ link công khai cho bạn bè, khách hàng hoặc công chúng mà không yêu cầu tài khoản Google",
    taskData: {
      title: "Triển Khai Độc Lập Thoát Ly Google Cloud IAP",
      department: "Cyber Security & Deep QA (Argent Protocol)",
      assignedAgentId: "security_hacker",
      description: "Thực thi cấu hình deploy Vercel và xuất bản mã nguồn độc lập bypass Google IAP.",
      deliverableTitle: "Gói Kế Thừa: Argent IAP Bypass & Independent Web Deploy",
      artifacts: [
        {
          name: "vercel.json",
          type: "config",
          data: `{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`,
        },
        {
          name: "argentDeployGuide.md",
          type: "markdown",
          data: `# Hướng Dẫn Triển Khai Độc Lập 1-Click
1. Tải file ZIP từ mục Đóng Gói & Xuất Bản của Tác Nhân Argent.
2. Mở Vercel.com > Add New Project > Kéo thả thư mục vừa giải nén.
3. Bấm Deploy > Nhận link độc lập https://motfilm-pro.vercel.app hoạt động 24/7!`,
        },
      ],
    },
  },
];
