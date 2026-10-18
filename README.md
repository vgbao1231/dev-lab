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
├── AGENTS.md                 # Hướng dẫn cho AI agent làm việc trong repo
├── README.md
├── docs/
│   ├── PROJECT_OVERVIEW.md   # Mục tiêu, đối tượng, phạm vi, định hướng kiến trúc
│   ├── ROADMAP.md            # Các giai đoạn, checklist, tiêu chí hoàn thành
│   └── DESIGN_SYSTEM.md      # Màu sắc, typography, quy tắc chuyển động, nguyên tắc giao diện
├── design-reference/         # Tham khảo bố cục và màu (HTML + screenshot), không đưa vào build
├── eslint.config.js          # ESLint flat config dùng chung cho cả workspace
├── prettier.config.mjs
├── tsconfig.base.json        # Cấu hình TypeScript strict dùng chung
├── pnpm-workspace.yaml
├── portal/                   # Cổng chính (Astro)
│   ├── content.config.ts     # Collection bài viết + schema frontmatter
│   ├── public/
│   └── src/
│       ├── components/       # Header, Footer, LabCard, PostList, ThemeToggle
│       ├── content/posts/    # Bài viết Markdown (tên file = slug)
│       ├── data/             # Dữ liệu tĩnh (lab, theme, quy ước nội dung)
│       ├── layouts/
│       ├── pages/            # /, /labs, /bai-viet, /lien-he
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

- Không hard-code màu và font trong component; dùng CSS variables trong `portal/src/styles/tokens.css` (nguồn: `docs/DESIGN_SYSTEM.md`).
- **Theme và mode là hai trục độc lập** (`data-theme` + `data-mode`), không phải bốn chế độ cố định. Thêm theme mới gồm ba bước: cập nhật `docs/DESIGN_SYSTEM.md`, thêm block CSS variables trong `portal/src/styles/tokens.css`, đăng ký trong `portal/src/data/themes.ts`.
- Thay đổi màu/font thì cập nhật `docs/DESIGN_SYSTEM.md` trước, rồi mới sửa code.
- Không hard-code thời lượng hay easing; dùng motion tokens trong `portal/src/styles/tokens.css` (nguồn: `docs/DESIGN_SYSTEM.md` mục 7). Khối nội dung muốn hiện dần thì thêm `data-animate`; mọi animation phải tôn trọng `prefers-reduced-motion`.
- `design-reference/` chỉ là bản tham khảo bố cục và màu. `docs/DESIGN_SYSTEM.md` mới là nguồn quyết định; khi reference khác docs thì theo docs và ghi rõ ở mục "Ghi chú: khác biệt có chủ ý".
- Hoàn thành một mục trong `docs/ROADMAP.md` thì đánh dấu `[x]` trong cùng thay đổi.
- `tsconfig.base.json` là cấu hình strict dùng chung. **Không dùng `extends` dạng mảng** trong `portal/`: Rolldown (Vite bên trong Astro) resolve sai dạng này và làm build thất bại; xem ghi chú trong `portal/tsconfig.json`.

## Tài liệu

- [Tổng quan dự án](docs/PROJECT_OVERVIEW.md)
- [Roadmap](docs/ROADMAP.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Hướng dẫn cho agent](AGENTS.md)

## Giấy phép

Nội dung bài viết và mã nguồn thuộc quyền tác giả của Gura, trừ khi có ghi chú khác.
