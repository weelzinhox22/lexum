import type { ReactNode } from 'react';
import { SidebarProvider } from '../contexts/SidebarContext';
import AppSidebar, { type ModuleSectionNav } from './AppSidebar';
import MobileMenuHeader from './MobileMenuHeader';

interface AppShellProps {
  children: ReactNode;
  userName?: string;
  userEmail?: string | null;
  onLogout?: () => void;
  loggingOut?: boolean;
  moduleSections?: ModuleSectionNav[];
  moduleProgressLabel?: string;
  moduleProgressPct?: number;
  mainClassName?: string;
}

function AppShellInner({ children, userName, userEmail, onLogout, loggingOut, moduleSections, moduleProgressLabel, moduleProgressPct, mainClassName }: AppShellProps) {
  const isAuthenticated = !!onLogout;

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <MobileMenuHeader
          userName={userName}
          userEmail={userEmail}
          onLogout={onLogout}
          loggingOut={loggingOut}
        />
      )}
      {isAuthenticated && (
        <AppSidebar
          userName={userName}
          userEmail={userEmail}
          onLogout={onLogout}
          loggingOut={loggingOut}
          moduleSections={moduleSections}
          moduleProgressLabel={moduleProgressLabel}
          moduleProgressPct={moduleProgressPct}
        />
      )}
      <main className={`app-shell-main ${mainClassName}`.trim()}>{children}</main>
    </div>
  );
}

export default function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellInner {...props} />
    </SidebarProvider>
  );
}
