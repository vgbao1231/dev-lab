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
│   ├── TAGS.md               # Registry tag dùng chung và quy tắc thêm tag
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
│       ├── assets/covers/     # Cover SVG 16:9, nhúng inline để dùng token theme
│       ├── components/        # Header, Footer, SearchDialog, Icon,
│       │                      # PostCard, PostCover, LabCard, PostList, ...
│       ├── content/posts/     # Bài viết Markdown (tên file = slug)
│       ├── content.config.ts  # Collection bài viết + schema frontmatter
│       ├── data/              # Dữ liệu tĩnh (lab, theme, profile, covers, icons, ...)
│       ├── layouts/
│       ├── lib/               # reading.ts, search.ts
│       ├── pages/             # /, /labs, /bai-viet, /bai-viet/<slug>, /lien-he, /search-index.json
│       └── styles/            # tokens.css, global.css
├── packages/
│   └── tags/                  # @dev-lab/tags — registry tag dùng chung cho portal + lab
└── labs/
    └── react-lab/            # Lab React + TypeScript + Vite
```

Mỗi lab là một ứng dụng độc lập trong `labs/`, có thể có stack và giao diện riêng. Các package
dùng chung (như `@dev-lab/tags`) nằm trong `packages/`.

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

| Lệnh                                | Việc                                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                          | Chạy dev server của portal                                 |
| `pnpm build`                        | Build tất cả package (`pnpm -r build`)                     |
| `pnpm preview`                      | Xem thử bản build của portal                               |
| `pnpm lint` / `pnpm lint:fix`       | Chạy / tự sửa lỗi ESLint                                   |
| `pnpm format` / `pnpm format:check` | Định dạng / kiểm tra định dạng bằng Prettier               |
| `pnpm typecheck`                    | `astro check` cho portal và `tsc --noEmit` cho lab/package |

## Nội dung bài viết

Bài viết là file Markdown trong `portal/src/content/posts/`; tên file trở thành slug trên URL. Frontmatter bắt buộc:

| Trường     | Kiểu   | Ghi chú                                                           |
| ---------- | ------ | ----------------------------------------------------------------- |
| `title`    | string | Tiêu đề bài                                                       |
| `date`     | date   | `YYYY-MM-DD`                                                      |
| `type`     | enum   | `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note` |
| `lab`      | string | Slug lab, ví dụ `react-lab`                                       |
| `tags`     | array  | 1–4 tag ID từ `@dev-lab/tags`, khuyến nghị 2–3                    |
| `summary`  | string | Tóm tắt một câu, hiển thị ở danh sách bài                         |
| `cover`    | string | Khóa cover trong `portal/src/data/covers.ts` (tuỳ chọn)           |
| `coverAlt` | string | Mô tả ảnh cho screen reader; bắt buộc khi có `cover`              |

`draft: true` (tuỳ chọn) để loại bài khỏi bản build. Schema được kiểm tra ngay lúc build: thiếu
trường, `type` sai, tag không có trong registry hoặc quá 4 tag thì build thất bại. Quy ước tag:
[`docs/TAGS.md`](docs/TAGS.md).

> Ba bài React internals hiện tại là nội dung thật; bài mẫu `bai-viet-mau.md` đã được xoá.

## Deploy (Cloudflare Pages)

Portal và **mỗi lab là một project Pages riêng**, cùng build từ repo này. Lý do ở [ADR 0008](docs/adr/0008-moi-lab-mot-project-pages.md).

| Thiết lập              | Portal (`dev-lab-gura`)                        | React Lab (`react-lab-gura`)             |
| ---------------------- | ---------------------------------------------- | ---------------------------------------- |
| Repository             | `vgbao1231/dev-lab`                            | `vgbao1231/dev-lab`                      |
| Production branch      | `main`                                         | `main`                                   |
| Framework preset       | Astro (rồi sửa lại build command)              | React (Vite) (rồi sửa lại build command) |
| Root directory         | `/`                                            | `/`                                      |
| Build command          | `pnpm --filter portal build`                   | `pnpm --filter react-lab build`          |
| Build output directory | `portal/dist`                                  | `labs/react-lab/dist`                    |
| Biến môi trường        | `NODE_VERSION=22.22.0`, `PNPM_VERSION=12.14.0` | giống portal                             |

Ba điểm dễ sai:

- **Tên project chính là `*.pages.dev` và không đổi được sau khi tạo.** Tên phải còn trống trên toàn Cloudflare (không chỉ tài khoản của bạn). Đặt sai thì chỉ có cách xoá project rồi tạo lại — mất lịch sử deployment và phải nhập lại biến môi trường. Tên trong bảng là ví dụ; kiểm tra lúc tạo project.
- **Root directory phải là gốc repo.** `pnpm-lock.yaml` và `pnpm-workspace.yaml` nằm ở đó; để `portal/` hay `labs/react-lab/` thì bước cài dependencies không tìm thấy lockfile.
- **Phải khai báo `NODE_VERSION` và `PNPM_VERSION`.** Build image v3 của Pages mặc định Node 22.16.0 và pnpm 10.11.1, thấp hơn mức repo yêu cầu (`engines.node >= 22.22.0`, `packageManager pnpm@12.14.0`); v3 không đọc `engines` hay `packageManager` trong `package.json`.

### Các bước

1. Cấp quyền repo cho Cloudflare: GitHub → **Settings → Applications → Cloudflare Pages** → cho phép repo `vgbao1231/dev-lab` (chỉ cần một lần, dùng chung cho mọi project).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → chọn `vgbao1231/dev-lab`.
3. Đặt tên project, chọn production branch và điền cấu hình theo bảng trên. Project name quyết định địa chỉ `*.pages.dev` (`dev-lab-gura` → `dev-lab-gura.pages.dev`).
4. Mở **Environment variables (advanced)** → thêm `NODE_VERSION` và `PNPM_VERSION` cho **cả Production và Preview**.
5. **Save and Deploy** → đọc build log → mở địa chỉ `*.pages.dev` để kiểm tra.
6. Lặp lại từ bước 2 cho React Lab (project name `react-lab-gura` → `react-lab-gura.pages.dev`).
7. Khi React Lab đã chạy: thêm `href` vào `portal/src/data/labs.ts`. `LabCard` tự biến thẻ thành link khi có `href`.

### Preview

Mỗi lần push lên branch khác `main` — kể cả trong pull request — Pages dựng một preview riêng:

- Địa chỉ dạng `https://<commit-hash>.<project>.pages.dev`, xem ở tab **Deployments** của project hoặc ở comment của bot trên pull request.
- Kiểm tra nhanh: tạo một branch, push một thay đổi nhỏ, mở tab Deployments và xác nhận có build mới.

Cách này dùng Git integration của Pages nên không cần secret hay workflow riêng; `.github/workflows/ci.yml` chỉ kiểm tra chất lượng mã. Muốn deploy từ GitHub Actions (ví dụ sau này đẩy số đo hiệu năng lên) thì mới cần `cloudflare/wrangler-action` và API token.

Preview đang bật. Muốn tắt để chỉ build ở `main`: **Settings → Builds & deployments → Configure Preview deployments → Preview branch controls → `None`**, giữ nguyên ô _Enable automatic production branch deployments_. Đánh đổi: không tắt thì mọi branch đều tốn một lượt build; tắt thì mọi thay đổi merge vào `main` lên production ngay, chỉ còn CI kiểm tra trước.

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
