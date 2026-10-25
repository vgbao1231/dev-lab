/**
 * Ước lượng thời gian đọc từ body Markdown.
 *
 * Không cần chính xác tuyệt đối: mục đích là cho người đọc biết bài dài hay ngắn.
 * Bỏ frontmatter (body đã không có), ảnh, link và các dấu Markdown để không đếm
 * URL hay ký hiệu thành từ.
 */
const WORDS_PER_MINUTE = 200;

export const estimateReadingMinutes = (markdown: string | undefined): number => {
  if (!markdown) return 1;

  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 1;

  return Math.max(1, Math.ceil(text.split(' ').length / WORDS_PER_MINUTE));
};
