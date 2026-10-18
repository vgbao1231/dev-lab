# Roadmap: Dev Lab

Tài liệu này chia dự án thành các giai đoạn. Mỗi giai đoạn có checklist công việc và tiêu chí hoàn thành.

**Giai đoạn hiện tại: Giai đoạn 1 — Nền tảng và lab React đầu tiên** 🟡 đang thực hiện

---

## Giai đoạn 1: Nền tảng và lab React đầu tiên 🟡 đang thực hiện

**Mục tiêu:** Có một cổng chính tối giản chạy được trên production, cùng một lab React với ít nhất 3 bài viết chất lượng.

### 1.1 Thiết lập repo

- [x] Tạo repo `dev-lab`
- [x] Viết `README.md`, `AGENTS.md`, `docs/`
- [x] Thiết lập pnpm workspace
- [x] Cấu hình ESLint, Prettier, TypeScript (strict)
- [x] Thiết lập CI cơ bản trên GitHub Actions (lint, typecheck, build)

### 1.2 Design tokens

- [x] Tạo file CSS variables cho theme đầu tiên (Minimalist Editorial), đủ light + dark
- [x] Tích hợp font: Patrick Hand, Inter, JetBrains Mono (có fallback và kiểm tra tiếng Việt)
      — thay Balsamiq Sans bằng Patrick Hand vì Balsamiq Sans không có subset tiếng Việt
- [x] Cài đặt chuyển chế độ: tối / sáng / hệ thống
      — theme và mode là hai trục độc lập; bộ chọn theme tự ẩn khi chỉ có một theme khả dụng
- [x] Kiểm tra contrast cho text và link ở Minimalist Editorial light và dark
      — mọi cặp token đạt WCAG AA; secondary text trên surface ở light là 4.87:1, sát ngưỡng nên không được giảm thêm
- [x] Thêm motion tokens (thời lượng, easing) và quy tắc chuyển động — xem `docs/DESIGN_SYSTEM.md` mục 7

### 1.3 Cổng chính (portal)

- [x] Khởi tạo project Astro trong thư mục `portal/`
- [x] Layout chung: header, footer, container single-column
- [x] Trang chủ: hero, danh sách lab, bài viết mới, dự án khác, liên hệ
- [x] Component thẻ lab (trạng thái: đang chạy, sắp tới, dự kiến)
- [x] Trang danh sách bài viết (`/bai-viet`) và trang chi tiết bài viết (`/bai-viet/<slug>`)
- [x] Trang "Labs" liệt kê các lab
- [x] Trang liên hệ
- [x] Chuyển trang bằng View Transitions (`<ClientRouter />`) + entrance animation cho khối nội dung (`motion/mini`, `data-animate`)
- [ ] Responsive trên mobile

### 1.4 Hệ thống nội dung

- [x] Định nghĩa frontmatter chuẩn: `title`, `date`, `type`, `lab`, `tags`, `summary`
- [x] Cấu hình collection cho bài viết (`portal/src/content.config.ts`: loader glob + schema zod)
- [x] Hiển thị tag và metadata bằng JetBrains Mono
      — bài mẫu `portal/src/content/posts/bai-viet-mau.md` để kiểm chứng pipeline, cần thay bằng bài thật ở mục 1.5

### 1.5 React Lab

- [x] Khởi tạo project React + TypeScript + Vite trong `labs/react-lab/`
- [ ] Bài viết 1 (Concept): Reconciliation hoạt động thế nào khi render list
- [ ] Bài viết 2 (Experiment): useMemo trên list lớn, có số đo và repo tái lập
- [ ] Bài viết 3 (Note): Dựng lab đầu tiên trên Cloudflare
- [ ] Trang so sánh bundle size, JS, LCP, build time giữa các lab (dữ liệu được cập nhật khi lab hoàn thành)

### 1.6 Deploy

- [ ] Kết nối repo với Cloudflare Pages (cần tài khoản Cloudflare — ghi cấu hình dự kiến trong README, mục "Deploy")
- [ ] Cấu hình build cho portal
- [ ] Cấu hình subdomain hoặc đường dẫn cho React Lab
- [ ] Kiểm tra preview branch hoạt động

### Tiêu chí hoàn thành giai đoạn 1

- Portal truy cập được trên production, hiển thị đúng theme Minimalist Editorial ở cả light và dark.
- React Lab có ít nhất 3 bài viết, mỗi bài có frontmatter đầy đủ.
- Lighthouse Performance trên trang chủ đạt từ 90 trở lên (mobile).
- Không có lỗi contrast WCAG AA ở text chính.
- README mô tả đúng cách chạy local và cấu trúc repo.

---

## Giai đoạn 2: Mở rộng nội dung và tương tác

**Mục tiêu:** Bổ sung demo tương tác và lab thứ hai.

- [ ] Chốt cách xây dựng demo tương tác (island component, iframe, hay playground)
- [ ] Thêm demo tương tác vào React Lab
- [ ] Chọn lab thứ hai (dự kiến: JS Under the Hood hoặc Next.js Lab)
- [ ] Thêm tìm kiếm hoặc lọc theo tag
- [ ] Thêm RSS feed
- [ ] Thêm theme thứ hai (Digital Garden) — bộ chọn theme sẽ tự hiện khi có từ hai theme

**Tiêu chí hoàn thành:** Có ít nhất 2 lab, một demo tương tác chạy được, người đọc tìm được bài theo tag.

---

## Giai đoạn 3: Hệ sinh thái

**Mục tiêu:** Các lab hoạt động độc lập, có quy trình riêng, và portal tổng hợp được tất cả.

- [ ] Chuẩn hóa quy trình thêm lab mới (template repo hoặc hướng dẫn)
- [ ] Thêm lab thứ ba theo định hướng đã chọn
- [ ] Đánh giá lại tên hệ sinh thái và cấu trúc domain
- [ ] Tự động cập nhật trang so sánh hiệu năng từ CI

**Tiêu chí hoàn thành:** Thêm một lab mới mất không quá một buổi cuối tuần, portal tự cập nhật danh sách lab.

---

## Việc tạm hoãn

Các ý tưởng sau được ghi nhận nhưng chưa đưa vào lộ trình:

- Bình luận hoặc tương tác người dùng
- Đa ngôn ngữ (Anh, Việt)
- Hệ thống đăng ký nhận bản tin

## Nhật ký thay đổi

| Ngày       | Thay đổi                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-17 | Khởi tạo roadmap, đánh dấu giai đoạn 1 đang thực hiện                                                                                                                                                                     |
| 2026-10-17 | Thiết lập pnpm workspace, ESLint/Prettier/TS strict, CI. Chuyển project Astro vào `portal/`, thêm design tokens + chuyển theme, thêm `labs/react-lab`                                                                     |
| 2026-10-18 | Chốt tên hệ sinh thái là **Dev Lab** (repo `dev-lab`). Thay font display Balsamiq Sans bằng Patrick Hand vì Balsamiq Sans thiếu subset tiếng Việt                                                                         |
| 2026-10-18 | Tách **theme** và **mode** thành hai trục độc lập (`data-theme` + `data-mode`), bỏ mô hình cố định 4 chế độ. Giai đoạn 1 chỉ triển khai theme Minimalist Editorial                                                        |
| 2026-10-18 | Thêm hệ thống nội dung: collection `posts`, schema frontmatter, trang `/bai-viet` và chi tiết bài viết, danh sách bài mới ở trang chủ. Kiểm tra contrast WCAG AA cho Minimalist Editorial: mọi cặp token đạt AA           |
| 2026-10-18 | Thêm chuyển động: motion tokens (mục 7 `DESIGN_SYSTEM.md`), View Transitions khi chuyển trang, entrance animation bằng `motion/mini`, cross-fade khi đổi theme/mode. Giữ `data-theme`/`data-mode` qua `astro:before-swap` |
