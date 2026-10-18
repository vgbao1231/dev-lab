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
- [x] Layout chung: header dính, footer, container hai tầng bề rộng (page 1280px + khối chữ 720px)
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
- [ ] Header: còn thiếu menu mobile dạng sheet và nút tìm kiếm (chưa cần ở giai đoạn này)
- [x] Trang chi tiết bài viết: mục lục (TOC) sinh từ heading, tự đánh dấu mục đang đọc theo vị trí cuộn
      — từ 1200px là cột riêng dính dưới header nên luôn nhìn thấy; dưới 1200px là khối ở đầu bài
- [x] Trang chi tiết bài viết: nút `#` ở mỗi tiêu đề, hiện khi hover/focus, bấm để sao chép liên kết tới anchor
- [x] Trang chi tiết bài viết: thanh tiến độ đọc ở mép trên viewport (không hiện số phần trăm)
      — trình duyệt hỗ trợ thì chạy bằng `animation-timeline: scroll()` trên compositor, không JS mỗi frame
- [x] Sticky footer: nội dung ngắn hơn viewport thì footer vẫn nằm ở đáy viewport
- [x] Footer bốn cột (brand · Nội dung · Lab · Liên hệ) + hàng đáy `© · mã nguồn · deploy`
- [x] Trang chủ thành portfolio: hero có vai trò + ba CTA, thêm mục "Về mình" (bảng facts, kỹ năng), "Dự án khác" lấy từ dữ liệu thật
- [x] `src/data/profile.ts` làm nguồn duy nhất cho thông tin cá nhân; trường trống thì UI tự bỏ qua
- [ ] Mục "So sánh giữa các stack" trên trang chủ — tạm bỏ 2026-10-18, làm cùng mục 1.5 khi có số đo thật
- [ ] Kiểm tra responsive trên mobile (breakpoint nền đã có sẵn)

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

| Ngày       | Thay đổi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-17 | Khởi tạo roadmap, đánh dấu giai đoạn 1 đang thực hiện                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-10-17 | Thiết lập pnpm workspace, ESLint/Prettier/TS strict, CI. Chuyển project Astro vào `portal/`, thêm design tokens + chuyển theme, thêm `labs/react-lab`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-10-18 | Chốt tên hệ sinh thái là **Dev Lab** (repo `dev-lab`). Thay font display Balsamiq Sans bằng Patrick Hand vì Balsamiq Sans thiếu subset tiếng Việt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2026-10-18 | Tách **theme** và **mode** thành hai trục độc lập (`data-theme` + `data-mode`), bỏ mô hình cố định 4 chế độ. Giai đoạn 1 chỉ triển khai theme Minimalist Editorial                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-10-18 | Thêm hệ thống nội dung: collection `posts`, schema frontmatter, trang `/bai-viet` và chi tiết bài viết, danh sách bài mới ở trang chủ. Kiểm tra contrast WCAG AA cho Minimalist Editorial: mọi cặp token đạt AA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-10-18 | Thêm chuyển động: motion tokens (mục 7 `DESIGN_SYSTEM.md`), View Transitions khi chuyển trang, entrance animation bằng `motion/mini`, cross-fade khi đổi theme/mode. Giữ `data-theme`/`data-mode` qua `astro:before-swap`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-10-18 | Cập nhật `DESIGN_SYSTEM.md` theo `design-reference/`: bố cục một cột 720px, section ngăn bằng đường kẻ, lab card bo 8px và là link, bộ chọn theme dạng segmented pill, nhãn eyebrow, bảng số liệu có hover hàng. Thêm mục 7.4 quy tắc hover (gạch chân mọc dần, hệ nút ghost/outlined/filled/segmented) và ghi chú khác biệt có chủ ý (giữ Patrick Hand thay Balsamiq Sans)                                                                                                                                                                                                                                                                                                                                                                               |
| 2026-10-18 | Chuyển bố cục sang hai tầng bề rộng: khung ngoài `--width-page` 1280px, khối chữ `--width-content` 720px (`.measure`); thêm breakpoint nền 560/640/768/1024 và padding ngang theo breakpoint. Đổi lưới lab sang `auto-fit` tự chia cột                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-10-18 | Làm lại header theo `ngockhoi96.dev`: dính, capsule mờ (`backdrop-filter`) khi cuộn, trượt ẩn/hiện theo hướng cuộn (tắt khi giảm chuyển động), nav pill accent khi hover, brand font mono                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-10-18 | Nối View Transition shared element cho tiêu đề bài viết (`view-transition-name: vt-post-<id>` ở `PostList` và trang chi tiết). Tạm bỏ mục "So sánh giữa các stack" khỏi trang chủ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2026-10-18 | Thêm `transition:persist` cho header, `view-transition-name: page-title` cho tiêu đề các trang, thu hẹp cross-fade chuyển trang vào `main` (gốc không animate) kèm cờ `data-theme-transition` để đổi theme vẫn cross-fade cả trang. Đổi bộ chọn theme/mode sang hai `<select>` gốc                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-10-18 | Chỉnh mượt chrome header: `backdrop-filter` bật thường trực, bỏ thay đổi chiều cao thanh nên không reflow dọc, thêm token `--duration-chrome` 340ms; nâng ngưỡng ẩn header lên 320px + delta 16px + cooldown 250ms; thêm nút "lên đầu trang". Mở rộng cột đọc bài viết (`--width-prose` 800px, căn giữa) và inset đường kẻ section vào bề rộng khối nội dung                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-10-18 | Header: khi đã cuộn, capsule hạ xuống 12px (biến `--header-inset`) bằng `position: relative; top` nên không reflow; thêm dải nền đục `::before` để che khoảng hở. Trang chi tiết bài viết: thêm mục lục (TOC) sinh từ `headings` của `render()`, tự đánh dấu mục đang đọc, và thanh tiến độ đọc 2px ở mép trên viewport                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-10-18 | Trang chi tiết bài viết thành hai cột từ 1200px: cột đọc `--width-prose` 800px + cột mục lục `--width-toc` 220px dính dưới header (dưới 1200px vẫn là khối ở đầu bài). Thêm nút `#` sao chép liên kết ở mỗi tiêu đề. Thanh tiến độ đọc chuyển sang `animation-timeline: scroll()` (có fallback JS và tự kiểm tra `getComputedStyle`) để hết giật. Thêm sticky footer (`body` cột flex `min-height: 100dvh`) và tiện ích `.visually-hidden`. Mở rộng bài viết mẫu để test mục lục + tiến độ                                                                                                                                                                                                                                                                |
| 2026-10-18 | Mục lục bài viết: rút còn **một cấp** (`h2`), làm rõ mục đang đọc (nền `--color-surface` + vạch trái `--color-accent` + chữ `--color-text`), thêm thanh cuộn mảnh theo theme/mode (token `--color-scrollbar-thumb`) và lớp phủ mờ `::after` ở mép dưới khi còn mục chưa cuộn tới                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-10-18 | Cho phép **nhiều mục lục active cùng lúc**: mọi tiêu đề đang trong tầm nhìn đều được đánh dấu; nếu không tiêu đề nào trong tầm nhìn thì giữ mục gần nhất đã đi qua. Đơn giản hoá bài viết mẫu về một cấp `h2`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-10-18 | Nâng thang chữ 1px ở các cỡ nhỏ và thân bài: `--text-2xs` 11→12, `--text-xs` 12→13, `--text-sm` 14→15, `--text-base` 16→17, `--text-lg` 18→19px. Giữ nguyên `h2` (26px) và `h1` (38px)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-10-19 | Trang chủ thành portfolio: hero thêm vai trò + ba CTA (`Xem các lab` · `Đọc bài viết` · `Liên hệ`), thêm mục "Về mình" (giới thiệu + bảng facts + kỹ năng) và "Dự án khác" (`ProjectList` mới) — hai mục này ẩn khi chưa có dữ liệu. Footer làm lại thành bốn cột (brand · Nội dung · Lab · Liên hệ). Thêm `src/data/profile.ts` làm nguồn duy nhất cho thông tin cá nhân; `.tag` gom về `global.css`                                                                                                                                                                                                                                                                                                                                                     |
| 2026-10-19 | Chỉnh thang chữ theo phản hồi: `--text-xs` 13→14 (nhãn section và tiêu đề mục lục cho rõ hơn), `--text-sm` 15→16 (chỗ Inter và JetBrains Mono đứng cạnh nhau trông lệch cỡ), `--text-lg` 19→21 (tiêu đề bài viết, tên lab, tên dự án). Tách token mới `--text-md` 18px cho `.lead` vì trước đó nó dùng chung `--text-lg` với tiêu đề nên vừa to ở chỗ này vừa nhỏ ở chỗ kia. Thêm `--text-brand` 24px cho brand header (trước hard-code 22px). Cập nhật `DESIGN_SYSTEM.md` mục 4 theo token thật thay cho các con số px cũ trong mục 6                                                                                                                                                                                                                    |
| 2026-10-19 | Chốt **quy tắc mono**: chữ JetBrains Mono luôn nhỏ hơn chữ Inter cùng vai trò 2px, nên toàn bộ chữ mono cỡ chữ (nav, link footer, kicker, hàng liên hệ, khối mã, dòng meta) hạ 16→14px; chữ Inter giữ 16px. Nhãn bảng facts lên 14px cho cùng cỡ với các nhãn mono khác. Trang chủ: hero đổi thành **lời chào** (`Xin chào, tui là Gura` + slogan từ `profile.tagline` mới) và khối "Dev Lab" tách thành section riêng ngay dưới. Brand header 24→32px kèm `line-height: 1` nên chiều cao header không đổi. Bảng facts thêm `align-items: baseline` để nhãn mono và giá trị Inter thẳng chân chữ                                                                                                                                                          |
| 2026-10-19 | Vòng chỉnh thứ ba: **mọi link dạng chữ dùng mono** cho đồng bộ — gom về class `.link-row` trong `global.css` (thay `.contact-row` cũ), áp cho CTA hero, "Tất cả bài viết", link quay lại cuối bài và `skip-link`; tiêu đề bài/lab/dự án và link trong câu văn vẫn giữ font nội dung (ghi rõ hai ngoại lệ này trong `DESIGN_SYSTEM.md` mục 4). Nhãn mono (eyebrow, tiêu đề mục lục, nhãn bảng facts) 14→16px. `.lead` 18→17px (`--text-base`) và **xoá token `--text-md`** không còn nơi dùng; brand về 28px                                                                                                                                                                                                                                               |
| 2026-10-19 | Vòng chỉnh thứ tư: cả **ba** link CTA ở hero đều có mũi tên `→` (trước chỉ link đầu). Điền dữ liệu thật vào `profile.ts`: thêm trường **`slogan`** (khẩu hiệu riêng, hiện thành dòng ghi chú `// …` màu accent dưới tagline ở hero), tagline đổi sang câu tiếng Việt, thêm ba dòng facts (`Ngoại ngữ`, `Nhiên liệu`, `Ngoài code`). Ghi quy tắc chọn facts trong `DESIGN_SYSTEM.md`: chỉ để thứ gần như không đổi, thứ thay đổi theo thời gian thì viết vào `about`                                                                                                                                                                                                                                                                                       |
| 2026-10-19 | Vòng chỉnh thứ sáu: **giá trị bảng facts thành chip** — tham khảo bố cục "Digital Garden" nhưng tự chọn màu theo token: nền `--color-surface`, viền `--color-border`, bo `--radius-lg`, chữ **Patrick Hand** `--text-base` (chữ Inter ở bảng facts bị bỏ vì dòng chữ dài làm bảng nặng như một bảng dữ liệu). Bỏ dấu chấm dẫn và bỏ luôn đường kẻ giữa các hàng (dùng ảnh tham chiếu nhưng giảm số đường ngang). **Bỏ dòng "Vai trò"** khỏi bảng facts — vai trò đã có ở kicker khối Dev Lab, lặp lại là thừa; `profileFacts` giờ chỉ dựng "Khu vực" từ `profile.location` rồi nối `profile.facts`. `ProfileFact.value: string` đổi thành `items: string[]`, mỗi chip một ý (`Tiếng Việt` · `Tiếng Anh · TOEIC 940`, …). Dưới 560px: nhãn trên, chip dưới |
