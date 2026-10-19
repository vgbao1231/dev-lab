# Design: Bố cục

> Một phần của design system; chỉ mục và bảng định tuyến ở [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Số mục giữ nguyên bản gốc vì comment trong code trỏ tới "mục N".

## 5. Bố cục

- **Hai tầng bề rộng.** `--width-page` (1120px) là khung ngoài — header, section, lưới, bảng.
  `--width-content` (800px) là khối chữ (`.measure`) để dòng không quá dài; cột đọc của bài
  viết (`.prose-col`) dùng chung giá trị này, không có tầng thứ ba. Nội dung trong khung
  căn **trái**, nên khối chữ và lưới luôn thẳng hàng với nhau.
- **Section ngăn bằng đường kẻ mỏng** ở cuối mỗi section. Đường kẻ vẽ bằng `::after` với
  `inset-inline: var(--space-inline)`, nên chỉ chạy trong bề rộng khối nội dung (không tràn ra
  padding ngang) và thẳng hàng với capsule của header khi đã cuộn. Padding dọc section 48px trên
  desktop, 40px trên mobile; hero có padding-top 56px.
- **Padding ngang** theo breakpoint: 20px (mặc định) → 24px (≥768px) → 32px (≥1024px).
- Khoảng trắng rộng nhưng không phình khoảng cách giữa các section. Không có sidebar cố định.
- **Breakpoint nền** (ghi thẳng trong media query vì CSS không cho dùng biến trong điều kiện
  media): 560px (một cột), 640px (header một hàng, nav căn giữa), 768px (section 48px),
  1024px (padding ngang 32px).
- **Header:** dính (`position: sticky`); brand `DevLab.` font display (`--text-brand`) bên trái, nav
  căn giữa, bộ chọn theme/mode (hai `<select>`) bên phải; đường kẻ dưới header.
  - Brand cỡ `--text-brand` (28px) ghim `line-height: 1`, nên chiều cao header do nav quyết định (khoảng
    60px) chứ không phụ thuộc cỡ brand. Đổi cỡ brand trong khoảng 28–32px không kéo theo thay đổi nào
    khác. Số đo và lý do: [ADR 0006](../adr/0006-header-capsule-dinh.md).
  - Header **không** có nền riêng; nền đục nằm trên thanh bar. Nhờ vậy khi cuộn, phần ngoài
    capsule là trong suốt, không lộ một hình chữ nhật sau bốn góc bo.
  - Quá 4px cuộn: nền chuyển sang bán trong suốt, thanh thu thành **capsule** và thêm bóng rất
    nhẹ. `backdrop-filter: blur(12px)` bật **thường trực** (bật/tắt theo trạng thái cuộn sẽ phải
    tạo lại compositing layer giữa chừng, gây giật); ở trạng thái đầu nền đục nên blur không nhìn
    thấy.
  - Capsule rộng `calc(var(--width-page) - 2 * var(--space-inline))` và header chừa
    `padding-inline: var(--space-inline)`, nên trên màn hình rộng capsule trùng khít mép khối nội
    dung, còn trên màn hình hẹp nó cũng chạm đúng mép đó. Chiều cao thanh **không** đổi giữa hai
    trạng thái để không đẩy nội dung phía dưới.
  - Ẩn/hiện theo hướng cuộn: chỉ bắt đầu ẩn khi đã cuộn quá **320px**, cần delta **16px** mới đổi
    trạng thái (chống rung khi cuộn nhẹ), có cooldown **250ms** giữa hai lần ẩn liên tiếp và cuộn
    lên thì hiện lại ngay. Tắt hẳn khi `prefers-reduced-motion: reduce`.
  - Khi đã cuộn, capsule được đẩy xuống `--header-inset` (12px, chỉ từ 640px) chứ không dính mép
    màn hình. Việc đẩy làm bằng `position: relative; top` — thuộc tính **chỉ đổi khi vẽ**, không
    đổi layout, nên header vẫn giữ nguyên chiều cao. Khoảng hở đó để lộ nội dung đang trôi phía
    sau, nên có một dải nền đục che lại bằng `.site-header::before` (`position: absolute`, ngoài
    luồng): ở trạng thái đầu capsule phủ lên dải này nên không nhìn thấy.
  - Header dùng `transition:persist` nên DOM được giữ nguyên qua các lần chuyển trang — vì vậy
    `aria-current` phải tự cập nhật bằng JS. Nav chỉ gồm `labs`, `bài viết`, `liên hệ`; brand là
    link về trang chủ nên **không** có mục "Trang chủ" riêng.
- **Hero (lời chào):** `h1` font display `Xin chào, tui là <tên>` (tên lấy từ `profile.ts`) → câu
  slogan `--text-base` màu muted (`profile.tagline`; trống thì bỏ) → **khẩu hiệu** dạng ghi chú
  `// …` màu accent (`profile.slogan`; trống thì bỏ) → hàng link CTA (`Xem các lab`, `Đọc bài viết`,
  `Liên hệ`). Đây là **lời chào**, không phải mô tả hệ sinh thái: trang chủ là portfolio cá nhân nên
  mở đầu bằng "ai đang viết", phần "chỗ này là gì" để ở section kế tiếp.
  - Cả **ba** link CTA đều có mũi tên `→`; mũi tên không phải để đánh dấu CTA chính mà là kiểu
    chung của hàng link, nên đừng thêm cho link này mà bỏ ở link kia.
  - Slogan dùng chung cỡ với đoạn mô tả ở khối Dev Lab (`--text-base`) — câu giới thiệu không cần to
    hơn thân bài, chỉ cần khác màu để tách khỏi phần còn lại.
- **Khối Dev Lab** (section ngay dưới hero): kicker mono `~/devlab · <vai trò>` → `h2` font display
  `Dev Lab` → đoạn mô tả hệ sinh thái → một dòng ghi chú kiểu comment (`// …`) màu `--color-accent`
  font mono → đoạn phụ màu `--color-text-muted` (`--text-sm`, không dùng `.lead` — `.lead` đã dành
  cho slogan ở hero).
- **Lưới lab:** tự chia cột theo bề rộng khả dụng
  (`repeat(auto-fit, minmax(min(340px, 100%), 1fr))`, gap 12px) — 1 cột khi hẹp, 2–3 cột khi rộng.
- **Trang chi tiết bài viết:** bố cục do `.post-layout` quyết định, `justify-content: center` để
  cả nhóm cột căn giữa khung.
  - Dưới 1200px: **một cột** — cột đọc (`.prose-col`, `--width-content` 800px), mục lục là khối ở
    đầu bài.
  - Từ 1200px: **hai cột** — cột đọc 800px + cột mục lục `--width-toc` (220px), cách nhau 40px;
    cột mục lục dính dưới header nên luôn nhìn thấy.
  - Các khối chữ ngắn ở trang khác cũng dùng `.measure` (800px) và căn trái để thẳng hàng với lưới
    bên dưới. Thanh tiến độ đọc ghim ở mép trên viewport (mục 6, `post-page.md`).
- **Thứ tự section trang chủ:** hero (lời chào) → Dev Lab → Về mình → Các lab → Bài viết mới →
  Dự án khác → Liên hệ.
  Hai mục "Về mình" và "Dự án khác" **chỉ hiện khi có dữ liệu thật** trong
  `portal/src/data/profile.ts`; chưa có thì ẩn hẳn, không để lại khối rỗng hay câu "sẽ bổ sung".
  Mục "So sánh giữa các stack" tạm bỏ ngày 2026-10-18, sẽ làm cùng mục 1.5 trong `ROADMAP.md` khi có số
  đo thật.
- **Footer:** bốn cột trên khung `--width-page`, xếp dọc khi hẹp rồi thành 2 cột từ 640px và 4
  cột từ 1024px (cột brand rộng `1.6fr`, ba cột điều hướng `1fr`):
  1. **Brand** — tên font display + một dòng mô tả (`--text-sm`, muted, tối đa 34ch).
  2. **Nội dung** — bốn route nội bộ (Trang chủ, Bài viết, Labs, Liên hệ).
  3. **Lab** — sinh thẳng từ `data/labs.ts`, không chép tay.
  4. **Liên hệ** — sinh từ `data/profile.ts` (GitHub, email nếu có) + link `Trang liên hệ`.

  Mỗi cột là một `<nav aria-labelledby>` trỏ vào nhãn `.eyebrow` của cột. Link footer để màu
  `--color-text-muted`, hover mới lên `--color-link` — bốn cột cùng màu `--color-link` sẽ quá ồn.
  Hàng đáy ngăn bằng `border-top` 1px: `© [năm] [Tên] · Dev Lab` bên trái, `Mã nguồn · Deploy trên
Cloudflare` bên phải. Nền tảng dữ liệu: xem mục 6 "Nguồn thông tin portfolio" trong `components.md`.

- **Sticky footer:** `body` là cột flex cao ít nhất `100dvh`, `main` giãn ra ở giữa
  (`flex: 1`). Nội dung ngắn hơn viewport thì footer vẫn nằm ở đáy viewport, không lơ lửng ngay
  dưới nội dung. Dùng `100dvh` chứ không phải `100vh` để không bị thanh địa chỉ trên mobile cắt.

### Token bố cục và hình dạng

| Token             | Giá trị     | Dùng cho                                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------- |
| `--width-page`    | 1120px      | khung ngoài: header, section, lưới, bảng                                     |
| `--width-content` | 800px       | khối chữ ngắn (`.measure`) và cột đọc bài viết (`.prose-col`)                |
| `--width-toc`     | 220px       | cột mục lục bài viết (chỉ từ 1200px)                                         |
| `--offset-header` | 96px        | chừa chỗ cho header dính: `scroll-margin-top` của heading, `top` của mục lục |
| `--space-inline`  | 20/24/32px  | padding ngang container theo breakpoint                                      |
| `--space-section` | 40px / 48px | padding dọc section (mobile / desktop)                                       |
| `--radius-sm`     | 4px         | tag, code block                                                              |
| `--radius-md`     | 6px         | phần tử nhỏ cần bo vừa (input, ảnh, pill nav)                                |
| `--radius-lg`     | 8px         | lab card, khung bảng số liệu, capsule header                                 |
| `--radius-pill`   | 999px       | nút lên đầu trang                                                            |
