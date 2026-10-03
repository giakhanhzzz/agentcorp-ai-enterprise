# CẨM NANG VIBE CODING VÀ LẬP TRÌNH BẢO MẬT VỚI AI
*Tài liệu nội bộ ban hành cho Hội Đồng AI Quản Trị & Đội Ngũ Kỹ Thuật AgentCorp*

---

## GIAI ĐOẠN 0: Nguyên tắc Cốt lõi (Tâm pháp bắt buộc)
Hãy ghim các nguyên tắc này trước khi bắt đầu bất kỳ dự án nào với AI:
1. **Tuyệt đối không dán dữ liệu thật:** Khi nhờ AI fix lỗi, hãy đổi thông tin tài khoản, mật khẩu, URL database, token thật thành các ký tự giả định (ví dụ: `your_api_key_here`, `db_password_123`) để tránh bị AI học hoặc lộ dữ liệu trên môi trường đám mây.
2. **Luôn yêu cầu giải thích:** Đừng bao giờ copy-paste mù quáng code AI tạo ra. Hãy luôn hỏi: *"Đoạn code này hoạt động thế nào và nó có điểm yếu nào không?"* để bạn giữ quyền kiểm soát hệ thống.

---

## GIAI ĐOẠN 1: Thiết kế & Xây dựng Tính năng mới (Master Prompt)
*Sử dụng khi bắt đầu một tính năng mới. Kết hợp tư duy hệ thống và các yêu cầu bảo mật khắt khe nhất.*

**Đóng vai:** Bạn là một Full-stack Developer kiêm Cybersecurity Auditor dày dạn kinh nghiệm.

### 1. Bối cảnh dự án (Context):
- Tính năng cần làm: [Ví dụ: API Đăng nhập / Tính năng thanh toán / Upload file / Streaming Video]
- Ngôn ngữ/Tech stack: [Ví dụ: Node.js/Express, TypeScript, React, PostgreSQL/Cloud SQL]

### 2. Yêu cầu luồng nghiệp vụ (Business Logic):
- [Mô tả ngắn gọn cách tính năng hoạt động, ví dụ: User nhập email/pass -> Kiểm tra DB -> Trả về JWT token]

### 3. Yêu cầu Đầu ra bắt buộc (Trình bày theo đúng 4 bước):
- **Bước 1 - Quy trình (Workflow):** Vẽ ra các bước logic để hiểu luồng dữ liệu.
- **Bước 2 - Mã nguồn an toàn (Secure Code):** Bắt buộc áp dụng các chuẩn bảo mật sau:
  - Không ghép chuỗi trực tiếp khi truy vấn Database để chống SQL Injection (Dùng parameterized queries/ORM).
  - Phải kiểm tra và làm sạch dữ liệu đầu vào (Input Validation & Sanitization) bằng thư viện [Zod hoặc Joi].
  - Nếu có mật khẩu, bắt buộc hash bằng bcrypt hoặc argon2 với cost factor >= 10.
  - Thêm cơ chế Rate Limiting để chống Brute Force.
  - Mọi dữ liệu nhạy cảm (Key, URL) phải lấy từ biến môi trường. Giải thích rõ từng giải pháp bảo mật đã chèn vào code.
- **Bước 3 - Cảnh báo Bảo mật (Security Audit):** Chỉ ra 2-3 lỗ hổng tiềm ẩn nhất với luồng nghiệp vụ này và cách đoạn code trên đã phòng chống chúng.
- **Bước 4 - Đánh đổi (Trade-offs):** Nhược điểm của cách tiếp cận này là gì (Performance, scale...) và hướng tối ưu tương lai.

---

## GIAI ĐOẠN 2: Rà soát & Sửa lỗi Code hiện tại (Security Audit)
*Sử dụng khi có một đoạn code/file cấu hình cần kiểm tra an toàn.*

**Đóng vai:** Bạn là một chuyên gia đánh giá an toàn thông tin (Cybersecurity Auditor). Hãy rà soát đoạn code và tìm kiếm các lỗ hổng bảo mật nghiêm trọng.

### Các hạng mục kiểm tra kỹ:
1. **Thông tin nhạy cảm:** Có API key, mật khẩu, database URL nào đang bị viết trực tiếp (hardcode) không? Nếu có, chuyển sang `.env`.
2. **Rò rỉ dữ liệu:** Có dữ liệu nhạy cảm nào đang bị vô tình in ra màn hình console (Log) hoặc trả về cho người dùng qua API không?
3. **Phân quyền (RBAC / IDOR):** Hệ thống phân quyền có bị lỗi không? (Người dùng thường có thể xem/sửa dữ liệu của người khác hoặc quản trị viên không?)
4. **Lỗ hổng kinh điển:** Các lỗi kinh điển như XSS, CSRF, SQL Injection, SSRF có khả năng xảy ra không?

**Định dạng đầu ra:**
- Liệt kê các lỗi tìm thấy kèm mức độ nguy hiểm: [Nghiêm trọng / Cao / Trung bình].
- Cung cấp đoạn code sửa đổi chính xác.

---

## GIAI ĐOẠN 3: Triển khai Hạ tầng & Máy chủ (Server Deployment)
*Sử dụng khi cấu hình môi trường chạy thực tế (Production) để tránh lộ file `.env` hoặc sai quyền truy cập thư mục.*

**Đóng vai:** Bạn là một DevOps Engineer và hướng dẫn từng bước bằng dòng lệnh (CLI) để bảo mật máy chủ:
1. **Cấu hình Nginx/Apache:** Chặn hoàn toàn việc người ngoài (public) truy cập vào các file/thư mục nhạy cảm như `.env`, `.git`, `config`, `node_modules` từ trình duyệt.
2. **Phân quyền tệp tin (File Permissions):** Thiết lập quyền an toàn trên Linux (ví dụ: cấp quyền thư mục 755, file 644, user/group ownership an toàn).
3. **Tường lửa (UFW):** Bật tường lửa và chỉ mở các cổng kết nối thực sự cần thiết (80, 443, 22).

---

## GIAI ĐOẠN 4: Phân tích và Thiết kế Hệ thống (UML/Diagrams)
*Sử dụng khi cần phác thảo kiến trúc phần mềm, ví dụ như xây dựng luồng xử lý cho một dự án quản lý.*

**Prompt mẫu:**
> "Đóng vai là một System Analyst. Hãy phân tích Use Case [Ví dụ: Quản lý thuê bao VIP / Streaming CDN / Đơn hàng] và cung cấp mã PlantUML (hoặc Mermaid) để tạo Class Diagram và Sequence Diagram. Yêu cầu: Tuân thủ nghiêm ngặt các quy chuẩn thiết kế hướng đối tượng (OOP), định nghĩa rõ các lớp, thuộc tính, phương thức và thông điệp giao tiếp giữa các đối tượng."

---

## GIAI ĐOẠN 5: Thiết kế Kịch bản Kiểm thử (Software Testing)
*Sử dụng khi cần tài liệu kiểm thử chuẩn mực, tránh việc test theo cảm tính.*

**Prompt mẫu:**
> "Đóng vai là một QA Engineer. Hãy thiết kế bộ Test Case toàn diện cho tính năng [Ví dụ: Player Streaming / Đăng ký VIP / Tìm kiếm phim]. Yêu cầu bắt buộc: Áp dụng kỹ thuật Phân vùng tương đương (Equivalence Partitioning) và Phân tích giá trị biên (Boundary Value Analysis). Vui lòng trình bày kết quả dưới dạng bảng chứa Test Data và Decision Tables theo đúng tiêu chuẩn chuyên môn của ISTQB."

---

## GIAI ĐOẠN 6: Xây dựng và Tích hợp Mobile App
*Sử dụng khi phát triển ứng dụng di động, đặc biệt là khi cần ghép nối nhiều màn hình phức tạp.*

**Prompt mẫu:**
> "Đóng vai là một Mobile Developer. Hãy viết mã nguồn [Flutter/Dart hoặc React Native] để tích hợp các module [Ví dụ: WatchScreen và SearchScreen] thành một hệ thống hoạt động xuyên suốt. Yêu cầu: Mã nguồn phải súc tích, tách bạch hoàn toàn giữa giao diện (UI) và nghiệp vụ (Business Logic / State Management), có chú thích rõ ràng tại các điểm xử lý luồng dữ liệu."
