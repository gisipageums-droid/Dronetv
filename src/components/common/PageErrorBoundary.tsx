import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// A render crash anywhere in the wrapped tree (e.g. a company/professional
// profile with an unexpected data shape) used to unmount the whole app with
// no fallback - the user just saw a permanently blank page. This catches it
// and shows a real message with a way back instead.
export default class PageErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Page render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-main px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-ink mb-3">This page couldn't load</h2>
            <p className="text-ink-paragraph mb-6">
              Something went wrong showing this content. Please try again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-lg bg-brand-yellow text-ink font-bold hover:bg-brand-gold transition"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-5 py-2.5 rounded-lg border border-ink-light text-ink font-bold hover:bg-ink-offwhite transition"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
