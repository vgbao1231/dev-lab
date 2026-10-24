# Design: Thành phần

> Một phần của design system; chỉ mục và bảng định tuyến ở [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Số mục giữ nguyên bản gốc vì comment trong code trỏ tới "mục N".

## 6. Thành phần (chung)

Hai kiểu tiêu đề section:

- **Tiêu đề chính** (`h2`, font display, `--text-xl`): dùng cho section quan trọng nhất — hiện
  là "Dev Lab" và "Các lab".
- **Nhãn section (eyebrow)**: JetBrains Mono, `--text-sm`, `uppercase`, `letter-spacing: 0.08em`,
  màu `--color-text-muted`. Dùng cho các section còn lại (`Bài viết mới`, `Dự án khác`,
  `Liên hệ`).

### Lab card

- Khi lab đã có địa chỉ, **cả card bấm được**: card là `<article>`, link ở tiêu đề được kéo
  phủ toàn card bằng `::after`, nên có con trỏ pointer. Khi chưa có địa chỉ, card là khối tĩnh:
  không hover, không con trỏ pointer.
- Nền `--color-surface`, viền `1px solid var(--color-border)`, bo `--radius-lg` (8px), padding
  18px, không đổ bóng.
- Bố cục: hàng đầu gồm tên lab (`h3`, display, `--text-lg`) và trạng thái (mono `--text-xs`) ở hai
  đầu; đoạn mô tả màu `--color-text-muted` (`--text-sm`); hàng chip stack.
- **Hover** (chỉ khi là link): viền đổi `--color-accent`, card nhấc lên `translateY(-1px)`.

### Trạng thái lab

- Chấm tròn 8px, viền `--color-text-muted`; trạng thái "đang chạy" tô đầy `--color-accent`.
- Luôn kèm **nhãn chữ** (`Đang chạy`, `Sắp tới`, `Dự kiến`) — không phân biệt chỉ bằng màu.

### Tag

- JetBrains Mono, `--text-2xs`, màu `--color-text-muted`, viền `1px solid --color-border`, bo
  `--radius-sm`, padding `0.05rem 0.4rem`, không nền màu.
- Khai báo **một lần ở `global.css`**; dùng cho tag bài viết, stack trong lab card và danh sách
  kỹ năng ở mục "Về mình".
- Tag bài viết lấy từ registry dùng chung **`@dev-lab/tags`** (`packages/tags`), không phải chuỗi
  tự do. Frontmatter ghi id (`react`, `state-management`); schema kiểm tra, sắp xếp theo
  Technology → Domain → Approach rồi đổi thành label chuẩn (`React`, `State Management`) trước khi
  component đọc. Mỗi bài **1–4 tag**, khuyến nghị 2–3. Danh mục và quy tắc thêm tag: [`docs/TAGS.md`](../TAGS.md).
- Tag là metadata độc lập với `lab`, `type` và category. Không dùng tag để thay tên lab hoặc loại
  bài; không thêm tag mới nếu registry đã có tag cùng nghĩa.

### Icon

- Bộ icon dùng chung ở `portal/src/components/Icon.astro`: viewBox 24, nét `1.5px`, đầu nét tròn,
  màu `currentColor`; icon đặc (GitHub) dùng `fill`. Kích thước dùng: 14px trong metadata, 16–18px
  trong nút/ô search, 20px ở tiêu đề trang, 24px ở brand.
- Danh mục hiện có: `leaf`, `search`, `sun`, `moon`, `monitor`, `flask`, `file-text`, `calendar`,
  `clock`, `github`, `x`, `enter`, `arrow-up`, `arrow-down`.
- Không dùng emoji làm icon chức năng (emoji trong câu chữ vẫn được). Không đổ bóng, không tô nền
  cho icon, trừ hộp icon 40×40px ở tiêu đề trang: nền `color-mix(in oklab, accent 14%, transparent)`,
  chữ `--color-accent`, bo `--radius-lg`.
- Icon chỉ là trang trí thì `aria-hidden` (mặc định của component); chỉ truyền `label` khi icon
  đứng một mình và cần được đọc.

### Danh sách dự án

- Cấu trúc hàng giống `Danh sách bài viết`: mỗi dự án là một hàng, ngăn bằng đường kẻ
  `1px --color-border` (hàng cuối thêm đường dưới), padding dọc 16px.
- Trong hàng: tên dự án (font display, `--text-lg`) và stack (mono `--text-2xs`, muted) nằm hai đầu
  một hàng `flex` baseline; mô tả một câu (`--text-sm`, muted) ở dòng dưới.
- Tên **chỉ là link khi có `href`**; chưa có bản công khai thì để chữ thường, không tạo link chết.

### Nguồn thông tin portfolio

- `portal/src/data/profile.ts` là nguồn duy nhất cho tên, câu slogan ở hero (`tagline`), khẩu hiệu
  dạng ghi chú (`slogan`), vai trò, vị trí, email, link liên hệ, kỹ năng, đoạn giới thiệu và danh
  sách dự án. Hero, khối Dev Lab (kicker vai trò), mục "Về mình", footer và trang liên hệ đều đọc từ
  đây — sửa một chỗ, cả năm nơi cập nhật.
- Trường nào để trống thì UI **bỏ qua**: `profileFacts` lọc sẵn dòng rỗng, `profileLinks` chỉ thêm
  `mailto:` khi có `email`, hai mục "Về mình" và "Dự án khác" ở trang chủ ẩn hẳn khi chưa có dữ
  liệu, `tagline`/`slogan` trống thì hero bỏ dòng đó.
- **Chỉ khai báo thứ đã được phép hiển thị công khai.** Trạng thái hiện tại (2026-10-19): tên, vai
  trò, vị trí, email, GitHub — đã cho phép; LinkedIn, CV, ảnh đại diện — chưa.

### Bảng facts

- Dùng ở mục "Về mình" (trang chủ) và trang liên hệ. Mỗi dòng: **nhãn** mono `--text-xs` màu muted ở
  cột trái cố định (`flex: 0 0 7rem`, nhờ vậy nhãn các dòng thẳng cột), **giá trị** là một hàng
  **chip** bên phải. Dòng cách nhau 12px (`gap` của grid trên `.facts`), **không kẻ đường phân dòng**:
  chip đã tự tạo khối, mà cả trang thì đã nhiều đường ngang.
- **Chip** (`.facts__chip`): nền `--color-surface`, viền `1px --color-border`, bo `--radius-lg`, chữ
  **font display** (Patrick Hand) `--text-base` màu `--color-text`. Không thêm token màu mới — cặp
  `surface`/`border` đã ăn theo cả theme lẫn mode. Chữ để `--color-text` chứ **không** dùng accent:
  cả hàng chip cùng màu accent sẽ tranh chỗ nhấn với kicker và mục lục.
- Chip dùng chung cặp token với `.tag` nhưng khác vai: `.tag` là nhãn kỹ thuật (mono 12px, bo
  `--radius-sm`), chip facts là giá trị cho người đọc (font display 17px, bo `--radius-lg`).
- `align-items: baseline` trên hàng: nhãn mono và chữ trong chip khác ascent nên căn theo đường chân
  chữ mới thẳng; hàng chip xuống dòng thì nhãn vẫn bám dòng đầu.
- **Mỗi chip một ý.** `Ngoại ngữ` là hai chip (`Tiếng Việt` / `Tiếng Anh · TOEIC 940`), `Ngoài code`
  là bốn chip. Gộp cả câu vào một chip là quay lại đúng kiểu dòng chữ cũ.
- **Dưới 560px:** nhãn lên trên, hàng chip xuống dưới và căn trái — chip dài như `Tiếng Anh · TOEIC
940` cần trọn bề ngang để không bị bẻ giữa chip.
- `profileFacts` dựng từ `profile.location` (**Khu vực**) cộng `profile.facts`; dòng nào không có
  chip nào thì tự bị lọc, nên trường trống không để lại nhãn rỗng.
- **Vai trò không nằm trong bảng facts.** Nó đã hiện ở kicker khối Dev Lab; lặp lại ở đây là thừa.
- **Chọn dòng nào:** facts là chỗ của thứ **gần như không đổi** (`Ngoại ngữ`, `Nhiên liệu`,
  `Ngoài code`…). Những thứ thay đổi theo thời gian (đang làm ở đâu, đang học gì) **không** để ở
  đây — vừa phải cập nhật liên tục, vừa làm bảng facts thành CV. Muốn kể thì viết vào `about`.
- **Viết câu chữ:** viết hoa chữ đầu từng chip (`Cà phê`, `Đồ ngọt`, `Gura`, không phải `cà phê, đồ
ngọt và gura`). Đây là chữ cho người đọc, không phải chỗ dán lại ghi chú thô.

### Danh sách bài viết (trang chủ)

- Mỗi bài là **một link khối** (`display: block`), padding dọc 16px, ngăn bằng đường kẻ.
- Thứ tự: metadata (mono `--text-2xs`, muted) → tiêu đề (font display, `--text-lg`) → tóm tắt (muted,
  `--text-sm`).
- **Hover:** tiêu đề đổi sang `--color-link`.
- Mục "Bài viết mới" ở trang chủ **giữ nguyên** cấu trúc này: không thumbnail, không thời gian đọc,
  không icon, không đổi bố cục. Card cover chỉ dùng ở `/bai-viet`.

### Cover bài viết

- Mỗi bài có một cover **16:9**, đặt thủ công trong frontmatter bằng hai trường:
  - `cover`: khóa trong `portal/src/data/covers.ts` (ví dụ `react-fiber`).
  - `coverAlt`: mô tả ảnh cho screen reader; **bắt buộc** khi có `cover`.
- File SVG nằm ở `portal/src/assets/covers/`, được nhúng **inline** qua `import.meta.glob(... ?raw)`
  để dùng được token màu của theme. Nhờ vậy cover tự đổi light/dark, không cần hai bộ ảnh và không
  phụ thuộc dịch vụ tối ưu ảnh.
- Màu trong cover chỉ dùng token: `--color-surface`, `--color-bg`, `--color-text`,
  `--color-text-muted`, `--color-accent`, `--color-link`, `--color-border`. Không hard-code màu.
- Bài chưa có cover dùng fallback monogram: nền `--color-bg` pha accent rất nhẹ, chữ cái đầu của
  tiêu đề font display màu `--color-accent`, nhãn loại bài mono muted. Fallback không được tạo link
  hay alt giả.

### Card bài viết ở `/bai-viet`

- Lưới card: **1 cột** mặc định, **2 cột** từ 768px, **3 cột** từ 1024px; gap 16px (20px từ 1024px).
- Card: nền `--color-surface`, viền `1px --color-border`, bo `--radius-lg`, `overflow: hidden`, không
  đổ bóng. Cover nằm trên, có đường kẻ dưới.
- Thân card: metadata `type · lab` (mono `--text-2xs`, muted) → tiêu đề font display `--text-lg`
  → tóm tắt Inter `--text-sm` muted → hàng tag → hàng đáy có ngày và thời gian đọc (mono
  `--text-2xs`, icon 14px).
- **Cả card là vùng bấm** của link tiêu đề bằng `::after` phủ toàn card, nhưng trong cây
  accessibility chỉ có **một** link (link tiêu đề). Không bọc `<a>` quanh cả card.
- **Hover** (chỉ thiết bị có con trỏ): viền pha accent 55%, card nhấc lên 2px, tiêu đề đổi
  `--color-link`. Tôn trọng `prefers-reduced-motion`.
- Tiêu đề card dùng `view-transition-name: vt-post-<id>`, trùng với `h1` ở trang chi tiết.
- **Thời gian đọc** chỉ hiện ở card `/bai-viet`: đếm từ body Markdown, 200 từ/phút, tối thiểu 1
  phút (`src/lib/reading.ts`). Không thêm vào danh sách trang chủ.

### Bảng trong bài

- Bảng Markdown đã có style cơ bản trong `portal/src/pages/bai-viet/[...slug].astro`:
  `border-collapse`, viền `1px --color-border`, chữ Inter `--text-sm`, ô tiêu đề màu
  `--color-text-muted`, hover hàng đổi nền sang `--color-bg`.
- Chưa có "bảng số liệu" riêng (khung `--color-surface`, font mono). Khi cần, chốt spec mới thay
  vì coi các gạch đầu dòng dưới đây là hiện hành:
  - Bọc trong khung nền `--color-surface`, viền 1px, bo `--radius-lg`, `overflow-x: auto`.
  - Font JetBrains Mono 12px. Ô tiêu đề cột màu `--color-text-muted`, weight 400, **căn trái**.
  - Ô dữ liệu màu `--color-text-muted`; **cột đầu** màu `--color-text`, weight 500.
  - Hàng ngăn bằng đường kẻ mảnh; **hover hàng** đổi nền sang `--color-bg`.

### Link

- Màu `--color-link`, mặc định **không gạch chân**; gạch chân hiện khi hover (chuyển động ở
  mục 7.4, `motion.md`).
- Link trong nav: màu `--color-text-muted`; hover đổi `--color-accent` **và** hiện một nền pill
  accent mờ nở ra sau chữ (`color-mix(in oklab, accent 16%, transparent)`, `scale(0.85)` → `1`,
  `opacity 0` → `1`); không gạch chân.
- Hiệu ứng hover của nav và brand chỉ áp trong `@media (hover: hover) and (pointer: fine)` để
  không dính trạng thái trên thiết bị cảm ứng.
- Trang hiện tại: `aria-current="page"`, màu `--color-text`; riêng link nav dùng màu `--color-accent` và nền pill.

### Nút

| Biến thể   | Nền              | Viền                 | Chữ                  | Hover                                     |
| ---------- | ---------------- | -------------------- | -------------------- | ----------------------------------------- |
| `ghost`    | trong suốt       | không                | `--color-text-muted` | nền `--color-surface`, chữ `--color-text` |
| `outlined` | trong suốt       | `1px --color-border` | `--color-text`       | viền `--color-accent`                     |
| `filled`   | `--color-accent` | không                | `--color-bg`         | nền `color-mix(in oklab, accent 88%, bg)` |

- Chưa biến thể nào được dùng. `ghost`, `outlined`, `filled` để dành cho CTA và form sau này; khi
  dùng thì theo bảng trên.
- Trạng thái "đang chọn" biểu diễn bằng ngữ nghĩa của chính phần tử (`checked` của `<input>`,
  `value` của `<select>`), không dùng class `.active` rời.
- Không tự chế màu accent đậm hơn cho `filled`; dùng `color-mix` để đổi đúng theo theme × mode.

### Bộ chọn theme / mode

- Hai trục độc lập, mỗi trục là một `<label>` bọc `<select>` gốc: nhãn mono `--text-2xs` và
  `<select>` mono `--text-2xs`, nền `--color-surface`, viền `1px --color-border`, bo
  `--radius-md`; hover đổi viền sang `--color-accent`.
- Dùng `<select>` gốc để giữ hành vi và bàn phím của hệ điều hành, không phải vẽ lại mũi tên
  (nếu vẽ thì phải hard-code màu trong component).
- Nhóm theme tự ẩn khi chỉ có một theme khả dụng. Nhãn chữ ẩn dưới 768px (vẫn còn `<label>` cho
  screen reader).
- Nhóm mode gồm `Hệ thống`, `Sáng`, `Tối`; nhóm theme liệt kê theo `src/data/themes.ts`.
- Trước `<select>` mode có icon 14px khớp preference: `monitor` (Hệ thống), `sun` (Sáng), `moon`
  (Tối). Icon do CSS chọn theo `html[data-mode-preference]`, không cần JS riêng; icon là trang trí
  nên `aria-hidden`.

### Tìm kiếm

- **Nút mở** nằm trong header, cạnh bộ chọn mode:
  - ≥768px: pill cao 34px, nền `color-mix(surface 70%, transparent)`, viền `--color-border`, icon
    search 16px, chữ `Tìm kiếm…`, `kbd` hiển thị `Ctrl K` (Mac: `⌘ K`). Hover đổi viền/chữ sang
    `--color-accent`.
  - <768px: thu thành nút icon vuông 34px, nền/viền trong suốt; ẩn chữ và `kbd`.
  - Nút có `aria-haspopup="dialog"`, `aria-expanded` được JS cập nhật.
- **Dialog** dùng `<dialog>` gốc + `showModal()` để có top layer, focus trap và Esc sẵn. Panel rộng
  tối đa 640px, nền `--color-surface`, viền `--color-border`, bo `--radius-lg`, bóng mềm bằng
  `color-mix`. Backdrop pha `--color-bg` 62% + blur 4px.
- **Nội dung:** ô input `type="search"` (ẩn nút clear mặc định), nút đóng `x`, danh sách kết quả
  `role="listbox"`, mỗi kết quả `role="option"`; footer gợi ý phím `↑` `↓` `↵` `esc` (ẩn dưới
  640px).
- **Kết quả** gồm bài viết, lab và trang tĩnh; tối đa 8 mục. Mỗi mục có nhãn loại (Bài viết /
  Lab / Trang), tiêu đề và metadata. Mục đang chọn có nền accent 12%. Không nhóm theo loại để
  điều hướng bàn phím đơn giản.
- **Bàn phím:** `Ctrl/Cmd+K` hoặc `/` (khi không focus vào input/textarea/select/contenteditable)
  mở dialog; `↑`/`↓` đổi mục, `Enter` mở, `Esc` đóng. Click ra ngoài panel cũng đóng.
- **Tìm không dấu:** chuẩn hoá NFD, bỏ combining mark, đổi `đ` → `d`, lowercase; nhờ vậy `fiber`
  khớp `Fiber`, `reconciliation` khớp `Reconciliation`.
- **Chỉ mục** sinh lúc build ở `/search-index.json`; client fetch lười ở lần mở đầu tiên và cache
  trong bộ nhớ. Không thêm dependency runtime, không gọi API bên ngoài.
- **Không dùng** dialog cho mobile menu; menu mobile vẫn là việc riêng (mục 1.3 roadmap).

### Nút lên đầu trang

- Nút tròn `--radius-pill`, 40×40px, cố định ở góc dưới phải (cách mép `--space-inline`), nền
  `--color-surface`, viền `1px --color-border`, chữ `--color-text-muted`; hover đổi chữ và viền
  sang `--color-accent`.
- Ẩn ở đầu trang; chỉ hiện khi đã cuộn quá 600px. Hiện dần bằng `animation` (opacity +
  `translateY(4px)`), ẩn ngay bằng thuộc tính `hidden` để không còn nhận focus.
- Bấm thì cuộn mượt lên đầu trang; khi `prefers-reduced-motion: reduce` thì nhảy thẳng.

### Code block

- Nền `--color-surface`, font JetBrains Mono, bo `--radius-sm`, `overflow-x: auto`.

### Hàng link

- Một hàng link inline, font mono `--text-xs` (14px) cho **đồng bộ toàn site**: nav, footer, khối
  liên hệ, CTA ở hero, dòng "Tất cả bài viết", link quay lại ở cuối bài, `skip-link` đều dùng mono.
- Các hàng link inline dùng chung class `.link-row` trong `global.css`. Nav, footer và `skip-link`
  có layout riêng nên tự khai báo font mono trong component, không gắn `.link-row`.
- Danh sách liên hệ lấy từ `profileLinks` trong `data/profile.ts`, nên **chỉ hiện những link đã
  có** — không để chỗ trống cho link chưa tồn tại.
- Hai ngoại lệ có chủ ý (xem mục 4, `typography.md`): link là **tiêu đề** giữ font display, link **trong câu văn**
  giữ font nội dung.
