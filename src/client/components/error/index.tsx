import normalizeException from "normalize-exception";
import React from "react";
import { ScriptErrorPage } from "./error";

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state: {
    error: Error | null;
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI.
    return { error: normalizeException(error) };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("[important] Component crashed:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <ScriptErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}
