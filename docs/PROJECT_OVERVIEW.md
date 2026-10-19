# Tổng quan dự án: Dev Lab

## 1. Dev Lab là gì

Dev Lab là một hệ sinh thái các blog và lab kỹ thuật. Thay vì một blog duy nhất, dự án gồm một **cổng chính** giới thiệu, phân loại và liên kết nhiều **lab** chuyên biệt. Mỗi lab tập trung vào một công nghệ hoặc một lĩnh vực — frontend, backend, DevOps hay chủ đề liên quan — và có thể có stack, giao diện và quy trình triển khai riêng.

## 2. Mục tiêu

1. **Chia sẻ kiến thức** kỹ thuật đã học hoặc đang tìm hiểu.
2. **Củng cố kiến thức cũ** thông qua nghiên cứu, giải thích và thực hành.
3. **Áp dụng công nghệ mới** vào các dự án thực tế nhỏ.
4. **Xây dựng sản phẩm đưa được vào CV** nếu đủ chất lượng kỹ thuật.
5. **Phát triển lâu dài**, theo hành trình nghề nghiệp của tác giả.

Dự án không nhằm tạo ra ý tưởng ứng dụng độc đáo. Trọng tâm là giá trị học tập, chất lượng kỹ thuật và khả năng duy trì.

## 3. Đối tượng sử dụng

- **Chính tác giả**: nơi ghi chép, thử nghiệm và ôn tập.
- **Frontend developer ở trình độ junior đến mid** muốn hiểu sâu cơ chế hoạt động của React, JavaScript, Next.js và các công cụ liên quan.
- **Nhà tuyển dụng hoặc người xem CV** muốn đánh giá năng lực kỹ thuật qua sản phẩm thực tế.

## 4. Phạm vi

### Trong phạm vi

- Cổng chính (portal) giới thiệu và liệt kê các lab.
- Các lab nội dung: bài viết, demo tương tác, thử nghiệm có số đo.
- Trang liên hệ, danh sách dự án khác, thông tin CV.

### Ngoài phạm vi (ít nhất ở giai đoạn hiện tại)

- Hệ thống đăng nhập, bình luận, tài khoản người dùng.
- Backend riêng cho nội dung. Nội dung là file tĩnh.
- Tính năng SaaS, dashboard, hay landing page bán hàng.

## 5. Các loại nội dung

| Loại             | Mục đích                                    | Ví dụ                             |
| ---------------- | ------------------------------------------- | --------------------------------- |
| Concept          | Giải thích kiến thức và cơ chế              | Reconciliation hoạt động thế nào  |
| Experiment       | Thử nghiệm, đo lường, so sánh               | useMemo trên list 10.000 item     |
| Case Study       | Phân tích vấn đề, debug, bài học            | Tìm nguyên nhân re-render thừa    |
| Interactive Demo | Demo để người đọc tự thử                    | Mô phỏng event loop               |
| Tutorial         | Hướng dẫn thực hiện một kỹ thuật            | Thiết lập Vitest với React        |
| Technical Note   | Ghi chép học tập, migration, vấn đề thực tế | Dựng lab đầu tiên trên Cloudflare |

Không bắt buộc mọi lab phải có đủ các loại trên.

## 6. Ví dụ các lab tiềm năng

Đây là danh sách mở, chưa phải kế hoạch cố định.

| Lab                 | Stack dự kiến               | Nội dung chính                            |
| ------------------- | --------------------------- | ----------------------------------------- |
| React Lab           | React, TypeScript, Vite     | Hooks, rendering, state, performance      |
| Next.js Lab         | Next.js                     | SSR, SSG, Server Components, caching      |
| JS Under the Hood   | Tuỳ chọn                    | Event loop, closure, prototype, Promise   |
| Web Performance Lab | Tuỳ chọn                    | Core Web Vitals, waterfall, benchmark     |
| Testing Lab         | Vitest, Playwright          | Unit, integration, E2E                    |
| Backend Mechanics   | Node.js, Express            | HTTP, middleware, auth, API design        |
| Database Lab        | SQL                         | Index, join, transaction, isolation level |
| DevOps Playground   | Docker, GitHub Actions      | CI/CD, deployment                         |
| Cloud Lab           | AWS, CloudFront, S3, Lambda | CDN caching, serverless                   |
| Git Internals       | Tuỳ chọn                    | Commit graph, merge, rebase               |

## 7. Nguyên tắc

### Dogfooding là tùy chọn

Việc dùng công nghệ để xây dựng chính website là cơ hội thực hành, không phải yêu cầu bắt buộc. Khi chỉ cần giải thích một kiến thức, viết bài là đủ.

### Phát triển theo giai đoạn

Không xây toàn bộ hệ sinh thái ngay từ đầu. Bắt đầu nhỏ, mở rộng khi có kiến thức, nhu cầu và thời gian phù hợp. Các lab mới có thể dùng công nghệ khác nhau.

### Chất lượng hơn số lượng

Một lab tốt với ít bài viết có giá trị hơn nhiều lab rỗng nội dung.

## 8. Tiêu chí đánh giá ý tưởng

Khi đề xuất hoặc đánh giá một lab, nội dung hay tính năng mới, kiểm tra:

1. Có đáp ứng mục tiêu chia sẻ kiến thức không?
2. Có giúp củng cố kiến thức cũ hoặc học kiến thức mới không?
3. Có áp dụng được vào thực tế không?
4. Có giá trị đưa vào CV không?
5. Có mở rộng được trong nhiều tháng hoặc năm không?
6. Có nét riêng, không chỉ là một blog thông thường không?
7. Chi phí hosting, domain và công sức duy trì có hợp lý không?
8. Có thể bắt đầu nhỏ và phát triển dần không?

## 9. Kiến trúc (đã chốt)

Lý do chi tiết ở [`adr/`](adr/README.md).

- **Tên**: Dev Lab, repo `dev-lab` (chốt 2026-10-18).
- **Portal**: `portal/`, Astro với output tĩnh, CSS thuần + design tokens ([ADR 0001](adr/0001-astro-tinh-va-pnpm-workspace.md)).
- **Lab**: mỗi lab là một ứng dụng độc lập trong `labs/`, có thể có stack, repo và quy trình deploy riêng. Lab đầu tiên: `react-lab` (React, TypeScript, Vite).
- **Nội dung**: Markdown/MDX trong content collection `posts`; schema frontmatter ở `portal/src/content.config.ts`.
- **Design**: theme và mode là hai trục độc lập ([ADR 0002](adr/0002-theme-va-mode-hai-truc-doc-lap.md)); giai đoạn 1 chỉ triển khai theme Minimalist Editorial. Token và quy tắc ở `docs/DESIGN_SYSTEM.md`.
- **Hosting (dự kiến, chưa kết nối)**: Cloudflare Pages.

## 10. Những điều chưa quyết định

Các mục dưới đây **chưa được chốt**. Không nên coi là đã quyết định khi viết code hoặc nội dung.

- Mỗi lab là subdomain, đường dẫn con hay site riêng (liên quan mục 1.6 trong `ROADMAP.md`).
- Các lab dùng chung design tokens với portal hay có bản sắc riêng (`react-lab` hiện chỉ có style bố cục).
- Mức độ tương tác: chỉ bài viết, có demo, hay có playground chạy trực tiếp (giai đoạn 2).
- Lab thứ hai (dự kiến JS Under the Hood hoặc Next.js Lab).
- Quy trình xuất bản, và có cần công cụ quản lý nội dung ngoài file Markdown hay không.
