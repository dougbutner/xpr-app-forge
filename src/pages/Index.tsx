/**
 * Index page — main template page composing Header + TransactionForm.
 */
import { Header } from '@/components/Header';
import { TransactionForm } from '@/components/TransactionForm';
import { useProton } from '@/hooks/useProton';

const Index = () => {
  const {
    actor,
    isLoggedIn,
    loading,
    wallets,
    activeId,
    addWebAuthWallet,
    addAnchorWallet,
    setActive,
    removeWallet,
    disconnectAll,
    transact,
  } = useProton();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        actor={actor}
        isLoggedIn={isLoggedIn}
        loading={loading}
        wallets={wallets}
        activeId={activeId}
        onAddWebAuth={addWebAuthWallet}
        onAddAnchor={addAnchorWallet}
        onSetActive={setActive}
        onRemoveWallet={removeWallet}
        onDisconnectAll={disconnectAll}
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            XPR Network Template
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            A minimal starter for building apps on XPR Network. Use WebAuth or Anchor to connect,
            add multiple accounts from the header menu, switch the active signer, and push transactions.
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
