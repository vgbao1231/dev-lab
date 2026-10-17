# AGENTS.md

Hướng dẫn này dành cho AI agent (Claude Code, Cursor, Copilot, v.v.) khi làm việc trong repo Dev Lab.

## 1. Đọc trước khi làm

Trước khi thay đổi bất kỳ thứ gì, đọc theo thứ tự:

1. `docs/PROJECT_OVERVIEW.md`: hiểu mục tiêu, phạm vi và định hướng kiến trúc.
2. `docs/ROADMAP.md`: xác định giai đoạn hiện tại và việc đang làm.
3. `docs/DESIGN_SYSTEM.md`: nếu việc liên quan đến giao diện, màu sắc, typography.

Nếu yêu cầu mâu thuẫn với các tài liệu trên, hỏi lại người dùng thay vì tự quyết.

## 2. Nguyên tắc chung

- **Không tự chốt quyết định kiến trúc.** Các mục ghi trong `PROJECT_OVERVIEW.md` mục "Những điều chưa quyết định" là chưa chốt. Đề xuất phương án kèm đánh đổi, chờ người dùng xác nhận.
- **Phạm vi nhỏ, thay đổi nhỏ.** Mỗi thay đổi nên giải quyết một việc. Không refactor hoặc đổi cấu trúc ngoài phạm vi được yêu cầu.
- **Giải thích trước, code sau.** Với nội dung kỹ thuật, ưu tiên giải thích cơ chế hoạt động rồi mới đưa ví dụ code.
- **Không thêm dependency mới** nếu chưa được đồng ý. Ghi rõ lý do khi đề xuất.
- **Không tạo tính năng chỉ để dogfood.** Việc dùng công nghệ để xây website là tùy chọn, không bắt buộc cho mọi bài viết.

## 3. Quy tắc code

### TypeScript

- Bật `strict`. Không dùng `any` trừ khi có comment giải thích.
- Ưu tiên `type` cho props và dữ liệu đơn giản, `interface` khi cần mở rộng.
- Tên biến và hàm dùng tiếng Anh. Comment có thể dùng tiếng Việt.

### React (trong các lab React)

- Function component, không dùng class component.
- Mỗi component một file, tên file trùng tên component (PascalCase).
- Không đặt logic nghiệp vụ trong JSX. Tách ra hook hoặc hàm thuần.

### CSS và styling

- Mọi màu sắc và font chữ **phải** lấy từ CSS variables trong `DESIGN_SYSTEM.md`. Không hard-code mã màu trong component.
- Không dùng inline style cho màu hoặc font.
- Không thêm gradient, glow, hay hiệu ứng trang trí nếu chưa có trong design system.

### Nội dung bài viết

- Viết bằng tiếng Việt, thuật ngữ kỹ thuật giữ nguyên tiếng Anh (ví dụ: `useMemo`, `reconciliation`, `event loop`).
- Mỗi bài có frontmatter đầy đủ: `title`, `date`, `type`, `lab`, `tags`, `summary`.
- `type` là một trong: `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note`.

## 4. Kiểm tra trước khi báo hoàn thành

Trước khi nói một việc đã xong, chạy và báo kết quả:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Nếu có lệnh nào thất bại, không báo hoàn thành. Mô tả lỗi và đề xuất cách sửa.

Với thay đổi giao diện, kiểm tra cả 4 chế độ màu (Warm Dark, Warm Light, Soft Dark, Soft Light) và viewport mobile.

## 5. Cập nhật tài liệu

- Hoàn thành một checklist trong `ROADMAP.md` thì đánh dấu `[x]` trong cùng thay đổi.
- Thay đổi cấu trúc thư mục thì cập nhật phần "Cấu trúc thư mục" trong `README.md`.
- Thay đổi token màu hoặc font thì cập nhật `DESIGN_SYSTEM.md` trước, rồi mới sửa code.

## 6. Commit và branch

- Commit theo Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.
- Một branch cho một việc. Tên branch: `feat/<mô-tả-ngắn>`, `docs/<mô-tả-ngắn>`.
- Không commit trực tiếp lên `main`.
