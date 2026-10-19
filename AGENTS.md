# AGENTS.md

Hướng dẫn cho AI agent (Claude Code, OpenCode, Cursor, Copilot, v.v.) làm việc trong repo Dev Lab.

Dev Lab là portal Astro (static) cộng các lab độc lập trong `labs/`, quản lý bằng pnpm workspace. Trang chủ là portfolio cá nhân; bài viết là Markdown/MDX trong content collection. Giai đoạn hiện tại: xem đầu `docs/ROADMAP.md`.

## Lệnh

| Việc                 | Lệnh                                                             |
| -------------------- | ---------------------------------------------------------------- |
| Dev portal           | `pnpm dev` (http://localhost:4321)                               |
| Dev một lab          | `pnpm --filter react-lab dev`                                    |
| Kiểm tra (giống CI)  | `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` |
| Tự sửa lint / format | `pnpm lint:fix` / `pnpm format`                                  |

## Bản đồ repo

- `portal/src/pages/`: route (`/`, `/labs`, `/bai-viet`, `/bai-viet/[...slug]`, `/lien-he`)
- `portal/src/components/`: component `.astro`, mỗi component một file PascalCase
- `portal/src/data/`: nguồn dữ liệu duy nhất. `profile.ts` (thông tin cá nhân), `labs.ts`, `themes.ts`, `content.ts` (`postTypes`)
- `portal/src/content/posts/`: bài viết, tên file = slug
- `portal/src/content.config.ts`: schema frontmatter (nguồn sự thật cho các trường bắt buộc)
- `portal/src/styles/tokens.css`: giá trị token (màu, cỡ chữ, khoảng cách, motion)
- `docs/design/`: spec giao diện theo chủ đề; `docs/adr/`: quyết định và lý do; `docs/CHANGELOG.md`: lịch sử chỉnh thiết kế
- `labs/<tên>/`: mỗi lab là một app độc lập
- `design-reference/`: chỉ để tham khảo, không build, không sửa

## Đọc gì trước khi làm

Không đọc hết `docs/`. Chọn theo việc:

| Việc                                                  | Đọc                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Màu, theme, token màu                                 | `docs/design/theme.md`                                       |
| Font, thang cỡ chữ                                    | `docs/design/typography.md`                                  |
| Bố cục trang, header, footer, breakpoint              | `docs/design/layout.md`                                      |
| Component: card, tag, link, nút, bảng facts, bộ chọn  | `docs/design/components.md`                                  |
| Trang chi tiết bài viết (mục lục, tiến độ đọc, nút #) | `docs/design/post-page.md`                                   |
| Animation, hover, View Transitions                    | `docs/design/motion.md`                                      |
| Viết hoặc sửa bài                                     | `portal/src/content.config.ts`, `portal/src/data/content.ts` |
| Đề xuất tính năng hoặc lab mới                        | `docs/PROJECT_OVERVIEW.md`, phần đầu `docs/ROADMAP.md`       |
| Vì sao đang làm như vậy                               | `docs/adr/`                                                  |

Comment trong code ghi "`docs/DESIGN_SYSTEM.md` mục N": bảng ở đầu file đó cho biết mục N nằm ở file nào.

Nếu yêu cầu mâu thuẫn với tài liệu, hỏi lại người dùng thay vì tự quyết.

## Nguyên tắc chung

- **Không tự chốt quyết định kiến trúc.** Mục "Những điều chưa quyết định" trong `docs/PROJECT_OVERVIEW.md` là chưa chốt: đề xuất phương án kèm đánh đổi, chờ người dùng xác nhận.
- **Phạm vi nhỏ, thay đổi nhỏ.** Mỗi thay đổi giải quyết một việc. Không refactor hoặc đổi cấu trúc ngoài phạm vi được yêu cầu.
- **Không thêm dependency mới** nếu chưa được đồng ý. Ghi rõ lý do khi đề xuất.
- **Không tạo tính năng chỉ để dogfood.** Dùng công nghệ để xây website là tùy chọn, không bắt buộc cho mọi bài viết.
- **Không thêm gradient, glow, hiệu ứng trang trí** nếu chưa có trong design system.

## Quy tắc code

### TypeScript

- Bật `strict`. Không dùng `any` trừ khi có comment giải thích.
- Ưu tiên `type` cho props và dữ liệu đơn giản, `interface` khi cần mở rộng.
- Tên biến và hàm dùng tiếng Anh. Comment có thể dùng tiếng Việt.

### React (trong các lab React)

- Function component, không dùng class component.
- Mỗi component một file, tên file trùng tên component (PascalCase).
- Không đặt logic nghiệp vụ trong JSX. Tách ra hook hoặc hàm thuần.

### CSS và styling

- Màu, font, cỡ chữ, thời lượng, easing **phải** lấy từ token trong `tokens.css`. Không hard-code.
- Cần token mới: cập nhật `docs/design/` trước, rồi `tokens.css`, trong cùng thay đổi.
- Không dùng inline style cho màu hoặc font.
- Mọi animation tôn trọng `prefers-reduced-motion`. Khối muốn hiện dần thì thêm `data-animate`, không tự viết animation riêng.

### Nội dung bài viết

- Viết bằng tiếng Việt, thuật ngữ kỹ thuật giữ nguyên tiếng Anh (`useMemo`, `reconciliation`, `event loop`).
- Frontmatter đầy đủ: `title`, `date`, `type`, `lab`, `tags`, `summary`. `type` là một trong `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note`. Build thất bại nếu thiếu hoặc sai.
- Giải thích cơ chế hoạt động trước, rồi mới đưa ví dụ code.

## Gotchas

- `portal/tsconfig.json` **không** dùng `extends` dạng mảng: Rolldown (Vite trong Astro) resolve sai và build hỏng.
- Header có `transition:persist`: DOM giữ qua các lần chuyển trang, nên `aria-current` phải cập nhật bằng JS.
- View Transitions thay toàn bộ attribute của `<html>`: `data-theme` / `data-mode` phải được chép sang document mới trong `astro:before-swap`.
- `[data-animate]` chỉ chạy ở lần tải trang đầu. `view-transition-name` phải là custom-ident hợp lệ và không trùng trong cùng một trang (tiêu đề bài dùng `vt-post-<id>`).
- Phần tử do JS chèn vào (nút `#` ở tiêu đề bài) không có `data-astro-cid`: style phải để ở `global.css`, không đặt trong `<style>` scoped.
- Mục "Về mình" và "Dự án khác" ẩn hẳn khi `profile.ts` trống: không render khối rỗng hay chữ "sẽ bổ sung".
- `profile.ts` chỉ chứa thứ đã được phép công khai. Đến 2026-10-19: tên, vai trò, vị trí, email, GitHub đã cho phép; LinkedIn, CV, ảnh đại diện chưa.
- `portal/src/content/posts/bai-viet-mau.md` là bài mẫu kiểm chứng pipeline, không phải nội dung thật.

## Định nghĩa "xong"

1. Lệnh "Kiểm tra (giống CI)" ở trên pass. Lệnh nào lỗi thì không báo hoàn thành: mô tả lỗi và đề xuất cách sửa.
2. Thay đổi giao diện: kiểm tra light và dark (hiện chỉ có Minimalist Editorial) và viewport mobile.
3. Cập nhật tài liệu trong cùng thay đổi, chỉ khi liên quan:
   - Xong một mục roadmap: đánh `[x]` trong `docs/ROADMAP.md`.
   - Đổi cấu trúc thư mục: sửa "Bản đồ repo" ở file này và cây thư mục trong `README.md`.
   - Đổi token màu, font hoặc quy tắc giao diện: sửa `docs/design/` trước, rồi mới sửa code.
   - Chốt một quyết định đáng nhớ: thêm ADR trong `docs/adr/`.
4. Không ghi nhật ký từng vòng chỉnh vào docs. Lịch sử nằm ở commit message.

## Git

- Commit theo Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.
- Một branch cho một việc: `feat/<mô-tả-ngắn>`, `docs/<mô-tả-ngắn>`.
- Không commit trực tiếp lên `main`.
