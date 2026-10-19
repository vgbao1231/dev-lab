# Design: Chuyển động

> Một phần của design system; chỉ mục và bảng định tuyến ở [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Số mục giữ nguyên bản gốc vì comment trong code trỏ tới "mục N".

## 7. Chuyển động (animation)

Phong cách tối giản thì chuyển động cũng tối giản: mục tiêu là làm rõ thay đổi trạng thái và
thứ bậc, không phải trang trí. Mục này bổ sung cho phần "Nguyên tắc" (mục 8, `../DESIGN_SYSTEM.md`).

### 7.1 Token

| Token               | Giá trị                         | Dùng cho                                                |
| ------------------- | ------------------------------- | ------------------------------------------------------- |
| `--duration-fast`   | 120ms                           | hover, focus, viền, màu chữ                             |
| `--duration-base`   | 200ms                           | entrance, ẩn/hiện header, thay đổi nhỏ                  |
| `--duration-slow`   | 320ms                           | chuyển trang (View Transition)                          |
| `--duration-chrome` | 340ms                           | chrome của header khi cuộn (nền, viền, độ rộng capsule) |
| `--ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)`    | mặc định                                                |
| `--ease-entrance`   | `cubic-bezier(0.16, 1, 0.3, 1)` | phần tử xuất hiện                                       |
| `--reveal-distance` | 8px                             | độ dịch lên khi phần tử xuất hiện                       |
| `--reveal-stagger`  | 60ms                            | độ trễ giữa các phần tử trong cùng một đợt              |

### 7.2 Quy tắc

1. Chỉ animate `opacity` và `transform` cho chuyển động làm thay đổi vị trí hoặc kích thước.
   Không animate `width`, `height`, `margin`, `top`/`left` — gây reflow và ảnh hưởng chỉ số
   hiệu năng. Các thuộc tính chỉ tốn paint như `color`, `background-color`, `border-color`,
   `background-size`, `text-decoration-color` được phép với `--duration-fast` (xem mục 7.4).
   **Ngoại lệ:** chrome của header khi cuộn đổi `max-width`/`padding-inline` (chỉ theo chiều
   ngang, không làm đổi chiều cao trang) và `background-color`/`border-color`/`border-radius`/
   `box-shadow`. Lý do: đây là hiệu ứng nhận diện của header, chỉ chạy khi vượt ngưỡng cuộn, và
   chỉ tác động lên một phần tử nhỏ. Không được nới ngoại lệ này cho phần tử khác.
2. Thời lượng tối đa 340ms (`--duration-chrome`). Không animation lặp vô hạn, không
   bounce/spring quá đà.
3. Không thêm gradient, glow hay hiệu ứng trang trí nhờ animation.
4. Mọi chuyển động **phải** tắt khi `prefers-reduced-motion: reduce`. Đây là yêu cầu bắt
   buộc, không phải tùy chọn.
5. Chỉ giữ animation giải thích được thay đổi trạng thái hoặc thứ bậc; nếu không giải thích
   được điều gì thì bỏ.

### 7.3 Danh mục chuyển động

| Nhóm               | Cách triển khai                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Chuyển trang       | `<ClientRouter />`; gốc không animate, chỉ `main` cross-fade                                                               |
| Header dính        | Cuộn xuống: `translateY(-100%)`; cuộn lên: hiện lại. Capsule đổi nền, viền, bo góc, độ rộng                                |
| Phần tử dùng chung | `view-transition-name` trùng tên ở hai trang, phần tử biến hình thay vì cross-fade                                         |
| Đổi theme / mode   | `document.startViewTransition()` bọc lúc gán `data-theme` / `data-mode`                                                    |
| Vào trang lần đầu  | Phần tử `[data-animate]` hiện dần bằng `motion/mini`, stagger theo token                                                   |
| Nút lên đầu trang  | Hiện dần khi cuộn quá 600px; bấm thì cuộn mượt (hoặc nhảy thẳng) lên đầu                                                   |
| Mục lục bài viết   | Mọi mục đang trong tầm nhìn được đánh dấu theo vị trí cuộn (có thể nhiều mục cùng lúc)                                     |
| Tiến độ đọc        | Đường 2px ở mép trên, dài theo phần trăm bài viết đã cuộn; trình duyệt hỗ trợ thì chạy bằng `animation-timeline: scroll()` |
| Micro-interaction  | Hover link, nav, lab card, hàng bảng — xem mục 7.4                                                                         |

Hiện đã nối shared element cho **tiêu đề bài viết**: `PostList` gắn
`view-transition-name: vt-post-<id>` lên tiêu đề trong danh sách, trang chi tiết gắn đúng tên đó
lên `h1`. Tên phải là custom-ident hợp lệ (id bài bắt đầu bằng số nên có tiền tố `vt-post-`) và
**không được trùng** trong cùng một trang.

Chi tiết triển khai (trong `portal/`):

- `[data-animate]` chỉ chạy ở **lần tải trang đầu tiên**. Các lần điều hướng trong site do
  View Transition xử lý, không chạy lại entrance.
- Cờ `.motion-ready` trên `<html>` được script inline chèn **trước khi vẽ**, và chỉ khi
  người dùng không yêu cầu giảm chuyển động. Nhờ vậy không có nháy, và nội dung không bao
  giờ bị ẩn khi JavaScript lỗi.
- View Transitions thay toàn bộ attribute của `<html>`, nên `data-theme` / `data-mode` phải
  được chép sang document mới trong `astro:before-swap`; nếu không theme sẽ bị reset sau khi
  chuyển trang.

### 7.4 Hover và trạng thái tương tác

Nguyên tắc: hover phải **nói được điều gì đó** (phần tử này bấm được, hoặc đang ở trạng thái
gì). Dùng `--duration-fast` (120ms) và `--ease-standard`. Không phóng to, không đổ bóng, không
dịch chuyển quá 1px (chỉ lab card nhấc lên 1px).

| Phần tử                             | Mặc định                  | Hover                                                                            |
| ----------------------------------- | ------------------------- | -------------------------------------------------------------------------------- |
| Link trong nội dung                 | không gạch chân           | gạch chân hiện dần (link ngắn: mọc dần; link trong bài: `text-decoration-color`) |
| Link CTA (`… →`)                    | không gạch chân           | gạch chân mọc dần + mũi tên dịch sang phải 2px                                   |
| Link nav                            | `--color-text-muted`      | `--color-accent` + nền pill accent mờ nở ra                                      |
| Brand trên header                   | `--color-text`            | `--color-accent`, không gạch chân                                                |
| Tiêu đề bài viết                    | `--color-text`            | `--color-link`                                                                   |
| Lab card (khi là link)              | viền `--color-border`     | viền `--color-accent` + `translateY(-1px)`                                       |
| Hàng bảng                           | nền `--color-surface`     | nền `--color-bg`                                                                 |
| Link mục lục                        | `--color-text-muted`      | `--color-text`; mục đang đọc thêm nền `--color-surface` + vạch `--color-accent`  |
| Nút sao chép ở tiêu đề bài viết     | ẩn (`opacity: 0`)         | hiện + `--color-accent` (cũng hiện khi focus)                                    |
| Nút `ghost` / `outlined` / `filled` | bảng nút, `components.md` | bảng nút, `components.md`                                                        |

**Gạch chân mọc dần** — kỹ thuật:

- Link ngắn và link CTA: `background-image: linear-gradient(currentColor, currentColor)`,
  `background-repeat: no-repeat`, `background-position: 0 100%`, `background-size: 0 1px`; khi
  hover đổi `background-size: 100% 1px`. Không tạo layout shift.
- Link trong bài viết dài: dùng `text-decoration-color: transparent → currentColor` để an toàn
  khi link xuống dòng (kỹ thuật `background-size` bị vỡ trên nhiều dòng).
- Mũi tên `→` của link CTA đặt trong `<span aria-hidden="true">` để có thể dịch riêng mà không
  lặp lại trong screen reader.
- Khi `prefers-reduced-motion: reduce`: bỏ hiệu ứng mọc dần, hiện gạch chân ngay lập tức.
