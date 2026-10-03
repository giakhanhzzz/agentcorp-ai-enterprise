// Smart project name suggestions and generator for AgentCorp

export interface NameSuggestion {
  name: string;
  tagline: string;
}

const CATEGORY_NAMES: Record<string, NameSuggestion[]> = {
  "Media & Streaming": [
    { name: "Motfilm Pro 4K", tagline: "Rạp chiếu phim trực tuyến tốc độ cao HLS 60FPS" },
    { name: "CineVibe Max", tagline: "Nền tảng OTT chiếu phim điện ảnh bom tấn" },
    { name: "VieStream OTT", tagline: "Cổng phát video theo yêu cầu chuẩn rạp" },
    { name: "StreamForge 60FPS", tagline: "Mạng phân phối video chống giật lag & bảo mật cao" },
    { name: "NovaPlay Prime", tagline: "Hệ sinh thái giải trí phim ảnh & truyền hình" },
    { name: "FlixMaster Cloud", tagline: "Trải nghiệm rạp chiếu phim tại gia không quảng cáo" },
  ],
  "SaaS AI & B2B": [
    { name: "OmniAgent AI", tagline: "Bộ máy điều hành tác nhân tự động cho doanh nghiệp" },
    { name: "HyperScale 30D", tagline: "Nền tảng phát triển & kiểm thử SaaS thần tốc" },
    { name: "CogniFlow Enterprise", tagline: "Luồng công việc tự động hoá bằng trí tuệ nhân tạo" },
    { name: "Synthetix Work", tagline: "Không gian làm việc hợp nhất hỗ trợ quyết định kinh doanh" },
    { name: "ApexIntelligence", tagline: "Giải pháp phân tích dữ liệu & dự báo chiến lược" },
    { name: "VibeCode Studio", tagline: "Nền tảng tạo lập phần mềm bằng ngôn ngữ tự nhiên" },
  ],
  "E-Commerce & Bán Lẻ": [
    { name: "ShopVibe Direct", tagline: "Nền tảng bán lẻ đa kênh tối ưu tỷ lệ chốt đơn" },
    { name: "GrowthMart Plus", tagline: "Hệ thống thương mại điện tử tăng trưởng doanh số x2" },
    { name: "OmniCart Express", tagline: "Trải nghiệm mua sắm mượt mà không bỏ quên giỏ hàng" },
    { name: "TrendPulse Commerce", tagline: "Nền tảng săn deal và phân tích xu hướng mua sắm" },
    { name: "ZenithRetail Cloud", tagline: "Quản lý tồn kho & đơn hàng thời gian thực" },
  ],
  "CRM & CSKH Swarm": [
    { name: "SwarmSupport AI", tagline: "Hệ thống hỗ trợ khách hàng tự động đa kênh 24/7" },
    { name: "ResolveDesk CRM", tagline: "Tổng đài xử lý khiếu nại & ticket thông minh" },
    { name: "EchoAgent Swarm", tagline: "Biệt đội tác nhân tư vấn bán hàng & chăm sóc khách hàng" },
    { name: "CarePulse Omnichannel", tagline: "Kết nối Zalo, Messenger, Telegram và Web Chat" },
    { name: "OmniHelp Desk", tagline: "Cơ sở tri thức RAG tra cứu tức thì cho CSKH" },
  ],
  "An Ninh Mạng & Hạ Tầng": [
    { name: "CyberShield 50K", tagline: "Tường lửa phòng thủ DDoS và chịu tải 50.000 QPS" },
    { name: "SentinelCore IPS", tagline: "Hệ thống phát hiện xâm nhập & quét lỗ hổng OWASP" },
    { name: "ZeroLeak Guard", tagline: "Giải pháp bảo vệ bản quyền link stream & chống cào dữ liệu" },
    { name: "FortressDefense Cloud", tagline: "Bảo vệ máy chủ Linux, Nginx & chặn rò rỉ secret" },
    { name: "RedTeam Sentinel", tagline: "Tự động giả lập tấn công pentest & kiểm định bảo mật" },
  ],
  "FinTech & Thanh Toán": [
    { name: "VibePay Gateway", tagline: "Cổng thanh toán điện tử an toàn chuẩn PCI-DSS" },
    { name: "NovaLedger Vault", tagline: "Hệ thống đối soát doanh thu & hóa đơn tự động" },
    { name: "TrustFlow Wallet", tagline: "Ví điện tử & quản lý dòng tiền doanh nghiệp" },
    { name: "AlphaCredit Engine", tagline: "Chấm điểm tín dụng & đánh giá rủi ro tài chính" },
  ],
  "Khác / Nội Bộ": [
    { name: "NexusWorkspace", tagline: "Không gian làm việc số và số hóa quy trình nội bộ" },
    { name: "CoreSync Platform", tagline: "Nền tảng đồng bộ dữ liệu doanh nghiệp" },
    { name: "AuraProject Cloud", tagline: "Quản trị dự án & cộng tác đa phòng ban" },
  ],
};

const PREFIXES = ["Nova", "Apex", "Omni", "Vibe", "Hyper", "Next", "Zenith", "Pulse", "Cyber", "Aura", "Nexus", "Synthe", "Echo"];
const ROOTS = ["Stream", "Flow", "Core", "Scale", "Desk", "Mart", "Forge", "Shield", "Pulse", "Hub", "Lab", "Stack", "Sync", "Link"];
const SUFFIXES = ["Pro", "4K", "AI", "Cloud", "Prime", "Max", "Plus", "Enterprise", "360", "Studio", "Ultra"];

/**
 * Returns preset names by category
 */
export function getSuggestionsByCategory(category: string): NameSuggestion[] {
  return CATEGORY_NAMES[category] || CATEGORY_NAMES["Media & Streaming"];
}

/**
 * Generates a completely new creative project name
 */
export function generateRandomProjectName(category?: string): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];

  if (category?.includes("Streaming") || category?.includes("Media")) {
    const streamRoots = ["Stream", "Play", "Flix", "Film", "Cine", "Vibe"];
    const r = streamRoots[Math.floor(Math.random() * streamRoots.length)];
    return `${prefix}${r} ${suffix}`;
  }

  if (category?.includes("SaaS") || category?.includes("AI")) {
    const aiRoots = ["Agent", "Flow", "Logic", "Cogni", "Scale", "Core"];
    const r = aiRoots[Math.floor(Math.random() * aiRoots.length)];
    return `${prefix}${r} ${suffix}`;
  }

  if (category?.includes("Commerce") || category?.includes("Bán Lẻ")) {
    const shopRoots = ["Shop", "Mart", "Cart", "Deal", "Market", "Mall"];
    const r = shopRoots[Math.floor(Math.random() * shopRoots.length)];
    return `${prefix}${r} ${suffix}`;
  }

  return `${prefix}${root} ${suffix}`;
}
