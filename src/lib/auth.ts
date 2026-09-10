import { AdminUser, AuthSession } from '../types';

const SESSION_STORAGE_KEY = 'hl_admin_auth_session';
const FAILED_ATTEMPTS_KEY = 'hl_admin_failed_attempts';
const LOCKOUT_UNTIL_KEY = 'hl_admin_lockout_until';

// Configured credentials from environment or local overrides
export const DEFAULT_ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'healthyline_admin').trim();
export const DEFAULT_ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || 'HealthyLine2026!Secure').trim();

// Maximum allowed consecutive failed attempts before temporary lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout
const SESSION_LIFETIME_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Compute SHA-256 hash using the Web Crypto API
 */
export async function sha256(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the login screen is currently locked out due to failed attempts
 */
export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const lockoutUntilStr = sessionStorage.getItem(LOCKOUT_UNTIL_KEY);
    if (!lockoutUntilStr) return { isLocked: false, remainingSeconds: 0 };

    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const now = Date.now();

    if (now < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    } else {
      // Lockout expired, reset counters
      sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
      return { isLocked: false, remainingSeconds: 0 };
    }
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(): { attemptsLeft: number; isNowLocked: boolean } {
  try {
    const current = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, current.toString());

    if (current >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
      return { attemptsLeft: 0, isNowLocked: true };
    }

    return { attemptsLeft: MAX_FAILED_ATTEMPTS - current, isNowLocked: false };
  } catch {
    return { attemptsLeft: 1, isNowLocked: false };
  }
}

/**
 * Clear failed attempts on successful login
 */
export function clearFailedAttempts(): void {
  try {
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Verify credentials and start session
 */
export async function authenticateAdmin(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  // Check lockout
  const { isLocked, remainingSeconds } = getLockoutStatus();
  if (isLocked) {
    return {
      success: false,
      error: `Превышено количество попыток. Вход заблокирован на ${remainingSeconds} сек.`,
    };
  }

  const cleanUser = usernameInput.trim();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Пожалуйста, введите имя пользователя и пароль' };
  }

  // Check against Master Admin Credentials
  const isUserValid =
    cleanUser.toLowerCase() === DEFAULT_ADMIN_USERNAME.toLowerCase() ||
    cleanUser.toLowerCase() === 'admin@healthyline.com' ||
    cleanUser.toLowerCase() === 'admin' ||
    cleanUser.toLowerCase() === 'boss';

  const isPassValid = cleanPass === DEFAULT_ADMIN_PASSWORD;

  if (isUserValid && isPassValid) {
    clearFailedAttempts();
    const user: AdminUser = {
      username: cleanUser,
      email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@healthyline.com`,
      role: 'superadmin',
      authenticated_at: new Date().toISOString(),
      auth_method: 'master_credentials',
    };

    const sessionToken = await sha256(`${cleanUser}-${cleanPass}-${Date.now()}`);

    const session: AuthSession = {
      user,
      token: sessionToken,
      expires_at: Date.now() + SESSION_LIFETIME_MS,
    };

    saveSession(session);
    return { success: true, session };
  }

  // Failed login
  const { attemptsLeft, isNowLocked } = recordFailedAttempt();
  if (isNowLocked) {
    return {
      success: false,
      error: 'Превышено число попыток! Система временно заблокирована на 60 секунд.',
    };
  }

  return {
    success: false,
    error: `Неверные учетные данные. Осталось попыток: ${attemptsLeft}`,
  };
}

/**
 * Save session to sessionStorage
 */
export function saveSession(session: AuthSession): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

/**
 * Retrieve and validate current active session
 */
export function getActiveSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session || !session.expires_at) return null;

    // Check expiration
    if (Date.now() > session.expires_at) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Log out and clear session
 */
export async function logoutAdmin(): Promise<void> {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore errors during logout
  }
}
