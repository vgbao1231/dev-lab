# 0001. Portal Astro tĩnh, các lab độc lập trong pnpm workspace

Trạng thái: Accepted
Ngày: 2026-10-17

## Bối cảnh

Dev Lab là hệ sinh thái nhiều lab chuyên biệt, mỗi lab có thể dùng công nghệ khác nhau. Nội dung là file tĩnh; không có đăng nhập, bình luận hay backend riêng (xem "Ngoài phạm vi" trong `PROJECT_OVERVIEW.md`). Ưu tiên tốc độ tải và chi phí hosting thấp.

## Quyết định

- Portal dùng Astro với output tĩnh, CSS thuần cùng design tokens, đặt ở `portal/`.
- Repo là pnpm workspace gồm `portal` và `labs/*`. Mỗi lab là một ứng dụng độc lập.
- Lab đầu tiên là `react-lab` (React, TypeScript, Vite).
- Hosting dự kiến: Cloudflare Pages (chưa kết nối).

## Hệ quả

- Lab mới có thể chọn stack riêng mà không ảnh hưởng portal.
- Việc dùng chung design tokens giữa portal và lab, cũng như cách đặt lab (subdomain, đường dẫn con hay site riêng), **chưa được chốt**.
- Build của portal chạy qua Rolldown nên có gotcha về `tsconfig` (xem "Gotchas" trong `AGENTS.md`).
