# 0003. Patrick Hand làm font display thay Balsamiq Sans

Trạng thái: Accepted
Ngày: 2026-10-18

## Bối cảnh

`design-reference/` dùng Balsamiq Sans weight 700 cho chữ display. Balsamiq Sans không có subset `vietnamese`, trong khi toàn bộ nội dung viết bằng tiếng Việt.

## Quyết định

Dùng Patrick Hand (có subset tiếng Việt) cho chữ display, Inter cho nội dung, JetBrains Mono cho metadata và code. Đây là khác biệt có chủ ý so với reference.

## Hệ quả

- Patrick Hand chỉ có weight 400: tiêu đề dùng weight normal, không giả lập bold.
- Inter hiện chỉ nạp weight 400 và 500, nên tiêu đề bài viết dùng font display thay vì Inter 600 như reference.
- Chip ở bảng facts cũng dùng font display (ngoại lệ có chủ ý, xem `docs/design/typography.md`).
- Mỗi font cần fallback và được kiểm tra đủ dấu tiếng Việt trước khi chốt.
