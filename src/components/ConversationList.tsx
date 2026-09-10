import React from 'react';
import { 
  Sparkles, 
  Headphones, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Copy, 
  Check,
  CheckCheck,
  Calendar,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Conversation, GorgiasFilter } from '../types';

export type DatePeriodFilter = 'all' | 'today' | '7days' | '30days' | 'custom';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  activeFilter: GorgiasFilter;
  onFilterChange: (filter: GorgiasFilter) => void;
  onToggleReadStatus?: (id: string) => void;
  dataSource?: 'n8n' | 'sample';
  dbError?: string | null;
  onRefresh?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
  activeFilter,
  onFilterChange,
  onToggleReadStatus,
  dataSource = 'sample',
  dbError,
  onRefresh,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [datePeriod, setDatePeriod] = React.useState<DatePeriodFilter>('all');
  const [customStartDate, setCustomStartDate] = React.useState<string>('');
  const [customEndDate, setCustomEndDate] = React.useState<string>('');

  // Date period helper
  const isWithinDatePeriod = (dateIso?: string) => {
    if (datePeriod === 'all' || !dateIso) return true;
    const itemDate = new Date(dateIso);
    const now = new Date();

    if (datePeriod === 'today') {
      return itemDate.toDateString() === now.toDateString();
    }
    if (datePeriod === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= sevenDaysAgo;
    }
    if (datePeriod === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return itemDate >= thirtyDaysAgo;
    }
    if (datePeriod === 'custom') {
      let matchesStart = true;
      let matchesEnd = true;
      if (customStartDate) {
        const start = new Date(customStartDate + 'T00:00:00');
        matchesStart = itemDate >= start;
      }
      if (customEndDate) {
        const end = new Date(customEndDate + 'T23:59:59.999');
        matchesEnd = itemDate <= end;
      }
      return matchesStart && matchesEnd;
    }
    return true;
  };

  // 1. Filter by date period first
  const dateFilteredConversations = conversations.filter((c) => 
    isWithinDatePeriod(c.created_at || c.last_message_at)
  );

  // 2. Filter by status tabs
  const filteredConversations = dateFilteredConversations.filter((conv) => {
    if (activeFilter === 'unread') {
      return Boolean(conv.unread);
    }
    if (activeFilter === 'sent_to_gorgias') {
      return Boolean(conv.gorgias_handoff);
    }
    if (activeFilter === 'sent_to_kb') {
      return Boolean(conv.kb_submission);
    }
    if (activeFilter === 'pending_action') {
      return !conv.gorgias_handoff && !conv.kb_submission;
    }
    return true;
  });

  const countAll = dateFilteredConversations.length;
  const countUnread = dateFilteredConversations.filter((c) => Boolean(c.unread)).length;
  const countPending = dateFilteredConversations.filter((c) => !c.gorgias_handoff && !c.kb_submission).length;
  const countGorgias = dateFilteredConversations.filter((c) => Boolean(c.gorgias_handoff)).length;
  const countKB = dateFilteredConversations.filter((c) => Boolean(c.kb_submission)).length;

  const handleCopySessionId = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sessionId);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMin = Math.round((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.round(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div
      id="window-1-conversation-list"
      className="flex flex-col h-full bg-zinc-50 border-r border-zinc-200 select-none overflow-hidden"
    >
      {/* Window Header */}
      <div className="p-3 border-b border-zinc-200 bg-white space-y-2">
        {/* Title & Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dataSource === 'n8n' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Conversations
            </h2>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-600 font-semibold border border-zinc-200">
              {filteredConversations.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                title="Обновить список диалогов"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Error notice if n8n is down */}
        {dbError && (
            <div className="p-2 text-[10px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3"/>
                <span>{dbError}</span>
            </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5 text-[11px]">
          <button
            id="filter-all-btn"
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All ({countAll})
          </button>

          <button
            id="filter-unread-btn"
            onClick={() => onFilterChange('unread')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'unread'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeFilter === 'unread' ? 'bg-white' : 'bg-blue-600'}`} />
            <span>Unread ({countUnread})</span>
          </button>

          <button
            id="filter-pending-btn"
            onClick={() => onFilterChange('pending_action')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'pending_action'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Needs Review ({countPending})
          </button>

          <button
            id="filter-gorgias-btn"
            onClick={() => onFilterChange('sent_to_gorgias')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'sent_to_gorgias'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Headphones className="w-3 h-3" />
            <span>Gorgias ({countGorgias})</span>
          </button>

          <button
            id="filter-kb-btn"
            onClick={() => onFilterChange('sent_to_kb')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'sent_to_kb'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>KB ({countKB})</span>
          </button>
        </div>

        {/* Date Range / Period Selection Bar */}
        <div id="date-range-filter-bar" className="pt-2 border-t border-zinc-100 space-y-1.5">
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <div className="flex items-center gap-1 text-zinc-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Период дат:</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {(['all', 'today', '7days', '30days', 'custom'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  id={`date-filter-btn-${period}`}
                  onClick={() => setDatePeriod(period)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    datePeriod === period
                      ? 'bg-zinc-800 text-white shadow-2xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {period === 'all' && 'Все'}
                  {period === 'today' && 'Сегодня'}
                  {period === '7days' && '7 дн.'}
                  {period === '30days' && '30 дн.'}
                  {period === 'custom' && 'Интервал...'}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Pickers for user selected period */}
          {datePeriod === 'custom' && (
            <div className="flex items-center gap-1.5 p-2 bg-zinc-50 rounded-lg border border-zinc-200 text-[11px]">
              <div className="flex-1 flex items-center gap-1 min-w-0">
                <span className="text-zinc-400 text-[10px] font-medium flex-shrink-0">С:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-[10px] text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                />
              </div>
              <div className="flex-1 flex items-center gap-1 min-w-0">
                <span className="text-zinc-400 text-[10px] font-medium flex-shrink-0">По:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-[10px] text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                />
              </div>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  title="Сбросить даты"
                  className="p-1 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 rounded cursor-pointer flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feed of Conversation / Session IDs */}
      <div 
        id="conversations-feed-scroll"
        className="flex-1 overflow-y-auto divide-y divide-zinc-200/60 p-2 space-y-1.5"
      >
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400 flex flex-col items-center justify-center">
            <MessageSquare className="w-8 h-8 text-zinc-300 mb-2" />
            <span className="font-semibold text-zinc-600">No conversations found</span>
            <span className="text-[11px] text-zinc-400 mt-0.5">Try clearing your search query or filter</span>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            const displaySessionId = conv.session_id || conv.id;

            return (
              <div
                key={conv.id}
                id={`conversation-item-${conv.id}`}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white border-zinc-400/80 shadow-xs ring-1 ring-zinc-400/30'
                    : 'bg-white/80 hover:bg-white border-zinc-200/80 hover:border-zinc-300'
                } ${conv.unread ? 'border-l-4 border-l-blue-600' : ''}`}
              >
                {/* Top Row: Session ID, Read Status & Time */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    {/* Session ID Pill */}
                    <span 
                      className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded tracking-tight flex items-center gap-1 ${
                        isSelected 
                          ? 'bg-zinc-900 text-white' 
                          : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                      }`}
                    >
                      <span>{displaySessionId}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopySessionId(e, displaySessionId)}
                        title="Copy Session ID"
                        className="hover:opacity-75 p-0.5"
                      >
                        {copiedId === displaySessionId ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-60" />
                        )}
                      </button>
                    </span>

                    {/* Unread / Read Status Pill */}
                    {conv.unread ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleReadStatus) onToggleReadStatus(conv.id);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-2xs cursor-pointer transition-colors"
                        title="Кликните, чтобы отметить диалог как прочитанный"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>Не прочитано</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleReadStatus) onToggleReadStatus(conv.id);
                        }}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-zinc-500 hover:text-zinc-700 bg-zinc-100/80 hover:bg-zinc-200/80 border border-zinc-200/60 cursor-pointer transition-colors"
                        title="Кликните, чтобы отметить диалог как непрочитанный"
                      >
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                        <span>Прочитано</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-400 flex-shrink-0 font-medium">
                    {formatRelativeTime(conv.last_message_at || conv.updated_at)}
                  </span>
                </div>

                {/* Customer Name & Topic */}
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className={`text-xs truncate ${conv.unread ? 'font-bold text-zinc-950' : 'font-semibold text-zinc-900'}`}>
                    {conv.customer_name}
                  </span>
                  <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                    {conv.series || conv.category}
                  </span>
                </div>

                {/* Message Snippet */}
                <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2 ${conv.unread ? 'font-medium text-zinc-800' : 'font-normal text-zinc-500'}`}>
                  {conv.last_message || conv.issue_description || 'No message content'}
                </p>

                {/* Status Badges Row (Gorgias / KB Status) */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {conv.gorgias_handoff && (
                    <span 
                      title={`Forwarded to Gorgias on ${new Date(conv.gorgias_handoff.forwarded_at).toLocaleDateString()}`}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      <Headphones className="w-2.5 h-2.5" />
                      <span>{conv.gorgias_handoff.ticket_id}</span>
                    </span>
                  )}

                  {conv.kb_submission && (
                    <span 
                      title="Submitted to AI Knowledge Base"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>KB Improvement</span>
                    </span>
                  )}

                  {!conv.gorgias_handoff && !conv.kb_submission && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600">
                      <span>Ready for review</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
