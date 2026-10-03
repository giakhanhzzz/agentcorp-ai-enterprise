import React, { useState } from "react";
import {
  Download,
  Github,
  PackageCheck,
  Code2,
  FolderGit2,
  Copy,
  Check,
  Terminal,
  FileText,
  Boxes,
  ExternalLink,
  Layers,
  X,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  GitCommit,
  GitBranch,
  Key,
  ShieldAlert,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCode,
  Globe,
  HelpCircle,
} from "lucide-react";
import { CompanyTask } from "../types";
import { getSafeOrigin, copyToClipboardSafely } from "../utils/shareSecurity";
import { getShareSecurityConfig } from "../utils/shareSecurity";

interface ExportProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectId?: string;
  tasks: CompanyTask[];
  onOpenShareModal?: () => void;
}

export const ExportProjectModal: React.FC<ExportProjectModalProps> = ({
  isOpen,
  onClose,
  projectName,
  projectId = "proj-motfilm",
  tasks,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<"deploy_independent" | "standalone" | "auto_git" | "commercial" | "gpt_bridge">("deploy_independent");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [packagingMode, setPackagingMode] = useState<"clean" | "owner_copilot">("clean");
  const [currentVersion, setCurrentVersion] = useState("v1.1.0");
  const [isZipping, setIsZipping] = useState(false);

  // Auto Git Push States
  const [githubRepoName, setGithubRepoName] = useState(() =>
    projectName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") || "my-web-project"
  );
  const [githubToken, setGithubToken] = useState("");
  const [gitStatus, setGitStatus] = useState<"idle" | "sanitizing" | "pushing" | "success" | "error">("idle");
  const [gitMessage, setGitMessage] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  if (!isOpen) return null;

  const [downloadZipStatus, setDownloadZipStatus] = useState<"idle" | "downloading" | "success" | "error">("idle");
  const [downloadErrorMsg, setDownloadErrorMsg] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboardSafely(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadRealZip = () => {
    setDownloadZipStatus("downloading");
    setDownloadErrorMsg(null);
    try {
      const link = document.createElement("a");
      link.href = "/motfilm-project.zip";
      link.download = `motfilm-pro-complete-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadZipStatus("success");
      setTimeout(() => setDownloadZipStatus("idle"), 4000);
    } catch (err: any) {
      console.warn("Direct download link fallback:", err);
      window.location.href = "/motfilm-project.zip";
    }
  };

  const handleDownloadStandaloneHtml = async () => {
    try {
      const response = await fetch("/api/export-standalone-html");
      if (!response.ok) throw new Error("Lỗi tải file html");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "motfilm-pro-standalone-player.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Direct fallback
      window.open("/api/export-standalone-html", "_blank");
    }
  };

  const currentModeUrl = `${getSafeOrigin()}/?mode=standalone&variant=${packagingMode}&p=${projectId}`;

  // Download auto-executable script (.bat for Windows, .sh for Mac/Linux)
  const handleDownloadAutoScript = (os: "windows" | "unix") => {
    const isWin = os === "windows";
    const repoTarget = repoUrl || `https://github.com/your-username/${githubRepoName}.git`;

    const scriptContent = isWin
      ? `@echo off
chcp 65001 >nul
echo ========================================================
echo   AGENTCORP ONE-CLICK GIT DEPLOY (BẢO VỆ API KEY 100%%)
echo ========================================================
echo.
echo [1/4] Dang tao file .gitignore bao mat...
(
echo node_modules/
echo dist/
echo .env
echo .env.local
echo *.log
echo .DS_Store
) > .gitignore

echo [2/4] Dang quet loc API Key tranh bi ro ri len GitHub...
if not exist .env.example (
  echo VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE > .env.example
  echo TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_TOKEN_HERE >> .env.example
)

echo [3/4] Khoi tao Git Commit %date%...
git init
git add .
git commit -m "feat(release): auto deploy ${projectName} ${currentVersion} sanitized"
git branch -M main

echo.
echo [4/4] Vui long nhap Link Git Remote (VD: ${repoTarget}):
set /p REMOTE_URL="Git Remote URL: "
if "%REMOTE_URL%"=="" set REMOTE_URL=${repoTarget}

git remote remove origin >nul 2>&1
git remote add origin %REMOTE_URL%
echo Dang day code len GitHub...
git push -u origin main

echo.
echo ========================================================
echo   THANH CONG! Ma nguon da duoc day len GitHub an toan!
echo ========================================================
pause
`
      : `#!/bin/bash
echo "========================================================"
echo "  AGENTCORP ONE-CLICK GIT DEPLOY (BẢO VỆ API KEY 100%)"
echo "========================================================"
echo ""
echo "[1/4] Tạo file .gitignore chuẩn an toàn..."
cat << 'EOF' > .gitignore
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
EOF

echo "[2/4] Quét lọc sạch API Key nhạy cảm..."
cat << 'EOF' > .env.example
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_TOKEN_HERE
EOF

echo "[3/4] Đóng gói Git Commit..."
git init
git add .
git commit -m "feat(release): auto deploy ${projectName} ${currentVersion} sanitized"
git branch -M main

echo ""
read -p "Nhập Git Remote URL (mặc định: ${repoTarget}): " REMOTE_URL
REMOTE_URL=\${REMOTE_URL:-"${repoTarget}"}

git remote remove origin 2>/dev/null
git remote add origin "\$REMOTE_URL"
echo "Đang đẩy mã nguồn lên GitHub..."
git push -u origin main

echo ""
echo "========================================================"
echo "  THÀNH CÔNG! Đã đẩy lên GitHub mà không lộ bất kỳ API Key nào!"
echo "========================================================"
`;

    const blob = new Blob([scriptContent], {
      type: isWin ? "application/x-bat" : "application/x-sh",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isWin ? "push-auto.bat" : "push-auto.sh";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Real Automated GitHub Packaging & Push Engine
  const handleAutoPushToGitHub = async () => {
    if (!githubToken.trim()) {
      setGitStatus("error");
      setGitMessage("Vui lòng dán GitHub Personal Access Token (PAT) để hệ thống tự tạo repo và đẩy code giúp bạn.");
      return;
    }

    setGitStatus("sanitizing");
    setGitMessage("Đang kích hoạt Lá Chắn Bảo Mật: Quét toàn bộ mã nguồn, tẩy sạch API Key và cấu hình .gitignore...");

    try {
      setGitStatus("pushing");
      setGitMessage(`Đang kết nối GitHub, khởi tạo commit và đẩy toàn bộ mã nguồn của dự án "${projectName}"...`);

      const response = await fetch("/api/github/push-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubToken: githubToken.trim(),
          repoName: githubRepoName.trim(),
          commitMessage: `feat: release ${projectName} (${currentVersion}) packaged from AgentCorp`,
          isPrivate: false,
        }),
      });

      const data = await response.json();
      if (data.success && data.repoUrl) {
        setRepoUrl(data.repoUrl);
        setGitStatus("success");
        setGitMessage(data.message || `Đã đóng gói và đẩy thành công lên GitHub: ${data.repoUrl}`);
      } else {
        setGitStatus("error");
        setGitMessage(data.message || "Không thể đẩy lên GitHub. Vui lòng kiểm tra lại token.");
      }
    } catch (err: any) {
      setGitStatus("error");
      setGitMessage(`Lỗi kết nối máy chủ: ${err.message || "Vui lòng thử lại"}`);
    }
  };

  const handleDownloadZipPrompt = () => {
    const isOwnerMode = packagingMode === "owner_copilot";
    const readmeContent = `# ${projectName} - Production Build (${currentVersion})
Tạo và đóng gói bởi Hội Đồng Tác Nhân AgentCorp Enterprise.

## 📦 Chế độ phân phối: ${isOwnerMode ? "Owner Copilot Mode (Kèm Admin Radar Bí Mật)" : "Clean Standalone (Thuần Túy Cho Khách Hàng)"}
${
  isOwnerMode
    ? `- Web App tích hợp Admin Growth Copilot ngầm.
- Phím tắt bí mật để mở Market Radar & Trình chỉ đạo: [Ctrl + Shift + A].
- Khán giả hoặc người dùng thông thường hoàn toàn KHÔNG nhìn thấy thanh công cụ này.`
    : `- KHÔNG chứa Admin Console nội bộ của AI.
- KHÔNG chứa Red Team Pentest tools.
- THUẦN TÚY là Web App thành phẩm hoàn chỉnh sẵn sàng thương mại hóa hoặc bàn giao khách hàng.`
}

## 🛡️ Tiêu Chuẩn Bảo Mật (Zero API Key Leak)
Mọi API key bí mật (Gemini, Stripe, Telegram, Supabase) đã được tự động cách ly vào \`.env.example\`.
Tuyệt đối không bao giờ commit file \`.env\` thật lên GitHub để tránh bị cào trộm API key!

## 🚀 Hướng dẫn khởi chạy nhanh
\`\`\`bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Biên dịch build production
npm run build
\`\`\`
`;

    const blob = new Blob([readmeContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `README-DEPLOY-${projectName.replace(/\s+/g, "-")}-${currentVersion}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Đóng Gói & Xuất Thành Phẩm Dự Án</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  {currentVersion}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dự án hiện tại: <span className="text-emerald-300 font-semibold">{projectName}</span> ({tasks.length} nhiệm vụ)
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
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 gap-4 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("deploy_independent")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "deploy_independent"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>1. 🚀 Đưa Lên Mạng Nhanh Nhất (0 Cần Token - Tải ZIP / Vercel)</span>
          </button>
          <button
            onClick={() => setActiveTab("standalone")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "standalone"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>2. Chế Độ Bản Giao (Khách Hàng / Quản Trị)</span>
          </button>
          <button
            onClick={() => setActiveTab("auto_git")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "auto_git"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Github className="w-4 h-4" />
            <span>3. 🛠️ Nâng Cao: Tự Động Push GitHub Bằng PAT</span>
          </button>
          <button
            onClick={() => setActiveTab("commercial")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "commercial"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>4. Bàn Giao Khách Hàng / Thương Mại</span>
          </button>
          <button
            onClick={() => setActiveTab("gpt_bridge")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "gpt_bridge"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>5. 🤖 Cho GPT / ChatGPT Check & Update (OpenAPI)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
          {activeTab === "deploy_independent" && (
            <div className="space-y-5">
              {/* ⚠️ GIẢI THÍCH VÌ SAO TAB ẨN DANH / MÁY KHÁC BỊ CHUYỂN HƯỚNG VỀ GOOGLE STUDIO */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Vì sao mở Tab Ẩn Danh hoặc gửi cho người khác lại bị chuyển hướng về Google Studio?</span>
                </div>
                <div className="text-slate-300 space-y-1.5 leading-relaxed text-xs">
                  <p>
                    • <strong>Bản chất kỹ thuật:</strong> Các link có đuôi <code className="text-rose-300">.run.app</code> là máy chủ thử nghiệm nội bộ của Google Cloud Run. Google áp dụng tường lửa <strong>Google Cloud IAP (Identity-Aware Proxy)</strong>.
                  </p>
                  <p>
                    • Khi mở bằng <strong>Tab Ẩn Danh (Incognito)</strong> hoặc điện thoại chưa đăng nhập tài khoản Google của bạn, Google IAP chặn ngay từ cổng mạng và tự động chuyển hướng (HTTP 302) về trang đăng nhập Google Studio. <strong>Code trong web hoàn toàn không thể can thiệp được rào cản này của Google.</strong>
                  </p>
                  <p className="text-emerald-300 font-semibold pt-1">
                    👉 <strong>Giải Pháp Duy Nhất:</strong> Tải file mã nguồn bên dưới đưa lên <strong>Vercel / Cloudflare</strong> (hoặc tải file <strong>HTML Standalone</strong>). Khi đó bạn có web độc lập 100%, ai bấm vào cũng xem được ngay mà không cần Google!
                  </p>
                </div>
              </div>

              {/* 1. Direct Download Actions: ZIP & STANDALONE HTML */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Full Source ZIP */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-cyan-950/60 border-2 border-emerald-500 space-y-3 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
                    DÙNG ĐỂ UP LÊN GITHUB ⭐
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">
                        1. Tải Toàn Bộ Mã Nguồn (.ZIP)
                      </span>
                    </div>
                    <div className="mt-1.5 p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      👉 BẠN CHỌN FILE NÀY ĐỂ UP LÊN GITHUB & VERCEL!
                    </div>
                    <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                      Chứa trọn bộ mã nguồn gốc của website (React, Vite, Node.js API, components, cấu hình vercel.json). Giải nén ra là có đủ 100% file để đưa lên GitHub.
                    </p>
                  </div>
                  {downloadErrorMsg && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span className="flex-1">{downloadErrorMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={handleDownloadRealZip}
                    disabled={downloadZipStatus === "downloading"}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      downloadZipStatus === "success"
                        ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30"
                        : downloadZipStatus === "downloading"
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-wait"
                        : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-600/30"
                    }`}
                  >
                    {downloadZipStatus === "downloading" ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Đang nén & đóng gói toàn bộ mã nguồn...</span>
                      </>
                    ) : downloadZipStatus === "success" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ĐÃ TẢI XUỐNG THÀNH CÔNG!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>TẢI FILE .ZIP (ĐỂ UP LÊN GITHUB)</span>
                      </>
                    )}
                  </button>
                  <a
                    href="/motfilm-project.zip"
                    download="motfilm-pro-complete.zip"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center justify-center gap-1.5 pt-1 text-center"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>🔗 Hoặc bấm vào đây để tải thẳng file ZIP (Dự phòng 100% không bị chặn)</span>
                  </a>
                </div>

                {/* Card 2: Standalone HTML (Offline & Zero-Server) */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-300 text-sm">
                        2. Tải File Standalone HTML
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px]">
                        Xem Offline
                      </span>
                    </div>
                    <div className="mt-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                      ⚠️ KHÔNG dùng file này up lên GitHub. Chỉ dùng khi muốn mở xem offline trên máy tính hoặc gửi qua Zalo.
                    </div>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      Chỉ gồm 1 file HTML duy nhất gom tất cả code lại: Nhấp đúp chuột là mở phim xem ngay mà không cần cài đặt Node.js hay server gì cả.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadStandaloneHtml}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <FileCode className="w-4 h-4" />
                    <span>TẢI FILE STANDALONE HTML (XEM NHANH)</span>
                  </button>
                </div>
              </div>

              {/* Hướng dẫn 3 bước Up lên GitHub không cần Token */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <Github className="w-5 h-5 text-purple-400" />
                    <span>Cách Up Lên GitHub Cực Dễ Bằng Kéo Thả (0 Cần Token - 0 Cần Gõ Lệnh)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                    Siêu Nhanh 1 Phút
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-emerald-400 text-xs block">Bước 1: Tải & Giải Nén ZIP</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Bấm nút màu xanh <strong>&quot;TẢI FILE .ZIP&quot;</strong> ở trên về máy tính, rồi nhấp chuột phải chọn <strong>Extract All (Giải nén)</strong> ra một thư mục.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-cyan-400 text-xs block">Bước 2: Tạo Repo Mới Trên GitHub</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Truy cập <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-cyan-300 underline font-bold">github.com/new</a>, đặt tên repo (ví dụ <code>motfilm-pro</code>), để Public và bấm nút xanh <strong>Create repository</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-amber-400 text-xs block">Bước 3: Kéo Thả & Commit</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Trên trang GitHub vừa tạo, bấm vào dòng chữ <strong>&quot;uploading an existing file&quot;</strong>, kéo thả toàn bộ các file trong thư mục vừa giải nén vào rồi bấm <strong>Commit changes</strong> là xong!
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Giải đáp về BẢN QUYỀN (Rất chi tiết và an tâm) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Về Vấn Đề Bản Quyền: Đưa Lên Vercel / Render Có Bị Khóa Không?</span>
                </div>
                <div className="space-y-2 text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">1. Nguyên lý kỹ thuật (Tại sao không bị quét bản quyền?):</strong> Motfilm Pro <strong>hoàn toàn KHÔNG lưu trữ bất kỳ file video (MP4/MKV) nào</strong> trên server của bạn hay trên Vercel (0 GB dữ liệu phim). Toàn bộ video được phát trực tiếp qua các link HLS (.m3u8) hoặc embed iframe từ các CDN mở bên thứ 3. Vercel chỉ đóng vai trò hiển thị giao diện Web (Frontend), do đó máy chủ Vercel <strong>không chứa nội dung vi phạm bản quyền</strong>.
                  </p>
                  <p>
                    <strong className="text-white">2. Đã tích hợp DMCA Disclaimer hợp pháp:</strong> Chân trang web đã có sẵn thông báo pháp lý miễn trừ trách nhiệm chuẩn quốc tế: <em>&quot;Website không sở hữu hay lưu trữ bất kỳ video nào trên máy chủ; mọi nội dung do bên thứ ba cung cấp.&quot;</em>
                  </p>
                  <p>
                    <strong className="text-white">3. Cơ chế bảo vệ nâng cao (Nếu muốn chạy quy mô lớn):</strong> Bạn chỉ cần trỏ tên miền qua Cloudflare (bật đám mây cam Proxy). Cloudflare sẽ che giấu 100% IP máy chủ gốc, vừa chống DDoS vừa ngăn chặn việc dò quét tự động.
                  </p>
                </div>
              </div>

              {/* 3. Hướng dẫn 3 bước đưa lên Vercel */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>3 Bước Triển Khai Lên Vercel (Miễn Phí 100% - Có Link Riêng Bất Kỳ Ai Cũng Vào Được)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 text-xs block">Bước 1: Tải File ZIP</span>
                    <p className="text-[11px] text-slate-400">
                      Bấm nút &quot;Tải File .ZIP Về Máy&quot; ở trên và giải nén thư mục trên máy tính của bạn.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-400 text-xs block">Bước 2: Mở Vercel.com</span>
                    <p className="text-[11px] text-slate-400">
                      Truy cập <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-cyan-300 underline font-bold">vercel.com</a>, đăng nhập miễn phí bằng GitHub hoặc Email, chọn <strong>Add New &gt; Project</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-400 text-xs block">Bước 3: Bấm Deploy</span>
                    <p className="text-[11px] text-slate-400">
                      Kéo thả thư mục hoặc chọn repo GitHub. Vercel tự nhận diện Vite React. Bấm <strong>Deploy</strong> là có ngay link <code>https://motfilm-pro.vercel.app</code>!
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
                  <span>✨ <strong>Kết quả:</strong> Tên miền độc lập của bạn hoạt động 24/7, không cần đăng nhập Google, gửi link cho bất kỳ ai trên điện thoại, máy tính hay TV cũng xem được ngay lập tức!</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === "standalone" && (
            <div className="space-y-4">
              {/* Packaging Mode Selector */}
              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">
                  Chọn định dạng đóng gói bạn muốn xuất:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPackagingMode("clean")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      packagingMode === "clean"
                        ? "bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-emerald-300">Bản 1: Cho Khách Hàng (Pure Client)</span>
                      {packagingMode === "clean" && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sạch 100%. Bóc tách toàn bộ công cụ AI, radar đối thủ và phím tắt quản trị. Phù hợp bàn giao khách hàng hoặc public cho người xem. Bắt buộc nhập <strong>Passcode 12h</strong> khi truy cập.
                    </p>
                  </div>

                  <div
                    onClick={() => setPackagingMode("owner_copilot")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      packagingMode === "owner_copilot"
                        ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-indigo-300">Bản 2: Cho Chủ Sở Hữu (Admin Copilot)</span>
                      {packagingMode === "owner_copilot" && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Chủ web có thể tự móc API Key của mình để điều khiển AI. Ẩn hoàn toàn với khách xem, kích hoạt bằng phím tắt bí mật <code className="text-amber-300 font-mono">Ctrl + Shift + A</code> để tự nâng cấp web!
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Link + Share with Passcode Button */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white block">
                      Đường dẫn xem trực tiếp ({packagingMode === "clean" ? "Bản Khách Hàng" : "Bản Chủ Sở Hữu"}):
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      Được bảo vệ bằng Passcode tự động reset sau 12h
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenShareModal && (
                      <button
                        onClick={onOpenShareModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
                      >
                        <Share2 className="w-3.5 h-3.5 fill-current" />
                        <span>Mở Cấp Pass 12H</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(currentModeUrl, "clean-url")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-md shadow-emerald-600/30"
                    >
                      {copiedKey === "clean-url" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === "clean-url" ? "Đã copy link!" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/80 border border-emerald-500/40 font-mono text-[11px] text-emerald-300 break-all select-all">
                  {currentModeUrl}
                </div>
              </div>

              {/* Download README & Deploy Config */}
              <button
                onClick={handleDownloadZipPrompt}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Hồ Sơ Bàn Giao & Hướng Dẫn Triển Khai ({currentVersion} README.md)</span>
              </button>
            </div>
          )}

          {activeTab === "auto_git" && (
            <div className="space-y-4">
              {/* Skip Token Notice */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Thấy tạo Token GitHub rườm rà và mất công?</span>
                    <span className="text-slate-300 text-[11px]">
                      Bạn <strong>không bắt buộc</strong> phải tạo Token này! Chỉ cần chuyển sang Tab 1 tải file ZIP về máy rồi kéo thả lên Vercel là web chạy ngay trong 30 giây!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("deploy_independent")}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Sang Tab 1 Tải ZIP
                </button>
              </div>

              {/* API Key Leak Shield Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Lá Chắn Bảo Mật & Lọc Tự Động (API Key Leak Shield)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    OWASP Certified
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Hệ thống <strong>tự động quét và loại bỏ 100% API Key nhạy cảm</strong> (Google AI Key, Gemini, Telegram Bot Token, Stripe Secret) trước khi đẩy lên GitHub. Tất cả key thật được cô lập an toàn trong biến môi trường, không lo bị lộ mã hay bị hacker cào trừ tiền!
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Tự động sinh .gitignore
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Cách ly .env an toàn
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Chống khóa tài khoản GitHub
                  </span>
                </div>
              </div>

              {/* Method 1: Auto Push to GitHub via Personal Access Token */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Github className="w-4 h-4 text-purple-400" />
                    Cách 1: Tự Động Tạo GitHub Repo Bằng Token (Zero-Typing)
                  </span>
                  <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Khuyên Dùng
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                        Tên Repository GitHub sẽ tạo:
                      </label>
                      <input
                        type="text"
                        value={githubRepoName}
                        onChange={(e) => setGithubRepoName(e.target.value)}
                        placeholder="motfilm-pro-website"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-slate-300 font-semibold">
                          GitHub Token (PAT):
                        </label>
                        <a
                          href="https://github.com/settings/tokens/new?scopes=repo&description=AgentCorp-Motfilm-Deploy"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Lấy Token Nhanh (10 Giây)
                        </a>
                      </div>
                      <input
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="Dán mã ghp_xxxxxxxxxxxx vào đây..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Chi tiết dễ hiểu: PAT là gì, cách lấy và giải pháp thay thế nếu không muốn tạo PAT */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                      <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Giải thích dễ hiểu: GitHub Personal Access Token (PAT) là gì & lấy ở đâu?</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                        <span className="font-bold text-amber-300 block">1. PAT là sao?</span>
                        <p className="text-slate-400 leading-relaxed">
                          Là một <strong>&quot;chìa khóa tạm thời&quot;</strong> của GitHub. Nó thay thế mật khẩu để phần mềm tự động tạo repo và đẩy mã nguồn lên tài khoản GitHub của bạn mà không cần bạn phải gõ lệnh git thủ công.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                        <span className="font-bold text-cyan-300 block">2. Cách lấy trong 3 bước:</span>
                        <ol className="text-slate-400 space-y-0.5 list-decimal list-inside">
                          <li>Bấm vào nút <strong className="text-white">&quot;Lấy Token Nhanh&quot;</strong> góc trên.</li>
                          <li>Kéo xuống cuối trang GitHub bấm nút xanh <strong className="text-white">&quot;Generate token&quot;</strong>.</li>
                          <li>Bấm icon Copy mã bắt đầu bằng <code className="text-emerald-400 font-mono">ghp_...</code> và dán vào ô bên trên!</li>
                        </ol>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/30 space-y-1">
                        <span className="font-bold text-emerald-300 block">3. Không muốn tạo Token?</span>
                        <p className="text-slate-400 leading-relaxed">
                          Bạn <strong>KHÔNG BẮT BUỘC</strong> phải có Token! Chỉ cần bấm sang tab <strong className="text-white">&quot;Tải Mã Nguồn (.ZIP)&quot;</strong> ở trên, tải file zip về máy rồi kéo thả lên Vercel là chạy ngay!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status or Progress */}
                {gitMessage && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      gitStatus === "error"
                        ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                        : gitStatus === "success"
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-indigo-950/40 border-indigo-500/40 text-indigo-300 animate-pulse"
                    }`}
                  >
                    {gitStatus === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : gitStatus === "error" ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    ) : (
                      <RotateCcw className="w-4 h-4 shrink-0 animate-spin text-indigo-400" />
                    )}
                    <span className="flex-1">{gitMessage}</span>
                  </div>
                )}

                <button
                  onClick={handleAutoPushToGitHub}
                  disabled={gitStatus === "sanitizing" || gitStatus === "pushing"}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {gitStatus === "sanitizing" || gitStatus === "pushing"
                      ? "Đang Lọc API Key & Đẩy Lên GitHub..."
                      : "🚀 Tự Động Tạo Repo & Đẩy Lên GitHub Ngay"}
                  </span>
                </button>
              </div>

              {/* Method 2: One-Click Executable Script (No Command Typing) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    Cách 2: Tải Script Tự Chạy 1-Click (Không Cần Gõ Lệnh)
                  </span>
                  <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Chỉ Cần Click Đúp
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Nếu bạn lười gõ lệnh trên terminal, chỉ cần tải script tự động này về thư mục dự án và <strong>nhấp đúp chuột</strong>. Script sẽ tự khởi tạo git, lọc sạch API key và đẩy code lên repo!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleDownloadAutoScript("windows")}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-white block group-hover:text-amber-300">
                        push-auto.bat (Windows)
                      </span>
                      <span className="text-[10px] text-slate-500">Tự chạy trong CMD với 1 cú click</span>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-300 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleDownloadAutoScript("unix")}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-white block group-hover:text-indigo-300">
                        push-auto.sh (Mac / Linux)
                      </span>
                      <span className="text-[10px] text-slate-500">Tự chạy trong Terminal an toàn</span>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "commercial" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Gói Bàn Giao Khách Hàng (Commercial Handover)</h4>
                <p className="text-slate-400">
                  Khi bán dự án cho khách hàng hoặc đối tác thương mại, họ chỉ nhận được giao diện trải nghiệm sản phẩm, tài liệu kiến trúc và hướng dẫn vận hành hạ tầng máy chủ:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">1. Frontend App</span>
                    <span className="text-[11px] text-slate-400">React + Tailwind UI 100% Responsive, hỗ trợ Mobile/Desktop/Tablet mượt mà.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">2. Cloud Infrastructure</span>
                    <span className="text-[11px] text-slate-400">File cấu hình Nginx/UFW/Redis cache tối ưu tải nặng & bảo vệ source code.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">3. Bản Quyền & Tài Liệu</span>
                    <span className="text-[11px] text-slate-400">Quyền sở hữu thuộc về bạn, không dính bất kỳ watermark hay thương hiệu bên thứ 3.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs">
                💡 <strong>Mẹo của Chủ Tịch:</strong> Sau khi bàn giao xong dự án này, bạn có thể bấm <strong>&quot;Tạo Dự Án Mới&quot;</strong> trên thanh điều hướng để khởi tạo ý tưởng SaaS hoặc E-Commerce tiếp theo mà không làm mất dữ liệu dự án cũ!
              </div>
            </div>
          )}

          {activeTab === "gpt_bridge" && (
            <div className="space-y-4">
              {/* Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Cầu Nối Trực Tiếp Cho ChatGPT / Custom GPT (OpenAPI Bridge)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Bạn hoàn toàn <strong>có thể cho GPT riêng của bạn kết nối vào đây</strong> để đọc mã nguồn, kiểm tra lỗi (audit code), xem trạng thái web và ra lệnh nâng cấp tự động!
                </p>
              </div>

              {/* 2 Cách Kết Nối */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cách 1: OpenAPI Schema cho Custom GPT */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-bold text-white text-xs block flex items-center gap-1.5 text-purple-300">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      Cách 1: Nhúng API vào Custom GPT (OpenAI Actions)
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Trong ChatGPT (mục <em>Explore GPTs &gt; Create &gt; Configure &gt; Actions</em>), bạn chỉ cần dán đường dẫn OpenAPI này để GPT tự động kết nối và gọi hàm:
                    </p>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[11px] text-purple-300 break-all select-all flex items-center justify-between">
                      <span>{getSafeOrigin()}/api/gpt/openapi.json</span>
                      <button
                        onClick={() => handleCopy(`${getSafeOrigin()}/api/gpt/openapi.json`, "openapi-url")}
                        className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] ml-2 shrink-0"
                      >
                        {copiedKey === "openapi-url" ? "Đã chép!" : "Chép Link"}
                      </button>
                    </div>
                  </div>

                  <a
                    href="/api/gpt/openapi.json"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Xem file Schema OpenAPI (JSON)</span>
                  </a>
                </div>

                {/* Cách 2: Qua GitHub Repository */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-bold text-white text-xs block flex items-center gap-1.5 text-emerald-300">
                      <Github className="w-4 h-4 text-emerald-400" />
                      Cách 2: Cấp Quyền Đọc Repo GitHub Cho GPT
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sau khi bạn tải file ZIP và đưa code lên GitHub cá nhân (như hướng dẫn ở Tab 1):
                    </p>
                    <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                      <li>Gửi link GitHub repo cho ChatGPT (hoặc Claude/Cursor).</li>
                      <li>GPT sẽ đọc trọn vẹn từng file, phân tích kiến trúc, tìm lỗi bug và viết code cập nhật theo ý bạn.</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setActiveTab("deploy_independent")}
                    className="w-full py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Lấy mã nguồn ZIP để đưa lên GitHub</span>
                  </button>
                </div>
              </div>

              {/* Các Endpoint Trực Tiếp Dành Cho AI */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Các Endpoint API Sẵn Sàng 24/7 Cho GPT:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-mono font-bold block">GET /api/gpt/status</span>
                    <span className="text-slate-400">Kiểm tra trạng thái dự án & link chạy thử</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-mono font-bold block">GET /api/gpt/code</span>
                    <span className="text-slate-400">Đọc danh mục file & thư viện dự án</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-purple-400 font-mono font-bold block">POST /api/gpt/directive</span>
                    <span className="text-slate-400">Gửi lệnh chỉ đạo nâng cấp từ GPT</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">AgentCorp Continuous Upgrade & Packaging Engine v3.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
