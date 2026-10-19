# Design: Trang chi tiết bài viết

> Một phần của design system; chỉ mục và bảng định tuyến ở [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Số mục giữ nguyên bản gốc vì comment trong code trỏ tới "mục N".

Mục 6 (phần dành riêng cho trang bài viết). Bố cục hai cột (`.post-layout`) nằm ở `layout.md` mục 5.

### Mục lục bài viết (TOC)

- Chỉ có ở trang chi tiết bài viết. Sinh từ `headings` của `render()` (Astro), **chỉ lấy `h2`**;
  ít hơn 2 mục thì không hiển thị — mục lục một dòng chỉ thêm nhiễu. Một cấp thôi vì thêm `h3` làm
  danh sách dài, khó quét, trong khi `h2` đã đủ để định vị.
- **Vị trí (2 chế độ, do `.post-layout` quyết định — xem mục 5, `layout.md`):**
  - Dưới 1200px: khối ở **đầu bài**, đứng trước cột đọc nhờ `order: -1`; khung viền
    `1px --color-border`, bo `--radius-md`, padding dọc 12px. Khoảng cách trên/dưới do `gap` của
    grid lo.
  - Từ 1200px: cột riêng bên phải, rộng `--width-toc` (220px), **dính** dưới header
    (`position: sticky`, `top: var(--offset-header)`) nên **luôn nhìn thấy trong lúc đọc**.
    `align-self: start` là bắt buộc: nếu để ô lưới cao bằng cột đọc thì phần tử hết chỗ để dính.
    Bỏ khung và bo góc (đây là cột phụ, không phải hộp nổi).
- **Không có padding ngang ở `nav`:** mục đang đọc cần trải hết bề ngang. Link tự mang
  `padding: 5px 12px`, còn tiêu đề `padding-inline: 12px` để thẳng hàng.
- Tiêu đề "Nội dung": mono, `--text-sm`, `uppercase`, `letter-spacing: 0.08em`, muted — cùng kiểu
  với nhãn section (eyebrow). Dùng `<p>`, không dùng heading, để không phá cấu trúc bài.
- Link: `--text-sm`, `--color-text-muted`, không gạch chân, giữ sẵn `border-left: 2px solid
transparent` để mục active không làm nhảy chữ. Hover: chữ sang `--color-text`.
- **Mục đang đọc** đánh dấu bằng `aria-current="true"` (không dùng class rời) và dùng **ba tín hiệu
  cùng lúc**: nền `--color-surface`, vạch trái `--color-accent` 2px, chữ `--color-text`. Chỉ đổi
  màu chữ là không đủ rõ giữa một danh sách dài.
- **Có thể có nhiều mục active cùng lúc.** Luật: mọi tiêu đề đang giao với vùng nhìn thấy (dưới
  `--offset-header`, trên đáy viewport) đều được đánh dấu. Nếu không tiêu đề nào trong tầm nhìn —
  đang ở giữa một mục dài, tiêu đề đã cuộn qua — thì giữ mục gần nhất đã đi qua, để không bao giờ
  mất chỉ báo "đang ở đâu". Trạng thái này cập nhật theo vị trí cuộn, xem mục 7.3, `motion.md`.
- **Thanh cuộn của mục lục (chỉ ở chế độ cột):** mảnh, lấy màu từ token nên tự đúng ở cả light và
  dark: `scrollbar-width: thin` + `scrollbar-color: var(--color-scrollbar-thumb) transparent`
  (Firefox, Chrome 121+), và `::-webkit-scrollbar` rộng 6px + `::-webkit-scrollbar-thumb` bo tròn
  cho Safari. `padding-right: 8px` để thanh cuộn không đè lên chữ.
- **Lớp mờ báo còn nội dung:** `::after` cao 80px ở mép dưới mục lục,
  `linear-gradient(to bottom, transparent, var(--color-bg))`, `pointer-events: none`, mặc định
  `opacity: 0`. Cao 80px để mờ dần qua khoảng ba mục chứ không cắt ngang một mục. JS ghi
  `data-overflow="bottom"` lên `<nav>` khi mục lục thật sự còn phần chưa cuộn tới, lúc đó mới
  hiện. Nhờ vậy không bao giờ hiện nhầm lúc danh sách đã hết.
- Ngưỡng xác định "đang đọc" đọc từ token `--offset-header`, không hard-code, để không lệch với
  `scroll-margin-top` của heading.
- Điều hướng bằng `href="#<slug>"`. Heading trong thân bài đã có `id` sẵn do pipeline markdown
  sinh (github-slugger), nên **không cần thêm rehype plugin hay dependency**.

### Nút sao chép liên kết ở tiêu đề bài viết

- Mỗi `h2`/`h3` có `id` trong thân bài được gắn thêm một nút `#` nhỏ (mono, `0.7em`).
- **Ẩn mặc định**, chỉ hiện khi hover tiêu đề, khi nút được focus bàn phím, hoặc khi vừa sao chép.
  Vì vậy nút không chiếm chỗ thị giác nhưng vẫn dùng được bằng bàn phím.
- Bấm nút: sao chép `${origin}${pathname}#<id>` vào clipboard, đổi biểu tượng thành `✓` và màu
  `--color-accent` trong 1.6s, đồng thời cập nhật thanh địa chỉ bằng `history.replaceState` (không
  nhảy trang).
- Có vùng `role="status"` ẩn (`.visually-hidden`) đọc kết quả cho screen reader. Nếu trình duyệt
  chặn clipboard, thông báo nói rõ liên kết đã có trên thanh địa chỉ.
- Nút do JavaScript chèn vào: `render()` chỉ trả HTML của markdown nên không chèn được ở phía
  server, và thao tác sao chép vốn đã cần JavaScript. Vì vậy style nằm ở `global.css`
  (`.heading-anchor`), không đặt trong `<style>` scoped của page — phần tử do JS tạo không có
  `data-astro-cid`.

### Thanh tiến độ đọc

- Chỉ có ở trang chi tiết bài viết. Một đường mảnh cao 2px, màu `--color-accent`, ghim sát mép
  trên viewport: `position: fixed`, `inset-block-start: 0`, `inset-inline: 0`, `z-index: 40`,
  `pointer-events: none`.
- Độ dài = **phần trăm bài viết đã cuộn qua**:
  `(scrollY - đỉnh bài viết) / (chiều cao bài viết - chiều cao viewport)`, kẹp trong `[0, 1]`, vẽ
  bằng `transform: scaleX()` với `transform-origin: left`.
- **Hai đường chạy, chọn theo khả năng trình duyệt:**
  1. Có `animation-timeline: scroll()` → để trình duyệt chạy animation theo tiến độ cuộn **trên
     compositor**. JS chỉ đo và ghi `--reading-start` / `--reading-end` (px trong không gian cuộn)
     cho `animation-range`, **không làm gì mỗi frame**. Đây là đường chính vì mượt nhất.
  2. Không có → JS ghi `--reading-progress` theo từng frame cuộn như trước.
- JS **kiểm tra lại bằng `getComputedStyle(bar).animationName`** chứ không chỉ tin vào
  `CSS.supports`: nếu chỉ tin `CSS.supports` mà cú pháp bị loại ở đâu đó thì JS đã ngừng ghi và
  thanh đứng yên ở 0.
- **Không** dùng `transition`: giá trị đã bám theo từng frame cuộn (hoặc do trình duyệt chạy), thêm
  transition chỉ tạo độ trễ giả.
- Không bật đường 1 khi `prefers-reduced-motion: reduce`: ngoài chuyện tôn trọng thiết lập, quy tắc
  `animation-duration: 0.01ms !important` toàn cục ở `global.css` sẽ làm animation theo tiến độ
  cuộn nhảy thẳng tới 100%. Khi đó JS đảm nhiệm và thanh vẫn chạy.
- Không hiển thị số phần trăm: chỉ một đường, đúng như yêu cầu.
