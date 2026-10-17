---
title: 'Bài viết mẫu để kiểm tra hệ thống nội dung'
date: 2026-10-18
type: note
lab: react-lab
tags: ['meta', 'astro', 'content-collection']
summary: 'Bài viết mẫu dùng để kiểm chứng collection, frontmatter và cách hiển thị metadata. Thay bằng nội dung thật hoặc xoá file này.'
draft: false
---

> **Đây là bài mẫu, không phải nội dung thật.** Nó tồn tại để kiểm chứng pipeline: frontmatter đầy đủ, collection `posts`, trang danh sách và trang chi tiết. Xoá `portal/src/content/posts/bai-viet-mau.md` khi bạn bắt đầu viết bài thật (3 bài của React Lab ở mục 1.5).

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

Trường `draft` là tuỳ chọn: `draft: true` để loại bài khỏi bản build.

## Thêm bài mới

Tạo file `.md` trong `portal/src/content/posts/`, thêm frontmatter như trên, viết nội dung bằng Markdown. Tên file chính là slug trên URL.
