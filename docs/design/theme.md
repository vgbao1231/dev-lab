# Design: Theme và màu sắc

> Một phần của design system; chỉ mục và bảng định tuyến ở [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Số mục giữ nguyên bản gốc vì comment trong code trỏ tới "mục N".

## 1. Cấu trúc theme

Hai trục **độc lập**, người dùng chọn riêng từng trục:

- **Theme:** bộ nhận diện màu sắc, mỗi theme có tên riêng và tinh thần riêng — Minimalist Editorial, Digital Garden, và các theme thêm sau này.
- **Chế độ (mode):** Light, Dark, hoặc Hệ thống (theo cài đặt thiết bị). Mode không gắn cứng với theme.

Vì hai trục độc lập, số tổ hợp **không cố định**: mỗi theme chỉ cần định nghĩa bảng màu cho light và dark của chính nó.

Theme được gắn lên `<html>` bằng hai thuộc tính:

```html
<html data-theme="minimalist-editorial" data-mode="dark"></html>
```

Cách mở rộng: thêm theme mới = thêm bảng màu vào file này (`docs/design/theme.md`) + thêm block CSS variables cho theme đó + đăng ký trong `portal/src/data/themes.ts`. Bố cục và typography **không** đổi theo theme, chỉ màu sắc đổi.

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

Tên token dùng chung cho mọi theme và mọi mode; chỉ giá trị thay đổi theo cặp `data-theme` + `data-mode`.
Giá trị thật nằm ở `portal/src/styles/tokens.css` và **phải khớp bảng ở mục 2** (bảng là bản quyết định,
file CSS là bản cài đặt; đổi màu thì sửa bảng trước). Không chép lại cả khối CSS vào đây để khỏi lệch.

- Token màu: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`,
  `--color-link`, `--color-border`, `--color-scrollbar-thumb`.
- Selector dạng `:root[data-theme='<id>'][data-mode='dark' | 'light']`. `:root` mang giá trị dark của
  Minimalist Editorial làm mặc định, để trang vẫn đọc được khi JavaScript chưa chạy.
- Thêm theme mới thì thêm hai block cùng dạng với selector `[data-theme='<id>']`, giá trị lấy từ bảng ở mục 2.
- Khi mode là "Hệ thống", JavaScript đọc `prefers-color-scheme` và gán `data-mode` tương ứng.
- Không hard-code màu trong component.
