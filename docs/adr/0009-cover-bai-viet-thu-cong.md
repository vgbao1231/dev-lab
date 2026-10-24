# 0009. Cover bài viết đặt thủ công, SVG inline theo theme

Trạng thái: Accepted
Ngày: 2026-10-24

## Bối cảnh

Trang `/bai-viet` chuyển sang dạng lưới card và cần ảnh đại diện cho từng bài. Trang chủ đã có
thiết kế cuối cho mục "Bài viết mới" (danh sách dòng, không thumbnail), nên cover chỉ được dùng ở
trang lưu trữ và không được kéo theo thay đổi giao diện trang chủ.

Có ba hướng:

1. Lấy ảnh đầu tiên trong thân bài làm cover.
2. Dùng ảnh raster đặt trong `public/` hoặc `src/assets/`, tối ưu bằng `astro:assets`.
3. Đặt một khóa cover trong frontmatter, tra ra SVG nội bộ.

Hướng 1 làm nội dung bài phụ thuộc vào ảnh và dễ tạo cover ngoài ý muốn. Hướng 2 cần hai bộ ảnh cho
light/dark nếu muốn ảnh hòa với theme, đồng thời phụ thuộc pipeline tối ưu ảnh.

## Quyết định

- Frontmatter có hai trường:
  - `cover`: khóa trong `portal/src/data/covers.ts`, ví dụ `react-fiber`.
  - `coverAlt`: mô tả ảnh cho screen reader; **bắt buộc** khi có `cover`.
- Ảnh là SVG vẽ tay trong `portal/src/assets/covers/`, được nhúng **inline** bằng
  `import.meta.glob(..., { query: '?raw', import: 'default' })`. Nhờ vậy SVG dùng được CSS custom
  property (`--color-surface`, `--color-accent`, …) và tự đổi theo theme/mode.
- `PostCover.astro` là nơi duy nhất render cover. Nếu bài không có `cover`, component render
  fallback monogram từ chữ cái đầu của tiêu đề; fallback không tạo alt giả và không phải link.
- Cover dùng tỉ lệ 16:9, góc trên của card; không dùng ảnh trong thân bài làm cover.
- Thêm cover mới là thay đổi có chủ đích: thêm file SVG, thêm khóa vào `covers.ts`, dùng trong
  frontmatter. Không cho phép đường dẫn tùy ý trong frontmatter.

## Hệ quả

- Cover tự đúng ở light/dark, không cần JavaScript và không cần hai bộ ảnh.
- Build kiểm tra được khóa cover và `coverAlt`; lỗi frontmatter làm build thất bại thay vì hiện ảnh
  vỡ.
- Không có tối ưu ảnh tự động (resize/AVIF/WebP). Chấp nhận được vì cover là SVG nhỏ, ít màu, và
  được nhúng một lần trong HTML.
- Người viết phải tự mô tả `coverAlt`; không thể suy ra alt từ nội dung SVG.
- Trang chủ giữ nguyên `PostList`; cover chỉ xuất hiện trong `PostCard` ở `/bai-viet`.
