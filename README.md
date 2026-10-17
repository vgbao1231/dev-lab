# Dev Lab

Dev Lab là một hệ sinh thái các blog và lab kỹ thuật, do [Gura](https://github.com/vgbao1231) phát triển như một dự án cá nhân dài hạn. Nội dung trải trên nhiều lĩnh vực — frontend, backend, DevOps — tuỳ theo công việc và chủ đề đang tìm hiểu.

Mục tiêu: chia sẻ kiến thức, củng cố kiến thức cũ qua thực hành và xây dựng sản phẩm đủ chất lượng để đưa vào CV.

> Trạng thái: **Giai đoạn 1 đang thực hiện** — xem [docs/ROADMAP.md](docs/ROADMAP.md).

## Công nghệ

- Workspace: pnpm workspace, Node `>=22.22.0`, pnpm `12`
- Portal: Astro (static output), CSS thuần + design tokens
- Lab đầu tiên: React, TypeScript, Vite
- Chất lượng mã: TypeScript `strict`, ESLint (flat config), Prettier
- Deploy: Cloudflare Pages _(chưa thiết lập)_

## Cấu trúc thư mục

```
dev-lab/
├── .github/workflows/ci.yml  # CI: lint, format, typecheck, build
├── AGENTS.md                 # Hướng dẫn cho AI agent làm việc trong repo
├── README.md
├── docs/
│   ├── PROJECT_OVERVIEW.md   # Mục tiêu, đối tượng, phạm vi, định hướng kiến trúc
│   ├── ROADMAP.md            # Các giai đoạn, checklist, tiêu chí hoàn thành
│   └── DESIGN_SYSTEM.md      # Màu sắc, typography, nguyên tắc giao diện
├── eslint.config.js          # ESLint flat config dùng chung cho cả workspace
├── prettier.config.mjs
├── tsconfig.base.json        # Cấu hình TypeScript strict dùng chung
├── pnpm-workspace.yaml
├── portal/                   # Cổng chính (Astro)
│   └── src/
│       ├── components/       # Header, Footer, LabCard, ThemeToggle
│       ├── data/             # Dữ liệu tĩnh (danh sách lab)
│       ├── layouts/
│       ├── pages/            # /, /labs, /lien-he
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

## Quy ước

- Không hard-code màu và font trong component; dùng CSS variables trong `portal/src/styles/tokens.css` (nguồn: `docs/DESIGN_SYSTEM.md`).
- Thay đổi màu/font thì cập nhật `docs/DESIGN_SYSTEM.md` trước, rồi mới sửa code.
- Hoàn thành một mục trong `docs/ROADMAP.md` thì đánh dấu `[x]` trong cùng thay đổi.
- `tsconfig.base.json` là cấu hình strict dùng chung. **Không dùng `extends` dạng mảng** trong `portal/`: Rolldown (Vite bên trong Astro) resolve sai dạng này và làm build thất bại; xem ghi chú trong `portal/tsconfig.json`.

## Tài liệu

- [Tổng quan dự án](docs/PROJECT_OVERVIEW.md)
- [Roadmap](docs/ROADMAP.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Hướng dẫn cho agent](AGENTS.md)

## Giấy phép

Nội dung bài viết và mã nguồn thuộc quyền tác giả của Gura, trừ khi có ghi chú khác.
