import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Calendar, 
  Tag, 
  MessageSquare, 
  ShieldCheck, 
  Copy, 
  Check, 
  CheckCheck,
  Clock, 
  Layers, 
  Database,
  Sparkles,
  CircleDot
} from 'lucide-react';
import { Conversation, ConversationStatus } from '../types';
import { 
  getStatusBadge, 
  getTicketTypeBadge, 
  getSeriesBadge, 
  getAvatarColor, 
  getInitials, 
  formatFullDateTime 
} from '../lib/formatters';

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
  onUpdateStatus: (status: ConversationStatus) => void;
  onToggleReadStatus?: () => void;
  isSupabaseConnected: boolean;
}

export const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  onClose,
  onUpdateStatus,
  onToggleReadStatus,
  isSupabaseConnected,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const statusBadge = getStatusBadge(conversation.status);
  const typeBadge = getTicketTypeBadge(conversation.ticket_type);
  const seriesBadge = getSeriesBadge(conversation.series);
  const avatarColor = getAvatarColor(conversation.customer_name);
  const initials = getInitials(conversation.customer_name);

  const handleCopyId = () => {
    navigator.clipboard.writeText(conversation.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <aside
      id="conversation-details-drawer"
      className="w-80 lg:w-88 flex-shrink-0 border-l border-zinc-200 bg-white h-full flex flex-col z-10 select-none animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">
          Детали и классификация тикета
        </h3>
        <button
          id="close-details-drawer-btn"
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Customer Profile Box */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-100">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base border mb-2.5 ${avatarColor.bg} ${avatarColor.text} ${avatarColor.border}`}
          >
            {initials}
          </div>
          <h4 className="font-bold text-sm text-zinc-900">
            {conversation.customer_name}
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            {conversation.customer_email}
          </p>

          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap justify-center">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.classes}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`} />
              {statusBadge.label}
            </span>

            {/* Read / Unread Status Badge */}
            {conversation.unread ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <CircleDot className="w-3 h-3 text-blue-600 animate-pulse" />
                Не прочитано
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCheck className="w-3 h-3 text-emerald-600" />
                Прочитано
              </span>
            )}
          </div>
        </div>

        {/* Product & Classification Box */}
        <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80 space-y-2.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            Классификация HealthyLine
          </label>

          {/* Series */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Серия изделия:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${seriesBadge.classes}`}>
              {seriesBadge.label}
            </span>
          </div>

          {/* Ticket Type */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Тип обращения:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${typeBadge.classes}`}>
              {typeBadge.label}
            </span>
          </div>

          {/* Problem / Issue */}
          <div className="pt-1.5 border-t border-zinc-200/60 text-xs">
            <span className="text-zinc-500 block mb-0.5">Суть проблемы / Тема:</span>
            <span className="font-semibold text-zinc-900 block leading-snug">
              {conversation.issue_description}
            </span>
          </div>
        </div>

        {/* Read / Unread Toggle Button */}
        {onToggleReadStatus && (
          <div>
            <button
              id="details-toggle-read-btn"
              onClick={onToggleReadStatus}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border transition-all ${
                conversation.unread
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200/70'
              }`}
            >
              {conversation.unread ? (
                <>
                  <CheckCheck className="w-4 h-4 text-white" />
                  <span>Отметить как прочитанное</span>
                </>
              ) : (
                <>
                  <CircleDot className="w-4 h-4 text-blue-600" />
                  <span>Пометить как «Не прочитано»</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Manager Actions: Quick Status */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
            Сменить статус диалога
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['open', 'pending', 'resolved'] as ConversationStatus[]).map((status) => (
              <button
                key={status}
                id={`details-status-${status}`}
                onClick={() => onUpdateStatus(status)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                  conversation.status === status
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {getStatusBadge(status).label}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="space-y-3 pt-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            Свойства сессии
          </label>

          {/* Conversation ID */}
          <div className="bg-zinc-50 rounded-lg p-2.5 border border-zinc-200/80">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
              <span>ID диалога</span>
              <button
                id="copy-conv-id-btn"
                onClick={handleCopyId}
                className="text-zinc-400 hover:text-zinc-800 transition-colors flex items-center gap-1"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>
            <code className="text-xs text-zinc-800 font-mono break-all select-all">
              {conversation.id}
            </code>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Создан
            </span>
            <span className="font-medium text-zinc-800 text-right">
              {formatFullDateTime(conversation.created_at)}
            </span>
          </div>

          {/* Last Activity */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Последняя активность
            </span>
            <span className="font-medium text-zinc-800 text-right">
              {formatFullDateTime(conversation.last_message_at || conversation.updated_at)}
            </span>
          </div>

          {/* Storage Origin */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              Источник данных
            </span>
            <span className="font-medium text-zinc-800">
              {isSupabaseConnected ? 'Supabase (Live DB)' : 'Локальный датасет'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {conversation.tags && conversation.tags.length > 0 && (
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Теги
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conversation.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200"
                >
                  <Tag className="w-2.5 h-2.5 text-zinc-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
