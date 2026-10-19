# Design: Typography

> Một phần của design system; chỉ mục và bảng định tuyến ở [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Số mục giữ nguyên bản gốc vì comment trong code trỏ tới "mục N".

## 4. Typography

| Vai trò | Font           | Dùng cho                                                                                |
| ------- | -------------- | --------------------------------------------------------------------------------------- |
| Display | Patrick Hand   | Tiêu đề chính, hero, chip ở bảng facts. Dùng tiết kiệm                                  |
| Body    | Inter          | Nội dung bài viết, đoạn văn, UI                                                         |
| Mono    | JetBrains Mono | Metadata, ngày tháng, tag, code block, bảng số liệu riêng (chưa triển khai), nhãn facts |

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
  - **Nhãn bảng facts là ngoại lệ**: về `--text-xs` và để **chữ thường**. Ở đây
    nhãn là chú thích cho giá trị, không phải nhãn khu vực, và năm dòng `uppercase` liền nhau đọc
    như đang hét.
- **Mọi link dạng chữ dùng mono** cho đồng bộ (xem `Hàng link` ở mục 6, `components.md`). Ba ngoại lệ có chủ ý:
  link là **tiêu đề** (tiêu đề bài viết, tên lab, tên dự án) giữ font display; link **nằm trong
  câu văn** (`.post-body`) giữ font nội dung — đổi font giữa dòng sẽ phá nhịp đọc; và **brand
  `DevLab.`** trên header giữ font display (xem `layout.md`).
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
| `--text-base`    | 1.0625rem (17px) | Thân bài, đoạn phụ trong hero, câu slogan ở hero (`.lead`), chip ở bảng facts (font display)                                                                         |
| `--text-lg`      | 1.3125rem (21px) | `h3` trong bài, tiêu đề bài trong danh sách, tên lab/dự án trên card, tên brand ở footer                                                                             |
| `--text-xl`      | 1.625rem (26px)  | Tiêu đề section                                                                                                                                                      |
| `--text-2xl`     | 2.375rem (38px)  | Hero và `h1`, gồm tiêu đề bài ở trang chi tiết                                                                                                                       |
| `--text-display` | 3rem (48px)      | Dự phòng, hiện chưa dùng                                                                                                                                             |
| `--text-brand`   | 1.75rem (28px)   | Brand `DevLab.` trên header — chữ display một mình nên cần lớn hơn cỡ chữ UI; đi kèm `line-height: 1` (mục 5, `layout.md`)                                           |

Lý do và lịch sử các lần chỉnh: [ADR 0005](../adr/0005-chu-mono-nho-hon-inter-2px.md) và
[`CHANGELOG.md`](../CHANGELOG.md). Khi đổi thang, kiểm tra lại ba chỗ dễ vỡ: nav header có còn vừa một hàng ở 1024px, tiêu đề
dài trong cột mục lục 220px có bị xuống dòng xấu không, và chiều cao header có bị đổi theo cỡ brand
không.
