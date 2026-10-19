# 0002. Theme và mode là hai trục độc lập

Trạng thái: Accepted
Ngày: 2026-10-18

## Bối cảnh

Ban đầu giao diện được hình dung là bốn chế độ cố định (hai theme nhân hai mode). Cách đó khó mở rộng: mỗi theme mới kéo theo bội số tổ hợp. `design-reference/` cũng dùng bốn nút gộp và bỏ lựa chọn "Hệ thống".

## Quyết định

- Hai thuộc tính độc lập trên `<html>`: `data-theme` và `data-mode`.
- Mode gồm Hệ thống, Sáng, Tối. Mỗi theme chỉ định nghĩa bảng màu cho light và dark của chính nó.
- Bố cục và typography không đổi theo theme; chỉ màu sắc đổi.
- Giai đoạn 1 chỉ triển khai Minimalist Editorial. Bộ chọn theme tự ẩn khi chỉ có một theme.

## Hệ quả

- Thêm theme mới gồm ba bước: bảng màu trong `docs/design/theme.md`, block CSS variables trong `tokens.css`, đăng ký trong `portal/src/data/themes.ts`.
- Bộ chọn dùng hai `<select>` gốc, khác với reference; khác biệt này đã ghi ở cuối `DESIGN_SYSTEM.md`.
- View Transitions thay toàn bộ attribute của `<html>`, nên phải chép `data-theme` / `data-mode` sang document mới trong `astro:before-swap` (xem ADR 0004).
