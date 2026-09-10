import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  KeyRound, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  HelpCircle,
  Database,
  Fingerprint
} from 'lucide-react';
import { AuthSession } from '../types';
import { 
  authenticateAdmin, 
  getLockoutStatus, 
  DEFAULT_ADMIN_USERNAME, 
  DEFAULT_ADMIN_PASSWORD 
} from '../lib/auth';

interface AdminLoginGateProps {
  onLoginSuccess: (session: AuthSession) => void;
  isSupabaseConfigured: boolean;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onLoginSuccess,
  isSupabaseConfigured,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [showSecurityAdvisory, setShowSecurityAdvisory] = useState(false);

  // Check lockout status on mount and count down
  useEffect(() => {
    const checkLockout = () => {
      const status = getLockoutStatus();
      if (status.isLocked) {
        setLockoutRemaining(status.remainingSeconds);
      } else {
        setLockoutRemaining(0);
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (lockoutRemaining > 0) return;

    setIsLoading(true);

    try {
      const result = await authenticateAdmin(username, password);

      if (result.success && result.session) {
        onLoginSuccess(result.session);
      } else {
        setErrorMessage(result.error || 'Ошибка входа. Проверьте имя пользователя и пароль.');
      }
    } catch {
      setErrorMessage('Произошла непредвиденная ошибка при проверке подлинности.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setUsername(DEFAULT_ADMIN_USERNAME);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setErrorMessage(null);
  };

  return (
    <div
      id="admin-login-gate"
      className="min-h-screen w-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 flex flex-col items-center justify-center p-4 selection:bg-zinc-900 selection:text-white"
    >
      {/* Brand Header & Lock Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200/90 overflow-hidden">
        {/* Top Accent Band */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-zinc-800 to-blue-600" />

        <div className="p-7">
          {/* HealthyLine Logo & Shield Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center mb-3.5">
              <img
                id="login-brand-logo"
                src="https://cdn.shopify.com/s/files/1/0639/6172/7028/files/HealthyLine_logo_909e00d5-5467-4ce1-9ba0-4fc038a1f537.png?v=1735050048"
                alt="HealthyLine Logo"
                referrerPolicy="no-referrer"
                className="h-6 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Защищённый шлюз авторизации</span>
            </div>

            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
              HealthyLine Support Admin
            </h1>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Вход для уполномоченных менеджеров поддержки и операторов тикетов
            </p>
          </div>

          {/* Lockout Warning */}
          {lockoutRemaining > 0 && (
            <div
              id="login-lockout-alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Система временно заблокирована</span>
                <span>Слишком много неверных попыток. Повторный ввод возможен через {lockoutRemaining} сек.</span>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errorMessage && lockoutRemaining === 0 && (
            <div
              id="login-error-alert"
              className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label 
                htmlFor="admin-username-input"
                className="block text-xs font-semibold text-zinc-700 mb-1.5"
              >
                Имя пользователя или Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="healthyline_admin или email"
                  required
                  disabled={isLoading || lockoutRemaining > 0}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-xs text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/15 focus:border-zinc-500 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password-input"
                  className="block text-xs font-semibold text-zinc-700"
                >
                  Пароль администратора
                </label>
                <span className="text-[10px] text-zinc-400 font-mono">SHA-256 Hashed</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading || lockoutRemaining > 0}
                  className="w-full pl-9 pr-9 py-2 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-xs text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/15 focus:border-zinc-500 transition-all font-mono disabled:opacity-60"
                />
                <button
                  type="button"
                  id="toggle-show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading || lockoutRemaining > 0}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Проверка полномочий...</span>
                </>
              ) : lockoutRemaining > 0 ? (
                <span>Блокировка ({lockoutRemaining}с)</span>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Войти в систему управления</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Тестовый вход для проверки:</span>
            <button
              id="quick-fill-demo-btn"
              type="button"
              onClick={handleQuickDemoFill}
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              Вставить демо-данные
            </button>
          </div>
        </div>

        {/* Security & GitHub Advisory Drawer */}
        <div className="bg-zinc-50/90 border-t border-zinc-100 p-4">
          <button
            id="toggle-security-advisory-btn"
            type="button"
            onClick={() => setShowSecurityAdvisory(!showSecurityAdvisory)}
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-700 hover:text-zinc-900"
          >
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
              <span>Защита данных клиентов и открытый GitHub</span>
            </span>
            {showSecurityAdvisory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSecurityAdvisory && (
            <div className="mt-3 text-[11px] text-zinc-600 space-y-2 leading-relaxed animate-in fade-in">
              <p>
                <strong>Как защищены ваши данные:</strong>
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-zinc-600">
                <li>
                  <span className="font-medium text-zinc-800">Шлюз аутентификации:</span> Любой посетитель сайта или репозитория без пароля видит только этот экран блокировки, не имея доступа к списку чатов и текстам клиентов.
                </li>
                <li>
                  <span className="font-medium text-zinc-800">Supabase Row Level Security (RLS):</span> В базе данных включены политики RLS. Даже если кто-то извлечет публичный ключ (Anon Key), база запрещает неавторизованные запросы к таблицам.
                </li>
                <li>
                  <span className="font-medium text-zinc-800">Секретные ключи:</span> Файл <code className="bg-zinc-200 px-1 py-0.5 rounded text-[10px]">.env.local</code> находится в <code className="bg-zinc-200 px-1 py-0.5 rounded text-[10px]">.gitignore</code> и никогда не попадает в публичный репозиторий GitHub.
                </li>
                <li>
                  <span className="font-medium text-zinc-800">Защита от подбора:</span> После 5 неудачных попыток форма блокируется на 60 секунд.
                </li>
              </ul>

              <div className="p-2 bg-white rounded border border-zinc-200 text-[10px] text-zinc-500 font-mono mt-2">
                Демо-доступ: login: <strong className="text-zinc-800">{DEFAULT_ADMIN_USERNAME}</strong> / pass: <strong className="text-zinc-800">{DEFAULT_ADMIN_PASSWORD}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center text-[11px] text-zinc-400">
        HealthyLine Compliance & Security Protocols • 256-Bit TLS
      </div>
    </div>
  );
};
