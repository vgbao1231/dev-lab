---
title: 'Bài viết mẫu để kiểm tra hệ thống nội dung'
date: 2026-10-18
type: note
lab: react-lab
tags: ['meta', 'astro', 'content-collection']
summary: 'Bài viết mẫu dùng để kiểm chứng collection, frontmatter, mục lục và thanh tiến độ đọc. Thay bằng nội dung thật hoặc xoá file này khi bắt đầu viết bài thật.'
draft: false
---

> **Đây là bài mẫu, không phải nội dung thật.** Nó tồn tại để kiểm chứng pipeline: frontmatter đầy đủ, collection `posts`, trang danh sách, trang chi tiết, mục lục và thanh tiến độ đọc. Xoá `portal/src/content/posts/bai-viet-mau.md` khi bạn bắt đầu viết bài thật (3 bài của React Lab ở mục 1.5 trong `ROADMAP.md`).

## Frontmatter

Mọi bài viết cần đủ các trường:

| Trường    | Kiểu   | Ghi chú                                                           |
| --------- | ------ | ----------------------------------------------------------------- |
| `title`   | string | Tiêu đề bài                                                       |
| `date`    | date   | Ngày viết, định dạng `YYYY-MM-DD`                                 |
| `type`    | enum   | `concept`, `experiment`, `case-study`, `demo`, `tutorial`, `note` |
| `lab`     | string | Slug của lab, ví dụ `react-lab`                                   |
| `tags`    | array  | Danh sách tag                                                     |
| `summary` | string | Tóm tắt một câu, dùng ở trang danh sách                           |

`summary` là câu tóm tắt một dòng, dùng ở trang danh sách và thẻ `description` cho SEO. Viết một câu, dưới 160 ký tự, nêu **bài này giải quyết việc gì**. Trường `draft` là tuỳ chọn: `draft: true` để loại bài khỏi bản build.

## Thêm bài mới

Tạo file `.md` trong `portal/src/content/posts/`, thêm frontmatter như trên, viết nội dung bằng Markdown. Tên file chính là slug trên URL: `use-memo-khong-phai-luc-nao-cung-nhanh.md` sẽ có địa chỉ `/bai-viet/use-memo-khong-phai-luc-nao-cung-nhanh`.

Thứ tự công việc: tạo file với `draft: true` → viết nội dung, xem bằng `pnpm dev` → chạy `pnpm lint`, `pnpm typecheck`, `pnpm build` → đổi `draft: false` khi đã sẵn sàng.

## Quy ước viết

Viết bằng tiếng Việt. Thuật ngữ kỹ thuật giữ nguyên tiếng Anh: `useMemo`, `reconciliation`, `event loop`, `viewport`. Không dịch những từ mà bản dịch làm nghĩa mờ đi.

Không có giới hạn cứng về độ dài. Nhưng nếu một bài vượt quá khoảng 2.000 từ, thường là dấu hiệu nên tách thành hai bài, hoặc bài đó đang gộp hai chủ đề khác nhau.

Khối mã dùng ba dấu huyền kèm tên ngôn ngữ. Không dán cả file nếu chỉ cần một hàm — người đọc phải tự tìm dòng quan trọng, đó là việc của người viết.

```ts
// Ví dụ: hàm thuần, dễ test, không phụ thuộc vào React.
export const formatReadingTime = (words: number, wordsPerMinute = 200): string => {
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} phút đọc`;
};
```

## Kiểm tra trước khi đăng

Ba lệnh phải xanh: `pnpm lint`, `pnpm typecheck`, `pnpm build`. Nếu một lệnh thất bại, không báo hoàn thành — sửa trước, rồi chạy lại cả ba.

Với thay đổi giao diện, kiểm tra hai theme × hai mode (hiện tại chỉ có Minimalist Editorial light và dark) và viewport mobile 390px. Hai lỗi hay gặp nhất khi quên kiểm tra: màu chữ trên nền `--color-surface` ở dark mode, và phần tử tràn ngang trên màn hình hẹp.

## Mục lục và tiến độ đọc

Mục lục lấy từ danh sách `headings` mà Astro trả về khi render Markdown, chỉ lấy `h2`. Trên màn hình rộng từ 1200px, mục lục nằm ở cột riêng bên phải và dính dưới header nên luôn nhìn thấy trong lúc đọc. Dưới 1200px, nó là một khối ở đầu bài.

Trong lúc cuộn, mọi tiêu đề đang nằm trong tầm nhìn đều được đánh dấu, nên có thể có nhiều mục sáng cùng lúc. Nếu bạn đang ở giữa một mục dài mà tiêu đề đã cuộn qua, mục đó vẫn được giữ sáng để biết mình đang ở đâu.

Thanh tiến độ là đường mảnh 2px ở sát mép trên, dài dần theo phần trăm bài viết đã cuộn qua. Nó không hiện số, chỉ hiện độ dài.

Mỗi tiêu đề có một nút `#` nhỏ, hiện ra khi đưa chuột vào tiêu đề hoặc khi nút được focus bằng bàn phím. Bấm vào đó sẽ sao chép địa chỉ đầy đủ của tiêu đề. Nút này cần JavaScript; nếu JavaScript bị tắt, `id` của tiêu đề vẫn có trong HTML nên bạn vẫn tự ghép `#` vào địa chỉ được.

## Việc còn lại

- [ ] Thay bài mẫu này bằng ba bài thật của React Lab.
- [ ] Bổ sung ảnh và khối mã có tô màu cú pháp.
- [ ] Đo chỉ số hiệu năng (mục 9 trong `DESIGN_SYSTEM.md` vẫn để trống).
