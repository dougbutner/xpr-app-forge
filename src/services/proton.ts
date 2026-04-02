/**
 * Proton Web SDK wrapper — handles login, logout, session restore, and transact.
 * Abstracts all blockchain interaction behind simple async functions.
 */
import ConnectWallet from '@proton/web-sdk';

const APP_NAME = 'XPR Template';
const REQUEST_ACCOUNT = 'xpr.template';

// Chain endpoints for XPR Network mainnet
const CHAIN_ENDPOINTS = ['https://proton.greymass.com'];

export interface ProtonSession {
  auth: { actor: string; permission: string };
  link: any;
  session: any;
}

/**
 * Connect wallet — opens the Proton login modal.
 * @param restoreSession If true, silently restores a previous session.
 */
export async function login(restoreSession = false): Promise<ProtonSession | null> {
  try {
    const { link, session } = await ConnectWallet({
      linkOptions: {
        endpoints: CHAIN_ENDPOINTS,
        restoreSession,
      },
      transportOptions: {
        requestAccount: REQUEST_ACCOUNT,
      },
      selectorOptions: {
        appName: APP_NAME,
      } as any,
    });

    if (!session) return null;

    return {
      auth: {
        actor: String(session.auth.actor),
        permission: String(session.auth.permission),
      },
      link,
      session,
    };
  } catch (err) {
    // User cancelled or no previous session when restoring
    if (restoreSession) return null;
    console.error('Login failed:', err);
    throw err;
  }
}

/**
 * Logout — removes the session from local storage and the link.
 */
export async function logout(session: ProtonSession): Promise<void> {
  try {
    await session.link.removeSession(REQUEST_ACCOUNT, session.session.auth, session.session.chainId);
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

/**
 * Transact — push one or more actions to the blockchain.
 * This is the core function apps will use to interact with smart contracts.
 *
 * @param session  Active ProtonSession
 * @param actions  Array of action objects: { account, name, data }
 * @returns        Transaction result
 */
export async function transact(
  session: ProtonSession,
  actions: Array<{
    account: string;
    name: string;
    data: Record<string, any>;
    authorization?: Array<{ actor: string; permission: string }>;
  }>
) {
  // Auto-fill authorization from the session if not provided
  const filledActions = actions.map((action) => ({
    ...action,
    authorization: action.authorization || [
      {
        actor: session.auth.actor,
        permission: session.auth.permission,
      },
    ],
  }));

  try {
    const result = await session.session.transact(
      { actions: filledActions },
      { broadcast: true }
    );
    return result;
  } catch (err) {
    console.error('Transaction failed:', err);
    throw err;
  }
}
