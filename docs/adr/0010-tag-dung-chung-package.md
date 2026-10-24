# 0010. Tag dùng chung qua package `@dev-lab/tags`

Trạng thái: Accepted
Ngày: 2026-10-24

## Bối cảnh

Tag ban đầu là chuỗi tự do trong frontmatter. Khi số bài và số lab tăng, cùng một khái niệm dễ
được viết thành nhiều biến thể (`React`, `react`, `ReactJS`, `state`, `state-management`). Tag
cũng cần dùng được ở các lab, không chỉ portal, và không nên phụ thuộc vào `lab`, `type` hay
category của bài.

Các hướng đã cân nhắc:

1. Tiếp tục dùng chuỗi tự do, chỉ chuẩn hóa bằng quy ước viết.
2. Đặt danh sách tag trong một file của portal, các lab copy sang.
3. Tạo một package workspace dùng chung.

Hướng 1 không ngăn được lệch dữ liệu. Hướng 2 tạo hai nguồn sự thật và sẽ lệch khi thêm tag.

## Quyết định

- Tạo package `packages/tags` với tên `@dev-lab/tags`; portal và các lab khai báo dependency
  `workspace:*`.
- Registry có **23 tag**, chia ba nhóm:
  - **Technology:** React, TypeScript, JavaScript, Astro, Next.js, Node.js, Docker, SQL, Git.
  - **Domain:** Frontend, Backend, Performance, Rendering, State Management, Concurrency, Testing,
    Database, DevOps, Cloud.
  - **Approach:** Internals, Architecture, Debugging, Benchmarking.
- Mỗi tag có `id`, `label`, `group`, `description`. `id` viết thường, không dấu, dùng dấu gạch nối
  khi cần (`state-management`); `label` giữ tên chính thức (`Next.js`, `Node.js`,
  `State Management`).
- Frontmatter bài viết lưu **id**, không lưu label. Schema ở `portal/src/content.config.ts`:
  - kiểm tra id bằng `isTagId`;
  - từ chối trùng, ít hơn 1 hoặc nhiều hơn 4 tag;
  - sắp xếp Technology → Domain → Approach rồi đổi thành label trước khi component đọc.
- Quy tắc nội dung: mỗi bài 1–4 tag, khuyến nghị 2–3; tag độc lập với lab/type/category; ưu tiên
  tag tổng quát; kiểm tra registry trước khi thêm; chỉ thêm khi thật sự cần.
- Tài liệu quy ước và danh sách đầy đủ: [`docs/TAGS.md`](../TAGS.md).

## Hệ quả

- Chỉ có một nguồn sự thật. Thêm tag là thay đổi code + tài liệu, không phải sửa rải rác.
- Build thất bại khi tag sai, thay vì âm thầm hiện một tag lạ. Đây là lựa chọn có chủ đích.
- Thứ tự tag trong frontmatter không còn ảnh hưởng UI; cùng một tập tag luôn hiển thị cùng thứ tự.
- Tag không phải nơi ghi công nghệ phụ hoặc từ khóa một lần. Những từ đó nằm trong nội dung bài và
  search index.
- Đổi `id` đã dùng là thay đổi dữ liệu, cần migration; không đổi tùy tiện.
