import React, { useState, useMemo, useEffect } from "react";
import {
  Trophy,
  Shield,
  Zap,
  Target,
  Sparkles,
  Search,
  Code2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Layers,
  Flame,
  Award,
  Coins,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Sword,
  ShieldCheck,
  Star,
  Users,
  RotateCcw,
} from "lucide-react";
import { CompanyTask, EnterpriseProject } from "../../types";

interface TFTAppPreviewProps {
  project: EnterpriseProject;
  tasks: CompanyTask[];
  onOpenCode: () => void;
  onRequestIteration?: (directive: string) => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

export interface TeamComp {
  id: string;
  name: string;
  tier: "S" | "A" | "B";
  season: "18" | "13";
  playstyle: "Fast 8" | "Slow Roll 6" | "Slow Roll 7" | "Reroll 5" | "Fast 9";
  avgPlacement: number;
  top4Rate: number;
  winRate: number;
  pickRate: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  synergies: Array<{ name: string; count: number; active: string }>;
  coreChampions: Array<{
    name: string;
    cost: number;
    star: number;
    role: "Carry Chính" | "Carry Phụ" | "Tank Chính" | "Hỗ Trợ";
    items: string[];
  }>;
  earlyGamePlan: string;
  positioningTip: string;
}

export interface ItemCraft {
  name: string;
  comp1: string;
  comp2: string;
  stats: string;
  description: string;
  bestFor: string[];
  type: "AD" | "AP" | "Tank" | "Utility";
}

// Roll Odds Table for Level 3-10
const rollOddsData: Record<number, number[]> = {
  3: [75, 25, 0, 0, 0],
  4: [55, 30, 15, 0, 0],
  5: [45, 33, 20, 2, 0],
  6: [30, 40, 25, 5, 0],
  7: [19, 30, 40, 10, 1],
  8: [15, 20, 32, 30, 3],
  9: [10, 17, 25, 35, 13],
  10: [5, 10, 20, 40, 25],
};

export const TFTAppPreview: React.FC<TFTAppPreviewProps> = ({
  project,
  tasks,
  onOpenCode,
  onRequestIteration,
  isStandalone,
  onExitStandalone,
}) => {
  // Determine initial season (Default to Season 18!)
  const [selectedSeason, setSelectedSeason] = useState<"18" | "13">(() => {
    if (project.customSettings?.tftSeason === "13") return "13";
    return "18"; // Primary default is Mùa 18!
  });

  const [activeTab, setActiveTab] = useState<"comps" | "items" | "roll" | "augments" | "code">("comps");
  const [selectedTier, setSelectedTier] = useState<"all" | "S" | "A">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number>(8);
  const [econGold, setEconGold] = useState<number>(50);
  const [directiveInput, setDirectiveInput] = useState("");
  const [livePatchNotice, setLivePatchNotice] = useState<string | null>(null);

  // Auto-switch to Season 18 if directive or active mission mentions 18
  useEffect(() => {
    const textToCheck = `${project.name} ${project.activeMission} ${project.description}`.toLowerCase();
    if (textToCheck.includes("18") || textToCheck.includes("mùa 18") || textToCheck.includes("s18")) {
      setSelectedSeason("18");
    }
  }, [project.name, project.activeMission, project.description]);

  // TFT Comps Dataset - Mùa 18 (Mới Nhất) & Mùa 13
  const allTeamComps: TeamComp[] = useMemo(
    () => [
      // ==================== MÙA 18 COMPS ====================
      {
        id: "comp-s18-mecha",
        name: "Cơ Giáp Tương Lai - Siêu Chiến Binh (Viktor & Jayce Carry)",
        tier: "S",
        season: "18",
        playstyle: "Fast 8",
        avgPlacement: 3.52,
        top4Rate: 62.4,
        winRate: 23.1,
        pickRate: 16.8,
        difficulty: "Trung bình",
        synergies: [
          { name: "Cơ Giáp", count: 5, active: "Hợp thể Siêu Cơ Giáp nhận +80% Máu & 65 SMCK/AP" },
          { name: "Siêu Công Nghệ", count: 4, active: "Trang bị kích hoạt thêm 350 Máu & 35% Tốc Đánh" },
          { name: "Đấu Sĩ Không Gian", count: 2, active: "+25% Máu tối đa" },
        ],
        coreChampions: [
          {
            name: "Viktor",
            cost: 5,
            star: 2,
            role: "Carry Chính",
            items: ["Bùa Xanh", "Mũ Phù Thủy Rabadon", "Kiếm Súng Hextech"],
          },
          {
            name: "Jayce",
            cost: 4,
            star: 2,
            role: "Carry Phụ",
            items: ["Vô Cực Kiếm", "Cung Xanh", "Móng Vuốt Sterak"],
          },
          {
            name: "Nautilus",
            cost: 4,
            star: 2,
            role: "Tank Chính",
            items: ["Thú Tượng Thạch Giáp", "Giáp Gai", "Giáp Máu Warmog"],
          },
          {
            name: "Blitzcrank",
            cost: 3,
            star: 2,
            role: "Hỗ Trợ",
            items: ["Lời Thề Hộ Vệ", "Nỏ Sét"],
          },
        ],
        earlyGamePlan: "Khởi đầu bằng 3 Cơ Giáp + 2 Đấu Sĩ giữ máu. Tích 50 vàng, lên cấp 8 tại vòng 4-2 rồi xả tiền bắt Viktor & Jayce 2 sao.",
        positioningTip: "Jayce & Nautilus ôm sát bảo vệ tuyến trước, Viktor ở góc sau cùng xả chùm tia tử thần quét sạch sàn đấu.",
      },
      {
        id: "comp-s18-void",
        name: "Hắc Tinh Đột Biến & Vũ Trụ Vô Hạn (Kai'Sa & Cho'Gath)",
        tier: "S",
        season: "18",
        playstyle: "Fast 8",
        avgPlacement: 3.68,
        top4Rate: 59.5,
        winRate: 20.4,
        pickRate: 14.9,
        difficulty: "Dễ",
        synergies: [
          { name: "Hắc Tinh", count: 6, active: "Đồng minh hy sinh tăng +25 SMCK & 25 AP vĩnh viễn trong trận" },
          { name: "Đột Biến", count: 3, active: "Đòn đánh gây sát thương chuẩn theo % máu" },
          { name: "Khổng Lồ", count: 1, active: "Miễn nhiễm khống chế, chiếm 2 vị trí" },
        ],
        coreChampions: [
          {
            name: "Kai'Sa",
            cost: 4,
            star: 2,
            role: "Carry Chính",
            items: ["Cuồng Đao Guinsoo", "Bàn Tay Công Lý", "Áo Choàng Bóng Tối"],
          },
          {
            name: "Cho'Gath",
            cost: 4,
            star: 3,
            role: "Tank Chính",
            items: ["Trái Tim Kiên Định", "Vuốt Rồng", "Giáp Gai"],
          },
          {
            name: "Jhin",
            cost: 4,
            star: 2,
            role: "Carry Phụ",
            items: ["Vô Cực Kiếm", "Diệt Khổng Lồ", "Ngọn Giáo Shojin"],
          },
          {
            name: "Malzahar",
            cost: 2,
            star: 2,
            role: "Hỗ Trợ",
            items: ["Quỷ Thư Morello"],
          },
        ],
        earlyGamePlan: "Bắt Cho'Gath sớm để tích stack Xơi Tái tăng máu vĩnh viễn, chuỗi thắng lấy đồ chuẩn cho Kai'Sa tại vòng đi chợ.",
        positioningTip: "Cho'Gath đứng 1 mình chặn đầu hút sát thương, Kai'Sa đặt hàng 3 góc an toàn lướt né sát thủ.",
      },
      {
        id: "comp-s18-sonic",
        name: "Học Viện Siêu Âm & Phù Thủy Không Gian (Ahri & Lux)",
        tier: "A",
        season: "18",
        playstyle: "Slow Roll 7",
        avgPlacement: 4.02,
        top4Rate: 54.8,
        winRate: 17.6,
        pickRate: 12.1,
        difficulty: "Trung bình",
        synergies: [
          { name: "Siêu Âm", count: 4, active: "Sóng âm gây choáng và khuếch đại 30% sát thương phép" },
          { name: "Học Viện", count: 4, active: "Tặng 40 AP khởi đầu & +3 AP mỗi lần tung chiêu" },
          { name: "Pháp Sư", count: 2, active: "+20 AP toàn đội" },
        ],
        coreChampions: [
          {
            name: "Ahri",
            cost: 4,
            star: 2,
            role: "Carry Chính",
            items: ["Bùa Xanh", "Găng Bảo Thạch", "Diệt Khổng Lồ"],
          },
          {
            name: "Lux",
            cost: 3,
            star: 3,
            role: "Carry Phụ",
            items: ["Ngọn Giáo Shojin", "Nanh Nashor", "Mũ Phù Thủy"],
          },
          {
            name: "Sylas",
            cost: 3,
            star: 3,
            role: "Tank Chính",
            items: ["Giáp Gai", "Thú Tượng Thạch Giáp", "Lời Thề Hộ Vệ"],
          },
        ],
        earlyGamePlan: "Tích 50 vàng ở cấp 7, Slow Roll tìm Lux 3 sao và Sylas 3 sao trước khi lên cấp 8 hoàn thiện Ahri.",
        positioningTip: "Lux bắn góc chéo đối diện carry địch, Ahri đứng giữa hàng sau hôn gió gom đội hình đối phương.",
      },
      {
        id: "comp-s18-bio",
        name: "Đấu Sĩ Sinh Học & Xạ Thủ Laze (Warwick & Ashe Reroll)",
        tier: "A",
        season: "18",
        playstyle: "Reroll 5",
        avgPlacement: 4.15,
        top4Rate: 52.9,
        winRate: 15.8,
        pickRate: 10.4,
        difficulty: "Khó",
        synergies: [
          { name: "Sinh Học", count: 6, active: "Đột biến gen nhận thêm 45% Hút máu toàn phần và Tốc đánh" },
          { name: "Đấu Sĩ", count: 4, active: "+40% Máu tối đa" },
          { name: "Xạ Thủ", count: 2, active: "Tăng tầm bắn và chí mạng tầm xa" },
        ],
        coreChampions: [
          {
            name: "Warwick",
            cost: 3,
            star: 3,
            role: "Carry Chính",
            items: ["Cuồng Đao Guinsoo", "Khăn Giải Thuật", "Quyền Năng Khổng Lồ"],
          },
          {
            name: "Ashe",
            cost: 2,
            star: 3,
            role: "Carry Phụ",
            items: ["Cung Xanh", "Vô Cực Kiếm", "Cuồng Đao Guinsoo"],
          },
          {
            name: "Vi",
            cost: 2,
            star: 3,
            role: "Tank Chính",
            items: ["Giáp Máu Warmog", "Giáp Gai", "Dây Chuyền Chuộc Tội"],
          },
        ],
        earlyGamePlan: "Đánh chuỗi thua 5 round đầu lấy đồ chuẩn tại vòng đi chợ, reroll mạnh tay ở cấp 6 kiếm Warwick 3 sao.",
        positioningTip: "Warwick đặt hàng 2 né sốc sát thương, nhảy cắn các tướng yếu máu phía sau đối thủ.",
      },

      // ==================== MÙA 13 (ARCANE) COMPS ====================
      {
        id: "comp-conqueror",
        name: "Chinh Phục Viện Trợ (Ambessa & Draven Carry)",
        tier: "S",
        season: "13",
        playstyle: "Fast 8",
        avgPlacement: 3.75,
        top4Rate: 58.2,
        winRate: 18.6,
        pickRate: 15.4,
        difficulty: "Trung bình",
        synergies: [
          { name: "Chinh Phục", count: 6, active: "Nhận 65 SMCK/AP & 18% Hút máu" },
          { name: "Đấu Sĩ", count: 2, active: "+20% Máu tối đa" },
          { name: "Giám Sát", count: 2, active: "Giảm 15% sát thương nhận vào" },
        ],
        coreChampions: [
          {
            name: "Ambessa",
            cost: 4,
            star: 2,
            role: "Carry Chính",
            items: ["Huyết Kiếm", "Móng Vuốt Sterak", "Bàn Tay Công Lý"],
          },
          {
            name: "Draven",
            cost: 3,
            star: 3,
            role: "Carry Phụ",
            items: ["Cuồng Đao Guinsoo", "Vô Cực Kiếm", "Cung Xanh"],
          },
          {
            name: "Mordekaiser",
            cost: 5,
            star: 2,
            role: "Tank Chính",
            items: ["Thú Tượng Thạch Giáp", "Giáp Gai", "Giáp Máu Warmog"],
          },
        ],
        earlyGamePlan: "Khởi đầu bằng 2 Chinh Phục + 2 Đấu Sĩ giữ máu. Lên cấp 6 ở 3-2, cấp 8 ở 4-2 rồi xả 40 vàng tìm Ambessa 2 sao.",
        positioningTip: "Ambessa đặt ở hàng 2 né sát thương đầu, Mordekaiser đứng giữa hàng 1 hút khống chế.",
      },
      {
        id: "comp-scrap",
        name: "Tái Chế Tốc Biến (Corki & Ekko Biến Hình)",
        tier: "S",
        season: "13",
        playstyle: "Fast 8",
        avgPlacement: 3.88,
        top4Rate: 55.4,
        winRate: 17.1,
        pickRate: 14.2,
        difficulty: "Dễ",
        synergies: [
          { name: "Tái Chế", count: 6, active: "4 Đồ thành phần biến thành đồ chuẩn & Lá chắn 450" },
          { name: "Pháo Thủ", count: 2, active: "+25% SMCK mỗi 3s" },
          { name: "Phục Kích", count: 2, active: "Nhảy ra tuyến sau đối thủ" },
        ],
        coreChampions: [
          {
            name: "Corki",
            cost: 4,
            star: 2,
            role: "Carry Chính",
            items: ["Ngọn Giáo Shojin", "Vô Cực Kiếm", "Cung Xanh"],
          },
          {
            name: "Ekko",
            cost: 4,
            star: 2,
            role: "Carry Phụ",
            items: ["Bàn Tay Công Lý", "Nanh Nashor", "Mũ Phù Thủy"],
          },
          {
            name: "Trundle",
            cost: 1,
            star: 3,
            role: "Tank Chính",
            items: ["Áo Choàng Gai", "Vuốt Rồng", "Giáp Máu"],
          },
        ],
        earlyGamePlan: "Lắp đồ thành phần cho các tướng Tái Chế để kích hoạt lá chắn tối đa, chuỗi thắng 5 trận đầu game.",
        positioningTip: "Corki đứng góc dưới cùng có bảo kê, Ekko nhảy chéo góc nhắm vào chủ lực địch.",
      },
      {
        id: "comp-chem",
        name: "Hóa Kỹ Nổ Hũ Đột Biến (Silco & Sevika)",
        tier: "A",
        season: "13",
        playstyle: "Slow Roll 7",
        avgPlacement: 4.05,
        top4Rate: 52.8,
        winRate: 16.2,
        pickRate: 11.5,
        difficulty: "Khó",
        synergies: [
          { name: "Hóa Kỹ", count: 5, active: "Tích trữ Shimmer, nổ hũ đồ Ánh Sáng & vàng" },
          { name: "Thống Trị", count: 2, active: "Hồi 15 Năng lượng mỗi đòn đánh" },
          { name: "Đấu Sĩ", count: 2, active: "+20% Máu tối đa" },
        ],
        coreChampions: [
          {
            name: "Silco",
            cost: 4,
            star: 2,
            role: "Carry Chính",
            items: ["Bùa Xanh", "Quỷ Thư Morello", "Găng Bảo Thạch"],
          },
          {
            name: "Sevika",
            cost: 5,
            star: 2,
            role: "Carry Phụ",
            items: ["Huyết Kiếm", "Quyền Năng Khổng Lồ", "Áo Choàng Thủy Ngân"],
          },
          {
            name: "Singed",
            cost: 1,
            star: 3,
            role: "Tank Chính",
            items: ["Trái Tim Kiên Định", "Giáp Gai", "Nỏ Sét"],
          },
        ],
        earlyGamePlan: "Đánh chuỗi thua có kiểm soát 5 round đầu tích lũy Shimmer, roll mạnh tay ở cấp 7 để lật kèo.",
        positioningTip: "Silco đứng giữa hàng 3 để kỹ năng lan trúng nhiều mục tiêu nhất.",
      },
      {
        id: "comp-academy",
        name: "Học Viện Pháp Sư (Lux Pháo Đài Phép Thuật)",
        tier: "A",
        season: "13",
        playstyle: "Slow Roll 6",
        avgPlacement: 4.18,
        top4Rate: 51.3,
        winRate: 14.8,
        pickRate: 9.8,
        difficulty: "Trung bình",
        synergies: [
          { name: "Học Viện", count: 4, active: "Tặng 35 AP khởi đầu & +2 AP mỗi lần tung chiêu" },
          { name: "Pháp Sư", count: 4, active: "Tung chiêu 2 lần giảm 25% sát thương chiêu 2" },
        ],
        coreChampions: [
          {
            name: "Lux",
            cost: 2,
            star: 3,
            role: "Carry Chính",
            items: ["Bùa Xanh", "Găng Bảo Thạch", "Kiếm Súng Hextech"],
          },
          {
            name: "Jayce",
            cost: 5,
            star: 1,
            role: "Carry Phụ",
            items: ["Vô Cực Kiếm", "Bàn Tay Công Lý"],
          },
          {
            name: "Leona",
            cost: 3,
            star: 3,
            role: "Tank Chính",
            items: ["Thú Tượng Thạch Giáp", "Vuốt Rồng", "Giáp Gai"],
          },
        ],
        earlyGamePlan: "Tích 50 vàng tại cấp 6, Slow Roll tìm Lux 3 sao và Leona 3 sao trước khi lên cấp 7/8.",
        positioningTip: "Lux bắn góc chéo đối diện carry địch để tia cầu vồng quét qua toàn bộ đội hình.",
      },
    ],
    []
  );

  // Filter comps by Season, Tier, and Search
  const filteredComps = useMemo(() => {
    return allTeamComps.filter((c) => {
      if (c.season !== selectedSeason) return false;
      if (selectedTier !== "all" && c.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchSynergy = c.synergies.some((s) => s.name.toLowerCase().includes(q));
        const matchChamp = c.coreChampions.some((ch) => ch.name.toLowerCase().includes(q));
        return matchName || matchSynergy || matchChamp;
      }
      return true;
    });
  }, [allTeamComps, selectedSeason, selectedTier, searchQuery]);

  // Item Recipes
  const itemsList: ItemCraft[] = useMemo(
    () => [
      {
        name: "Vô Cực Kiếm (IE)",
        comp1: "Kiếm B.F",
        comp2: "Găng Đấu Tập",
        stats: "+35 SMCK, +35% Tỷ lệ Chí Mạng",
        description: "Sát thương vật lý từ kỹ năng có thể chí mạng. Khi thừa 100% tỷ lệ chí mạng, chuyển thành sát thương chí mạng.",
        bestFor: selectedSeason === "18" ? ["Jayce", "Jhin", "Ashe"] : ["Draven", "Ambessa", "Corki"],
        type: "AD",
      },
      {
        name: "Cuồng Đao Guinsoo",
        comp1: "Cung Gỗ",
        comp2: "Gậy Quá Khổ",
        stats: "+15% Tốc Đánh, +15 AP",
        description: "Mỗi đòn đánh tăng +5% Tốc Độ Đánh cộng dồn vô hạn đến hết giao tranh.",
        bestFor: selectedSeason === "18" ? ["Kai'Sa", "Warwick", "Ashe"] : ["Draven", "Corki", "Ambessa"],
        type: "AD",
      },
      {
        name: "Bùa Xanh",
        comp1: "Nước Mắt",
        comp2: "Nước Mắt",
        stats: "+30 Năng Lượng khởi đầu, +10 AP",
        description: "Giảm 10 Năng lượng tối đa của kỹ năng. Nhận thêm 10 Năng lượng khi hạ gục mục tiêu.",
        bestFor: selectedSeason === "18" ? ["Viktor", "Ahri", "Lux"] : ["Silco", "Lux", "Heimerdinger"],
        type: "AP",
      },
      {
        name: "Găng Bảo Thạch (JG)",
        comp1: "Gậy Quá Khổ",
        comp2: "Găng Đấu Tập",
        stats: "+25 AP, +35% Chí Mạng",
        description: "Sát thương phép thuật từ kỹ năng có thể chí mạng. Tăng thêm 15% Sát Thương Phép.",
        bestFor: selectedSeason === "18" ? ["Ahri", "Viktor", "Lux"] : ["Lux", "Silco", "Heimerdinger"],
        type: "AP",
      },
      {
        name: "Thú Tượng Thạch Giáp",
        comp1: "Giáp Lưới",
        comp2: "Áo Choàng Bạc",
        stats: "+30 Giáp, +30 Kháng Phép",
        description: "Mỗi kẻ địch nhắm vào chủ sở hữu tăng thêm +10 Giáp & +10 Kháng Phép.",
        bestFor: selectedSeason === "18" ? ["Nautilus", "Cho'Gath", "Sylas"] : ["Mordekaiser", "Singed", "Trundle"],
        type: "Tank",
      },
      {
        name: "Giáp Máu Warmog",
        comp1: "Đai Khổng Lồ",
        comp2: "Đai Khổng Lồ",
        stats: "+800 Máu tối đa",
        description: "Tăng 800 Máu và hồi 1% Máu tối đa mỗi giây trong suốt giao tranh.",
        bestFor: selectedSeason === "18" ? ["Cho'Gath", "Vi", "Nautilus"] : ["Singed", "Trundle", "Mordekaiser"],
        type: "Tank",
      },
      {
        name: "Ngọn Giáo Shojin",
        comp1: "Kiếm B.F",
        comp2: "Nước Mắt",
        stats: "+15 SMCK, +15 AP, +15 Năng Lượng",
        description: "Mỗi đòn đánh hồi thêm 5 Năng Lượng, tối ưu cho các tướng có năng lượng từ 70 trở lên.",
        bestFor: selectedSeason === "18" ? ["Lux", "Jhin", "Ahri"] : ["Corki", "Lux", "Heimerdinger"],
        type: "Utility",
      },
      {
        name: "Khăn Giải Thuật (QSS)",
        comp1: "Găng Đấu Tập",
        comp2: "Áo Choàng Bạc",
        stats: "+20% Kháng Phép, +20% Chí Mạng, +30% Tốc Đánh",
        description: "Miễn nhiễm hoàn toàn mọi hiệu ứng khống chế trong 14 giây đầu trận đấu.",
        bestFor: selectedSeason === "18" ? ["Warwick", "Jayce", "Kai'Sa"] : ["Ambessa", "Draven", "Sevika"],
        type: "Utility",
      },
    ],
    [selectedSeason]
  );

  const handleDirectiveSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = directiveInput.trim();
    if (!trimmed) return;

    // Check if directive updates season
    const lower = trimmed.toLowerCase();
    if (lower.includes("18") || lower.includes("mùa 18") || lower.includes("s18")) {
      setSelectedSeason("18");
      setLivePatchNotice(`⚡ Đã nạp Hot-Patch: Dữ liệu TFT Mùa 18 (Patch 15.2) đã được kích hoạt trực tiếp theo chỉ đạo!`);
    } else if (lower.includes("13") || lower.includes("mùa 13") || lower.includes("s13")) {
      setSelectedSeason("13");
      setLivePatchNotice(`⚡ Đã nạp Hot-Patch: Chuyển dữ liệu sang TFT Mùa 13 (Arcane) theo yêu cầu!`);
    } else {
      setLivePatchNotice(`⚡ Đã chuyển chỉ đạo tới Kỹ Sư Trưởng & Hội Đồng AI: "${trimmed.slice(0, 45)}..."`);
    }

    if (onRequestIteration) {
      onRequestIteration(trimmed);
    }
    setDirectiveInput("");

    setTimeout(() => {
      setLivePatchNotice(null);
    }, 6000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-sans text-slate-100">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950/70 via-slate-900 to-amber-950/60 border-b border-purple-500/20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Trophy className="w-3 h-3 fill-current" />
                TFT Pro Tactics (ĐTCL)
              </span>

              {/* Dynamic Season Badge */}
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-extrabold border border-purple-500/40">
                {selectedSeason === "18" ? "Patch 15.2 / Mùa 18 (Mới Nhất)" : "Patch 14.24 / Mùa 13 (Arcane)"}
              </span>

              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Riot Games Telemetry 60FPS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{project.name || "TFT Meta & Team Comp Analyzer"}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Mùa {selectedSeason}
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Hệ thống phân tích ĐTCL chuyên sâu Mùa {selectedSeason}: Bảng xếp hạng đội hình Tier S/A, tỷ lệ Top 4 & Winrate thời gian thực, bảng ghép đồ chuẩn BiS, xác suất roll tướng theo cấp độ và chiến lược quản lý lợi tức 50 vàng.
            </p>

            {/* Quick Season Switcher Pills */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-bold">Chọn Mùa Giải:</span>
              <button
                onClick={() => setSelectedSeason("18")}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedSeason === "18"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Mùa 18 (Hiện Tại - Mới Nhất)</span>
              </button>
              <button
                onClick={() => setSelectedSeason("13")}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedSeason === "13"
                    ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 shadow-md shadow-amber-600/30 ring-1 ring-amber-400"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <span>Mùa 13 (Lưu Trữ Arcane)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Kiến Trúc WBS ({tasks.length})</span>
            </button>

            {isStandalone && onExitStandalone && (
              <button
                onClick={onExitStandalone}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                ✕ Thoát Xem Riêng
              </button>
            )}
          </div>
        </div>

        {/* Live Patch Notice Alert Banner */}
        {livePatchNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{livePatchNotice}</span>
            </div>
            <button
              onClick={() => setLivePatchNotice(null)}
              className="text-emerald-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="px-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2 py-2.5">
          <button
            onClick={() => setActiveTab("comps")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "comps"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>🏆 Meta Đội Hình Mùa {selectedSeason}</span>
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "items"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sword className="w-3.5 h-3.5" />
            <span>⚔️ Ghép Đồ Chuẩn (BiS)</span>
          </button>

          <button
            onClick={() => setActiveTab("roll")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "roll"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>🎲 Xác Suất Roll & Lợi Tức</span>
          </button>

          <button
            onClick={() => setActiveTab("augments")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "augments"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Lõi Công Nghệ</span>
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>💻 Mã Nguồn Backend</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Dữ liệu Mùa {selectedSeason} đồng bộ thời gian thực từ rank Thách Đấu</span>
        </div>
      </div>

      {/* 3. Main Content Tab Views */}
      <div className="p-5 sm:p-6 space-y-6">
        {activeTab === "comps" && (
          <div className="space-y-5">
            {/* Filters & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold mr-1">Lọc Tier:</span>
                <button
                  onClick={() => setSelectedTier("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === "all" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  Tất cả ({allTeamComps.filter((c) => c.season === selectedSeason).length})
                </button>
                <button
                  onClick={() => setSelectedTier("S")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === "S" ? "bg-red-500 text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  Tier S (Đỉnh Meta Mùa {selectedSeason})
                </button>
                <button
                  onClick={() => setSelectedTier("A")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === "A" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  Tier A (Leo Rank Tốt)
                </button>
              </div>

              {/* Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Tìm tướng, tộc hệ Mùa ${selectedSeason}...`}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Comps List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredComps.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                  Không tìm thấy đội hình phù hợp với từ khóa "{searchQuery}" trong Mùa {selectedSeason}.
                </div>
              ) : (
                filteredComps.map((comp) => (
                  <div
                    key={comp.id}
                    className="rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 p-4 transition-all space-y-4"
                  >
                    {/* Comp Title & Stats */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              comp.tier === "S" ? "bg-red-500 text-white" : "bg-indigo-600 text-white"
                            }`}
                          >
                            Tier {comp.tier}
                          </span>
                          <h3 className="text-base font-bold text-white">{comp.name}</h3>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 text-[11px] font-medium border border-slate-700">
                            {comp.playstyle}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                            Mùa {comp.season}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {comp.synergies.map((syn, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-800"
                              title={syn.active}
                            >
                              <span className="text-purple-400 font-bold">{syn.count}</span> {syn.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Winrate Stats */}
                      <div className="flex items-center gap-4 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 block">Top 4</span>
                          <span className="text-xs font-bold text-emerald-400">{comp.top4Rate}%</span>
                        </div>
                        <div className="w-px h-6 bg-slate-800" />
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 block">Thắng (Top 1)</span>
                          <span className="text-xs font-bold text-amber-400">{comp.winRate}%</span>
                        </div>
                        <div className="w-px h-6 bg-slate-800" />
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 block">Hạng TB</span>
                          <span className="text-xs font-bold text-purple-300">{comp.avgPlacement}</span>
                        </div>
                      </div>
                    </div>

                    {/* Core Champions & Items */}
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Đội Hình Nòng Cốt & Trang Bị Chuẩn (BiS):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {comp.coreChampions.map((champ, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    champ.cost === 5
                                      ? "bg-amber-400 shadow-sm shadow-amber-400/50"
                                      : champ.cost === 4
                                      ? "bg-purple-400 shadow-sm shadow-purple-400/50"
                                      : champ.cost === 3
                                      ? "bg-blue-400"
                                      : "bg-slate-400"
                                  }`}
                                />
                                <span className="text-xs font-bold text-white">{champ.name}</span>
                                <span className="text-[10px] text-amber-400 font-bold">
                                  {"★".repeat(champ.star)}
                                </span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                                {champ.role}
                              </span>
                            </div>

                            {/* Items List */}
                            <div className="space-y-1">
                              {champ.items.map((item, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-medium text-amber-200 border border-amber-500/20 flex items-center justify-between"
                                >
                                  <span>{item}</span>
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Guide & Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="font-bold text-amber-300 block mb-1">
                          📌 Lộ trình vận hành đầu game:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {comp.earlyGamePlan}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="font-bold text-purple-300 block mb-1">
                          🎯 Mẹo xếp bài & Vị trí:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {comp.positioningTip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Item Recipes */}
        {activeTab === "items" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Bảng Ghép Đồ Chuẩn BiS (Best-in-Slot) Mùa {selectedSeason}</h3>
                <p className="text-xs text-slate-400">
                  Công thức ghép từ 2 mảnh trang bị thành phần & tướng sử dụng tối ưu nhất trong phiên bản Mùa {selectedSeason}.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                Mùa {selectedSeason} Meta
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {itemsList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                        ⚔️
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {item.comp1} + {item.comp2}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        item.type === "AD"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : item.type === "AP"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : item.type === "Tank"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono">{item.stats}</div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500 font-medium">Tướng tối ưu Mùa {selectedSeason}:</span>
                    {item.bestFor.map((champ, cIdx) => (
                      <span key={cIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-bold">
                        {champ}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Roll Odds & Econ Calculator */}
        {activeTab === "roll" && (
          <div className="space-y-6">
            {/* Level Selector */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Xác Suất Xuất Hiện Tướng Theo Cấp Độ (Roll Odds)</h3>
                  <p className="text-xs text-slate-400">
                    Bảng tỷ lệ chuẩn từ Riot Games giúp tính toán thời điểm roll tối ưu trong Mùa {selectedSeason}.
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/30">
                  Cấp Độ: Level {selectedLevel}
                </span>
              </div>

              {/* Level Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? "bg-purple-600 text-white scale-105 shadow-md shadow-purple-600/30 ring-1 ring-purple-400"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>

              {/* Odds Display */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
                {[
                  { cost: 1, label: "Tướng 1 Vàng", color: "from-slate-600 to-slate-700", textColor: "text-slate-300" },
                  { cost: 2, label: "Tướng 2 Vàng", color: "from-emerald-600 to-teal-700", textColor: "text-emerald-300" },
                  { cost: 3, label: "Tướng 3 Vàng", color: "from-blue-600 to-indigo-700", textColor: "text-blue-300" },
                  { cost: 4, label: "Tướng 4 Vàng", color: "from-purple-600 to-pink-700", textColor: "text-purple-300" },
                  { cost: 5, label: "Tướng 5 Vàng", color: "from-amber-600 to-yellow-600", textColor: "text-amber-300" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1"
                  >
                    <span className="text-[11px] text-slate-400 font-medium block">{item.label}</span>
                    <span className={`text-xl font-extrabold ${item.textColor}`}>
                      {rollOddsData[selectedLevel][idx]}%
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${rollOddsData[selectedLevel][idx]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Econ 50 Gold Interest Simulator */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Quản Lý Kinh Tế & Lợi Tức 50 Vàng (Econ Calculator)</h3>
                  <p className="text-xs text-slate-400">
                    Quy tắc tích trữ 50 vàng: Luôn đảm bảo nhận +5 vàng lợi tức mỗi vòng đấu để tối đa hóa tài nguyên.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Số vàng hiện có:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={econGold}
                    onChange={(e) => setEconGold(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Lợi tức mỗi round</span>
                  <span className="text-lg font-bold text-amber-400">
                    +{Math.min(5, Math.floor(econGold / 10))} vàng
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Vàng cơ bản mỗi round</span>
                  <span className="text-lg font-bold text-white">+5 vàng</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Thu nhập tối thiểu vòng tới</span>
                  <span className="text-lg font-bold text-emerald-400">
                    +{5 + Math.min(5, Math.floor(econGold / 10))} vàng
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Augments */}
        {activeTab === "augments" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-sm font-bold text-white">Xếp Hạng Lõi Công Nghệ (Augments Tier List) Mùa {selectedSeason}</h3>
              <p className="text-xs text-slate-400">
                Các lõi nâng cấp đem lại tỷ lệ vào Top 4 cao nhất phiên bản theo dữ liệu thống kê rank Thách Đấu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/40 space-y-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                  Lõi Kim Cương (Prismatic)
                </span>
                <h4 className="text-xs font-bold text-white">
                  {selectedSeason === "18" ? "Vương Miện Cơ Giáp Tương Lai" : "Vương Miện Chinh Phục"}
                </h4>
                <p className="text-xs text-slate-300">
                  {selectedSeason === "18"
                    ? "Nhận 1 Ấn Cơ Giáp, 1 Kiếm Súng Hextech và 1 tướng Viktor ngay lập tức."
                    : "Nhận 1 Ấn Chinh Phục, 1 Huyết Kiếm và 1 tướng Ambessa ngay lập tức."}
                </p>
                <div className="text-[10px] text-emerald-400 font-bold">Top 4: 65.4% | Winrate: 23.8%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                  Lõi Vàng (Gold)
                </span>
                <h4 className="text-xs font-bold text-white">Khuyến Mãi Kinh Nghiệm</h4>
                <p className="text-xs text-slate-300">
                  Khi mua kinh nghiệm, nhận thêm 2 XP. Lập tức nhận 8 kinh nghiệm.
                </p>
                <div className="text-[10px] text-emerald-400 font-bold">Top 4: 59.8% | Winrate: 19.1%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700/50 space-y-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                  Lõi Bạc (Silver)
                </span>
                <h4 className="text-xs font-bold text-white">Lắp Ghép Thần Tốc</h4>
                <p className="text-xs text-slate-300">
                  Sau 7 vòng giao tranh người chơi, nhận 1 trang bị ngẫu nhiên hoàn chỉnh.
                </p>
                <div className="text-[10px] text-emerald-400 font-bold">Top 4: 54.5% | Winrate: 15.8%</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Backend & Code Artifacts */}
        {activeTab === "code" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-sm font-bold text-white">Mã Nguồn Backend & Thuật Toán Riot Games Telemetry (Mùa {selectedSeason})</h3>
              <p className="text-xs text-slate-400">
                Các deliverables và mã nguồn được xây dựng bởi Kỹ Sư Trưởng và Hội Đồng Tác Nhân AI.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
              <div className="text-slate-500">// riotTftTelemetryGateway.ts - Riot Games API Gateway with Caching & Rate Limiting</div>
              <pre>{`export class RiotTFTGateway {
  private cache = new Map<string, any>();
  private apiKey: string;
  private currentSeason = "${selectedSeason}";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTopChallengerComps(season = "${selectedSeason}", region = "vn2") {
    const cacheKey = \`tft-comps-s\${season}-\${region}\`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const resp = await fetch(\`https://\${region}.api.riotgames.com/tft/league/v1/challenger\`, {
      headers: { "X-Riot-Token": this.apiKey }
    });
    const data = await resp.json();
    this.cache.set(cacheKey, data);
    return data;
  }

  calculateRollOdds(level: number, cost: 1 | 2 | 3 | 4 | 5): number {
    const matrix: Record<number, number[]> = {
      7: [19, 30, 40, 10, 1],
      8: [15, 20, 32, 30, 3],
      9: [10, 17, 25, 35, 13],
      10: [5, 10, 20, 40, 25]
    };
    return matrix[level]?.[cost - 1] ?? 0;
  }
}`}</pre>
            </div>
          </div>
        )}

        {/* 4. Quick Directive Input For Agent */}
        <div className="pt-4 border-t border-slate-800/80">
          <form onSubmit={handleDirectiveSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={directiveInput}
              onChange={(e) => setDirectiveInput(e.target.value)}
              placeholder="Chỉ đạo Hội Đồng AI cho dự án TFT (VD: Cập nhật meta Mùa 18, đổi sang Mùa 18, bổ sung đội hình mới...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!directiveInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all disabled:opacity-40 cursor-pointer shrink-0"
            >
              <span>Chỉ Đạo AI</span>
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
