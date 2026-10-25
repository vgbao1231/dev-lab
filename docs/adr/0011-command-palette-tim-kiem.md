# 0011. Command palette tìm kiếm, index sinh lúc build

Trạng thái: Accepted
Ngày: 2026-10-24

## Bối cảnh

Portal là site Astro tĩnh. Cần tìm kiếm bài viết, lab và trang tĩnh với trải nghiệm command
palette tương tự `ngockhoi96.dev`: mở nhanh bằng bàn phím, gõ không dấu vẫn khớp, điều hướng bằng
mũi tên. Site hiện không có backend và ưu tiên ít JavaScript.

Các hướng:

1. Dịch vụ tìm kiếm bên ngoài (Algolia, Typesense).
2. Thư viện tìm kiếm phía client (Fuse.js, MiniSearch, Pagefind).
3. Tự sinh index JSON lúc build và tự xếp hạng ở client.

Hướng 1 thêm phụ thuộc dịch vụ, chi phí và cấu hình ngoài repo. Hướng 2 khả thi nhưng thêm
dependency runtime hoặc bước build riêng cho một tập dữ liệu rất nhỏ (vài chục mục).

## Quyết định

- Dùng command palette dạng `<dialog>` gốc + `showModal()`; không dựng modal tự viết.
- Index sinh lúc build tại `/search-index.json` từ content collection, `labs.ts` và danh sách
  trang tĩnh. Mỗi mục có `type`, `title`, `summary`, `href`, `meta`, `tags`, và `text` đã chuẩn
  hoá.
- Client fetch index **lười** ở lần mở đầu tiên, cache trong bộ nhớ. Không gọi API bên ngoài.
- Chuẩn hoá tìm kiếm: NFD, bỏ combining mark, đổi `đ` → `d`, lowercase, gộp khoảng trắng. Nhờ vậy
  `fiber` khớp `Fiber`, `reconciliation` khớp `Reconciliation`.
- Xếp hạng đơn giản, không phụ thuộc thư viện: khớp tiêu đề > tag > metadata > summary > tất cả
  token; ưu tiên nhẹ cho bài viết, rồi lab, rồi trang. Tối đa 8 kết quả.
- Phím tắt: `Ctrl/Cmd+K` và `/` khi focus không nằm trong input/textarea/select/contenteditable.
  Trong dialog: `↑`/`↓` đổi mục, `Enter` mở, `Esc` đóng; click ra ngoài panel cũng đóng.
- Không thêm dependency runtime. Code tìm kiếm thuần TypeScript ở `portal/src/lib/search.ts` để
  endpoint và client dùng chung.
- Kết quả là link thật (`<a href>`), không phải `button` + `router.push`; nhờ vậy mở tab mới,
  copy link và View Transitions vẫn hoạt động.

## Hệ quả

- Không có chi phí dịch vụ, không có khóa API, index nằm trong bundle tĩnh vài KB.
- Chất lượng xếp hạng đủ tốt cho vài chục mục; nếu nội dung tăng lên hàng nghìn mục cần đánh giá
  lại (có thể thay bằng Pagefind hoặc index có stemming).
- Tìm kiếm phụ thuộc JavaScript. Không có fallback server-side; trang `/bai-viet` vẫn là cách duyệt
  đầy đủ khi JS lỗi.
- Index chỉ chứa nội dung công khai, bài `draft` bị loại.
- Khi thêm loại nội dung mới, phải thêm vào endpoint và kiểu `SearchEntry`; đây là điểm bảo trì đã
  biết.
