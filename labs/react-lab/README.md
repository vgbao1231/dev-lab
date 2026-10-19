# React Lab

Lab đầu tiên của Dev Lab: hooks, rendering, state và performance, kèm số đo thực tế.

- Stack: React 19, TypeScript (strict), Vite
- Chạy local: `pnpm --filter react-lab dev`
- Build: `pnpm --filter react-lab build`
- Typecheck: `pnpm --filter react-lab typecheck`

## Trạng thái

Đây mới là khung lab. Nội dung tiếp theo theo `docs/ROADMAP.md` mục 1.5:

- Bài viết 1 (Concept): Reconciliation khi render list
- Bài viết 2 (Experiment): `useMemo` trên list lớn, có số đo
- Bài viết 3 (Note): Dựng lab trên Cloudflare

## Ghi chú

- Style hiện chỉ dùng cho bố cục. Việc chia sẻ design tokens giữa portal và các lab
  chưa được chốt (xem `docs/PROJECT_OVERVIEW.md`, mục "Những điều chưa quyết định").
- Không thêm dependency mới khi chưa được đồng ý (xem `AGENTS.md`).
