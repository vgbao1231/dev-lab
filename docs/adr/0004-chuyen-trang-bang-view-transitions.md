# 0004. Chuyển trang bằng View Transitions

Trạng thái: Accepted
Ngày: 2026-10-18

## Bối cảnh

Muốn chuyển trang mượt mà vẫn giữ site tĩnh, không thêm framework. Chuyển động phải tối giản, giúp làm rõ thay đổi trạng thái và thứ bậc chứ không để trang trí.

## Quyết định

- Dùng `<ClientRouter />` của Astro. Chỉ `main` cross-fade, phần gốc không animate.
- Header dùng `transition:persist`; tiêu đề các trang có `view-transition-name: page-title`; tiêu đề bài viết là shared element `vt-post-<id>`.
- Đổi theme/mode bọc bằng `document.startViewTransition()`, kèm cờ `data-theme-transition` để lần đổi này vẫn cross-fade cả trang.
- Entrance animation cho `[data-animate]` bằng `motion/mini`, chỉ chạy ở lần tải trang đầu.

## Hệ quả

- `aria-current` ở nav phải cập nhật bằng JS vì DOM header được giữ nguyên.
- `data-theme` / `data-mode` phải được chép trong `astro:before-swap`, nếu không theme bị reset sau khi chuyển trang.
- Cờ `.motion-ready` được script inline chèn trước khi vẽ và chỉ khi không yêu cầu giảm chuyển động, nên không có nháy và nội dung không bị ẩn khi JS lỗi.
- Chỉ animate `opacity` và `transform`; ngoại lệ duy nhất là chrome của header (xem ADR 0006).
