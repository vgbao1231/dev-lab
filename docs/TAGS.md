# Hệ thống tag

Tag là metadata dùng chung cho portal và mọi lab. Mục tiêu là để một bài viết có thể được tìm
theo cùng một từ vựng, dù bài đó thuộc lab nào, loại nội dung nào hay category nào.

Registry nằm ở **`packages/tags/src/index.ts`** và được publish nội bộ dưới tên
**`@dev-lab/tags`**. Portal và các lab import cùng một nguồn; không chép danh sách tag sang chỗ khác.

## Quy tắc chọn tag

- Mỗi bài dùng **1–4 tag**, khuyến nghị **2–3**. Một tag chỉ nên có mặt khi nó thực sự giúp phân
  loại hoặc tìm kiếm bài.
- Tag **độc lập** với `lab`, `type` và category. Không dùng tag để thay tên lab, loại bài hay
  chuyên mục.
- Dùng **tên tiếng Anh chính thức** của công nghệ/khái niệm: `Next.js`, `Node.js`, `State
Management`, không viết `Nextjs`, `Node`, `state`.
- Ưu tiên tag **tổng quát, tái sử dụng được**. Không tạo tag cho một bài, một thư viện nhỏ hoặc
  một biến thể chỉ xuất hiện một lần.
- **Kiểm tra danh sách trước khi thêm.** Nếu đã có tag cùng nghĩa, dùng tag đó. Ví dụ: không thêm
  `hooks` khi đã có `React`; không thêm `async` khi đã có `Concurrency`.
- Không dùng tag thay cho từ khoá trong tiêu đề. Từ khoá cụ thể (tên API, tên lỗi) thuộc về nội
  dung bài và search index, không thuộc registry.
- Thứ tự hiển thị do registry quyết định: **Technology → Domain → Approach**, cùng nhóm thì theo
  label. Frontmatter không cần sắp xếp.

## Danh sách hiện tại (23 tag)

### Technology — công cụ, ngôn ngữ, nền tảng

| ID           | Label      | Dùng khi                                          |
| ------------ | ---------- | ------------------------------------------------- |
| `react`      | React      | React, hooks, rendering và hệ sinh thái liên quan |
| `typescript` | TypeScript | Type system, generic, strict mode và tooling      |
| `javascript` | JavaScript | Ngôn ngữ JavaScript, runtime và cơ chế của nó     |
| `astro`      | Astro      | Astro, islands, content collection và build tĩnh  |
| `nextjs`     | Next.js    | Next.js, SSR/SSG, Server Components và caching    |
| `nodejs`     | Node.js    | Runtime Node.js, HTTP, middleware và API          |
| `docker`     | Docker     | Container, image, compose và môi trường chạy      |
| `sql`        | SQL        | Truy vấn, index, join và transaction              |
| `git`        | Git        | Commit graph, merge, rebase và quy trình làm việc |

### Domain — lĩnh vực hoặc khái niệm kỹ thuật

| ID                 | Label            | Dùng khi                                                 |
| ------------------ | ---------------- | -------------------------------------------------------- |
| `frontend`         | Frontend         | Xây dựng giao diện và trải nghiệm phía client            |
| `backend`          | Backend          | API, service và xử lý phía server                        |
| `performance`      | Performance      | Tốc độ tải, chi phí runtime và các chỉ số hiệu năng      |
| `rendering`        | Rendering        | Cơ chế tạo/cập nhật UI: render, reconciliation, commit   |
| `state-management` | State Management | Quản lý, chia sẻ và đồng bộ state                        |
| `concurrency`      | Concurrency      | Scheduling, interrupt, xử lý song song và tính nhất quán |
| `testing`          | Testing          | Unit, integration, E2E và chiến lược kiểm thử            |
| `database`         | Database         | Mô hình dữ liệu, truy vấn, transaction và isolation      |
| `devops`           | DevOps           | Build, deploy, CI/CD và vận hành hệ thống                |
| `cloud`            | Cloud            | CDN, serverless và hạ tầng cloud                         |

### Approach — góc tiếp cận của bài viết

| ID             | Label        | Dùng khi                                          |
| -------------- | ------------ | ------------------------------------------------- |
| `internals`    | Internals    | Đi vào cơ chế bên trong runtime hoặc framework    |
| `architecture` | Architecture | Cấu trúc hệ thống, ranh giới và đánh đổi thiết kế |
| `debugging`    | Debugging    | Tìm nguyên nhân lỗi và cách quan sát hệ thống     |
| `benchmarking` | Benchmarking | Đo lường, so sánh có kiểm soát và có thể tái lập  |

## Cách dùng trong bài viết

Frontmatter ghi **ID**, không ghi label:

```yaml
tags: ['react', 'internals', 'rendering']
```

Schema ở `portal/src/content.config.ts` sẽ:

1. Kiểm tra từng ID có trong registry.
2. Từ chối tag trùng, ít hơn 1 hoặc nhiều hơn 4.
3. Sắp xếp theo nhóm rồi đổi ID thành label chuẩn.

Component chỉ nhận label (`React`, `Internals`, `Rendering`), nên UI không cần biết registry và
không thể vô tình hiển thị ID thô. Tag trong frontmatter sai sẽ làm **build thất bại**, không bị
bỏ qua im lặng.

Ví dụ:

| Bài                              | Tag                                        |
| -------------------------------- | ------------------------------------------ |
| React Fiber & Reconciliation     | `react`, `internals`, `rendering`          |
| React Concurrent Rendering       | `react`, `concurrency`, `performance`      |
| Tearing & `useSyncExternalStore` | `react`, `state-management`, `concurrency` |

## Khi cần thêm tag

Chỉ thêm khi thật sự cần, và làm trong cùng một thay đổi:

1. Kiểm tra bảng trên và các tag đã có; loại khả năng trùng nghĩa.
2. Đề xuất ID, label, nhóm và một câu mô tả phạm vi.
3. Cập nhật `packages/tags/src/index.ts` và tài liệu này.
4. Chạy `pnpm typecheck`; schema của portal sẽ tự nhận danh sách mới.
5. Không đổi ID cũ nếu đã có bài dùng; đổi ID là thay đổi dữ liệu, cần migration riêng.

Tag không phải nơi ghi công nghệ phụ, tên thư viện nhỏ hay sở thích cá nhân. Nếu một tag chỉ dùng
cho một bài và không giúp tìm kiếm bài khác, hãy để từ đó trong nội dung bài.
