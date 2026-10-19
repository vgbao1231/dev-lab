# Architecture Decision Records (ADR)

Mỗi file ghi **một** quyết định: bối cảnh, quyết định, và đánh đổi. Dùng để trả lời "vì sao lại làm vậy" mà không cần lục lịch sử commit.

Quy ước:

- Tên file `NNNN-ten-ngan.md`, đánh số tăng dần.
- Không sửa nội dung ADR cũ. Quyết định đổi thì thêm ADR mới và ghi "Thay thế ADR NNNN".
- Spec (giá trị, quy tắc hiện hành) nằm ở `docs/design/`; ADR chỉ giữ lý do.

Mẫu:

```md
# NNNN. Tiêu đề quyết định

Trạng thái: Accepted | Superseded by NNNN
Ngày: YYYY-MM-DD

## Bối cảnh

## Quyết định

## Hệ quả
```

## Danh sách

| ADR                                                 | Quyết định                                                 |
| --------------------------------------------------- | ---------------------------------------------------------- |
| [0001](0001-astro-tinh-va-pnpm-workspace.md)        | Portal Astro tĩnh, các lab độc lập trong pnpm workspace    |
| [0002](0002-theme-va-mode-hai-truc-doc-lap.md)      | Theme và mode là hai trục độc lập                          |
| [0003](0003-font-display-patrick-hand.md)           | Patrick Hand làm font display thay Balsamiq Sans           |
| [0004](0004-chuyen-trang-bang-view-transitions.md)  | Chuyển trang bằng View Transitions                         |
| [0005](0005-chu-mono-nho-hon-inter-2px.md)          | Chữ mono luôn nhỏ hơn chữ Inter cùng vai trò 2px           |
| [0006](0006-header-capsule-dinh.md)                 | Header dính dạng capsule mờ                                |
| [0007](0007-tien-do-doc-bang-animation-timeline.md) | Thanh tiến độ đọc chạy bằng `animation-timeline: scroll()` |
