import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Copy, 
  Check, 
  CheckCheck,
  ExternalLink, 
  Info, 
  Send, 
  MoreVertical, 
  Bot, 
  UserCheck,
  AlertTriangle,
  CircleDot
} from 'lucide-react';
import { Conversation, ConversationStatus } from '../types';
import { 
  getStatusBadge, 
  getTicketTypeBadge, 
  getSeriesBadge, 
  getAvatarColor, 
  getInitials, 
  formatFullDateTime, 
  formatExactTime 
} from '../lib/formatters';

interface ChatHeaderProps {
  conversation: Conversation;
  onUpdateStatus: (newStatus: ConversationStatus) => void;
  onToggleReadStatus?: () => void;
  onToggleDetails: () => void;
  isDetailsOpen: boolean;
  onSimulateMessage: (sender: 'customer' | 'ai') => void;
  onCopyTranscript: () => void;
  copiedTranscript: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onUpdateStatus,
  onToggleReadStatus,
  onToggleDetails,
  isDetailsOpen,
  onSimulateMessage,
  onCopyTranscript,
  copiedTranscript,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSimulateMenu, setShowSimulateMenu] = useState(false);

  const statusBadge = getStatusBadge(conversation.status);
  const typeBadge = getTicketTypeBadge(conversation.ticket_type);
  const seriesBadge = getSeriesBadge(conversation.series);
  const avatarColor = getAvatarColor(conversation.customer_name);
  const initials = getInitials(conversation.customer_name);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(conversation.customer_email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <header 
      id="chat-header" 
      className="border-b border-zinc-200 bg-white flex flex-col z-10 select-none flex-shrink-0"
    >
      {/* Upper Main Header Bar */}
      <div className="h-16 px-5 flex items-center justify-between gap-4">
        {/* Left: Customer Info & Badges */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs border ${avatarColor.bg} ${avatarColor.text} ${avatarColor.border}`}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-zinc-900 truncate">
                {conversation.customer_name}
              </h2>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  id="header-status-toggle"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border transition-colors hover:brightness-95 ${statusBadge.classes}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
                  <span>{statusBadge.label}</span>
                </button>

                {showStatusMenu && (
                  <div 
                    id="status-dropdown-menu"
                    className="absolute left-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-30 text-xs"
                  >
                    {(['open', 'pending', 'resolved'] as ConversationStatus[]).map((st) => (
                      <button
                        key={st}
                        id={`set-status-${st}`}
                        onClick={() => {
                          onUpdateStatus(st);
                          setShowStatusMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-50 capitalize ${
                          conversation.status === st ? 'font-semibold text-zinc-900' : 'text-zinc-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(st).dotColor}`} />
                        {getStatusBadge(st).label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Read / Unread Toggle Badge */}
              {onToggleReadStatus && (
                <button
                  id="toggle-read-status-header-btn"
                  onClick={onToggleReadStatus}
                  title={conversation.unread ? 'Нажмите, чтобы отметить как прочитано' : 'Нажмите, чтобы вернуть в статус "Не прочитано"'}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                    conversation.unread
                      ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 shadow-2xs font-semibold'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {conversation.unread ? (
                    <>
                      <CircleDot className="w-3 h-3 text-blue-600 animate-pulse" />
                      <span>Не прочитано</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Прочитано</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 truncate">
              <span className="truncate">{conversation.customer_email}</span>
              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                title="Скопировать email"
                className="text-zinc-400 hover:text-zinc-700 transition-colors p-0.5 rounded"
              >
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              <span className="text-zinc-300">•</span>
              <span className="text-[11px] text-zinc-400 hidden sm:inline">
                Создан: {formatFullDateTime(conversation.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Realtime Message Simulator for testing live updates */}
          <div className="relative">
            <button
              id="simulate-msg-btn"
              onClick={() => setShowSimulateMenu(!showSimulateMenu)}
              title="Протестировать поступление новых сообщений в реальном времени"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 rounded-lg text-xs font-medium border border-zinc-200/80 transition-colors shadow-xs"
            >
              <Send className="w-3 h-3 text-zinc-500" />
              <span className="hidden md:inline">Тест Realtime</span>
            </button>

            {showSimulateMenu && (
              <div 
                id="simulate-dropdown-menu"
                className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-zinc-200 py-1.5 z-30 text-xs"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Имитация сообщения
                </div>
                <button
                  id="sim-customer-msg"
                  onClick={() => {
                    onSimulateMessage('customer');
                    setShowSimulateMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    К
                  </div>
                  <div>
                    <div className="font-medium text-xs">Ответ клиента</div>
                    <div className="text-[10px] text-zinc-400">Помечает чат непрочитанным</div>
                  </div>
                </button>

                <button
                  id="sim-ai-msg"
                  onClick={() => {
                    onSimulateMessage('ai');
                    setShowSimulateMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                    ИИ
                  </div>
                  <div>
                    <div className="font-medium text-xs">Ответ ИИ-ассистента</div>
                    <div className="text-[10px] text-zinc-400">Мгновенный Realtime-ответ</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Copy Transcript Button */}
          <button
            id="copy-transcript-btn"
            onClick={onCopyTranscript}
            title="Скопировать стенограмму диалога"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium border border-zinc-200 transition-colors shadow-xs"
          >
            {copiedTranscript ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 hidden sm:inline">Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">Копировать стенограмму</span>
              </>
            )}
          </button>

          {/* Toggle Details Panel */}
          <button
            id="toggle-details-btn"
            onClick={onToggleDetails}
            title="Технические детали и свойства диалога"
            className={`p-1.5 rounded-lg border transition-colors ${
              isDetailsOpen
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Structured Classification Bar (Series, Ticket Type, Problem) */}
      <div 
        id="chat-classification-bar" 
        className="px-5 py-2 bg-zinc-50/80 border-t border-zinc-100 flex items-center gap-2.5 flex-wrap text-xs"
      >
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Карточка:
        </span>

        {/* Product Series Badge */}
        <span
          id="chat-series-badge"
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border shadow-2xs ${seriesBadge.classes}`}
        >
          {seriesBadge.label}
        </span>

        {/* Ticket Type Badge (Problem / Return / Warranty / Inquiry) */}
        <span
          id="chat-ticket-type-badge"
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${typeBadge.classes}`}
        >
          {typeBadge.label}
        </span>

        {/* Issue Description */}
        <div 
          id="chat-issue-description"
          className="flex-1 min-w-[200px] flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-zinc-200/90 text-xs font-medium text-zinc-800"
        >
          <span className="text-zinc-400 font-normal text-[11px]">Тема/Проблема:</span>
          <span className="font-semibold text-zinc-900 truncate">{conversation.issue_description}</span>
        </div>
      </div>
    </header>
  );
};
