import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Tv,
  Rocket,
  ShoppingBag,
  Headphones,
  Server,
  Zap,
  X,
  ChevronRight,
  FolderPlus,
} from "lucide-react";
import { EnterpriseProject } from "../types";
import {
  generateRandomProjectName,
  getSuggestionsByCategory,
  NameSuggestion,
} from "../utils/nameGenerator";

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: EnterpriseProject[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (projectData: {
    name: string;
    category: string;
    description: string;
  }) => void;
  onUpdateProject: (
    projectId: string,
    updates: Partial<EnterpriseProject>
  ) => void;
  onDeleteProject: (projectId: string) => void;
  initialTab?: "catalog" | "create" | "rename";
}

const CATEGORIES = [
  "Media & Streaming",
  "SaaS AI & B2B",
  "E-Commerce & Bán Lẻ",
  "CRM & CSKH Swarm",
  "An Ninh Mạng & Hạ Tầng",
  "FinTech & Thanh Toán",
  "Khác / Nội Bộ",
];

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  initialTab = "catalog",
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "create" | "rename">(
    initialTab
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Create Form State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Media & Streaming");
  const [newDescription, setNewDescription] = useState("");

  // Rename Form State
  const activeProj = projects.find((p) => p.id === activeProjectId);
  const [renameTargetId, setRenameTargetId] = useState<string>(activeProjectId);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Set initial rename fields when active project or rename target changes
  React.useEffect(() => {
    const target = projects.find((p) => p.id === renameTargetId) || activeProj;
    if (target) {
      setEditName(target.name);
      setEditCategory(target.category);
      setEditDescription(target.description);
    }
  }, [renameTargetId, activeProjectId, projects]);

  if (!isOpen) return null;

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      filterCategory === "all" || p.category === filterCategory;
    return matchQuery && matchCat;
  });

  const handleSuggestNameForCreate = () => {
    const suggested = generateRandomProjectName(newCategory);
    setNewName(suggested);
  };

  const handleSuggestNameForEdit = () => {
    const suggested = generateRandomProjectName(editCategory);
    setEditName(suggested);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = newName.trim() || generateRandomProjectName(newCategory);
    onCreateProject({
      name: finalName,
      category: newCategory,
      description: newDescription.trim() || `Dự án ${finalName} phát triển bởi AgentCorp Enterprise`,
    });
    setNewName("");
    setNewDescription("");
    setActiveTab("catalog");
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateProject(renameTargetId, {
      name: editName.trim(),
      category: editCategory,
      description: editDescription.trim(),
      updatedAt: new Date().toISOString(),
    });
    setActiveTab("catalog");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg">
                  Danh Mục & Quản Lý Dự Án
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                  {projects.length} Dự Án
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý các không gian làm việc độc lập. Tạo dự án, đổi tên, hoặc tự động đề xuất tên tuỳ ý.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 gap-3">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "catalog"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Danh Mục Dự Án ({projects.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("create");
              if (!newName) {
                setNewName(generateRandomProjectName(newCategory));
              }
            }}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "create"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>2. + Tạo Dự Án Mới</span>
          </button>
          <button
            onClick={() => setActiveTab("rename")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "rename"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>3. Đổi Tên / Sửa Dự Án</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5 text-xs">
          {/* TAB 1: CATALOG LIST */}
          {activeTab === "catalog" && (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm dự án theo tên hoặc mô tả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Tất cả danh mục ({projects.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setActiveTab("create");
                      setNewName(generateRandomProjectName(newCategory));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shrink-0 shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Mới</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredProjects.map((p) => {
                  const isActive = p.id === activeProjectId;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative group ${
                        isActive
                          ? "bg-indigo-950/30 border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div>
                        {/* Header of Project Card */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                              }`}
                            />
                            <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                              {p.name}
                            </h3>
                          </div>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-[10px] shrink-0">
                              Đang Mở
                            </span>
                          )}
                        </div>

                        {/* Category & Status Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px]">
                            {p.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px]">
                            {p.tasks?.length || 0} Nhiệm vụ
                          </span>
                          {p.activeMission && (
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px]">
                              ✓ Đã có Hội đồng AI
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {p.description || "Dự án mới tạo chưa có mô tả chi tiết."}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                        <span className="text-[10px] text-slate-500">
                          {p.updatedAt
                            ? `Cập nhật: ${new Date(p.updatedAt).toLocaleDateString("vi-VN")}`
                            : "Mới tạo"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setRenameTargetId(p.id);
                              setActiveTab("rename");
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Đổi tên / sửa thông tin dự án"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {projects.length > 1 && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Bạn có chắc chắn muốn xoá dự án "${p.name}"? Thao tác này không thể hoàn tác.`
                                  )
                                ) {
                                  onDeleteProject(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors"
                              title="Xoá dự án này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onSelectProject(p.id);
                              onClose();
                            }}
                            disabled={isActive}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              isActive
                                ? "bg-slate-800 text-slate-400 cursor-default"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                            }`}
                          >
                            <span>{isActive ? "Đang chọn" : "Mở Dự Án"}</span>
                            {!isActive && <ArrowRight className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE NEW PROJECT */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-slate-300 space-y-1">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Không Gian Dự Án Độc Lập Mới</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sau khi tạo, dự án sẽ có không gian làm việc riêng. Bạn có thể xem giao diện, quản lý đầu việc, hoặc gửi yêu cầu/prompt cho Ban Giám Đốc AI bất cứ lúc nào bạn sẵn sàng.
                </p>
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  1. Danh mục / Lĩnh vực:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => {
                        setNewCategory(cat);
                        // Auto-refresh suggestions for this category
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        newCategory === cat
                          ? "bg-indigo-600/30 border-indigo-500 text-white font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Name & Auto-Suggest */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    2. Tên dự án:
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestNameForCreate}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🎲 Tự động đề xuất tên hay</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Motfilm Pro 4K, NovaPlay, OmniCart AI..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />

                {/* Quick Name Suggestions Pill List */}
                <div className="mt-2.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">
                    Gợi ý tên thương mại theo danh mục:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {getSuggestionsByCategory(newCategory).map((sugg) => (
                      <button
                        type="button"
                        key={sugg.name}
                        onClick={() => {
                          setNewName(sugg.name);
                          if (!newDescription) {
                            setNewDescription(sugg.tagline);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-[11px]"
                      >
                        <span className="font-bold text-indigo-300">{sugg.name}</span>
                        <span className="text-slate-500 text-[10px] ml-1 hidden sm:inline">
                          ({sugg.tagline})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  3. Mô tả ngắn gọn về dự án (tùy chọn):
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả mục tiêu sản phẩm hoặc giá trị cốt lõi..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Khởi Tạo Dự Án Mới</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: RENAME & EDIT CURRENT PROJECT */}
          {activeTab === "rename" && (
            <form onSubmit={handleSaveRename} className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    Đổi tên & Cập nhật thông tin dự án
                  </span>
                  <select
                    value={renameTargetId}
                    onChange={(e) => setRenameTargetId(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tên dự án sẽ được đồng bộ lên thanh điều hướng, hồ sơ xuất bản Git và tài liệu bàn giao.
                </p>
              </div>

              {/* Edit Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">Tên dự án mới:</label>
                  <button
                    type="button"
                    onClick={handleSuggestNameForEdit}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🎲 Tự đề xuất tên khác</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-semibold"
                />

                {/* Suggestions pill list */}
                <div className="mt-2.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Gợi ý tên nhanh:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {getSuggestionsByCategory(editCategory || "Media & Streaming").map((sugg) => (
                      <button
                        type="button"
                        key={sugg.name}
                        onClick={() => setEditName(sugg.name)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-[11px]"
                      >
                        {sugg.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Edit Category */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Danh mục:
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edit Description */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Mô tả dự án:
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            AgentCorp Multi-Project Workspace Directory
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
