# 0008. Mỗi lab là một project Cloudflare Pages riêng

Trạng thái: Accepted
Ngày: 2026-10-20

## Bối cảnh

Mục 1.6 cần một chỗ để đưa React Lab lên mạng, và cách đặt lab vẫn nằm trong "Những điều chưa quyết định". Ba lựa chọn đã cân nhắc:

- **Đường dẫn con trong portal** (`/labs/react-lab`): build của lab phải nhét vào `portal/dist`, Vite phải đặt `base` theo đường dẫn, và mỗi lần deploy lab là deploy lại cả portal.
- **Project Pages riêng cho mỗi lab** (`react-lab.pages.dev`): lab giữ nguyên cấu hình Vite, build và deploy độc lập với portal.
- **Subdomain của domain riêng** (`react-lab.<domain>`): sạch nhất về dài hạn nhưng cần mua domain trước.

## Quyết định

- Mỗi lab là một project Cloudflare Pages riêng, cùng trỏ vào repo `dev-lab`.
- Project của lab dùng root directory là gốc repo, build `pnpm --filter <lab> build`, output `labs/<lab>/dist`.
- Portal liên kết tới lab bằng URL tuyệt đối qua `href` trong `portal/src/data/labs.ts`; build của lab **không** được nhúng vào portal.
- Khi có domain riêng, gắn subdomain cho từng project Pages — không phải đổi cấu hình build.

## Hệ quả

- Thêm lab mới nghĩa là thêm một project Pages, không đụng vào portal. Hợp với "mỗi lab là một ứng dụng độc lập" ở ADR 0001.
- Mỗi lab có preview deployment riêng theo branch hoặc pull request, không chờ build của portal.
- Link từ portal sang lab là cross-origin: không có điều hướng chung, không dùng chung layout hay token giữa các site.
- Cấu hình từng project nằm ở README, mục "Deploy".
