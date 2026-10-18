# Design System: Dev Lab

Hệ thống thiết kế cho cổng chính và các lab. Phong cách tối giản, cá nhân, hướng nội dung. Không phải landing page SaaS.

Nguồn tham khảo bố cục và màu sắc: `design-reference/` (xem mục 6, phần "Ghi chú: khác biệt có chủ ý so với `design-reference/`").

## 1. Cấu trúc theme

Hai trục **độc lập**, người dùng chọn riêng từng trục:

- **Theme:** bộ nhận diện màu sắc, mỗi theme có tên riêng và tinh thần riêng — Minimalist Editorial, Digital Garden, và các theme thêm sau này.
- **Chế độ (mode):** Light, Dark, hoặc Hệ thống (theo cài đặt thiết bị). Mode không gắn cứng với theme.

Vì hai trục độc lập, số tổ hợp **không cố định**: mỗi theme chỉ cần định nghĩa bảng màu cho light và dark của chính nó.

Theme được gắn lên `<html>` bằng hai thuộc tính:

```html
<html data-theme="minimalist-editorial" data-mode="dark"></html>
```

Cách mở rộng: thêm theme mới = thêm bảng màu vào `DESIGN_SYSTEM.md` + thêm block CSS variables cho theme đó + đăng ký trong `portal/src/data/themes.ts`. Bố cục và typography **không** đổi theo theme, chỉ màu sắc đổi.

### Phạm vi triển khai

- **Giai đoạn hiện tại:** chỉ triển khai **Minimalist Editorial** (đủ light + dark). Bộ chọn theme tự ẩn khi chỉ có một theme khả dụng, và tự hiện khi có từ hai theme trở lên.
- **Sau này:** Digital Garden và các theme khác. Bảng màu của Digital Garden đã ghi ở mục 2.2 nhưng **chưa** đưa vào code.

## 2. Bảng màu theme

### 2.1 Minimalist Editorial — đang triển khai

**Mood:** ấm, bình tĩnh, mang cảm giác nhật ký kỹ thuật cá nhân.

| Token           | Dark      | Light     |
| --------------- | --------- | --------- |
| Background      | `#171614` | `#F7F4ED` |
| Surface         | `#24221F` | `#FFFCF6` |
| Primary text    | `#F2EBDD` | `#292720` |
| Secondary text  | `#B6ADA0` | `#756F64` |
| Accent          | `#A6B58A` | `#667A4D` |
| Links           | `#83B9D4` | `#326C8A` |
| Borders         | `#3A3630` | `#E3DDD1` |
| Scrollbar thumb | `#565046` | `#C9C1B1` |

### 2.2 Digital Garden — chưa triển khai

**Mood:** yên tĩnh, tự nhiên, như một khu vườn tri thức.

| Token          | Dark      | Light     |
| -------------- | --------- | --------- |
| Background     | `#111A18` | `#F1F5EF` |
| Surface        | `#1C2723` | `#FAFCF8` |
| Primary text   | `#E7E8D9` | `#26332B` |
| Secondary text | `#A5B2A6` | `#647469` |
| Accent         | `#A8C3A0` | `#547A58` |
| Links          | `#8CBFC0` | `#347779` |
| Borders        | `#34423A` | `#D8E2D7` |

## 3. CSS variables

Tên token dùng chung cho mọi theme và mọi mode; chỉ giá trị thay đổi theo cặp `data-theme` + `data-mode`. Theme đang triển khai:

```css
:root,
:root[data-theme='minimalist-editorial'][data-mode='dark'] {
  --color-bg: #171614;
  --color-surface: #24221f;
  --color-text: #f2ebdd;
  --color-text-muted: #b6ada0;
  --color-accent: #a6b58a;
  --color-link: #83b9d4;
  --color-border: #3a3630;
  --color-scrollbar-thumb: #565046;
}

:root[data-theme='minimalist-editorial'][data-mode='light'] {
  --color-bg: #f7f4ed;
  --color-surface: #fffcf6;
  --color-text: #292720;
  --color-text-muted: #756f64;
  --color-accent: #667a4d;
  --color-link: #326c8a;
  --color-border: #e3ddd1;
  --color-scrollbar-thumb: #c9c1b1;
}
```

`:root` mang giá trị dark của Minimalist Editorial làm mặc định, để trang vẫn đọc được khi JavaScript chưa chạy.

Thêm theme mới thì thêm hai block cùng dạng với selector `[data-theme='<id>']`, giá trị lấy từ bảng ở mục 2.

Khi mode là "Hệ thống", JavaScript đọc `prefers-color-scheme` và gán `data-mode` tương ứng. Không hard-code màu trong component.

## 4. Typography

| Vai trò | Font           | Dùng cho                                                        |
| ------- | -------------- | --------------------------------------------------------------- |
| Display | Patrick Hand   | Tiêu đề chính, hero, chip ở bảng facts. Dùng tiết kiệm          |
| Body    | Inter          | Nội dung bài viết, đoạn văn, UI                                 |
| Mono    | JetBrains Mono | Metadata, ngày tháng, tag, code block, bảng số liệu, nhãn facts |

### Quy tắc

- Không dùng Patrick Hand cho đoạn văn dài hoặc nội dung đọc lâu. Một ngoại lệ có chủ ý: **chip ở
  bảng facts** (`Frontend Engineer`, `Cà phê`) — mỗi chip chỉ một hai từ, và nét viết tay làm hàng
  chip bớt khô như một bảng dữ liệu.
- **Chữ mono không bao giờ dùng cùng cỡ với chữ Inter đứng cạnh.** JetBrains Mono có nét rộng và
  x-height cao nên ở cùng cỡ nó trông nặng hơn Inter. Ba tầng mono:
  - **Nhãn mono** (eyebrow, tiêu đề mục lục): `--text-sm` (16px) — nhãn là chữ uppercase có giãn,
    cần đủ lớn để đọc ra là nhãn.
  - **Chữ/link mono** (nav, link footer, kicker, hàng link, khối mã, dòng meta, nhãn bảng facts):
    `--text-xs` (14px).
  - **Metadata mono** (tag, stack, nhãn bộ chọn theme, ghi chú nhỏ): `--text-2xs` (12px).
  - **Nhãn bảng facts là ngoại lệ** (2026-10-19, lần 4): về `--text-xs` và để **chữ thường**. Ở đây
    nhãn là chú thích cho giá trị, không phải nhãn khu vực, và năm dòng `uppercase` liền nhau đọc
    như đang hét.
- **Mọi link dạng chữ dùng mono** cho đồng bộ (xem `Hàng link` ở mục 6). Hai ngoại lệ có chủ ý:
  link là **tiêu đề** (tiêu đề bài viết, tên lab, tên dự án) giữ font display, và link **nằm trong
  câu văn** (`.post-body`) giữ font nội dung — đổi font giữa dòng sẽ phá nhịp đọc.
- Patrick Hand chỉ có một weight (400), nên tiêu đề dùng weight normal; không giả lập bold.
- Mọi font có fallback: `system-ui, sans-serif` cho Inter, `ui-monospace, monospace` cho JetBrains Mono.
- Kiểm tra hiển thị đầy đủ dấu tiếng Việt (ă, â, đ, ơ, ư và các dấu thanh) trên mỗi font trước khi chốt.
  Balsamiq Sans **không** có subset `vietnamese` (đã loại bỏ), Patrick Hand thì có.

### Thang kích thước

| Token            | Kích thước       | Dùng cho                                                                                                                                                             |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--text-2xs`     | 0.75rem (12px)   | Chữ mono cỡ nhỏ: metadata bài viết, tag, stack, nhãn bộ chọn theme, ghi chú nhỏ                                                                                      |
| `--text-xs`      | 0.875rem (14px)  | **Chữ/link mono**: nav, link footer, kicker, hàng link, khối mã, dòng meta, nhãn bảng facts                                                                          |
| `--text-sm`      | 1rem (16px)      | Chữ Inter (mô tả card/dự án, tóm tắt bài viết, link mục lục, đoạn phụ ở khối Dev Lab, dòng mô tả footer, bảng trong bài) **và** nhãn mono (eyebrow, tiêu đề mục lục) |
| `--text-base`    | 1.0625rem (17px) | Thân bài, đoạn phụ trong hero, câu slogan ở hero (`.lead`), link CTA, chip ở bảng facts (font display)                                                               |
| `--text-lg`      | 1.3125rem (21px) | `h3` trong bài, tiêu đề bài viết, tên lab/dự án trên card, tên brand ở footer                                                                                        |
| `--text-xl`      | 1.625rem (26px)  | Tiêu đề section                                                                                                                                                      |
| `--text-2xl`     | 2.375rem (38px)  | Hero / `h1`                                                                                                                                                          |
| `--text-display` | 3rem (48px)      | Dự phòng, hiện chưa dùng                                                                                                                                             |
| `--text-brand`   | 1.75rem (28px)   | Brand `DevLab.` trên header — chữ display một mình nên cần lớn hơn cỡ chữ UI; đi kèm `line-height: 1` (mục 5)                                                        |

Thang này đã qua sáu lần chỉnh: **2026-10-18** nâng 1px ở các cỡ nhỏ và thân bài; **2026-10-19** nâng
tiếp `--text-xs` (13→14px), `--text-sm` (15→16px) và `--text-lg` (19→21px) rồi tách `--text-md` khỏi
`--text-lg` để hạ `.lead` xuống 18px; **2026-10-19 (lần 2)** dựng quy tắc mono, hạ chữ/link mono
16→14px và nâng brand lên 32px; **2026-10-19 (lần 3)** bỏ `--text-md`, `.lead` về `--text-base` (17px,
bằng đoạn mô tả ở khối Dev Lab), nhãn mono 14→16px và brand về 28px; **2026-10-19 (lần 4)** nhãn bảng
facts rời khỏi nhóm nhãn mono (16px uppercase) xuống `--text-xs` chữ thường; **2026-10-19 (lần 5)**
giá trị bảng facts đổi từ chữ Inter sang **chip font display** ở `--text-base`. `h2` và `h1` giữ
nguyên. Khi đổi thang, kiểm tra lại ba chỗ dễ vỡ: nav header có còn vừa một hàng ở 1024px, tiêu đề
dài trong cột mục lục 220px có bị xuống dòng xấu không, và chiều cao header có bị đổi theo cỡ brand
không.

## 5. Bố cục

- **Hai tầng bề rộng.** `--width-page` (1280px) là khung ngoài — header, section, lưới, bảng.
  `--width-content` (720px) là khối chữ (`.measure`) để dòng không quá dài. Nội dung trong khung
  căn **trái**, nên khối chữ và lưới luôn thẳng hàng với nhau.
- **Section ngăn bằng đường kẻ mỏng** ở cuối mỗi section. Đường kẻ vẽ bằng `::after` với
  `inset-inline: var(--space-inline)`, nên chỉ chạy trong bề rộng khối nội dung (không tràn ra
  padding ngang) và thẳng hàng với capsule của header khi đã cuộn. Padding dọc section 48px trên
  desktop, 40px trên mobile; hero có padding-top 56px.
- **Padding ngang** theo breakpoint: 20px (mặc định) → 24px (≥768px) → 32px (≥1024px).
- Khoảng trắng rộng nhưng không phình khoảng cách giữa các section. Không có sidebar cố định.
- **Breakpoint nền** (ghi thẳng trong media query vì CSS không cho dùng biến trong điều kiện
  media): 560px (một cột), 640px (header một hàng, nav căn giữa), 768px (section 48px),
  1024px (padding ngang 32px).
- **Header:** dính (`position: sticky`); brand `DevLab.` font display (`--text-brand`) bên trái, nav
  căn giữa, bộ chọn theme/mode (hai `<select>`) bên phải; đường kẻ dưới header.
  - Brand ghim `line-height: 1`. Chữ display có ascent/descent rộng, nên để `normal` thì hộp dòng
    của brand cao hơn mọi thứ khác trong thanh và chiều cao header phụ thuộc vào cỡ chữ brand —
    ghim `line-height: 1` cho hộp dòng đúng bằng cỡ chữ, nhờ vậy tăng cỡ brand không đẩy header cao
    lên. Nét chữ tràn nhẹ ra ngoài hộp dòng nhưng vẫn nằm trong `padding-block` của thanh nên không
    bị cắt.
  - Cỡ brand chốt **28px** (2026-10-19). Số đo bằng Chrome headless ở 1280px: ở 24px `line-height:
normal` hộp dòng là 32px và chính nó quyết định chiều cao thanh (header 62px); ở 28px
    `line-height: 1` hộp dòng là 28px nên phần tử cao nhất thanh chuyển thành nav — header còn
    60.4px. 32px là mức lớn nhất vẫn giữ nguyên 62px nhưng nét chữ khi đó ngang cỡ `h1`; 28px là mức
    đã chốt, và vì chiều cao thanh do nav quyết định nên sau này đổi cỡ brand trong khoảng 28–32px
    sẽ không kéo theo thay đổi nào khác.
  - Header **không** có nền riêng; nền đục nằm trên thanh bar. Nhờ vậy khi cuộn, phần ngoài
    capsule là trong suốt, không lộ một hình chữ nhật sau bốn góc bo.
  - Quá 4px cuộn: nền chuyển sang bán trong suốt, thanh thu thành **capsule** và thêm bóng rất
    nhẹ. `backdrop-filter: blur(12px)` bật **thường trực** (bật/tắt theo trạng thái cuộn sẽ phải
    tạo lại compositing layer giữa chừng, gây giật); ở trạng thái đầu nền đục nên blur không nhìn
    thấy.
  - Capsule rộng `calc(var(--width-page) - 2 * var(--space-inline))` và header chừa
    `padding-inline: var(--space-inline)`, nên trên màn hình rộng capsule trùng khít mép khối nội
    dung, còn trên màn hình hẹp nó cũng chạm đúng mép đó. Chiều cao thanh **không** đổi giữa hai
    trạng thái để không đẩy nội dung phía dưới.
  - Ẩn/hiện theo hướng cuộn: chỉ bắt đầu ẩn khi đã cuộn quá **320px**, cần delta **16px** mới đổi
    trạng thái (chống rung khi cuộn nhẹ), có cooldown **250ms** giữa hai lần ẩn liên tiếp và cuộn
    lên thì hiện lại ngay. Tắt hẳn khi `prefers-reduced-motion: reduce`.
  - Khi đã cuộn, capsule được đẩy xuống `--header-inset` (12px, chỉ từ 640px) chứ không dính mép
    màn hình. Việc đẩy làm bằng `position: relative; top` — thuộc tính **chỉ đổi khi vẽ**, không
    đổi layout, nên header vẫn giữ nguyên chiều cao. Khoảng hở đó để lộ nội dung đang trôi phía
    sau, nên có một dải nền đục che lại bằng `.site-header::before` (`position: absolute`, ngoài
    luồng): ở trạng thái đầu capsule phủ lên dải này nên không nhìn thấy.
  - Header dùng `transition:persist` nên DOM được giữ nguyên qua các lần chuyển trang — vì vậy
    `aria-current` phải tự cập nhật bằng JS. Nav chỉ gồm `labs`, `bài viết`, `liên hệ`; brand là
    link về trang chủ nên **không** có mục "Trang chủ" riêng.
- **Hero (lời chào):** `h1` font display `Xin chào, tui là <tên>` (tên lấy từ `profile.ts`) → câu
  slogan `--text-base` màu muted (`profile.tagline`; trống thì bỏ) → **khẩu hiệu** dạng ghi chú
  `// …` màu accent (`profile.slogan`; trống thì bỏ) → hàng link CTA (`Xem các lab`, `Đọc bài viết`,
  `Liên hệ`). Đây là **lời chào**, không phải mô tả hệ sinh thái: trang chủ là portfolio cá nhân nên
  mở đầu bằng "ai đang viết", phần "chỗ này là gì" để ở section kế tiếp.
  - Cả **ba** link CTA đều có mũi tên `→`; mũi tên không phải để đánh dấu CTA chính mà là kiểu
    chung của hàng link, nên đừng thêm cho link này mà bỏ ở link kia.
  - Slogan dùng chung cỡ với đoạn mô tả ở khối Dev Lab (`--text-base`) — câu giới thiệu không cần to
    hơn thân bài, chỉ cần khác màu để tách khỏi phần còn lại.
- **Khối Dev Lab** (section ngay dưới hero): kicker mono `~/devlab · <vai trò>` → `h2` font display
  `Dev Lab` → đoạn mô tả hệ sinh thái → một dòng ghi chú kiểu comment (`// …`) màu `--color-accent`
  font mono → đoạn phụ màu `--color-text-muted` (`--text-sm`, không dùng `.lead` — `.lead` đã dành
  cho slogan ở hero).
- **Lưới lab:** tự chia cột theo bề rộng khả dụng
  (`repeat(auto-fit, minmax(min(340px, 100%), 1fr))`, gap 12px) — 1 cột khi hẹp, 2–3 cột khi rộng.
- **Trang chi tiết bài viết:** bố cục do `.post-layout` quyết định, `justify-content: center` để
  cả nhóm cột căn giữa khung.
  - Dưới 1200px: **một cột** — cột đọc (`.prose-col`, `--width-prose` 800px), mục lục là khối ở
    đầu bài.
  - Từ 1200px: **hai cột** — cột đọc 800px + cột mục lục `--width-toc` (220px), cách nhau 40px;
    cột mục lục dính dưới header nên luôn nhìn thấy.
  - Các khối chữ ngắn ở trang khác vẫn dùng `.measure` (720px) và căn trái để thẳng hàng với lưới
    bên dưới. Thanh tiến độ đọc ghim ở mép trên viewport (mục 6).
- **Thứ tự section trang chủ:** hero (lời chào) → Dev Lab → Về mình → Các lab → Bài viết mới →
  Dự án khác → Liên hệ.
  Hai mục "Về mình" và "Dự án khác" **chỉ hiện khi có dữ liệu thật** trong
  `portal/src/data/profile.ts`; chưa có thì ẩn hẳn, không để lại khối rỗng hay câu "sẽ bổ sung".
  Mục "So
  sánh giữa các stack" tạm bỏ ngày 2026-10-18, sẽ làm cùng mục 1.5 trong `ROADMAP.md` khi có số
  đo thật.
- **Footer:** bốn cột trên khung `--width-page`, xếp dọc khi hẹp rồi thành 2 cột từ 640px và 4
  cột từ 1024px (cột brand rộng `1.6fr`, ba cột điều hướng `1fr`):
  1. **Brand** — tên font display + một dòng mô tả (`--text-sm`, muted, tối đa 34ch).
  2. **Nội dung** — bốn route nội bộ (Trang chủ, Bài viết, Labs, Liên hệ).
  3. **Lab** — sinh thẳng từ `data/labs.ts`, không chép tay.
  4. **Liên hệ** — sinh từ `data/profile.ts` (GitHub, email nếu có) + link `trang liên hệ`.

  Mỗi cột là một `<nav aria-labelledby>` trỏ vào nhãn `.eyebrow` của cột. Link footer để màu
  `--color-text-muted`, hover mới lên `--color-link` — bốn cột cùng màu `--color-link` sẽ quá ồn.
  Hàng đáy ngăn bằng `border-top` 1px: `© [năm] [Tên] · Dev Lab` bên trái, `mã nguồn · deploy trên
Cloudflare` bên phải. Nền tảng dữ liệu: xem mục 6 "Nguồn thông tin portfolio".

- **Sticky footer:** `body` là cột flex cao ít nhất `100dvh`, `main` giãn ra ở giữa
  (`flex: 1`). Nội dung ngắn hơn viewport thì footer vẫn nằm ở đáy viewport, không lơ lửng ngay
  dưới nội dung. Dùng `100dvh` chứ không phải `100vh` để không bị thanh địa chỉ trên mobile cắt.

### Token bố cục và hình dạng

| Token             | Giá trị     | Dùng cho                                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------- |
| `--width-page`    | 1280px      | khung ngoài: header, section, lưới, bảng                                     |
| `--width-content` | 720px       | khối chữ ngắn (`.measure`)                                                   |
| `--width-prose`   | 800px       | cột đọc của bài viết (`.prose-col`)                                          |
| `--width-toc`     | 220px       | cột mục lục bài viết (chỉ từ 1200px)                                         |
| `--offset-header` | 96px        | chừa chỗ cho header dính: `scroll-margin-top` của heading, `top` của mục lục |
| `--space-inline`  | 20/24/32px  | padding ngang container theo breakpoint                                      |
| `--space-section` | 40px / 48px | padding dọc section (mobile / desktop)                                       |
| `--radius-sm`     | 4px         | tag, code block                                                              |
| `--radius-md`     | 6px         | phần tử nhỏ cần bo vừa (input, ảnh, pill nav)                                |
| `--radius-lg`     | 8px         | lab card, khung bảng số liệu, capsule header                                 |
| `--radius-pill`   | 999px       | nút lên đầu trang                                                            |

## 6. Thành phần

Hai kiểu tiêu đề section:

- **Tiêu đề chính** (`h2`, font display, `--text-xl`): dùng cho section quan trọng nhất — hiện
  là "Các lab".
- **Nhãn section (eyebrow)**: JetBrains Mono, `--text-sm`, `uppercase`, `letter-spacing: 0.08em`,
  màu `--color-text-muted`. Dùng cho các section còn lại (`Bài viết mới`, `Dự án khác`,
  `Liên hệ`).

### Lab card

- Khi lab đã có địa chỉ, **cả card là một link** (`<a>`), có con trỏ pointer. Khi chưa có địa
  chỉ, card là khối tĩnh: không hover, không con trỏ pointer.
- Nền `--color-surface`, viền `1px solid var(--color-border)`, bo `--radius-lg` (8px), padding
  18px, không đổ bóng.
- Bố cục: hàng đầu gồm tên lab (`h3`, display, `--text-lg`) và trạng thái (mono `--text-2xs`) ở hai
  đầu; đoạn mô tả màu `--color-text-muted` (`--text-sm`); hàng chip stack.
- **Hover** (chỉ khi là link): viền đổi `--color-accent`, card nhấc lên `translateY(-1px)`.

### Trạng thái lab

- Chấm tròn 7px, viền `--color-text-muted`; trạng thái "đang chạy" tô đầy `--color-accent`.
- Luôn kèm **nhãn chữ** (`Đang chạy`, `Sắp tới`, `Dự kiến`) — không phân biệt chỉ bằng màu.

### Tag

- JetBrains Mono, `--text-2xs`, màu `--color-text-muted`, viền `1px solid --color-border`, bo
  `--radius-sm`, padding `1px 7px`, không nền màu.
- Khai báo **một lần ở `global.css`**; dùng cho tag bài viết, stack trong lab card và danh sách
  kỹ năng ở mục "Về mình".

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

### Danh sách bài viết

- Mỗi bài là **một link khối** (`display: block`), padding dọc 16px, ngăn bằng đường kẻ.
- Thứ tự: metadata (mono `--text-2xs`, muted) → tiêu đề (font display, `--text-lg`) → tóm tắt (muted,
  `--text-sm`).
- **Hover:** tiêu đề đổi sang `--color-link`.

### Mục lục bài viết (TOC)

- Chỉ có ở trang chi tiết bài viết. Sinh từ `headings` của `render()` (Astro), **chỉ lấy `h2`**;
  ít hơn 2 mục thì không hiển thị — mục lục một dòng chỉ thêm nhiễu. Một cấp thôi vì thêm `h3` làm
  danh sách dài, khó quét, trong khi `h2` đã đủ để định vị.
- **Vị trí (2 chế độ, do `.post-layout` quyết định — xem mục 5):**
  - Dưới 1200px: khối ở **đầu bài**, đứng trước cột đọc nhờ `order: -1`; khung viền
    `1px --color-border`, bo `--radius-md`, padding dọc 12px. Khoảng cách trên/dưới do `gap` của
    grid lo.
  - Từ 1200px: cột riêng bên phải, rộng `--width-toc` (220px), **dính** dưới header
    (`position: sticky`, `top: var(--offset-header)`) nên **luôn nhìn thấy trong lúc đọc**.
    `align-self: start` là bắt buộc: nếu để ô lưới cao bằng cột đọc thì phần tử hết chỗ để dính.
    Bỏ khung và bo góc (đây là cột phụ, không phải hộp nổi).
- **Không có padding ngang ở `nav`:** mục đang đọc cần trải hết bề ngang. Link tự mang
  `padding: 5px 12px`, còn tiêu đề `padding-inline: 12px` để thẳng hàng.
- Tiêu đề "Nội dung": mono, `--text-sm`, `uppercase`, `letter-spacing: 0.08em`, muted — cùng kiểu
  với nhãn section (eyebrow). Dùng `<p>`, không dùng heading, để không phá cấu trúc bài.
- Link: `--text-sm`, `--color-text-muted`, không gạch chân, giữ sẵn `border-left: 2px solid
transparent` để mục active không làm nhảy chữ. Hover: chữ sang `--color-text`.
- **Mục đang đọc** đánh dấu bằng `aria-current="true"` (không dùng class rời) và dùng **ba tín hiệu
  cùng lúc**: nền `--color-surface`, vạch trái `--color-accent` 2px, chữ `--color-text`. Chỉ đổi
  màu chữ là không đủ rõ giữa một danh sách dài.
- **Có thể có nhiều mục active cùng lúc.** Luật: mọi tiêu đề đang giao với vùng nhìn thấy (dưới
  `--offset-header`, trên đáy viewport) đều được đánh dấu. Nếu không tiêu đề nào trong tầm nhìn —
  đang ở giữa một mục dài, tiêu đề đã cuộn qua — thì giữ mục gần nhất đã đi qua, để không bao giờ
  mất chỉ báo "đang ở đâu". Trạng thái này cập nhật theo vị trí cuộn, xem mục 7.3.
- **Thanh cuộn của mục lục (chỉ ở chế độ cột):** mảnh, lấy màu từ token nên tự đúng ở cả light và
  dark: `scrollbar-width: thin` + `scrollbar-color: var(--color-scrollbar-thumb) transparent`
  (Firefox, Chrome 121+), và `::-webkit-scrollbar` rộng 6px + `::-webkit-scrollbar-thumb` bo tròn
  cho Safari. `padding-right: 8px` để thanh cuộn không đè lên chữ.
- **Lớp mờ báo còn nội dung:** `::after` cao 80px ở mép dưới mục lục,
  `linear-gradient(to bottom, transparent, var(--color-bg))`, `pointer-events: none`, mặc định
  `opacity: 0`. Cao 80px để mờ dần qua khoảng ba mục chứ không cắt ngang một mục. JS ghi
  `data-overflow="bottom"` lên `<nav>` khi mục lục thật sự còn phần chưa cuộn tới, lúc đó mới
  hiện. Nhờ vậy không bao giờ hiện nhầm lúc danh sách đã hết.
- Ngưỡng xác định "đang đọc" đọc từ token `--offset-header`, không hard-code, để không lệch với
  `scroll-margin-top` của heading.
- Điều hướng bằng `href="#<slug>"`. Heading trong thân bài đã có `id` sẵn do pipeline markdown
  sinh (github-slugger), nên **không cần thêm rehype plugin hay dependency**.

### Nút sao chép liên kết ở tiêu đề bài viết

- Mỗi `h2`/`h3` có `id` trong thân bài được gắn thêm một nút `#` nhỏ (mono, `0.7em`).
- **Ẩn mặc định**, chỉ hiện khi hover tiêu đề, khi nút được focus bàn phím, hoặc khi vừa sao chép.
  Vì vậy nút không chiếm chỗ thị giác nhưng vẫn dùng được bằng bàn phím.
- Bấm nút: sao chép `${origin}${pathname}#<id>` vào clipboard, đổi biểu tượng thành `✓` và màu
  `--color-accent` trong 1.6s, đồng thời cập nhật thanh địa chỉ bằng `history.replaceState` (không
  nhảy trang).
- Có vùng `role="status"` ẩn (`.visually-hidden`) đọc kết quả cho screen reader. Nếu trình duyệt
  chặn clipboard, thông báo nói rõ liên kết đã có trên thanh địa chỉ.
- Nút do JavaScript chèn vào: `render()` chỉ trả HTML của markdown nên không chèn được ở phía
  server, và thao tác sao chép vốn đã cần JavaScript. Vì vậy style nằm ở `global.css`
  (`.heading-anchor`), không đặt trong `<style>` scoped của page — phần tử do JS tạo không có
  `data-astro-cid`.

### Thanh tiến độ đọc

- Chỉ có ở trang chi tiết bài viết. Một đường mảnh cao 2px, màu `--color-accent`, ghim sát mép
  trên viewport: `position: fixed`, `inset-block-start: 0`, `inset-inline: 0`, `z-index: 40`,
  `pointer-events: none`.
- Độ dài = **phần trăm bài viết đã cuộn qua**:
  `(scrollY - đỉnh bài viết) / (chiều cao bài viết - chiều cao viewport)`, kẹp trong `[0, 1]`, vẽ
  bằng `transform: scaleX()` với `transform-origin: left`.
- **Hai đường chạy, chọn theo khả năng trình duyệt:**
  1. Có `animation-timeline: scroll()` → để trình duyệt chạy animation theo tiến độ cuộn **trên
     compositor**. JS chỉ đo và ghi `--reading-start` / `--reading-end` (px trong không gian cuộn)
     cho `animation-range`, **không làm gì mỗi frame**. Đây là đường chính vì mượt nhất.
  2. Không có → JS ghi `--reading-progress` theo từng frame cuộn như trước.
- JS **kiểm tra lại bằng `getComputedStyle(bar).animationName`** chứ không chỉ tin vào
  `CSS.supports`: nếu chỉ tin `CSS.supports` mà cú pháp bị loại ở đâu đó thì JS đã ngừng ghi và
  thanh đứng yên ở 0.
- **Không** dùng `transition`: giá trị đã bám theo từng frame cuộn (hoặc do trình duyệt chạy), thêm
  transition chỉ tạo độ trễ giả.
- Không bật đường 1 khi `prefers-reduced-motion: reduce`: ngoài chuyện tôn trọng thiết lập, quy tắc
  `animation-duration: 0.01ms !important` toàn cục ở `global.css` sẽ làm animation theo tiến độ
  cuộn nhảy thẳng tới 100%. Khi đó JS đảm nhiệm và thanh vẫn chạy.
- Không hiển thị số phần trăm: chỉ một đường, đúng như yêu cầu.

### Bảng số liệu

- Bọc trong khung nền `--color-surface`, viền 1px, bo `--radius-lg`, `overflow-x: auto`.
- Font JetBrains Mono 12px. Ô tiêu đề cột màu `--color-text-muted`, weight 400, **căn trái**
  (bỏ quy tắc "số căn phải" trước đây — dùng mono nên cột đã thẳng).
- Ô dữ liệu màu `--color-text-muted`; **cột đầu** màu `--color-text`, weight 500.
- Hàng ngăn bằng đường kẻ mảnh; **hover hàng** đổi nền sang `--color-bg`.

### Link

- Màu `--color-link`, mặc định **không gạch chân**; gạch chân hiện khi hover (chuyển động ở
  mục 7.4).
- Link trong nav: màu `--color-text-muted`; hover đổi `--color-accent` **và** hiện một nền pill
  accent mờ nở ra sau chữ (`color-mix(in oklab, accent 16%, transparent)`, `scale(0.85)` → `1`,
  `opacity 0` → `1`); không gạch chân. Trang hiện tại (`aria-current="page"`) cũng dùng màu
  accent và nền pill.
- Hiệu ứng hover của nav và brand chỉ áp trong `@media (hover: hover) and (pointer: fine)` để
  không dính trạng thái trên thiết bị cảm ứng.
- Trang hiện tại: `aria-current="page"`, màu `--color-text`. Với link nav: màu `--color-accent`.

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
  Khai báo một lần ở `global.css` (`.link-row`), các nơi chỉ cần gắn class.
- Danh sách liên hệ lấy từ `profileLinks` trong `data/profile.ts`, nên **chỉ hiện những link đã
  có** — không để chỗ trống cho link chưa tồn tại.
- Hai ngoại lệ có chủ ý (xem mục 4): link là **tiêu đề** giữ font display, link **trong câu văn**
  giữ font nội dung.

### Ghi chú: khác biệt có chủ ý so với `design-reference/`

`design-reference/` là bản tham khảo bố cục và màu sắc. Màu sắc trong đó khớp hoàn toàn với mục
2 (Minimalist Editorial + Digital Garden), nên **không có khác biệt về màu**. Các điểm sau **cố
ý không** theo reference:

| Điểm               | Reference                                   | Dev Lab                                                 | Lý do                                                        |
| ------------------ | ------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Font display       | Balsamiq Sans, weight 700                   | Patrick Hand, weight 400                                | Balsamiq Sans thiếu subset tiếng Việt; Patrick Hand 1 weight |
| Bộ chọn theme      | 4 nút gộp (2 theme × 2 mode), bỏ "Hệ thống" | 2 trục độc lập, mỗi trục một `<select>`, giữ "Hệ thống" | Giữ mô hình hai trục ở mục 1; dùng control gốc cho a11y      |
| Tiêu đề bài viết   | Inter 600, 17px                             | font display, `--text-lg`                               | Inter hiện chỉ nạp weight 400/500                            |
| Cấu trúc site      | một trang, điều hướng bằng anchor           | trang riêng `/labs`, `/bai-viet`, `/lien-he`            | Nội dung sẽ dài, cần URL riêng                               |
| Tên theme          | nhãn ngắn `ấm` / `dịu`                      | `Minimalist Editorial` / `Digital Garden`               | Khớp `src/data/themes.ts` và mục 2                           |
| Màu hover `filled` | (không có)                                  | `color-mix(in oklab, accent 88%, bg)`                   | Không thêm biến màu mới                                      |
| Header             | không có (không có bố cục dính)             | dính + capsule mờ khi cuộn + nav pill hover             | Bổ sung theo yêu cầu, tham khảo `ngockhoi96.dev`             |

## 7. Chuyển động (animation)

Phong cách tối giản thì chuyển động cũng tối giản: mục tiêu là làm rõ thay đổi trạng thái và
thứ bậc, không phải trang trí. Mục này bổ sung cho phần "Nguyên tắc" bên dưới.

### 7.1 Token

| Token               | Giá trị                         | Dùng cho                                                |
| ------------------- | ------------------------------- | ------------------------------------------------------- |
| `--duration-fast`   | 120ms                           | hover, focus, viền, màu chữ                             |
| `--duration-base`   | 200ms                           | entrance, ẩn/hiện header, thay đổi nhỏ                  |
| `--duration-slow`   | 320ms                           | chuyển trang (View Transition)                          |
| `--duration-chrome` | 340ms                           | chrome của header khi cuộn (nền, viền, độ rộng capsule) |
| `--ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)`    | mặc định                                                |
| `--ease-entrance`   | `cubic-bezier(0.16, 1, 0.3, 1)` | phần tử xuất hiện                                       |
| `--reveal-distance` | 8px                             | độ dịch lên khi phần tử xuất hiện                       |
| `--reveal-stagger`  | 60ms                            | độ trễ giữa các phần tử trong cùng một đợt              |

### 7.2 Quy tắc

1. Chỉ animate `opacity` và `transform`. Không animate `width`, `height`, `margin`,
   `top`/`left` — gây reflow và ảnh hưởng chỉ số hiệu năng.
   **Ngoại lệ duy nhất:** chrome của header khi cuộn đổi `max-width`/`padding-inline` (chỉ theo
   chiều ngang, không làm đổi chiều cao trang) và `background-color`/`border-color`/
   `border-radius`/`box-shadow`. Lý do: đây là hiệu ứng nhận diện của header, chỉ chạy khi vượt
   ngưỡng cuộn, và chỉ tác động lên một phần tử nhỏ. Không được nới ngoại lệ này cho phần tử
   khác.
2. Thời lượng tối đa 340ms (`--duration-chrome`). Không animation lặp vô hạn, không
   bounce/spring quá đà.
3. Không thêm gradient, glow hay hiệu ứng trang trí nhờ animation.
4. Mọi chuyển động **phải** tắt khi `prefers-reduced-motion: reduce`. Đây là yêu cầu bắt
   buộc, không phải tùy chọn.
5. Chỉ giữ animation giải thích được thay đổi trạng thái hoặc thứ bậc; nếu không giải thích
   được điều gì thì bỏ.

### 7.3 Danh mục chuyển động

| Nhóm               | Cách triển khai                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Chuyển trang       | `<ClientRouter />`; gốc không animate, chỉ `main` cross-fade                                                               |
| Header dính        | Cuộn xuống: `translateY(-100%)`; cuộn lên: hiện lại. Capsule đổi nền, viền, bo góc, độ rộng                                |
| Phần tử dùng chung | `view-transition-name` trùng tên ở hai trang, phần tử biến hình thay vì cross-fade                                         |
| Đổi theme / mode   | `document.startViewTransition()` bọc lúc gán `data-theme` / `data-mode`                                                    |
| Vào trang lần đầu  | Phần tử `[data-animate]` hiện dần bằng `motion/mini`, stagger theo token                                                   |
| Nút lên đầu trang  | Hiện dần khi cuộn quá 600px; bấm thì cuộn mượt (hoặc nhảy thẳng) lên đầu                                                   |
| Mục lục bài viết   | Mọi mục đang trong tầm nhìn được đánh dấu theo vị trí cuộn (có thể nhiều mục cùng lúc)                                     |
| Tiến độ đọc        | Đường 2px ở mép trên, dài theo phần trăm bài viết đã cuộn; trình duyệt hỗ trợ thì chạy bằng `animation-timeline: scroll()` |
| Micro-interaction  | Hover link, nav, lab card, hàng bảng — xem mục 7.4                                                                         |

Hiện đã nối shared element cho **tiêu đề bài viết**: `PostList` gắn
`view-transition-name: vt-post-<id>` lên tiêu đề trong danh sách, trang chi tiết gắn đúng tên đó
lên `h1`. Tên phải là custom-ident hợp lệ (id bài bắt đầu bằng số nên có tiền tố `vt-post-`) và
**không được trùng** trong cùng một trang.

Chi tiết triển khai (trong `portal/`):

- `[data-animate]` chỉ chạy ở **lần tải trang đầu tiên**. Các lần điều hướng trong site do
  View Transition xử lý, không chạy lại entrance.
- Cờ `.motion-ready` trên `<html>` được script inline chèn **trước khi vẽ**, và chỉ khi
  người dùng không yêu cầu giảm chuyển động. Nhờ vậy không có nháy, và nội dung không bao
  giờ bị ẩn khi JavaScript lỗi.
- View Transitions thay toàn bộ attribute của `<html>`, nên `data-theme` / `data-mode` phải
  được chép sang document mới trong `astro:before-swap`; nếu không theme sẽ bị reset sau khi
  chuyển trang.

### 7.4 Hover và trạng thái tương tác

Nguyên tắc: hover phải **nói được điều gì đó** (phần tử này bấm được, hoặc đang ở trạng thái
gì). Dùng `--duration-fast` (120ms) và `--ease-standard`. Không phóng to, không đổ bóng, không
dịch chuyển quá 1px (chỉ lab card nhấc lên 1px).

| Phần tử                             | Mặc định              | Hover                                                                           |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| Link trong nội dung                 | không gạch chân       | **gạch chân mọc dần trái → phải**                                               |
| Link CTA (`… →`)                    | không gạch chân       | gạch chân mọc dần + mũi tên dịch sang phải 2px                                  |
| Link nav                            | `--color-text-muted`  | `--color-accent` + nền pill accent mờ nở ra                                     |
| Brand trên header                   | `--color-text`        | `--color-accent`, không gạch chân                                               |
| Tiêu đề bài viết                    | `--color-text`        | `--color-link`                                                                  |
| Lab card (khi là link)              | viền `--color-border` | viền `--color-accent` + `translateY(-1px)`                                      |
| Hàng bảng                           | nền `--color-surface` | nền `--color-bg`                                                                |
| Link mục lục                        | `--color-text-muted`  | `--color-text`; mục đang đọc thêm nền `--color-surface` + vạch `--color-accent` |
| Nút sao chép ở tiêu đề bài viết     | ẩn (`opacity: 0`)     | hiện + `--color-accent` (cũng hiện khi focus)                                   |
| Nút `ghost` / `outlined` / `filled` | theo bảng ở mục 6     | theo bảng ở mục 6                                                               |

**Gạch chân mọc dần** — kỹ thuật:

- Link ngắn và link CTA: `background-image: linear-gradient(currentColor, currentColor)`,
  `background-repeat: no-repeat`, `background-position: 0 100%`, `background-size: 0 1px`; khi
  hover đổi `background-size: 100% 1px`. Không tạo layout shift.
- Link trong bài viết dài: dùng `text-decoration-color: transparent → currentColor` để an toàn
  khi link xuống dòng (kỹ thuật `background-size` bị vỡ trên nhiều dòng).
- Mũi tên `→` của link CTA đặt trong `<span aria-hidden="true">` để có thể dịch riêng mà không
  lặp lại trong screen reader.
- Khi `prefers-reduced-motion: reduce`: bỏ hiệu ứng mọc dần, hiện gạch chân ngay lập tức.

## 8. Nguyên tắc

1. **Tương phản:** text chính đạt tối thiểu WCAG AA (4.5:1) trên nền ở mọi cặp theme × mode đang triển khai (hiện tại: Minimalist Editorial light và dark). Kiểm tra cả link và text phụ.
2. **Tối giản:** tránh card lồng nhau, gradient, hiệu ứng glow, minh họa lớn.
3. **Một CTA:** mỗi màn hình tối đa một hành động chính.
4. **Nhất quán:** bố cục và typography giữ nguyên giữa các theme. Chỉ màu sắc thay đổi.
5. **Cá nhân:** ưu tiên nội dung và giọng văn của tác giả hơn trang trí.
6. **Chuyển động có mục đích.** Animation không bắt buộc; nếu có thì theo mục 7 và luôn tôn
   trọng `prefers-reduced-motion`.

## 9. Việc cần kiểm tra

- [x] Contrast của `--color-text-muted` trên `--color-surface`: 7.16:1 (dark) và 4.87:1 (light)
- [x] Contrast của `--color-link`: trên background 8.49:1 (dark) / 5.24:1 (light), trên surface 7.45:1 (dark) / 5.62:1 (light)
      — đo bằng công thức WCAG 2.1 (relative luminance) ngày 2026-10-18. Lưu ý: secondary text trên surface ở light chỉ 4.87:1, sát ngưỡng AA 4.5:1, không được giảm thêm.
- [x] Hiển thị tiếng Việt của Patrick Hand (subset `vietnamese` của Google Fonts: U+0102-0103, U+0110-0111, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9)
- [ ] Trạng thái focus cho bàn phím
- [ ] Trạng thái "đang chạy" và "sắp tới" của lab card có đủ phân biệt không khi chỉ dựa vào màu
- [x] Animation tôn trọng `prefers-reduced-motion` (CSS guard trong `global.css` + kiểm tra
      trong `BaseLayout.astro` và `ThemeToggle.astro`)
- [x] Theme không bị reset sau khi chuyển trang bằng View Transitions (chép `data-theme` /
      `data-mode` trong `astro:before-swap`)
- [ ] Thời lượng chuyển động và bundle JS của `motion/mini` trên mobile (Lighthouse Performance)
- [ ] Hover của link, nav, lab card, hàng bảng đúng như mục 7.4 ở cả light và dark
- [ ] Gạch chân mọc dần không gây layout shift; link trong bài viết dài không vỡ khi xuống dòng
- [ ] Lab card chưa có địa chỉ: không hover, không con trỏ pointer
- [ ] Nút `filled` dùng `color-mix`, không hard-code màu accent đậm hơn
