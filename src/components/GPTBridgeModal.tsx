import React, { useState } from "react";
import {
  X,
  Bot,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Terminal,
  Zap,
  Play,
  Layers,
  Code,
  Globe,
  Share2,
  ShieldCheck,
} from "lucide-react";

interface GPTBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectName?: string;
}

export const GPTBridgeModal: React.FC<GPTBridgeModalProps> = ({
  isOpen,
  onClose,
  activeProjectName = "Motfilm Pro 4K",
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testDirective, setTestDirective] = useState("Tối ưu hóa bộ nhớ đệm cache và kiểm tra luồng phát");

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://ais-dev-vwktnk6nfyko3vvjp7czty-722673602658.asia-southeast1.run.app";

  const openApiUrl = `${currentOrigin}/api/gpt/openapi.json`;
  const statusApiUrl = `${currentOrigin}/api/gpt/status`;
  const tasksApiUrl = `${currentOrigin}/api/gpt/tasks`;
  const directiveApiUrl = `${currentOrigin}/api/gpt/directive`;

  const sampleGptSystemPrompt = `Bạn là Trợ lý Lập trình viên AI (ChatGPT Copilot) được cấp quyền truy cập trực tiếp vào mã nguồn dự án AgentCorp.

Bạn có các Actions sau để tương tác với dự án:
1. \`getProjectFiles\`: Xem danh sách tất cả các tệp mã nguồn trong dự án.
2. \`readSourceFile(path)\`: Đọc toàn bộ nội dung code của một tệp cụ thể (Ví dụ: src/components/LiveAppPreview.tsx, package.json).
3. \`writeSourceFile(path, content)\`: Trực tiếp ghi đè / sửa mã nguồn tệp trên máy chủ. Code sẽ được lưu và áp dụng ngay lập tức!
4. \`sendChatMessage(message)\`: Nhắn tin, thảo luận hoặc thông báo kết quả sửa code trực tiếp vào phòng họp Web Agent.
5. \`getProjectStatus\` & \`getProjectTasks\`: Kiểm tra tiến độ và trạng thái hệ thống.

Quy trình làm việc chuẩn khi người dùng yêu cầu sửa code:
- Bước 1: Gọi \`readSourceFile\` để đọc code hiện tại của tệp cần sửa.
- Bước 2: Phân tích và cập nhật logic code cẩn thận, không làm gãy các tính năng cũ.
- Bước 3: Gọi \`writeSourceFile\` với đường dẫn tệp và toàn bộ nội dung code mới.
- Bước 4: Gọi \`sendChatMessage\` để thông báo vào phòng chat của người dùng: "Tôi đã sửa xong tệp [đường dẫn]. Bạn hãy kiểm tra lại nhé!".`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(openApiUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(sampleGptSystemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleRunTest = async (type: "status" | "directive" | "files" | "read" | "write" | "chat") => {
    setIsTesting(true);
    setTestResult(null);
    try {
      if (type === "status") {
        const resp = await fetch("/api/gpt/status");
        const data = await resp.json();
        setTestResult({
          type: "status",
          endpoint: "GET /api/gpt/status",
          response: data,
        });
      } else if (type === "files") {
        const resp = await fetch("/api/gpt/files");
        const data = await resp.json();
        setTestResult({
          type: "files",
          endpoint: "GET /api/gpt/files",
          response: data,
        });
      } else if (type === "read") {
        const resp = await fetch("/api/gpt/read-file?path=package.json");
        const data = await resp.json();
        setTestResult({
          type: "read",
          endpoint: "GET /api/gpt/read-file?path=package.json",
          response: data,
        });
      } else if (type === "write") {
        const resp = await fetch("/api/gpt/write-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "gpt_activity_log.json",
            content: JSON.stringify(
              {
                source: "ChatGPT Direct Code Write Test",
                modifiedAt: new Date().toISOString(),
                status: "PASSED",
                notes: "GPT có toàn quyền đọc và ghi trực tiếp vào các tệp mã nguồn!",
              },
              null,
              2
            ),
            agentName: "ChatGPT Copilot",
          }),
        });
        const data = await resp.json();
        setTestResult({
          type: "write",
          endpoint: "POST /api/gpt/write-file",
          response: data,
        });
      } else if (type === "chat") {
        const resp = await fetch("/api/gpt/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Xin chào! Tôi là ChatGPT Copilot vừa kết nối trực tiếp vào phòng họp Web Agent của bạn lúc ${new Date().toLocaleTimeString("vi-VN")}. Tôi đã sẵn sàng nhận lệnh đọc và sửa code!`,
            agentName: "ChatGPT Copilot",
          }),
        });
        const data = await resp.json();
        setTestResult({
          type: "chat",
          endpoint: "POST /api/gpt/chat",
          response: data,
        });
      } else {
        const resp = await fetch("/api/gpt/directive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            directive: testDirective,
            agentName: "ChatGPT Custom GPT (Test Bot)",
            priority: "high",
          }),
        });
        const data = await resp.json();
        setTestResult({
          type: "directive",
          endpoint: "POST /api/gpt/directive",
          response: data,
        });
      }
    } catch (err: any) {
      setTestResult({
        type: "error",
        endpoint: "Error",
        response: { error: err.message || "Lỗi kiểm tra API" },
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Cổng Kết Nối ChatGPT / Custom GPT (GPT Bridge Actions)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  OpenAPI 3.1 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cho phép ChatGPT hoặc GPT của bạn kiểm tra (check) mã nguồn và gửi cập nhật (update) tức thì
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-5">
          {/* Quick Answer Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-emerald-200 text-sm">
                GPT của bạn HOÀN TOÀN CÓ THỂ truy cập để Check & Update!
              </p>
              <p className="text-slate-300 leading-relaxed">
                Hệ thống đã mở sẵn <strong>OpenAPI Schema chuẩn quốc tế</strong>. Bạn chỉ cần copy link Action bên dưới và dán vào phần <strong>&quot;Actions&quot;</strong> của Custom GPT trên ChatGPT, GPT của bạn sẽ có đầy đủ quyền đọc dữ liệu, kiểm tra các nhiệm vụ WBS và gửi lệnh điều khiển vào AgentCorp!
              </p>
            </div>
          </div>

          {/* 1-Click Action URL */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Đường dẫn OpenAPI Schema (Dán vào ChatGPT Actions):</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">OpenAPI 3.1.0</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={openApiUrl}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none select-all"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Đã Copy!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link Action</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Step Integration Guide */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hướng Dẫn 3 Bước Cài Đặt Vào Custom GPT (Chỉ 30 Giây):</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
                  1
                </div>
                <p className="font-bold text-slate-200">Mở Custom GPT trên ChatGPT</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Vào <strong>chatgpt.com</strong> &rarr; Chọn <strong>Explore GPTs</strong> &rarr; Bấm <strong>Create a GPT</strong> (hoặc cấu hình GPT có sẵn của bạn).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                  2
                </div>
                <p className="font-bold text-slate-200">Thêm Action từ URL</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Chọn tab <strong>Configure</strong> &rarr; kéo xuống mục <strong>Actions</strong> &rarr; bấm <strong>Create new action</strong> &rarr; bấm <strong>Import from URL</strong> và dán link ở trên vào.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs border border-cyan-500/30">
                  3
                </div>
                <p className="font-bold text-slate-200">Ra lệnh cho GPT</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Bấm Lưu. Giờ bạn chỉ cần chat với GPT: <em>&quot;Check dự án AgentCorp giúp tôi&quot;</em> hoặc <em>&quot;Cập nhật thêm server và đổi màu giao diện&quot;</em>!
                </p>
              </div>
            </div>
          </div>

          {/* Endpoints Capability Matrix */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Các Quyền Năng GPT Có Thể Gọi Để Đọc & Sửa Code:</span>
              <span className="text-[10px] text-emerald-400 font-bold">7 Actions OpenAPI</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    POST
                  </span>
                  <span className="font-mono text-emerald-200 text-[11px] font-bold">/api/gpt/write-file</span>
                </div>
                <span className="text-emerald-300 font-semibold text-[11px]">
                  ✍️ TRỰC TIẾP SỬA & GHI ĐÈ FILE CODE TRÊN MÁY CHỦ (Áp dụng tức thì!)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    GET
                  </span>
                  <span className="font-mono text-slate-200 text-[11px]">/api/gpt/read-file?path=...</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  📖 Đọc toàn bộ nội dung code của bất kỳ file nào trong dự án
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    GET
                  </span>
                  <span className="font-mono text-slate-200 text-[11px]">/api/gpt/files</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  📂 Xem danh sách tất cả các file mã nguồn hiện có
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    POST
                  </span>
                  <span className="font-mono text-slate-200 text-[11px]">/api/gpt/chat</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  💬 Nhắn tin hoặc báo cáo sửa code trực tiếp vào phòng họp Web Agent
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    GET
                  </span>
                  <span className="font-mono text-slate-200 text-[11px]">/api/gpt/status</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  🔍 Kiểm tra trạng thái hoạt động & link xem live
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    GET
                  </span>
                  <span className="font-mono text-slate-200 text-[11px]">/api/gpt/tasks</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  📋 Đọc danh sách 6 nhiệm vụ WBS & kết quả nghiệm thu của các Agent
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live Test Sandbox */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-200">
                  Chạy Thử Nghiệm Quyền Đọc & Sửa Code Trực Tiếp (Live Test Sandbox)
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Mô phỏng như GPT thật</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleRunTest("files")}
                disabled={isTesting}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Xem Danh Sách File</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunTest("read")}
                disabled={isTesting}
                className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>2. Đọc File Code</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunTest("write")}
                disabled={isTesting}
                className="px-2.5 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Sửa / Ghi Code Thật</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunTest("chat")}
                disabled={isTesting}
                className="px-2.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>4. Nhắn Vào Chat Web</span>
              </button>
            </div>

            {/* Test Output Console */}
            {testResult && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/80">
                  <span className="text-emerald-400 font-bold">{testResult.endpoint}</span>
                  <span className="text-[10px]">HTTP 200 OK</span>
                </div>
                <pre className="text-slate-300 max-h-40 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                  {JSON.stringify(testResult.response, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Sample Instructions Prompt */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Mẫu Câu Lệnh Cấu Hình (System Instructions cho Custom GPT):</span>
              </label>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? "Đã chép" : "Sao chép mẫu prompt"}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={sampleGptSystemPrompt}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] focus:outline-none resize-none select-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hỗ trợ cả ChatGPT Plus, Custom GPTs, Cursor AI & Claude Desktop!</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
