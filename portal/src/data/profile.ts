/**
 * Thông tin cá nhân — nguồn duy nhất cho phần portfolio: hero, mục "Về mình", footer và
 * trang liên hệ.
 *
 * Quy tắc: **chỉ khai báo thứ đã được phép hiển thị công khai.** Trường nào để trống thì UI
 * tự bỏ qua — không hiển thị nhãn rỗng, không tạo link chết.
 *
 * Người dùng đã xác nhận cho hiển thị (2026-10-19): tên, vai trò, vị trí, email, GitHub.
 * **Chưa** được phép: LinkedIn, CV, ảnh đại diện.
 *
 * Các trường còn để trống đang chờ dữ liệu: `email`, `about`, `skills`.
 * `projects` đang là hai mục **ví dụ** — thay bằng dự án thật.
 */

export type ProfileLink = {
  label: string;
  href: string;
};

export type ProfileFact = {
  label: string;
  /** Mỗi phần tử là một chip ở cột phải. Rỗng thì cả dòng bị lọc bỏ. */
  items: string[];
};

export type ProfileProject = {
  name: string;
  summary: string;
  stack: string[];
  /** Để trống nếu chưa có bản công khai. */
  href?: string;
};

export type Profile = {
  name: string;
  /** Câu slogan ngắn ở hero (dưới lời chào). Để trống thì hero chỉ còn lời chào và CTA. */
  tagline?: string;
  /**
   * Khẩu hiệu riêng, hiện thành một dòng ghi chú `// …` màu accent ngay dưới `tagline`.
   * Để trống thì không hiện. Hiện tại giữ nguyên bản tiếng Anh.
   */
  slogan?: string;
  /** Hiện ở kicker khối Dev Lab. Bảng facts cố tình không lặp lại vai trò. */
  role?: string;
  /** Nơi ở dạng ngắn, ví dụ `Hà Nội`. */
  location?: string;
  /** Địa chỉ email liên hệ. */
  email?: string;
  /** Mỗi phần tử là một đoạn văn ở mục "Về mình". */
  about: string[];
  /** Kỹ năng chính, hiển thị dạng tag. */
  skills: string[];
  /**
   * Dòng bổ sung cho bảng facts, ngoài **Khu vực**.
   *
   * Mỗi dòng là một nhãn ngắn + vài chip. Viết hoa chữ đầu từng chip và chỉ để **một ý** trong
   * một chip (`Tiếng Anh · TOEIC 940` gộp làm một, `Chạy bộ` tách riêng) — đây là chữ hiển thị
   * cho người đọc, không phải chỗ dán lại ghi chú thô.
   *
   * **Vai trò không nằm ở đây.** Nó đã hiện ở kicker khối Dev Lab; lặp lại trong bảng facts là
   * thừa.
   */
  facts: ProfileFact[];
  /** Link liên hệ công khai (không gồm email — email lấy từ trường `email`). */
  links: ProfileLink[];
  /** Dự án khác, không phải lab trong `labs.ts`. */
  projects: ProfileProject[];
};

export const profile: Profile = {
  name: 'Gura',
  tagline: 'Chỗ tui ghi lại những gì đang học, đang làm và đang tò mò — chậm thôi, nhưng đều.',
  slogan: "The goal isn't to be perfect, but rather to be better than yesterday 🌿",
  role: 'Frontend Engineer',
  location: 'HCM, Việt Nam',
  email: '',
  about: [],
  skills: [],
  facts: [
    { label: 'Ngoại ngữ', items: ['Tiếng Việt', 'Tiếng Anh · TOEIC 940'] },
    { label: 'Nhiên liệu', items: ['Cà phê', 'Đồ ngọt', 'Gura'] },
    { label: 'Ngoài code', items: ['Chạy bộ', 'Cầu lông', 'Nghe nhạc', 'Chơi game'] },
  ],
  links: [{ label: 'GitHub/vgbao1231', href: 'https://github.com/vgbao1231' }],
  /*
   * TẠM: hai dự án ví dụ để xem bố cục danh sách. Cả hai cố tình không có `href` để không tạo
   * link giả — khi có dự án thật, thêm `href` là tên tự thành link.
   * Thay bằng dự án thật rồi xoá hai mục này.
   */
  projects: [
    {
      name: 'Dự án ví dụ · chưa có thật',
      summary: 'Mục mẫu để xem nhịp hàng, cỡ chữ và cách stack hiển thị. Thay bằng dự án thật.',
      stack: ['React', 'TypeScript'],
    },
    {
      name: 'Dự án ví dụ · chưa có thật 2',
      summary: 'Mục mẫu thứ hai để thấy đường kẻ giữa hai hàng và cách stack dài tự xuống dòng.',
      stack: ['Astro', 'Vite', 'Cloudflare'],
    },
  ],
};

/** Repo của chính site này — dùng ở hàng đáy footer. */
export const sourceRepo = 'https://github.com/vgbao1231/dev-lab';

/** Bảng facts ở mục "Về mình": chỉ giữ dòng có chip nào đó. */
export const profileFacts: ProfileFact[] = [
  ...(profile.location ? [{ label: 'Khu vực', items: [profile.location] }] : []),
  ...profile.facts,
].filter((fact) => fact.items.length > 0);

/** Link liên hệ đã sẵn sàng hiển thị: email (nếu có) xếp sau các link còn lại. */
export const profileLinks: ProfileLink[] = [
  ...profile.links,
  ...(profile.email ? [{ label: profile.email, href: `mailto:${profile.email}` }] : []),
];
