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
            XPR Network multi login template
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Build on XPR with EASY and other{' '}
            <a
              href="https://flex.report"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:text-accent hover:underline"
            >
              Flextokens
            </a>
            — balances, swaps, and contract actions. The{' '}
            <span className="text-foreground/90">skill/</span> folder has markdown guides (start with{' '}
            <span className="text-foreground/90">flextokens.md</span>) for chain-wide builds with an AI or by hand.
            Use WebAuth or Anchor, multiple accounts in the header, switch signer, push transactions.
          </p>
        </div>

        <TransactionForm onTransact={transact} isLoggedIn={isLoggedIn} />
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        <p>
          This template is provided by{' '}
          <a
            href="https://alcor.exchange/v/xpr/swap?input=xusdc-xtokens&output=easy-mon3y"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:text-accent hover:underline"
          >
            EASY
          </a>{' '}
          the #1 community altcoin on XPR by{' '}
          <a
            href="https://alcor.exchange/v/xpr/analytics/tokens/easy-mon3y"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:text-accent hover:underline"
          >
            volume
          </a>
          .
        </p>
        <p className="mt-2">Built on XPR Network — Powered by Proton Web SDK</p>
      </footer>
    </div>
  );
};

export default Index;
