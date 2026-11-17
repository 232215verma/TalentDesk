import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Luma render error:', error);
  }

  render() {
    if (this.state.failed) {
      return <main style={{ minHeight: '100vh', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 12, padding: 24, background: '#f7f6f2', color: '#292b25', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <span style={{ color: '#df8058', fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>LUMA</span>
        <h1 style={{ margin: 0, fontSize: 24 }}>This page needs a refresh.</h1>
        <p style={{ maxWidth: 360, color: '#77786f', lineHeight: 1.5 }}>The app hit a display error. Refresh the page. If it happens again, check the browser Console and the VS Code terminal.</p>
        <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 7, padding: '11px 16px', background: '#d77b55', color: '#fff', cursor: 'pointer' }}>Refresh app</button>
      </main>;
    }
    return this.props.children;
  }
}
