import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-32">
        {children}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-20 left-0 right-0 pb-3 pt-2 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Built with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
            <span className="font-semibold text-primary">ParamBhaav Technologies</span>
          </p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
