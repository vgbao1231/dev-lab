# Dev Lab

Dev Lab là một hệ sinh thái các blog và lab kỹ thuật, do [Gura](https://github.com/vgbao1231) phát triển như một dự án cá nhân dài hạn. Nội dung trải trên nhiều lĩnh vực — frontend, backend, DevOps — tuỳ theo công việc và chủ đề đang tìm hiểu.

Mục tiêu: chia sẻ kiến thức, củng cố kiến thức cũ qua thực hành và xây dựng sản phẩm đủ chất lượng để đưa vào CV.

> Trạng thái: **Giai đoạn 1 đang thực hiện** — xem [docs/ROADMAP.md](docs/ROADMAP.md).

## Công nghệ

- Workspace: pnpm workspace, Node `>=22.22.0`, pnpm `12`
- Portal: Astro (static output), CSS thuần + design tokens
- Chuyển động: View Transitions của Astro (`<ClientRouter />`) + `motion/mini` cho entrance
- Nội dung: Markdown/MDX qua content collection của Astro
- Lab đầu tiên: React, TypeScript, Vite
- Chất lượng mã: TypeScript `strict`, ESLint (flat config), Prettier
- Deploy: Cloudflare Pages _(chưa kết nối — xem mục Deploy bên dưới)_

## Cấu trúc thư mục

```
dev-lab/
├── .github/workflows/ci.yml  # CI: lint, format, typecheck, build
├── AGENTS.md                 # Hướng dẫn cho AI agent (nguồn chính)
├── README.md
├── docs/
│   ├── PROJECT_OVERVIEW.md   # Mục tiêu, đối tượng, phạm vi, kiến trúc đã chốt và chưa chốt
│   ├── ROADMAP.md            # Các giai đoạn, checklist, tiêu chí hoàn thành
│   ├── DESIGN_SYSTEM.md      # Chỉ mục design system, nguyên tắc, checklist
│   ├── design/               # Spec theo chủ đề: theme, typography, layout, components, post-page, motion
│   ├── adr/                  # Quyết định kiến trúc/thiết kế: vì sao, đánh đổi gì
│   └── CHANGELOG.md          # Lịch sử các vòng chỉnh thiết kế
├── design-reference/         # Tham khảo bố cục và màu (HTML + screenshot), không đưa vào build
├── eslint.config.js          # ESLint flat config dùng chung cho cả workspace
├── prettier.config.mjs
├── tsconfig.base.json        # Cấu hình TypeScript strict dùng chung
├── pnpm-workspace.yaml
├── portal/                   # Cổng chính (Astro)
│   ├── public/
│   └── src/
│       ├── components/       # Header, Footer, LabCard, PostList, ProjectList, ThemeToggle,
│       │                     # TableOfContents, ReadingProgress, BackToTop
│       ├── content/posts/    # Bài viết Markdown (tên file = slug)
│       ├── content.config.ts # Collection bài viết + schema frontmatter
│       ├── data/             # Dữ liệu tĩnh (lab, theme, profile, quy ước nội dung)
│       ├── layouts/
│       ├── pages/            # /, /labs, /bai-viet, /bai-viet/<slug>, /lien-he
│       └── styles/           # tokens.css, global.css
└── labs/
    └── react-lab/            # Lab React + TypeScript + Vite
```

Mỗi lab là một ứng dụng độc lập trong `labs/`, có thể có stack và giao diện riêng.

## Yêu cầu môi trường

- Node.js `>=22.22.0`
- pnpm `12` (đã khai báo trong `packageManager`)

## Chạy local

```bash
# Cài dependencies cho toàn workspace
pnpm install

# Chạy portal ở chế độ dev (http://localhost:4321)
pnpm dev

# Chạy riêng một lab
pnpm --filter react-lab dev

# Kiểm tra chất lượng mã
pnpm lint
pnpm format:check
pnpm typecheck

# Build toàn bộ workspace
pnpm build
```

| Lệnh                                | Việc                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| `pnpm dev`                          | Chạy dev server của portal                             |
| `pnpm build`                        | Build tất cả package (`pnpm -r build`)                 |
| `pnpm preview`                      | Xem thử bản build của portal                           |
| `pnpm lint` / `pnpm lint:fix`       | Chạy / tự sửa lỗi ESLint                               |
| `pnpm format` / `pnpm format:check` | Định dạng / kiểm tra định dạng bằng Prettier           |
| `pnpm typecheck`                    | `astro check` cho portal và `tsc --noEmit` cho các lab |

## Nội dung bài viết

Bài viết là file Markdown trong `portal/src/content/posts/`; tên file trở thành slug trên URL. Frontmatter bắt buộc:

| Trường    | Kiểu   | Ghi chú                                                           |
| --------- | ------ | ----------------------------------------------------------------- |
| `title`   | string | Tiêu đề bài                                                       |
| `date`    | date   | `YYYY-MM-DD`                                                      |
| `type`    | enum   | `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note` |
| `lab`     | string | Slug lab, ví dụ `react-lab`                                       |
| `tags`    | array  | Danh sách tag                                                     |
| `summary` | string | Tóm tắt một câu, hiển thị ở danh sách bài                         |

`draft: true` (tuỳ chọn) để loại bài khỏi bản build. Schema được kiểm tra ngay lúc build: thiếu trường hoặc `type` sai thì build thất bại.

> `portal/src/content/posts/bai-viet-mau.md` là bài mẫu để kiểm chứng pipeline — thay bằng bài thật hoặc xoá khi bắt đầu viết nội dung (mục 1.5 trong roadmap).

## Deploy (Cloudflare Pages)

Chưa kết nối repo với Cloudflare (cần tài khoản của tác giả). Cấu hình dự kiến cho portal:

| Thiết lập              | Giá trị                                   |
| ---------------------- | ----------------------------------------- |
| Repository             | `vgbao1231/dev-lab`                       |
| Production branch      | `main`                                    |
| Root directory         | `/` (monorepo, build ở root)              |
| Build command          | `pnpm --filter portal build`              |
| Build output directory | `portal/dist`                             |
| Biến môi trường        | `NODE_VERSION=22.22.0`, `PNPM_VERSION=12` |

- Preview: mỗi pull request sẽ có một preview deployment riêng.
- React Lab: chưa deploy; cần chốt dùng subdomain hay đường dẫn con (xem "Những điều chưa quyết định" trong `docs/PROJECT_OVERVIEW.md`).

## Quy ước

Quy tắc code, gotchas và định nghĩa "xong" nằm ở [AGENTS.md](AGENTS.md); quy tắc giao diện nằm ở [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Hai điểm cần biết khi tự phát triển:

- Không hard-code màu, font, thời lượng, easing: dùng token trong `portal/src/styles/tokens.css`.
- Hoàn thành một mục trong `docs/ROADMAP.md` thì đánh dấu `[x]` trong cùng thay đổi.

## Tài liệu

- [Tổng quan dự án](docs/PROJECT_OVERVIEW.md)
- [Roadmap](docs/ROADMAP.md)
- [Design system](docs/DESIGN_SYSTEM.md) và các spec trong [docs/design/](docs/design/)
- [Quyết định kiến trúc (ADR)](docs/adr/README.md)
- [Hướng dẫn cho agent](AGENTS.md)

## Giấy phép

Nội dung bài viết và mã nguồn thuộc quyền tác giả của Gura, trừ khi có ghi chú khác.
