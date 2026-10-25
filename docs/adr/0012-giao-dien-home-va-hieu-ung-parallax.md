# 0012. Giao diện trang chủ và hiệu ứng parallax nền

Trạng thái: Accepted
Ngày: 2026-10-24

## Bối cảnh

Trang chủ Dev Lab cần làm mới giao diện theo thiết kế tham khảo tại `design-reference/home-html/Main.dc.html` để hoàn thiện vai trò portfolio cá nhân và khu vườn kỹ thuật (Digital Garden vibe). Thiết kế gốc có các đặc điểm:

1. Nền trang chủ mang tông xanh rêu tối (`#0b0d09` cùng `radial-gradient` xanh rêu đậm từ trên đỉnh), điểm xuyết bằng 4 blob hữu cơ lớn và các hạt bụi mờ lơ lửng (floating dust particles) phát sáng nhẹ.
2. Hiệu ứng parallax chuyển động mượt mà theo con trỏ chuột (`mousemove`) và cuộn trang (`scroll`), kết hợp animation nhịp thở lơ lửng hữu cơ cho các hạt bụi mờ.
3. Hero dạng 2 cột: bên trái là lời chào và link điều hướng; bên phải là hình minh hoạ cây mầm (`sprout`) kèm ghi chú viết tay `Small steps / Big progress`.
4. Mục "Các lab" chuyển sang bố cục 2 phần: sidebar giới thiệu bên trái và lưới thẻ card bên phải với cấu trúc cover 72px, chip danh mục, tiêu đề font serif và dòng trạng thái.
5. Kiểu chữ đa dạng: dùng `Caveat` cho chữ viết tay phóng khoáng (tên hero 92px, note) và `Lora` cho tiêu đề serif.

## Quyết định

- **Font chữ:** Bổ sung `Caveat`, `Lora` và `Be Vietnam Pro` vào thẻ font ở `BaseLayout.astro`, khai báo thành tokens `--font-caveat`, `--font-serif`, `--font-sans` trong `tokens.css`. Hero name sử dụng font Caveat kích thước lớn (clamp tới 92px) và Lora cho tiêu đề mục Labs / card lab.
- **Nền và Blobs, Hạt bụi mờ:** Bọc toàn bộ nội dung trang chủ trong `.home-wrapper` mang màu nền và radial gradient chuẩn từ reference. Các blob và các hạt bụi mờ (floating particles) nằm trong lớp `.home-deco` (`position: absolute; inset: 0; pointer-events: none`). Mỗi hạt bụi mờ gồm lớp ngoài nhận transform parallax và lớp bên trong (`.home-dot__glow`) chạy keyframes lơ lửng, nhấp nháy phát sáng nhẹ nhàng tạo cảm giác huyền ảo (digital garden / fireflies). Ẩn lớp trang trí này ở chế độ Light mode để đảm bảo độ tương phản.
- **Hiệu ứng Parallax:** Cài đặt bằng TypeScript thuần với `requestAnimationFrame` và toạ độ chuẩn hoá `nx, ny` trong khoảng `[-0.5, 0.5]` (không scale quá đà). CSS `transition: transform` chậm (1s - 2.8s) tạo độ trễ hữu cơ. Lắng nghe cả `DOMContentLoaded` và sự kiện `astro:page-load` để hoạt động chính xác với View Transitions.
- **Khả năng tiếp cận:** Tắt hoàn toàn transition và transform khi hệ thống bật cờ `prefers-reduced-motion: reduce`. Toàn bộ đồ hoạ minh hoạ và khối trang trí đều được gắn `aria-hidden="true"`.
- **Card Lab:** Cập nhật `LabCard.astro` theo đúng cấu trúc của reference: bo góc `border-radius: 12px`, padding 10px, ảnh cover bo góc 8px cao 72px với gradient tuỳ chỉnh theo từng lab, chip danh mục nhỏ gọn và dòng meta ngày/trạng thái.

## Hệ quả

- Trang chủ có chiều sâu thị giác phong phú và tương tác mượt mà đúng theo prototype tham khảo mà không làm tăng dung lượng bundle (không cài thêm dependency JS bên ngoài).
- Duy trì tính nhất quán khi điều hướng nhờ tương thích hoàn toàn với View Transitions.
- Light mode vẫn giữ được sự hài hòa và sạch sẽ nhờ tự động ẩn các blob tối và chuyển sang gradient sáng phù hợp.
