"use client";
import { Component, type ReactNode } from "react";

// কোনো অংশ রেন্ডারে ভাঙলে পুরো পেজ সাদা না হয়ে fallback দেখায়
export class ErrorBoundary extends Component<{ fallback: (reset: () => void) => ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("CVবানাও render error:", error);
  }
  reset = () => this.setState({ failed: false });
  render() {
    return this.state.failed ? this.props.fallback(this.reset) : this.props.children;
  }
}
