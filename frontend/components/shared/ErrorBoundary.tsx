'use client';

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
                  <p className="text-sm text-slate-300">
                    An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                  </p>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-left">
                    <p className="text-xs font-mono text-red-300 break-words">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    <RefreshCw size={16} />
                    Try Again
                  </button>
                  <Link
                    href="/dashboard/student"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Home size={16} />
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
