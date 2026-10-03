import React, { useState } from "react";
import {
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Plus,
  ArrowRight,
  ShieldCheck,
  Code2,
  Layers,
  X,
  Search,
  BookOpen,
  FolderGit2,
} from "lucide-react";
import { ArchitectureBlueprint, CompanyTask, EnterpriseProject } from "../types";

interface BlueprintVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprints: ArchitectureBlueprint[];
  currentProject: EnterpriseProject;
  onInheritBlueprint: (blueprint: ArchitectureBlueprint) => void;
  onSaveNewBlueprint?: (blueprint: ArchitectureBlueprint) => void;
}

export const BlueprintVaultModal: React.FC<BlueprintVaultModalProps> = ({
  isOpen,
  onClose,
  blueprints,
  currentProject,
  onInheritBlueprint,
  onSaveNewBlueprint,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inheritedIds, setInheritedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const categories = ["all", ...Array.from(new Set(blueprints.map((b) => b.category)))];

  const filteredBlueprints = blueprints.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInherit = (bp: ArchitectureBlueprint) => {
    onInheritBlueprint(bp);
    setInheritedIds((prev) => [...prev, bp.id]);
    setTimeout(() => {
      setInheritedIds((prev) => prev.filter((id) => id !== bp.id));
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Award className="w-6 h-6 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base">
                  Kho Thành Tựu & Kế Thừa Kiến Trúc (Solution Vault)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  {blueprints.length} Thành Tựu Tái Sử Dụng
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Đang mở cho dự án: <span className="text-indigo-400 font-bold">{currentProject.name}</span> ({currentProject.category})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Proposition Banner */}
        <div className="px-5 py-3 bg-indigo-950/40 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-indigo-200">
            💡 <strong>Tái sử dụng siêu tốc:</strong> Khi làm dự án mới cùng phong cách (Streaming, SaaS, CSKH, E-Commerce), chỉ cần bấm <strong>Kế Thừa</strong> là AI tự động nạp toàn bộ module code và giải pháp đã hoàn thiện vào dự án mới trong 1 giây!
          </span>
          <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Tiết kiệm 95% thời gian
          </span>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thành tựu (HLS streaming, API Key, Stripe, Rate Limit, CSKH Swarm, Anti-DDoS)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "Tất Cả" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint Cards List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {filteredBlueprints.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p>Không tìm thấy thành tựu nào khớp với từ khóa tìm kiếm.</p>
            </div>
          ) : (
            filteredBlueprints.map((bp) => {
              const isInherited = inheritedIds.includes(bp.id);

              return (
                <div
                  key={bp.id}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 p-5 transition-all space-y-3 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-white text-base">{bp.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                          Nguồn: {bp.sourceProjectName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{bp.description}</p>
                    </div>

                    <button
                      onClick={() => handleInherit(bp)}
                      disabled={isInherited}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isInherited
                          ? "bg-emerald-600 text-white shadow-emerald-600/30"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20"
                      }`}
                    >
                      {isInherited ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Đã Kế Thừa Vào Dự Án!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-slate-950 fill-current" />
                          <span>⚡ Kế Thừa Vào Dự Án Này</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Highlights / Achievements Bullet List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    {bp.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags and Recommended context */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/50 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {bp.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-indigo-300 font-medium">
                      🎯 Khuyến nghị cho: {bp.recommendedFor}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Thành tựu khi kế thừa sẽ lập tức xuất hiện trong tab <strong>Cơ Cấu Nhiệm Vụ WBS</strong>.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Đóng Kho Thành Tựu
          </button>
        </div>
      </div>
    </div>
  );
};
