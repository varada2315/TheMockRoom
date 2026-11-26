import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4 shadow-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Something went unexpected</h2>
          <p className="text-sm text-muted-foreground max-w-md mt-2 mb-6">
            An issue occurred while rendering this page ({this.state.error?.message || 'Unknown error'}).
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={() => window.location.reload()} className="gap-2 rounded-xl">
              <RefreshCw className="w-4 h-4" /> Reload Portal
            </Button>
            <Button variant="outline" onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="rounded-xl">
              Reset Session
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
