import React, { useState } from 'react';
import {
  X,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { N8N_API_BASE_URL, GATEWAY_AUTH_TOKEN } from '../lib/api';

interface GatewaySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
  onRefreshData: () => void;
}

export const GatewaySetupModal: React.FC<GatewaySetupModalProps> = ({
  isOpen,
  onClose,
  isConfigured,
  onRefreshData,
}) => {
  const [apiUrl, setApiUrl] = useState(N8N_API_BASE_URL || '/webhook');
  const [authToken, setAuthToken] = useState(GATEWAY_AUTH_TOKEN || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const cleanUrl = apiUrl.replace(/\/+$/, '');
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${cleanUrl}/chats?limit=1`, {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        setTestResult({
          success: true,
          message: `Успешно! n8n шлюз ответил кодом ${res.status}. Доступ к /webhook/chats активен.`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Шлюз вернул HTTP ${res.status} (${res.statusText}). Проверьте, включен ли Webhook в n8n.`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Ошибка соединения: ${err.message}. Убедитесь, что n8n запущен и доступен по указанному URL.`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('N8N_API_BASE_URL', apiUrl.trim());
      if (authToken.trim()) {
        localStorage.setItem('N8N_GATEWAY_AUTH_TOKEN', authToken.trim());
      } else {
        localStorage.removeItem('N8N_GATEWAY_AUTH_TOKEN');
      }
    }
    onRefreshData();
    onClose();
  };

  const handleResetToDefault = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('N8N_API_BASE_URL');
      localStorage.removeItem('N8N_GATEWAY_AUTH_TOKEN');
    }
    setApiUrl('/webhook');
    setAuthToken('');
    setTestResult(null);
    onRefreshData();
  };

  return (
    <div
      id="gateway-setup-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="gateway-setup-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                <span>Подключение шлюза n8n / Nginx</span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Zero Supabase Frontend
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Прямая работа через эндпоинты <code className="bg-zinc-200 px-1 py-0.5 rounded text-[10px]">/webhook/chats</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-600 leading-relaxed">
          {/* Architecture Banner */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block text-purple-900">
                Безопасная архитектура Backend for Frontend (BFF)
              </span>
              <p className="text-[11px] text-purple-900/80 leading-relaxed">
                Фронтенд полностью изолирован: он обращается только к вашему защищенному API-шлюзу n8n.
                Все ключи Supabase хранятся внутри самого n8n и никогда не попадают в браузер пользователя.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Базовый URL вебхука n8n (API Base URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://app.healthyline.com/webhook или /webhook"
                  className="w-full px-3 py-2 bg-white text-xs text-zinc-900 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 font-mono"
                />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                По умолчанию: <code className="bg-zinc-200 px-1 py-0.5 rounded text-[10px]">/webhook</code> (относительный путь при проксировании через Nginx) или полный адрес вашего n8n сервера.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Токен авторизации шлюза (Gateway Bearer Token / Опционально)
              </label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Секретный токен для заголовка Authorization (если включен в n8n)"
                className="w-full px-3 py-2 bg-white text-xs text-zinc-900 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 font-mono"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Если в Webhook n8n настроена Header Auth или Bearer Auth, укажите токен здесь.
              </p>
            </div>

            {/* Test result display */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>{isTesting ? 'Проверка связи...' : 'Тест соединения (/chats)'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-1.5 text-zinc-500 hover:text-zinc-700 text-xs transition-colors cursor-pointer"
              >
                Сбросить на значение по умолчанию
              </button>
            </div>
          </div>

          {/* n8n Endpoints Specification */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              <span>Ожидаемые эндпоинты в n8n:</span>
            </h3>
            <div className="bg-zinc-900 text-zinc-100 rounded-xl p-3 font-mono text-[11px] space-y-2">
              <div>
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-zinc-300">/webhook/chats</span>
                <span className="text-zinc-500 ml-2">→ Возвращает список всех диалогов клиентов</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-zinc-300">/webhook/chats/:id</span>
                <span className="text-zinc-500 ml-2">→ Возвращает сообщения конкретного чата</span>
              </div>
              <div>
                <span className="text-blue-400 font-bold">POST</span>{' '}
                <span className="text-zinc-300">/webhook/chats/:id/read</span>
                <span className="text-zinc-500 ml-2">→ Помечает чат прочитанным</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <span className="text-[11px] text-zinc-400">
            Сохраняется в памяти браузера
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm transition-all"
            >
              Применить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
