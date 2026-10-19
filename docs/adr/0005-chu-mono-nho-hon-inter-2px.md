# 0005. Chữ mono luôn nhỏ hơn chữ Inter cùng vai trò 2px

Trạng thái: Accepted
Ngày: 2026-10-19

## Bối cảnh

JetBrains Mono có nét rộng và x-height cao, nên ở cùng cỡ với Inter nó trông nặng hơn. Thang chữ đã qua nhiều vòng chỉnh trong cùng ngày (chi tiết ở `docs/CHANGELOG.md`), và còn có lúc hai font đứng cạnh nhau trông lệch cỡ.

## Quyết định

Chữ mono luôn nhỏ hơn chữ Inter cùng vai trò 2px, chia ba tầng:

- Nhãn mono (eyebrow, tiêu đề mục lục): `--text-sm` (16px), uppercase có giãn chữ.
- Chữ và link mono (nav, link footer, kicker, hàng link, khối mã, dòng meta): `--text-xs` (14px).
- Metadata mono (tag, stack, nhãn bộ chọn theme): `--text-2xs` (12px).

Mọi link dạng chữ dùng mono; các hàng link inline gom về class `.link-row`, còn nav, footer và `skip-link` có layout riêng nên tự khai báo mono. Ba ngoại lệ: link là tiêu đề giữ font display, link nằm trong câu văn giữ font nội dung (đổi font giữa dòng phá nhịp đọc), và brand trên header giữ font display. Nhãn bảng facts cũng là ngoại lệ: `--text-xs`, chữ thường, vì năm dòng uppercase liền nhau đọc như đang hét.

## Hệ quả

- Token `--text-md` đã bị xoá vì không còn nơi dùng; `.lead` dùng `--text-base`.
- Khi đổi thang chữ phải kiểm tra lại: nav header còn vừa một hàng ở 1024px không, tiêu đề dài trong cột mục lục 220px có xuống dòng xấu không, chiều cao header có đổi theo cỡ brand không.
