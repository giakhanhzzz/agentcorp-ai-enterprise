import React, { useState } from "react";
import {
  X,
  Users,
  Plus,
  Crown,
  Compass,
  Cpu,
  Sparkles,
  ShieldAlert,
  BarChart3,
  User,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";
import { Agent, Department, AgentRole } from "../types";

interface OrgChartModalProps {
  agents: Agent[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateAgents: (agents: Agent[]) => void;
}

export const OrgChartModal: React.FC<OrgChartModalProps> = ({
  agents,
  isOpen,
  onClose,
  onUpdateAgents,
}) => {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New agent form state
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: "",
    role: "",
    roleType: "custom",
    department: "Custom Department",
    personality: "",
    systemPrompt: "",
    avatarColor: "from-blue-600 to-indigo-700",
    avatarIcon: "User",
  });

  if (!isOpen) return null;

  const handleSaveEdit = () => {
    if (!editingAgent) return;
    const updated = agents.map((a) => (a.id === editingAgent.id ? editingAgent : a));
    onUpdateAgents(updated);
    setEditingAgent(null);
  };

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.role) return;
    const created: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgent.name || "Tác nhân mới",
      role: newAgent.role || "Chuyên viên",
      roleType: "custom",
      department: (newAgent.department as Department) || "Custom Department",
      avatarColor: newAgent.avatarColor || "from-blue-600 to-indigo-700",
      avatarIcon: "User",
      personality: newAgent.personality || "Cẩn trọng, hiệu quả cao",
      systemPrompt: newAgent.systemPrompt || "Đảm nhận nhiệm vụ chuyên sâu theo phân công của ban giám đốc",
    };
    onUpdateAgents([...agents, created]);
    setIsAddingNew(false);
    setNewAgent({
      name: "",
      role: "",
      roleType: "custom",
      department: "Custom Department",
      personality: "",
      systemPrompt: "",
    });
  };

  const handleDeleteAgent = (id: string) => {
    if (agents.length <= 2) {
      alert("Công ty cần duy trì ít nhất 2 tác nhân để thảo luận!");
      return;
    }
    onUpdateAgents(agents.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Sơ Đồ Tổ Chức & Đội Ngũ Tác Nhân Doanh Nghiệp
              </h3>
              <p className="text-xs text-slate-400">
                Tùy chỉnh vai trò, tính cách và câu lệnh định hướng (System Prompt) cho từng Agent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tác Nhân</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {/* Add New Agent Form */}
          {isAddingNew && (
            <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-indigo-200">
                  Tuyển Dụng & Bổ Nhiệm Tác Nhân Mới
                </h4>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Hủy
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Họ và Tên tác nhân:
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    placeholder="Ví dụ: Hoàng Minh - Cố vấn Pháp lý"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Chức danh / Vai trò:
                  </label>
                  <input
                    type="text"
                    value={newAgent.role}
                    onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                    placeholder="Ví dụ: Giám đốc Pháp chế & Tuân thủ (CLO)"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Phong cách / Cá tính phản biện:
                </label>
                <input
                  type="text"
                  value={newAgent.personality}
                  onChange={(e) => setNewAgent({ ...newAgent, personality: e.target.value })}
                  placeholder="Ví dụ: Nghiêm ngặt tuân thủ luật pháp quốc tế, bảo vệ quyền sở hữu trí tuệ"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Chỉ đạo cốt lõi (System Prompt):
                </label>
                <textarea
                  rows={3}
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                  placeholder="Bạn là Cố vấn Pháp lý... Luôn kiểm tra các khía cạnh bản quyền, điều khoản dịch vụ và rủi ro kiện tụng."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateAgent}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Thêm vào Hội đồng
                </button>
              </div>
            </div>
          )}

          {/* Edit Agent Form Modal Overlay / Inline */}
          {editingAgent && (
            <div className="p-5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-4">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span>Chỉnh sửa thông số tác nhân: {editingAgent.name}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Tên:</label>
                  <input
                    type="text"
                    value={editingAgent.name}
                    onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Chức danh:</label>
                  <input
                    type="text"
                    value={editingAgent.role}
                    onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Cá tính & Phương châm:</label>
                <input
                  type="text"
                  value={editingAgent.personality}
                  onChange={(e) => setEditingAgent({ ...editingAgent, personality: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Chỉ đạo hệ thống (System Prompt):</label>
                <textarea
                  rows={3}
                  value={editingAgent.systemPrompt}
                  onChange={(e) => setEditingAgent({ ...editingAgent, systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingAgent(null)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-700 text-slate-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>
          )}

          {/* Agent Roster Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.avatarColor} p-0.5 shadow-md`}
                      >
                        <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
                          {agent.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                        <span className="text-[11px] text-indigo-400 font-medium">
                          {agent.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingAgent(agent)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {agent.roleType === "custom" && (
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                          title="Xóa tác nhân"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Phòng ban:</strong> {agent.department}
                    </p>
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Tính cách:</strong> {agent.personality}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                    Prompt: &quot;{agent.systemPrompt}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
