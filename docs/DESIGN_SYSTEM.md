# Design System: Dev Lab

Hệ thống thiết kế cho cổng chính và các lab. Phong cách tối giản, cá nhân, hướng nội dung. Không phải landing page SaaS.

File này là **chỉ mục**: nguyên tắc (mục 8), checklist (mục 9) và bảng cho biết nội dung nằm ở đâu. Phần chi tiết tách theo chủ đề trong `docs/design/`; chỉ đọc file đúng với việc đang làm.

Số mục 1–9 giữ nguyên bản gốc, vì comment trong code vẫn ghi "`docs/DESIGN_SYSTEM.md` mục N".

## Mục N nằm ở đâu

| Mục | Nội dung                                                    | File                                           |
| --- | ----------------------------------------------------------- | ---------------------------------------------- |
| 1–3 | Cấu trúc theme × mode, bảng màu, quy ước CSS variables      | [`design/theme.md`](design/theme.md)           |
| 4   | Font, quy tắc chữ mono, thang cỡ chữ                        | [`design/typography.md`](design/typography.md) |
| 5   | Bố cục, header, footer, breakpoint, token bố cục            | [`design/layout.md`](design/layout.md)         |
| 6   | Thành phần: card, tag, icon, cover, search, bộ chọn         | [`design/components.md`](design/components.md) |
| 6   | Riêng trang bài viết: mục lục, nút `#`, thanh tiến độ đọc   | [`design/post-page.md`](design/post-page.md)   |
| 7   | Chuyển động: token, quy tắc, danh mục, hover                | [`design/motion.md`](design/motion.md)         |
| —   | Registry và quy tắc tag dùng chung cho portal + lab         | [`TAGS.md`](TAGS.md)                           |
| 8–9 | Nguyên tắc, checklist, khác biệt so với `design-reference/` | file này                                       |

## Nguồn sự thật

- Tài liệu quyết định, code cài đặt. Đổi màu, font, token: sửa tài liệu trước, rồi `portal/src/styles/tokens.css`.
- `design-reference/` chỉ để tham khảo bố cục và màu. Khi khác tài liệu thì theo tài liệu và ghi vào bảng ở cuối file này.
- Lý do của các quyết định thiết kế nằm ở [`adr/`](adr/README.md), không nằm trong các file spec.

## 8. Nguyên tắc

1. **Tương phản:** text chính đạt tối thiểu WCAG AA (4.5:1) trên nền ở mọi cặp theme × mode đang triển khai (hiện tại: Minimalist Editorial light và dark). Kiểm tra cả link và text phụ.
2. **Tối giản:** tránh card lồng nhau, gradient/glow trang trí và minh họa lớn. Ngoại lệ đã
   chốt: cover SVG 16:9 cho bài viết ở [ADR 0009](adr/0009-cover-bai-viet-thu-cong.md); không nới
   ngoại lệ cho thành phần khác.
3. **Một CTA:** mỗi màn hình tối đa một hành động chính.
4. **Nhất quán:** bố cục và typography giữ nguyên giữa các theme. Chỉ màu sắc thay đổi.
5. **Cá nhân:** ưu tiên nội dung và giọng văn của tác giả hơn trang trí.
6. **Chuyển động có mục đích.** Animation không bắt buộc; nếu có thì theo mục 7 (`design/motion.md`) và luôn tôn
   trọng `prefers-reduced-motion`.

## 9. Việc cần kiểm tra

- [x] Contrast của `--color-text-muted` trên `--color-surface`: 7.16:1 (dark) và 4.87:1 (light)
- [x] Contrast của `--color-link`: trên background 8.49:1 (dark) / 5.24:1 (light), trên surface 7.45:1 (dark) / 5.62:1 (light)
      — đo bằng công thức WCAG 2.1 (relative luminance) ngày 2026-10-18. Lưu ý: secondary text trên surface ở light chỉ 4.87:1, sát ngưỡng AA 4.5:1, không được giảm thêm.
- [x] Hiển thị tiếng Việt của Patrick Hand (subset `vietnamese` của Google Fonts: U+0102-0103, U+0110-0111, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9)
- [ ] Trạng thái focus cho bàn phím
- [ ] Trạng thái "đang chạy" và "sắp tới" của lab card có đủ phân biệt không khi chỉ dựa vào màu
- [x] Animation tôn trọng `prefers-reduced-motion` (CSS guard trong `global.css` + kiểm tra
      trong `BaseLayout.astro` và `ThemeToggle.astro`)
- [x] Search: `Ctrl/Cmd+K` và `/`, điều hướng `↑` `↓`, `Enter`, `Esc`; tìm không dấu; không thêm
      dependency runtime; dialog có focus trap của `<dialog>` gốc
- [x] Tag: registry `@dev-lab/tags` là nguồn duy nhất; frontmatter sai tag hoặc quá 4 tag làm build
      thất bại; label hiển thị đã chuẩn hoá
- [x] Cover bài viết: SVG inline dùng token, hiển thị đúng light/dark; bài thiếu cover có fallback
      monogram; `coverAlt` bắt buộc khi có cover
- [x] `/bai-viet`: lưới 1/2/3 cột, cover 16:9, card có một link duy nhất; trang chủ không đổi
- [x] Theme không bị reset sau khi chuyển trang bằng View Transitions (chép `data-theme` /
      `data-mode` trong `astro:before-swap`)
- [ ] Thời lượng chuyển động và bundle JS của `motion/mini` trên mobile (Lighthouse Performance)
- [ ] Hover của link, nav, lab card, hàng bảng đúng như mục 7.4 (`design/motion.md`) ở cả light và dark
- [ ] Gạch chân mọc dần không gây layout shift; link trong bài viết dài không vỡ khi xuống dòng
- [ ] Lab card chưa có địa chỉ: không hover, không con trỏ pointer
- [ ] Nút `filled` dùng `color-mix`, không hard-code màu accent đậm hơn

## Ghi chú: khác biệt có chủ ý so với `design-reference/`

`design-reference/` là bản tham khảo bố cục và màu sắc. Màu sắc trong đó khớp hoàn toàn với mục
2 (Minimalist Editorial + Digital Garden), nên **không có khác biệt về màu**. Các điểm sau **cố
ý không** theo reference:

| Điểm               | Reference                                   | Dev Lab                                                 | Lý do                                                        |
| ------------------ | ------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Font display       | Balsamiq Sans, weight 700                   | Patrick Hand, weight 400                                | Balsamiq Sans thiếu subset tiếng Việt; Patrick Hand 1 weight |
| Bộ chọn theme      | 4 nút gộp (2 theme × 2 mode), bỏ "Hệ thống" | 2 trục độc lập, mỗi trục một `<select>`, giữ "Hệ thống" | Giữ mô hình hai trục ở mục 1; dùng control gốc cho a11y      |
| Tiêu đề bài viết   | Inter 600, 17px                             | font display, `--text-2xl`                              | Inter hiện chỉ nạp weight 400/500                            |
| Cấu trúc site      | một trang, điều hướng bằng anchor           | trang riêng `/labs`, `/bai-viet`, `/lien-he`            | Nội dung sẽ dài, cần URL riêng                               |
| Tên theme          | nhãn ngắn `ấm` / `dịu`                      | `Minimalist Editorial` / `Digital Garden`               | Khớp `src/data/themes.ts` và mục 2                           |
| Màu hover `filled` | (không có)                                  | `color-mix(in oklab, accent 88%, bg)`                   | Không thêm biến màu mới                                      |
| Header             | không có (không có bố cục dính)             | dính + capsule mờ khi cuộn + nav pill hover             | Bổ sung theo yêu cầu, tham khảo `ngockhoi96.dev`             |
