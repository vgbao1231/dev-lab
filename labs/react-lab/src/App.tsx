export type AppProps = {
  title?: string;
};

/**
 * Khung tối thiểu của React Lab.
 * Nội dung thật (bài viết, demo tương tác) sẽ được thêm ở bước sau của giai đoạn 1.
 */
export default function App({ title = 'React Lab' }: AppProps) {
  return (
    <main>
      <h1>{title}</h1>
      <p>
        Khung lab đã sẵn sàng. Xem <code>labs/react-lab/README.md</code> để biết các bước tiếp theo.
      </p>
    </main>
  );
}
