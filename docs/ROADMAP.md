# Roadmap: Dev Lab

Tài liệu này chia dự án thành các giai đoạn. Mỗi giai đoạn có checklist công việc và tiêu chí hoàn thành.

**Giai đoạn hiện tại: Giai đoạn 1 — Nền tảng và lab React đầu tiên** 🟡 đang thực hiện

**Còn mở ở giai đoạn 1:** 1.3 menu mobile dạng sheet · mục "So sánh giữa các stack" (tạm bỏ) ·
1.5 trang so sánh hiệu năng · 1.6 toàn bộ phần Deploy.

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
- [x] Layout chung: header dính, footer, container hai tầng bề rộng (page 1120px + khối chữ 800px)
- [x] Trang chủ: hero, danh sách lab, bài viết mới, dự án khác, liên hệ
- [x] Component thẻ lab (trạng thái: đang chạy, sắp tới, dự kiến)
- [x] Trang danh sách bài viết (`/bai-viet`) và trang chi tiết bài viết (`/bai-viet/<slug>`)
- [x] Trang "Labs" liệt kê các lab
- [x] Trang liên hệ
- [x] Chuyển trang bằng View Transitions (`<ClientRouter />`) + entrance animation cho khối nội dung (`motion/mini`, `data-animate`)
- [x] Áp bố cục và thành phần theo `design-reference/`: section có đường kẻ, lab card là link + hover, nhãn eyebrow
- [x] Chuẩn hóa trạng thái hover (mục 7.4 `DESIGN_SYSTEM.md`): gạch chân mọc dần cho link, nav pill accent, tiêu đề bài viết, hàng bảng
- [x] Dựng nền responsive: breakpoint 560 / 640 / 768 / 1024, padding ngang theo breakpoint, lưới lab tự chia cột
- [x] Bộ chọn theme/mode: hai `<select>` gốc trên hai trục độc lập; theme tự ẩn khi chỉ có một theme
- [x] Nút "lên đầu trang" hiện khi cuộn quá 600px, tôn trọng `prefers-reduced-motion`
- [x] Header theo kiểu `ngockhoi96.dev`: sticky, capsule mờ thu hẹp khi cuộn, nav pill accent, ẩn/hiện theo hướng cuộn, `transition:persist`
- [x] Header: nút tìm kiếm mở command palette; `Ctrl/Cmd+K` hoặc `/`, tìm bài viết/lab/trang,
      không dấu vẫn khớp, điều hướng bằng bàn phím; index sinh lúc build, không thêm dependency
- [x] Bộ icon dùng chung (nét 1.5px, `currentColor`): brand, search, mode, tiêu đề trang, metadata
      bài viết, footer; thay các ký tự/emoji rời rạc
- [x] `/bai-viet`: lưới card 1/2/3 cột, cover 16:9, tag, thời gian đọc; trang chủ giữ nguyên
      danh sách dòng
- [ ] Header: menu mobile dạng sheet (chưa cần ở giai đoạn này)
- [x] Trang chi tiết bài viết: mục lục (TOC) sinh từ heading, tự đánh dấu mục đang đọc theo vị trí cuộn
      — từ 1200px là cột riêng dính dưới header nên luôn nhìn thấy; dưới 1200px là khối ở đầu bài
- [x] Trang chi tiết bài viết: nút `#` ở mỗi tiêu đề, hiện khi hover/focus, bấm để sao chép liên kết tới anchor
- [x] Trang chi tiết bài viết: thanh tiến độ đọc ở mép trên viewport (không hiện số phần trăm)
      — trình duyệt hỗ trợ thì chạy bằng `animation-timeline: scroll()` trên compositor, không JS mỗi frame
- [x] Sticky footer: nội dung ngắn hơn viewport thì footer vẫn nằm ở đáy viewport
- [x] Footer bốn cột (brand · Nội dung · Lab · Liên hệ) + hàng đáy `© · Mã nguồn · Deploy`
- [x] Trang chủ thành portfolio: hero có vai trò + ba CTA, thêm mục "Về mình" (bảng facts, kỹ năng), "Dự án khác" lấy từ dữ liệu thật
- [x] `src/data/profile.ts` làm nguồn duy nhất cho thông tin cá nhân; trường trống thì UI tự bỏ qua
- [ ] Mục "So sánh giữa các stack" trên trang chủ — tạm bỏ 2026-10-18, làm cùng mục 1.5 khi có số đo thật
- [x] Kiểm tra responsive trên mobile (breakpoint nền đã có sẵn)
      — xác minh 360/390/414px ở cả light và dark: nav một hàng, lưới lab 1 cột, TOC ở đầu bài, chip facts không tràn; không có tràn ngang ở cấp trang

### 1.4 Hệ thống nội dung

- [x] Định nghĩa frontmatter chuẩn: `title`, `date`, `type`, `lab`, `tags`, `summary`, `cover`,
      `coverAlt`
- [x] Cấu hình collection cho bài viết (`portal/src/content.config.ts`: loader glob + schema zod)
- [x] Hiển thị tag và metadata bằng JetBrains Mono
      — bài mẫu `bai-viet-mau.md` đã được thay bằng ba bài thật ở mục 1.5
- [x] Hệ thống tag dùng chung: package `@dev-lab/tags` (23 tag, 3 nhóm Technology/Domain/Approach);
      frontmatter lưu id, schema kiểm tra 1–4 tag và đổi sang label chuẩn; quy ước ở `docs/TAGS.md`
- [x] Cover bài viết: `cover` + `coverAlt` trong frontmatter, SVG inline theo token theme, fallback
      monogram khi thiếu cover

### 1.5 React Lab

- [x] Khởi tạo project React + TypeScript + Vite trong `labs/react-lab/`
- [x] Bài viết 1 (Concept): React Fiber & Reconciliation — element tree, Fiber tree, render phase
      và commit phase; vì sao `key` quyết định việc giữ hay mất state
- [x] Bài viết 2 (Concept): React Concurrent Rendering — lanes, scheduler, render interruptible
      và giới hạn của commit phase
- [x] Bài viết 3 (Concept): Tearing & `useSyncExternalStore` — snapshot, subscription và cách
      tránh hai component đọc hai phiên bản dữ liệu
- [ ] Trang so sánh bundle size, JS, LCP, build time giữa các lab (dữ liệu được cập nhật khi lab hoàn thành)

### 1.6 Deploy

- [ ] Kết nối repo với Cloudflare Pages (cần tài khoản Cloudflare — cấu hình từng bước ở README, mục "Deploy")
- [ ] Cấu hình build cho portal
- [ ] Dựng project Pages riêng cho React Lab — chốt 2026-10-20 bằng ADR 0008, không dùng đường dẫn con
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
- [ ] Thêm lọc bài viết theo tag (tìm kiếm đã có ở giai đoạn 1)
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

Xem [`CHANGELOG.md`](CHANGELOG.md). Quyết định đáng nhớ: [`adr/`](adr/README.md).
