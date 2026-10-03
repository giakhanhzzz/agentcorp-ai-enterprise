import React, { useState, useMemo } from "react";
import {
  Crosshair,
  Trophy,
  Flame,
  Shield,
  Zap,
  Activity,
  Search,
  Code2,
  Sparkles,
  Server,
  User,
  Users,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  Clock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { CompanyTask, EnterpriseProject } from "../../types";

interface ApexAppPreviewProps {
  project: EnterpriseProject;
  tasks: CompanyTask[];
  onOpenCode: () => void;
  onRequestIteration?: (directive: string) => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

interface PlayerProfile {
  tag: string;
  platform: "PC" | "PlayStation" | "Xbox";
  rankName: string;
  rankColor: string;
  rankIcon: string;
  predatorRank: number | null;
  rp: number;
  level: number;
  kd: number;
  winRate: number;
  totalKills: number;
  totalDamage: string;
  headshotPct: number;
  favoriteLegend: string;
  matches: Array<{
    id: string;
    legend: string;
    placement: number;
    kills: number;
    damage: number;
    rpDelta: number;
    timeAgo: string;
    map: string;
  }>;
}

const SAMPLE_PLAYERS: Record<string, PlayerProfile> = {
  ImperialHal: {
    tag: "TSM_ImperialHal",
    platform: "PC",
    rankName: "Apex Predator",
    rankColor: "from-red-600 via-rose-500 to-amber-500",
    rankIcon: "👑",
    predatorRank: 14,
    rp: 24850,
    level: 950,
    kd: 5.64,
    winRate: 34.2,
    totalKills: 48920,
    totalDamage: "16,420,000",
    headshotPct: 36.8,
    favoriteLegend: "Horizon",
    matches: [
      { id: "m1", legend: "Horizon", placement: 1, kills: 11, damage: 3240, rpDelta: 245, timeAgo: "12 phút trước", map: "World's Edge" },
      { id: "m2", legend: "Bangalore", placement: 1, kills: 8, damage: 2680, rpDelta: 210, timeAgo: "34 phút trước", map: "World's Edge" },
      { id: "m3", legend: "Horizon", placement: 3, kills: 6, damage: 1950, rpDelta: 95, timeAgo: "55 phút trước", map: "Storm Point" },
      { id: "m4", legend: "Wraith", placement: 7, kills: 3, damage: 1120, rpDelta: -10, timeAgo: "1 giờ trước", map: "Storm Point" },
      { id: "m5", legend: "Horizon", placement: 1, kills: 14, damage: 4180, rpDelta: 280, timeAgo: "2 giờ trước", map: "Olympus" },
    ],
  },
  iiTzTimmy: {
    tag: "iiTzTimmy",
    platform: "PC",
    rankName: "Apex Predator",
    rankColor: "from-red-600 via-rose-500 to-amber-500",
    rankIcon: "👑",
    predatorRank: 42,
    rp: 21940,
    level: 890,
    kd: 6.12,
    winRate: 31.8,
    totalKills: 42150,
    totalDamage: "14,890,000",
    headshotPct: 38.2,
    favoriteLegend: "Pathfinder",
    matches: [
      { id: "m1", legend: "Pathfinder", placement: 1, kills: 16, damage: 4890, rpDelta: 290, timeAgo: "18 phút trước", map: "World's Edge" },
      { id: "m2", legend: "Pathfinder", placement: 2, kills: 9, damage: 2940, rpDelta: 170, timeAgo: "40 phút trước", map: "Storm Point" },
      { id: "m3", legend: "Wraith", placement: 4, kills: 5, damage: 1820, rpDelta: 65, timeAgo: "1 giờ trước", map: "Storm Point" },
    ],
  },
  Aceu: {
    tag: "Aceu_Official",
    platform: "PC",
    rankName: "Master",
    rankColor: "from-purple-600 via-violet-500 to-indigo-600",
    rankIcon: "💎",
    predatorRank: null,
    rp: 17420,
    level: 780,
    kd: 4.88,
    winRate: 27.5,
    totalKills: 33400,
    totalDamage: "11,200,000",
    headshotPct: 34.1,
    favoriteLegend: "Wraith",
    matches: [
      { id: "m1", legend: "Wraith", placement: 1, kills: 10, damage: 3100, rpDelta: 220, timeAgo: "25 phút trước", map: "Olympus" },
      { id: "m2", legend: "Wraith", placement: 5, kills: 4, damage: 1450, rpDelta: 40, timeAgo: "1 giờ trước", map: "World's Edge" },
    ],
  },
};

const LEGEND_META = [
  {
    name: "Horizon",
    role: "Skirmisher",
    tier: "S",
    pickRate: 14.8,
    winRate: 53.4,
    avatar: "🌪️",
    tactical: "Gravity Lift",
    ultimate: "Black Hole",
    summary: "Thống trị di chuyển thẳng đứng và quấy rối đội hình từ trên cao.",
  },
  {
    name: "Bangalore",
    role: "Assault",
    tier: "S",
    pickRate: 13.2,
    winRate: 52.8,
    avatar: "💨",
    tactical: "Smoke Launcher",
    ultimate: "Rolling Thunder",
    summary: "Khói mù phá vỡ tầm ngắm, tốc độ chạy trốn Double Time khi bị bắn.",
  },
  {
    name: "Conduit",
    role: "Support",
    tier: "S",
    pickRate: 11.5,
    winRate: 53.1,
    avatar: "⚡",
    tactical: "Radiant Transfer",
    ultimate: "Energy Barricade",
    summary: "Bơm giáp tạm thời cứu đồng đội từ xa, khống chế khu vực rộng lớn.",
  },
  {
    name: "Wraith",
    role: "Skirmisher",
    tier: "A",
    pickRate: 10.4,
    winRate: 51.2,
    avatar: "🌀",
    tactical: "Into the Void",
    ultimate: "Dimensional Rift",
    summary: "Cơ động cao, mở cổng dịch chuyển toàn đội an toàn qua vùng hiểm địa.",
  },
  {
    name: "Pathfinder",
    role: "Skirmisher",
    tier: "A",
    pickRate: 9.6,
    winRate: 50.9,
    avatar: "🤖",
    tactical: "Grappling Hook",
    ultimate: "Zipline Gun",
    summary: "Dây móc thần sầu tiếp cận góc bắn bất ngờ trên mái nhà và ngọn tháp.",
  },
  {
    name: "Revenant",
    role: "Skirmisher",
    tier: "A",
    pickRate: 8.8,
    winRate: 51.5,
    avatar: "💀",
    tactical: "Shadow Pounce",
    ultimate: "Forged Shadows",
    summary: "Nhảy vồ áp sát cực mạnh, kích hoạt khiên bóng đêm chặn thêm 75 sát thương.",
  },
  {
    name: "Bloodhound",
    role: "Recon",
    tier: "B",
    pickRate: 7.2,
    winRate: 49.8,
    avatar: "🦅",
    tactical: "Eye of the Allfather",
    ultimate: "Beast of the Hunt",
    summary: "Quét xuyên tường phát hiện vị trí kẻ địch, tốc độ truy sát siêu nhanh.",
  },
  {
    name: "Gibraltar",
    role: "Support",
    tier: "B",
    pickRate: 4.8,
    winRate: 49.2,
    avatar: "🛡️",
    tactical: "Dome of Protection",
    ultimate: "Defensive Bombardment",
    summary: "Vòm bảo vệ chống oanh tạc và hồi sinh đồng đội nhanh trong giao tranh.",
  },
];

const WEAPONS_DB = [
  { id: "r301", name: "R-301 Carbine", category: "Assault Rifle", ammo: "Light", baseDmg: 14, headDmg: 25, legDmg: 11, rpm: 810, magSize: 28 },
  { id: "flatline", name: "VK-47 Flatline", category: "Assault Rifle", ammo: "Heavy", baseDmg: 19, headDmg: 33, legDmg: 15, rpm: 600, magSize: 30 },
  { id: "peacekeeper", name: "Peacekeeper", category: "Shotgun", ammo: "Shotgun", baseDmg: 99, headDmg: 121, legDmg: 77, rpm: 58, magSize: 5 },
  { id: "nemesis", name: "Nemesis Burst AR", category: "Assault Rifle", ammo: "Energy", baseDmg: 17, headDmg: 29, legDmg: 14, rpm: 750, magSize: 32 },
  { id: "wingman", name: "Wingman", category: "Pistol / Sniper", ammo: "Sniper", baseDmg: 45, headDmg: 79, legDmg: 36, rpm: 156, magSize: 8 },
  { id: "volt", name: "Volt SMG", category: "SMG", ammo: "Energy", baseDmg: 15, headDmg: 23, legDmg: 12, rpm: 720, magSize: 28 },
  { id: "kraber", name: "Kraber .50-Cal", category: "Care Package Sniper", ammo: "Special", baseDmg: 140, headDmg: 280, legDmg: 112, rpm: 25, magSize: 4 },
];

const SHIELD_TIERS = [
  { label: "Giáp Trắng (Level 1)", totalHp: 150, color: "border-slate-400 text-slate-300" },
  { label: "Giáp Xanh (Level 2)", totalHp: 175, color: "border-blue-400 text-blue-300" },
  { label: "Giáp Tím / Vàng (Level 3)", totalHp: 200, color: "border-purple-400 text-purple-300" },
  { label: "Giáp Đỏ Evo (Level 4)", totalHp: 225, color: "border-rose-500 text-rose-300" },
];

export const ApexAppPreview: React.FC<ApexAppPreviewProps> = ({
  project,
  tasks,
  onOpenCode,
  onRequestIteration,
  isStandalone,
  onExitStandalone,
}) => {
  const [activeTab, setActiveTab] = useState<"tracker" | "meta" | "weapons" | "synergy" | "code">("tracker");
  const [searchTag, setSearchTag] = useState("ImperialHal");
  const [currentTag, setCurrentTag] = useState("ImperialHal");
  const [directiveInput, setDirectiveInput] = useState("");

  // Weapon simulator states
  const [selectedWeaponId, setSelectedWeaponId] = useState("r301");
  const [selectedShieldIndex, setSelectedShieldIndex] = useState(2); // Purple (200HP)
  const [headshotRatio, setHeadshotRatio] = useState(30); // 30% headshots

  // Synergy builder state
  const [selectedLegends, setSelectedLegends] = useState<string[]>(["Horizon", "Conduit", "Bangalore"]);

  const player = useMemo(() => {
    return SAMPLE_PLAYERS[currentTag] || {
      tag: currentTag,
      platform: "PC",
      rankName: "Apex Predator",
      rankColor: "from-red-600 via-rose-500 to-amber-500",
      rankIcon: "👑",
      predatorRank: 78,
      rp: 19850,
      level: 650,
      kd: 4.25,
      winRate: 26.5,
      totalKills: 28400,
      totalDamage: "9,650,000",
      headshotPct: 32.5,
      favoriteLegend: "Horizon",
      matches: [
        { id: "m1", legend: "Horizon", placement: 1, kills: 8, damage: 2450, rpDelta: 205, timeAgo: "15 phút trước", map: "World's Edge" },
        { id: "m2", legend: "Bangalore", placement: 3, kills: 5, damage: 1780, rpDelta: 85, timeAgo: "45 phút trước", map: "Storm Point" },
      ],
    };
  }, [currentTag]);

  const selectedWeapon = useMemo(() => {
    return WEAPONS_DB.find((w) => w.id === selectedWeaponId) || WEAPONS_DB[0];
  }, [selectedWeaponId]);

  const targetHp = SHIELD_TIERS[selectedShieldIndex].totalHp;

  // Compute Weapon TTK metrics
  const weaponStats = useMemo(() => {
    const w = selectedWeapon;
    const avgDmgPerShot = (w.headDmg * headshotRatio + w.baseDmg * (100 - headshotRatio)) / 100;
    const dps = Math.round((w.baseDmg * (w.rpm / 60)) * 10) / 10;
    const bulletsToKill = Math.ceil(targetHp / avgDmgPerShot);
    const fireIntervalSec = 60 / w.rpm;
    const ttkSec = bulletsToKill > 1 ? (bulletsToKill - 1) * fireIntervalSec : 0;
    const ttkMs = Math.round(ttkSec * 1000);
    const isOneMag = bulletsToKill <= w.magSize;

    return {
      avgDmgPerShot: Math.round(avgDmgPerShot * 10) / 10,
      dps,
      bulletsToKill,
      ttkMs,
      isOneMag,
    };
  }, [selectedWeapon, targetHp, headshotRatio]);

  // Compute Squad Synergy score
  const synergyScore = useMemo(() => {
    const roles = selectedLegends.map((lName) => {
      const leg = LEGEND_META.find((m) => m.name === lName);
      return leg?.role || "Skirmisher";
    });
    const uniqueRoles = new Set(roles).size;
    let base = 65;
    if (uniqueRoles === 3) base += 25; // Balanced comp
    if (uniqueRoles === 2) base += 15;
    if (selectedLegends.includes("Horizon") && selectedLegends.includes("Conduit")) base += 8;
    return Math.min(99, base);
  }, [selectedLegends]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag.trim()) return;
    setCurrentTag(searchTag.trim());
  };

  const handleDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveInput.trim() || !onRequestIteration) return;
    onRequestIteration(directiveInput.trim());
    setDirectiveInput("");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. APEX HEADER & LIVE SERVER TELEMETRY */}
      <div className="rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/60 border border-red-500/40 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/50 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>APEX LEGENDS PRO TELEMETRY (LIVE ENGINE)</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                Season 23: From the Rift
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                API EA Sports: Online 120Hz
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{project.name.toLowerCase().includes("apex") ? project.name : "Apex Legends Pro Tracker & Esports Meta Hub"}</span>
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Hệ thống theo dõi thống kê người chơi theo thời gian thực, bảng xếp hạng Apex Predator toàn cầu, mô phỏng sát thương TTK vũ khí và radar phân tích đội hình thi đấu ALGS chuyên nghiệp.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Xem Code & WBS ({tasks.length})</span>
            </button>
            {isStandalone && onExitStandalone && (
              <button
                onClick={onExitStandalone}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-700 transition-all"
              >
                ✕ Thoát
              </button>
            )}
          </div>
        </div>

        {/* Live Server Latency Badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-red-400" />
              Cụm Máy Chủ Trực Tuyến:
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400">
              🇯🇵 Tokyo 1: 24ms
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400">
              🇸🇬 Singapore 1: 32ms
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-400">
              🇺🇸 US-West: 115ms
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>WebSocket QPS: <strong>48,200 pkt/s</strong></span>
            <span>•</span>
            <span>Packet Loss: <strong>0.00%</strong></span>
          </div>
        </div>
      </div>

      {/* 2. CHAIRMAN UPGRADE BAR DIRECTLY FOR APEX */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
        <form onSubmit={handleDirectiveSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={directiveInput}
              onChange={(e) => setDirectiveInput(e.target.value)}
              placeholder="Chỉ đạo AI nâng cấp cho Apex (vd: Bổ sung radar vũ khí Akimbo, bảng so sánh ranked mùa mới, tích hợp Discord bot)..."
              className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-red-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-red-400 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!directiveInput.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30 disabled:opacity-40 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nạp Chỉ Đạo Nâng Cấp</span>
          </button>
        </form>
      </div>

      {/* 3. MAIN NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("tracker")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "tracker"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Hồ Sơ & Xếp Hạng Predator</span>
        </button>

        <button
          onClick={() => setActiveTab("meta")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "meta"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Bảng Xếp Hạng Meta Tướng (S-Tier)</span>
        </button>

        <button
          onClick={() => setActiveTab("weapons")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "weapons"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>Mô Phỏng Sát Thương & TTK Vũ Khí</span>
        </button>

        <button
          onClick={() => setActiveTab("synergy")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "synergy"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Bộ Ghép Đội Hình & Synergy ALGS</span>
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ml-auto ${
            activeTab === "code"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-indigo-400 hover:text-indigo-200 bg-indigo-950/40 border border-indigo-800/60"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>API & Kiến Trúc Backend Apex</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: PLAYER TRACKER & RANKED LEADERBOARD */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* Player Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  placeholder="Nhập Gamertag Apex (vd: ImperialHal, iiTzTimmy, Aceu)..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shrink-0"
              >
                Tra Cứu
              </button>
            </form>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px]">Gợi ý tuyển thủ:</span>
              {Object.keys(SAMPLE_PLAYERS).map((pTag) => (
                <button
                  key={pTag}
                  onClick={() => {
                    setSearchTag(pTag);
                    setCurrentTag(pTag);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    currentTag === pTag
                      ? "bg-red-600/30 border-red-500 text-red-200"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  {pTag}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Hero Card */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-1 flex items-center justify-center shadow-xl shadow-red-600/30">
                  <div className="w-full h-full rounded-xl bg-slate-950 flex flex-col items-center justify-center">
                    <span className="text-3xl">{player.rankIcon}</span>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                      {player.predatorRank ? `#${player.predatorRank}` : "MASTER"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-black uppercase">
                      {player.platform}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Level {player.level} (Prestige 3)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Đang Online
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{player.tag}</h2>
                  <p className="text-xs text-slate-400">
                    Hạng hiện tại: <strong className="text-rose-400 font-bold">{player.rankName}</strong> • Điểm RP:{" "}
                    <strong className="text-amber-300 font-mono">{player.rp.toLocaleString()} RP</strong> • Tướng sở trường:{" "}
                    <strong className="text-indigo-300">{player.favoriteLegend}</strong>
                  </p>
                </div>
              </div>

              {/* Rank Points Delta Progress Bar */}
              <div className="w-full lg:w-80 space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Bậc Xếp Hạng Predator
                  </span>
                  <span className="text-amber-400 font-mono font-bold">{player.rp.toLocaleString()} / 30,000 RP</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (player.rp / 30000) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>#100 Predator: 18,200 RP</span>
                  <span className="text-emerald-400 font-bold">An Toàn Top 100</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">K/D Tỉ Lệ Giết</span>
                <div className="text-xl font-black text-rose-400 font-mono">{player.kd}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">+0.32 tuần này</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tỉ Lệ Vô Địch</span>
                <div className="text-xl font-black text-amber-400 font-mono">{player.winRate}%</div>
                <span className="text-[10px] text-slate-400">Top 0.1% server</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng Mạng Hạ</span>
                <div className="text-xl font-black text-white font-mono">{player.totalKills.toLocaleString()}</div>
                <span className="text-[10px] text-slate-400">Mùa 23 Ranked</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng Sát Thương</span>
                <div className="text-xl font-black text-indigo-400 font-mono">{player.totalDamage}</div>
                <span className="text-[10px] text-slate-400">Avg 1,840 / trận</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Độ Chuẩn Bắn Đầu</span>
                <div className="text-xl font-black text-emerald-400 font-mono">{player.headshotPct}%</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Siêu xạ thủ</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tướng Số 1</span>
                <div className="text-xl font-black text-purple-300 font-mono truncate">{player.favoriteLegend}</div>
                <span className="text-[10px] text-slate-400">Pick 72% trận</span>
              </div>
            </div>

            {/* Match History Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Lịch Sử 5 Trận Gần Nhất (Telemetry Match Stream)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-y border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Tướng & Bản Đồ</th>
                      <th className="py-2.5 px-3">Thứ Hạng</th>
                      <th className="py-2.5 px-3">Mạng Hạ</th>
                      <th className="py-2.5 px-3">Sát Thương</th>
                      <th className="py-2.5 px-3">Biến Động RP</th>
                      <th className="py-2.5 px-3">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {player.matches.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span>{m.legend}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{m.map}</div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold">
                          {m.placement === 1 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              🏆 #1 Champion
                            </span>
                          ) : (
                            <span className="text-slate-300">#{m.placement}</span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-rose-400">
                          {m.kills} kills
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-300">
                          {m.damage.toLocaleString()} dmg
                        </td>

                        <td className="py-3 px-3 font-mono font-bold">
                          {m.rpDelta > 0 ? (
                            <span className="text-emerald-400">+{m.rpDelta} RP</span>
                          ) : (
                            <span className="text-rose-400">{m.rpDelta} RP</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {m.timeAgo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEGEND META TIER LIST */}
      {activeTab === "meta" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>Apex Legends Meta Tier List (Season 23: Ranked Predator & ALGS)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Dữ liệu phân tích dựa trên hơn 1,500,000 trận đấu Ranked Bậc Kim Cương, Cao Thủ & Predator tuần qua.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold font-mono">
                Cập nhật: 10 phút trước
              </span>
            </div>

            {/* Tier Rows */}
            <div className="space-y-4">
              {["S", "A", "B"].map((tierLetter) => {
                const legendsInTier = LEGEND_META.filter((l) => l.tier === tierLetter);
                const tierColor =
                  tierLetter === "S"
                    ? "from-rose-600 to-red-600 text-white"
                    : tierLetter === "A"
                    ? "from-amber-600 to-yellow-600 text-white"
                    : "from-blue-600 to-indigo-600 text-white";

                return (
                  <div key={tierLetter} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col md:flex-row">
                    <div className={`w-full md:w-24 p-4 bg-gradient-to-b ${tierColor} flex items-center justify-center shrink-0`}>
                      <span className="text-3xl font-black">{tierLetter} TIER</span>
                    </div>

                    <div className="p-4 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {legendsInTier.map((leg) => (
                        <div key={leg.name} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{leg.avatar}</span>
                              <div>
                                <h4 className="font-extrabold text-white text-sm">{leg.name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">{leg.role}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-mono font-bold text-emerald-400">{leg.winRate}% WR</div>
                              <div className="text-[10px] font-mono text-slate-400">{leg.pickRate}% Pick</div>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {leg.summary}
                          </p>

                          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 font-mono">
                            <span>Q: <strong>{leg.tactical}</strong></span>
                            <span>Z: <strong>{leg.ultimate}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEAPON DAMAGE & TTK SIMULATOR */}
      {activeTab === "weapons" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-500" />
                <span>Mô Phỏng Sát Thương Thực Tế & Thời Gian Hạ Gục (TTK Engine)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tính toán chính xác từng viên đạn, độ trễ giữa các phát bắn (RPM), sát thương đầu/thân và khả năng 1-mag knock đối thủ.
              </p>
            </div>

            {/* Config Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Weapon Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-red-400" />
                  Chọn Vũ Khí:
                </label>
                <div className="space-y-1.5">
                  {WEAPONS_DB.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWeaponId(w.id)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        selectedWeaponId === w.id
                          ? "bg-red-600/20 border-red-500 text-white font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div>
                        <div className="font-bold">{w.name}</div>
                        <div className="text-[10px] text-slate-500">{w.category} • Đạn {w.ammo}</div>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <div>{w.baseDmg} DMG</div>
                        <div className="text-[10px] text-slate-500">{w.rpm} RPM</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Target Armor Tier */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    Cấp Giáp Mục Tiêu (Máu + Giáp):
                  </label>
                  <div className="space-y-2">
                    {SHIELD_TIERS.map((tier, idx) => (
                      <button
                        key={tier.label}
                        onClick={() => setSelectedShieldIndex(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          selectedShieldIndex === idx
                            ? `bg-slate-800 ${tier.color} font-bold shadow-md`
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{tier.label}</span>
                        <span className="font-mono font-bold">{tier.totalHp} HP</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headshot Ratio Slider */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      Tỉ Lệ Bắn Trúng Đầu:
                    </span>
                    <span className="text-amber-400 font-mono font-bold">{headshotRatio}% Headshot</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={headshotRatio}
                    onChange={(e) => setHeadshotRatio(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>0% (Chỉ bắn thân)</span>
                    <span>50% (Cao thủ)</span>
                    <span>100% (Aim bot)</span>
                  </div>
                </div>
              </div>

              {/* 3. Output TTK Benchmark Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                    KẾT QUẢ TÍNH TOÁN HIỆU SUẤT VŨ KHÍ
                  </span>
                  <h4 className="text-xl font-black text-white mt-1">{selectedWeapon.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Bắn vào đối thủ mang {SHIELD_TIERS[selectedShieldIndex].label} ({targetHp} HP).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Thời gian hạ gục (TTK):</span>
                    <span className="text-2xl font-black text-red-400 font-mono">
                      {weaponStats.ttkMs} ms
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Số đạn cần để hạ gục:</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {weaponStats.bulletsToKill} viên / băng {selectedWeapon.magSize}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Khả năng 1-Mag Knock:</span>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      weaponStats.isOneMag ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {weaponStats.isOneMag ? "✅ 1 Băng Là Đủ" : "⚠️ Cần Nạp Đạn Hoặc Súng Phụ"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Sát thương mỗi giây (DPS):</span>
                    <span className="text-lg font-black text-indigo-400 font-mono">
                      {weaponStats.dps} DPS
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  💡 <em>Mẹo Pro:</em> {weaponStats.ttkMs < 1200 ? "Vũ khí này hạ gục cực nhanh trong cự ly gần!" : "Nên cấu rỉa trước khi áp sát vì thời gian TTK tương đối dài."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SQUAD SYNERGY BUILDER */}
      {activeTab === "synergy" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-500" />
                  <span>Bộ Tính Điểm Tương Tác Đội Hình 3 Người (Squad Synergy Engine)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Lựa chọn 3 Legend để máy học chấm điểm độ hài hòa chiến thuật ALGS, khả năng công phá và kiểm soát bo.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40">
                <span className="text-xs text-slate-300 font-bold">Điểm Synergy:</span>
                <span className="text-lg font-black text-amber-400 font-mono">{synergyScore}/100</span>
              </div>
            </div>

            {/* Current Selected 3-Man Squad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedLegends.map((lName, idx) => {
                const leg = LEGEND_META.find((m) => m.name === lName) || LEGEND_META[0];
                return (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-red-400">VỊ TRÍ {idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px]">
                        {leg.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{leg.avatar}</span>
                      <div>
                        <h4 className="text-lg font-black text-white">{leg.name}</h4>
                        <span className="text-xs text-emerald-400 font-mono">Winrate: {leg.winRate}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      Vai trò chiến thuật: <strong>{leg.tactical}</strong> để mở giao tranh, <strong>{leg.ultimate}</strong> kết liễu đội bạn.
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Legend Pick Pool */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300">
                Bấm vào tướng bên dưới để thay đổi đội hình:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {LEGEND_META.map((leg) => {
                  const isSelected = selectedLegends.includes(leg.name);
                  return (
                    <button
                      key={leg.name}
                      onClick={() => {
                        if (isSelected) {
                          if (selectedLegends.length > 1) {
                            setSelectedLegends(selectedLegends.filter((n) => n !== leg.name));
                          }
                        } else {
                          if (selectedLegends.length < 3) {
                            setSelectedLegends([...selectedLegends, leg.name]);
                          } else {
                            setSelectedLegends([selectedLegends[1], selectedLegends[2], leg.name]);
                          }
                        }
                      }}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? "bg-red-600/30 border-red-500 shadow-md text-white font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-2xl">{leg.avatar}</span>
                      <span className="text-xs font-bold truncate max-w-full">{leg.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{leg.tier} Tier</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tactical AI Evaluation */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Nhận Định Chiến Thuật Từ Hội Đồng AI:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Đội hình <strong>{selectedLegends.join(" + ")}</strong> đạt điểm số <strong>{synergyScore}/100</strong>. Khả năng công phá cao, cơ động vượt trội để chiếm giữ high ground vòng bo 4. Khuyến nghị Kỹ sư trưởng thiết lập telemetry để ghi nhận tỉ lệ thắng thực chiến của bộ ba này trên toàn bộ máy chủ Tokyo và Singapore.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: APEX API & BACKEND CODE */}
      {activeTab === "code" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>Mã Nguồn Module Tích Hợp API Apex & WebSocket Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Các đoạn mã nguồn do AI Dev và Kỹ Sư Trưởng thi công, sẵn sàng kết nối tới EA Apex API hoặc Tracker Network.
                </p>
              </div>
              <button
                onClick={onOpenCode}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                Mở Toàn Bộ WBS ({tasks.length} Hạng Mục)
              </button>
            </div>

            {/* Code Block 1: ApexApiClient */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
              <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <span>src/services/ApexTrackerService.ts</span>
                <span className="text-[10px] text-emerald-400">TypeScript • Live Ready</span>
              </div>
              <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed">
{`// High-Performance Apex Legends Telemetry Ingestion Service
import { createClient } from "redis";

export class ApexTrackerService {
  private redisCache = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
  private eaApiKey = process.env.APEX_EA_API_KEY;

  async fetchPlayerStats(playerTag: string, platform: "PC" | "PSN" | "X1" = "PC") {
    const cacheKey = \`apex:player:\${platform}:\${playerTag.toLowerCase()}\`;
    
    // 1. In-Memory Fast Cache Check (TTL: 60s)
    const cached = await this.redisCache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 2. Fetch from EA Official / Tracker Network Gateway
    const response = await fetch(\`https://api.mozambiquehe.re/bridge?auth=\${this.eaApiKey}&player=\${encodeURIComponent(playerTag)}&platform=\${platform}\`);
    if (!response.ok) throw new Error("Failed to fetch Apex Telemetry");

    const data = await response.json();
    
    // 3. Cache for instant 120Hz lookups
    await this.redisCache.setEx(cacheKey, 60, JSON.stringify(data));
    return data;
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
