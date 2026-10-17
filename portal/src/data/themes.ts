export type ThemeStatus = 'available' | 'planned';

export type ThemeId = 'minimalist-editorial' | 'digital-garden';

export type Theme = {
  id: ThemeId;
  /** Tên hiển thị trong bộ chọn theme. */
  label: string;
  /** Mô tả ngắn về tinh thần của theme. */
  mood: string;
  status: ThemeStatus;
};

/**
 * Registry theme — hai trục độc lập với mode (xem docs/DESIGN_SYSTEM.md mục 1).
 *
 * Thêm theme mới gồm ba bước:
 *  1. Thêm bảng màu vào docs/DESIGN_SYSTEM.md.
 *  2. Thêm block CSS variables cho theme đó trong src/styles/tokens.css.
 *  3. Thêm một mục vào danh sách này với status 'available'.
 */
export const themes: Theme[] = [
  {
    id: 'minimalist-editorial',
    label: 'Minimalist Editorial',
    mood: 'Ấm, bình tĩnh, kiểu nhật ký kỹ thuật',
    status: 'available',
  },
  {
    id: 'digital-garden',
    label: 'Digital Garden',
    mood: 'Yên tĩnh, tự nhiên, như một khu vườn tri thức',
    status: 'planned',
  },
];

export const defaultThemeId: ThemeId = 'minimalist-editorial';

/** Theme đã có CSS variables. Bộ chọn theme chỉ hiện khi có từ hai theme trở lên. */
export const availableThemes: Theme[] = themes.filter((theme) => theme.status === 'available');
