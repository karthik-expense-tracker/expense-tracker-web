import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Please reload the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}