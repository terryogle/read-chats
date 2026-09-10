import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  KeyRound, 
  Database, 
  AlertTriangle, 
  Github, 
  Fingerprint, 
  LogOut 
} from 'lucide-react';
import { AdminUser } from '../types';

interface SecurityGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
  isSupabaseConfigured: boolean;
}

export const SecurityGuideModal: React.FC<SecurityGuideModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  isSupabaseConfigured,
}) => {
  const [copiedRlsSql, setCopiedRlsSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const RLS_HARDENED_SQL = `-- 🔒 PRODUCTION RLS POLICIES FOR HEALTHYLINE CHAT PRIVACY:
-- Run this in Supabase SQL Editor to guarantee customer conversations & messages
-- are ONLY accessible to authenticated staff, preventing data leaks via public GitHub repos:

-- 1. Ensure RLS is active on tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop any overly permissive public policies
DROP POLICY IF EXISTS "Allow public read access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public update access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public insert to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public read access to messages" ON public.messages;
DROP POLICY IF EXISTS "Allow public insert to messages" ON public.messages;

-- 3. Restrict administrative read/write strictly to authenticated staff:
CREATE POLICY "Authenticated staff can read all conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated staff can update conversations"
ON public.conversations FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated staff can read all messages"
ON public.messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff or webhook can insert messages"
ON public.messages FOR INSERT
TO authenticated, service_role
WITH CHECK (true);
`;

  const ENV_CONFIG_SAMPLE = `# In your local .env.local file (NEVER committed to Git):
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...

# Set your private manager credentials:
VITE_ADMIN_USERNAME=my_secret_manager_name
VITE_ADMIN_PASSWORD=MyUltraSecurePass2026!#$
`;

  const handleCopyRls = () => {
    navigator.clipboard.writeText(RLS_HARDENED_SQL);
    setCopiedRlsSql(true);
    setTimeout(() => setCopiedRlsSql(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(ENV_CONFIG_SAMPLE);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div
      id="security-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="security-guide-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">
                Защита данных клиентов и безопасность GitHub
              </h2>
              <p className="text-xs text-zinc-500">
                Гарантия конфиденциальности диалогов при публичном репозитории
              </p>
            </div>
          </div>
          <button
            id="close-security-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-zinc-600 leading-relaxed">
          {/* Active Session Info Box */}
          {currentUser && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 text-xs flex items-center gap-2">
                    <span>{currentUser.username}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Авторизован: {new Date(currentUser.authenticated_at).toLocaleTimeString()} ({currentUser.auth_method})
                  </div>
                </div>
              </div>

              <button
                id="security-modal-logout-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold shadow-2xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Завершить сессию</span>
              </button>
            </div>
          )}

          {/* 3 Rules for Public GitHub Safety */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-zinc-800" />
              <span>3 золотых правила безопасности в открытом GitHub:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>.gitignore защита</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Файлы <code className="bg-zinc-200 px-1 py-0.2 rounded text-[10px]">.env</code> и <code className="bg-zinc-200 px-1 py-0.2 rounded text-[10px]">.env.local</code> внесены в <code className="text-zinc-800 font-mono">.gitignore</code>. Ваши секретные пароли и токены никогда не попадут в репозиторий.
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Только Anon Key</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  В клиентском коде используется только публичный <code className="text-zinc-800 font-mono">anon_key</code>. Ключ <code className="text-rose-700 font-semibold">service_role</code> строго запрещено помещать в репозиторий!
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Supabase RLS</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Политики Row Level Security блокируют доступ к данным для посторонних лиц. Даже зная URL и Anon-ключ, никто не сможет выгрузить переписку клиентов.
                </p>
              </div>
            </div>
          </div>

          {/* Hardened RLS SQL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>SQL-запрос для максимальной защиты (RLS)</span>
              </h3>
              <button
                id="copy-rls-sql-btn"
                onClick={handleCopyRls}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {copiedRlsSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRlsSql ? 'Скопировано' : 'Копировать SQL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mb-2">
              Выполните этот скрипт в разделе <strong>SQL Editor</strong> в вашей панели Supabase, чтобы полностью закрыть публичный доступ к переписке:
            </p>
            <pre className="p-3 bg-zinc-900 text-zinc-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-zinc-800">
              {RLS_HARDENED_SQL}
            </pre>
          </div>

          {/* Custom Credentials Configuration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-zinc-700" />
                <span>Настройка собственного логина и пароля</span>
              </h3>
              <button
                id="copy-env-sample-btn"
                onClick={handleCopyEnv}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 hover:text-zinc-900"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Скопировано' : 'Копировать .env'}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mb-2">
              Чтобы задать свои уникальные учетные данные администратора, укажите их в локальном файле <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono">.env.local</code>:
            </p>
            <pre className="p-3 bg-zinc-100 text-zinc-800 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-200">
              {ENV_CONFIG_SAMPLE}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs">
          <div className="text-[11px] text-zinc-400">
            HealthyLine Zero-Trust Security Standard
          </div>
          <button
            id="close-security-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-2xs"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
