# 0007. Thanh tiến độ đọc chạy bằng `animation-timeline: scroll()`

Trạng thái: Accepted
Ngày: 2026-10-18

## Bối cảnh

Bản đầu ghi tiến độ bằng JS ở từng frame cuộn nên thanh bị giật.

## Quyết định

- Đường chính: trình duyệt hỗ trợ `animation-timeline: scroll()` thì animation chạy theo tiến độ cuộn trên compositor. JS chỉ đo và ghi `--reading-start` / `--reading-end` cho `animation-range`, không làm gì mỗi frame.
- Đường dự phòng: trình duyệt không hỗ trợ thì JS ghi `--reading-progress` theo từng frame cuộn.
- JS xác nhận bằng `getComputedStyle(bar).animationName`, không chỉ tin `CSS.supports`: nếu cú pháp bị loại ở đâu đó mà JS đã ngừng ghi thì thanh đứng yên ở 0.
- Không dùng `transition`: giá trị đã bám theo từng frame nên transition chỉ tạo độ trễ giả.

## Hệ quả

- Khi `prefers-reduced-motion: reduce`, không bật đường chính: quy tắc toàn cục `animation-duration: 0.01ms !important` ở `global.css` sẽ làm animation theo tiến độ cuộn nhảy thẳng tới 100%. JS đảm nhiệm và thanh vẫn chạy.
- Không hiển thị số phần trăm, chỉ một đường mảnh 2px.
