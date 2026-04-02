/**
 * Index page — main template page composing Header + TransactionForm.
 */
import { Header } from '@/components/Header';
import { TransactionForm } from '@/components/TransactionForm';
import { useProton } from '@/hooks/useProton';

const Index = () => {
  const { actor, isLoggedIn, loading, login, logout, transact } = useProton();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        actor={actor}
        isLoggedIn={isLoggedIn}
        loading={loading}
        onLogin={login}
        onLogout={logout}
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            XPR Network Template
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            A minimal starter for building apps on XPR Network. Connect your wallet and interact with smart contracts.
          </p>
        </div>

        <TransactionForm onTransact={transact} isLoggedIn={isLoggedIn} />
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        Built on XPR Network — Powered by Proton Web SDK
      </footer>
    </div>
  );
};

export default Index;
