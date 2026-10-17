# Design System: Dev Lab

Hệ thống thiết kế cho cổng chính và các lab. Phong cách tối giản, cá nhân, hướng nội dung. Không phải landing page SaaS.

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

| Token          | Dark      | Light     |
| -------------- | --------- | --------- |
| Background     | `#171614` | `#F7F4ED` |
| Surface        | `#24221F` | `#FFFCF6` |
| Primary text   | `#F2EBDD` | `#292720` |
| Secondary text | `#B6ADA0` | `#756F64` |
| Accent         | `#A6B58A` | `#667A4D` |
| Links          | `#83B9D4` | `#326C8A` |
| Borders        | `#3A3630` | `#E3DDD1` |

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
}

:root[data-theme='minimalist-editorial'][data-mode='light'] {
  --color-bg: #f7f4ed;
  --color-surface: #fffcf6;
  --color-text: #292720;
  --color-text-muted: #756f64;
  --color-accent: #667a4d;
  --color-link: #326c8a;
  --color-border: #e3ddd1;
}
```

`:root` mang giá trị dark của Minimalist Editorial làm mặc định, để trang vẫn đọc được khi JavaScript chưa chạy.

Thêm theme mới thì thêm hai block cùng dạng với selector `[data-theme='<id>']`, giá trị lấy từ bảng ở mục 2.

Khi mode là "Hệ thống", JavaScript đọc `prefers-color-scheme` và gán `data-mode` tương ứng. Không hard-code màu trong component.

## 4. Typography

| Vai trò | Font           | Dùng cho                                            |
| ------- | -------------- | --------------------------------------------------- |
| Display | Patrick Hand   | Tiêu đề chính, hero. Dùng tiết kiệm                 |
| Body    | Inter          | Nội dung bài viết, đoạn văn, UI                     |
| Mono    | JetBrains Mono | Metadata, ngày tháng, tag, code block, bảng số liệu |

### Quy tắc

- Không dùng Patrick Hand cho đoạn văn dài hoặc nội dung đọc lâu.
- Patrick Hand chỉ có một weight (400), nên tiêu đề dùng weight normal; không giả lập bold.
- Mọi font có fallback: `system-ui, sans-serif` cho Inter, `ui-monospace, monospace` cho JetBrains Mono.
- Kiểm tra hiển thị đầy đủ dấu tiếng Việt (ă, â, đ, ơ, ư và các dấu thanh) trên mỗi font trước khi chốt.
  Balsamiq Sans **không** có subset `vietnamese` (đã loại bỏ), Patrick Hand thì có.

### Thang kích thước gợi ý

| Token            | Kích thước | Dùng cho        |
| ---------------- | ---------- | --------------- |
| `--text-xs`      | 0.75rem    | Metadata, tag   |
| `--text-sm`      | 0.875rem   | Chú thích, bảng |
| `--text-base`    | 1rem       | Body            |
| `--text-lg`      | 1.125rem   | Lead paragraph  |
| `--text-xl`      | 1.5rem     | Tiêu đề mục     |
| `--text-2xl`     | 2.25rem    | Tiêu đề trang   |
| `--text-display` | 3rem       | Hero            |

## 5. Bố cục

- Một cột, căn giữa, chiều rộng tối đa khoảng 680px cho nội dung đọc, 900px cho trang danh sách.
- Danh sách bài viết xếp chồng theo chiều dọc, ngăn cách bằng đường kẻ mỏng (`--color-border`).
- Khoảng trắng rộng. Padding section tối thiểu 64px trên desktop, 40px trên mobile.
- Không có sidebar cố định trên trang bài viết.

## 6. Thành phần

- **Lab card:** nền `--color-surface`, viền 1px, bo góc nhỏ (4–6px). Không đổ bóng.
- **Tag:** JetBrains Mono, `--text-xs`, viền mỏng, không nền màu.
- **Link:** dùng `--color-link`, gạch chân khi hover.
- **Code block:** nền `--color-surface`, font JetBrains Mono.
- **Bảng số liệu:** viền mảnh, số căn phải, tiêu đề in mờ bằng `--color-text-muted`.

## 7. Nguyên tắc

1. **Tương phản:** text chính đạt tối thiểu WCAG AA (4.5:1) trên nền ở mọi cặp theme × mode đang triển khai (hiện tại: Minimalist Editorial light và dark). Kiểm tra cả link và text phụ.
2. **Tối giản:** tránh card lồng nhau, gradient, hiệu ứng glow, minh họa lớn.
3. **Một CTA:** mỗi màn hình tối đa một hành động chính.
4. **Nhất quán:** bố cục và typography giữ nguyên giữa các theme. Chỉ màu sắc thay đổi.
5. **Cá nhân:** ưu tiên nội dung và giọng văn của tác giả hơn trang trí.
6. **Không bắt buộc animation.** Nếu có, tôn trọng `prefers-reduced-motion`.

## 8. Việc cần kiểm tra

- [x] Contrast của `--color-text-muted` trên `--color-surface`: 7.16:1 (dark) và 4.87:1 (light)
- [x] Contrast của `--color-link`: trên background 8.49:1 (dark) / 5.24:1 (light), trên surface 7.45:1 (dark) / 5.62:1 (light)
      — đo bằng công thức WCAG 2.1 (relative luminance) ngày 2026-10-18. Lưu ý: secondary text trên surface ở light chỉ 4.87:1, sát ngưỡng AA 4.5:1, không được giảm thêm.
- [x] Hiển thị tiếng Việt của Patrick Hand (subset `vietnamese` của Google Fonts: U+0102-0103, U+0110-0111, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9)
- [ ] Trạng thái focus cho bàn phím
- [ ] Trạng thái "đang chạy" và "sắp tới" của lab card có đủ phân biệt không khi chỉ dựa vào màu
