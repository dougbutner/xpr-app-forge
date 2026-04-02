/**
 * Header — top nav bar with XPR branding and login/logout button.
 */
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Wallet } from 'lucide-react';

interface HeaderProps {
  actor: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ actor, isLoggedIn, loading, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">X</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">XPR Template</h1>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn && actor && (
          <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{actor}</span>
          </div>
        )}

        {isLoggedIn ? (
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button onClick={onLogin} disabled={loading} size="sm">
            <LogIn className="h-4 w-4" />
            {loading ? 'Restoring…' : 'Connect Wallet'}
          </Button>
        )}
      </div>
    </header>
  );
}
