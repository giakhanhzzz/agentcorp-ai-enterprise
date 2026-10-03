# 🏢 AgentCorp Enterprise — Autonomous Multi-Agent AI Corporation

> **Hệ thống đa tác nhân AI tự vận hành như một tập đoàn công nghệ:** Tự động phân tích bài toán, lập cơ cấu phân rã công việc (WBS 6 nhiệm vụ), kích hoạt hội đồng quản trị AI phản biện đa chiều, và tự động thực thi mã nguồn với cổng kết nối ChatGPT Actions / GPT Direct Code API.

---

## 🌟 Tính Năng Cốt Lõi

1. **🏛️ Hội Đồng Quản Trị Đa Tác Nhân (AI Boardroom):**
   * **CEO (Trần Đình Nam):** Định hướng chiến lược, ra quyết nghị tối cao và phê duyệt sản phẩm bàn giao.
   * **Kiến Trúc Sư Hệ Thống (Trần Tuấn Anh):** Thiết kế kiến trúc giải pháp, gateway chịu tải và hạ tầng kỹ thuật.
   * **Giám Đốc Sản Phẩm CPO (Lê Hoàng Nam):** Phân rã WBS, thiết kế trải nghiệm người dùng (UX) và tính toán các thuật toán cốt lõi.
   * **Thẩm Định & Rủi Ro QA (Vũ Đức Thắng):** Pentest bảo mật, kiểm thử chịu tải và thiết lập tường lửa.
   * **Tiếp Thị & Tăng Trưởng CMO (Phạm Mai Linh):** Chiến lược Go-To-Market, định vị thương hiệu và tăng trưởng người dùng.
   * **Tài Chính & Vận Hành CFO (Đoàn Thu Hương):** Quản trị ngân sách máy chủ $0 và dự phóng dòng tiền.

2. **🤖 Động Cơ Đổi AI Linh Hoạt (Multi-AI Model Switcher):**
   * **Google Gemini 3.8 Flash:** Tích hợp sẵn, xử lý tốc độ cao và xuất JSON có cấu trúc.
   * **OpenAI (ChatGPT / GPT-4o / GPT-4o-mini / o3-mini):** Tùy chọn nhập API Key riêng.
   * **DeepSeek (V3 / R1 Reasoner):** Suy luận chuỗi tư duy sâu.
   * **Groq Free (Llama 3.3 70B):** Tốc độ phản hồi cực nhanh dưới 500ms.
   * **OpenRouter & Ollama Local:** Tự do tùy biến mô hình cục bộ riêng tư 100%.

3. **⚡ Cổng Tích Hợp ChatGPT Actions (GPT Direct Code API):**
   * Chuẩn **OpenAPI 3.1.0** tại `/api/gpt/openapi.json`.
   * Cho phép ChatGPT / Custom GPT gọi hàm:
     * `getProjectFiles`: Xem danh sách toàn bộ file mã nguồn.
     * `readSourceFile`: Đọc nội dung chi tiết từng dòng code.
     * `writeSourceFile`: Trực tiếp sửa và ghi đè mã nguồn tệp trên máy chủ.
     * `sendChatMessage`: Nhắn tin và báo cáo kết quả trực tiếp vào khung chat Web Agent.

4. **🚀 Danh Mục Dự Án Mẫu Đã Triển Khai (Product Portfolio):**
   * **Motfilm Pro 4K:** Nền tảng xem phim streaming OTT HLS 60FPS kết nối kho KKPhim 30,000+ phim, Ambient Lighting, tường lửa chống leech link.
   * **TFT Meta Pro (Patch 15.2):** Cẩm nang Đấu Trường Chân Lý Mùa 18 & Mùa 13, tính xác suất Roll tướng cấp 8 và bản đồ BiS.
   * **Apex Legends Pro Tracker:** Radar meta Season 23, tính thời gian hạ gục TTK vũ khí giáp đỏ và EA Telemetry Gateway 120Hz.

---

## 🛠️ Cài Đặt & Chạy Trên Máy Tính (Local)

```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Khởi chạy máy chủ phát triển (Express + Vite)
npm run dev

# 3. Mở trình duyệt tại:
http://localhost:3000
```

---

## 🚀 Triển Khai Lên Vercel / Render

1. Tạo một repository mới trên GitHub (khuyên dùng chế độ **Private**).
2. Đẩy toàn bộ mã nguồn lên GitHub.
3. Đăng nhập vào [Vercel.com](https://vercel.com), chọn **Add New Project** và liên kết với GitHub Repo.
4. Cấu hình tự động:
   * **Framework:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Bấm **Deploy**. Website sẽ hoạt động online 24/7 với tên miền miễn phí!
