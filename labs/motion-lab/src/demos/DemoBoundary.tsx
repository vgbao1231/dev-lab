import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * One broken demo must not take the whole lab down. Wrap each lazily loaded
 * demo in this boundary so the failure stays local and the reader can retry.
 */
export class DemoBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Motion Lab demo failed:', error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="demo-error" role="alert">
          <p>Nội dung này gặp lỗi. Các demo khác vẫn chạy bình thường.</p>
          <button
            type="button"
            className="demo-button"
            onClick={() => this.setState({ error: null })}
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
