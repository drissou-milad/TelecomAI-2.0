import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TelecomAI ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {this.props.fallbackTitle || 'Component Encountered an Issue'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {this.state.error?.message || 'A runtime error occurred while rendering this module.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover & Refresh</span>
              </button>
              {this.props.onReset && (
                <button
                  onClick={this.props.onReset}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
