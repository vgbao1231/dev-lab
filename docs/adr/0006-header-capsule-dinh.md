# 0006. Header dính dạng capsule mờ

Trạng thái: Accepted
Ngày: 2026-10-18

## Bối cảnh

Header được làm lại theo kiểu của `ngockhoi96.dev` (bổ sung ngoài `design-reference/`): dính, thu thành capsule mờ khi cuộn, ẩn hiện theo hướng cuộn. Yêu cầu là mượt và không đẩy nội dung bên dưới.

## Quyết định

- Nền đục nằm trên thanh bar, header không có nền riêng; khi cuộn quá 4px thì nền bán trong suốt và thanh thành capsule.
- `backdrop-filter: blur(12px)` bật **thường trực**. Bật tắt theo trạng thái cuộn buộc trình duyệt tạo lại compositing layer giữa chừng và gây giật.
- Chiều cao thanh **không** đổi giữa hai trạng thái, nên không reflow.
- Khi đã cuộn, capsule hạ xuống `--header-inset` (12px, từ 640px) bằng `position: relative; top` (chỉ đổi lúc vẽ), kèm dải nền đục `.site-header::before` che khoảng hở.
- Ẩn khi cuộn quá 320px, cần delta 16px mới đổi trạng thái, cooldown 250ms giữa hai lần ẩn; tắt hẳn khi `prefers-reduced-motion`.
- Brand cỡ 28px (`--text-brand`) với `line-height: 1`.

Số đo bằng Chrome headless ở 1280px: ở 24px với `line-height: normal`, hộp dòng của brand là 32px và quyết định chiều cao thanh (header 62px). Ở 28px với `line-height: 1`, hộp dòng là 28px nên phần tử cao nhất chuyển thành nav và header còn 60.4px. 32px là mức lớn nhất vẫn giữ 62px nhưng nét chữ khi đó ngang cỡ `h1`.

## Hệ quả

- Đổi cỡ brand trong khoảng 28–32px không kéo theo thay đổi nào khác.
- Header là ngoại lệ **duy nhất** của quy tắc "chỉ animate `opacity` và `transform`": nó đổi `max-width`, `padding-inline`, màu nền, viền, bo góc và bóng. Không được nới ngoại lệ này cho phần tử khác.
- Token `--duration-chrome` (340ms) dành riêng cho chuyển động này.
