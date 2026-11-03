/**
 * Primary navigation — shared by the inline header nav and the mobile sheet menu
 * (docs/design/layout.md, "Header").
 *
 * The brand already links home, so there is no separate "Trang chủ" item.
 */
export type NavItem = {
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: '/labs', label: 'Labs' },
  { href: '/bai-viet', label: 'Bài viết' },
  { href: '/lien-he', label: 'Liên hệ' },
];
