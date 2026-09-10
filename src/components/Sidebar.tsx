import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  RefreshCw, 
  SlidersHorizontal, 
  Radio, 
  X, 
  Database,
  Tag,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Layers,
  CheckCheck,
  CircleDot,
  Filter
} from 'lucide-react';
import { 
  Conversation, 
  FilterStatus, 
  FilterType, 
  FilterSeries, 
  SortOption,
  TicketType,
  ProductSeries
} from '../types';
import { 
  formatRelativeTime, 
  getStatusBadge, 
  getTicketTypeBadge, 
  getSeriesBadge, 
  getAvatarColor, 
  getInitials 
} from '../lib/formatters';
const isSupabaseConfigured = true;

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  filterSeries: FilterSeries;
  onFilterSeriesChange: (series: FilterSeries) => void;
  onlyUnread: boolean;
  onToggleOnlyUnread: () => void;
  onToggleReadStatus?: (id: string, currentUnread: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isRealtimeActive: boolean;
  onOpenSetupModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
  filterStatus,
  onFilterChange,
  filterType,
  onFilterTypeChange,
  filterSeries,
  onFilterSeriesChange,
  onlyUnread,
  onToggleOnlyUnread,
  onToggleReadStatus,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onRefresh,
  isLoading,
  isRealtimeActive,
  onOpenSetupModal,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Status filter
    if (filterStatus !== 'all' && c.status !== filterStatus) {
      return false;
    }

    // Type filter (problem, return, inquiry, warranty)
    if (filterType !== 'all' && c.ticket_type !== filterType) {
      return false;
    }

    // Series filter (Platinum, Jet, TAO, Rainbow Chakra, InfraMat Pro)
    if (filterSeries !== 'all' && c.series !== filterSeries) {
      return false;
    }

    // Only unread filter
    if (onlyUnread && !c.unread) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customer_name.toLowerCase().includes(q);
      const matchEmail = c.customer_email.toLowerCase().includes(q);
      const matchLastMsg = (c.last_message || '').toLowerCase().includes(q);
      const matchIssue = (c.issue_description || '').toLowerCase().includes(q);
      const matchSeries = (c.series || '').toLowerCase().includes(q);
      const matchCategory = (c.category || '').toLowerCase().includes(q);
      const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q)) || false;

      return matchName || matchEmail || matchLastMsg || matchIssue || matchSeries || matchCategory || matchTags;
    }

    return true;
  });

  // Sort conversations
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortOption === 'updated') {
      const timeA = new Date(a.last_message_at || a.updated_at).getTime();
      const timeB = new Date(b.last_message_at || b.updated_at).getTime();
      return timeB - timeA;
    }
    if (sortOption === 'newest') {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeB - timeA;
    }
    if (sortOption === 'oldest') {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB;
    }
    return 0;
  });

  // Count calculations
  const totalCount = conversations.length;
  const unreadCount = conversations.filter((c) => c.unread).length;
  const openCount = conversations.filter((c) => c.status === 'open').length;
  const pendingCount = conversations.filter((c) => c.status === 'pending').length;
  const resolvedCount = conversations.filter((c) => c.status === 'resolved').length;

  const problemCount = conversations.filter((c) => c.ticket_type === 'problem').length;
  const returnCount = conversations.filter((c) => c.ticket_type === 'return').length;

  return (
    <aside
      id="admin-sidebar"
      className="w-full md:w-96 lg:w-[410px] flex-shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full z-20 select-none"
    >
      {/* Top Header with HealthyLine Branding */}
      <div className="p-3.5 pb-2.5 border-b border-zinc-100">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 px-2 py-1 rounded-lg bg-white border border-zinc-200/90 flex items-center justify-center shadow-2xs flex-shrink-0">
              <img
                id="healthyline-brand-logo"
                src="https://cdn.shopify.com/s/files/1/0639/6172/7028/files/HealthyLine_logo_909e00d5-5467-4ce1-9ba0-4fc038a1f537.png?v=1735050048"
                alt="HealthyLine Logo"
                referrerPolicy="no-referrer"
                className="h-5 w-auto object-contain max-w-[105px]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm text-zinc-900 leading-tight tracking-tight truncate">
                  HealthyLine
                </h1>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex-shrink-0">
                  Support
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate">
                Панель управления чатами
              </p>
            </div>
          </div>

          {/* Database / Realtime Status Indicator */}
          <button
            id="supabase-status-btn"
            onClick={onOpenSetupModal}
            title={
              isSupabaseConfigured
                ? 'Connected to Supabase (Click for connection details)'
                : 'Preview mode (Click to connect your Supabase database)'
            }
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border transition-colors flex-shrink-0 ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            {isSupabaseConfigured ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">Supabase Live</span>
                <span className="sm:hidden">Live</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3 text-zinc-500" />
                <span className="hidden sm:inline">Supabase Setup</span>
                <span className="sm:hidden">DB</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="sidebar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по клиенту, проблеме, серии (Jet, Platinum)..."
            className="w-full pl-8 pr-8 py-1.5 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-xs text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100/80 p-0.5 rounded-lg text-xs mb-2">
          {[
            { id: 'all', label: 'Все', count: totalCount },
            { id: 'open', label: 'Открыт', count: openCount },
            { id: 'pending', label: 'Ожидает', count: pendingCount },
            { id: 'resolved', label: 'Решён', count: resolvedCount },
          ].map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                onClick={() => onFilterChange(tab.id as FilterStatus)}
                className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-full ${
                    isActive ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category & Series Fast Filter Bar */}
        <div className="space-y-1.5 pt-1 border-t border-zinc-100">
          {/* Row 1: Quick Category / Type Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
            <button
              id="type-filter-all"
              onClick={() => onFilterTypeChange('all')}
              className={`px-2 py-0.5 rounded-md font-medium flex-shrink-0 transition-colors ${
                filterType === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
              }`}
            >
              Все типы
            </button>
            <button
              id="type-filter-problem"
              onClick={() => onFilterTypeChange(filterType === 'problem' ? 'all' : 'problem')}
              className={`px-2 py-0.5 rounded-md font-medium flex-shrink-0 transition-colors border ${
                filterType === 'problem'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100'
              }`}
            >
              ⚠️ Проблема {problemCount > 0 && `(${problemCount})`}
            </button>
            <button
              id="type-filter-return"
              onClick={() => onFilterTypeChange(filterType === 'return' ? 'all' : 'return')}
              className={`px-2 py-0.5 rounded-md font-medium flex-shrink-0 transition-colors border ${
                filterType === 'return'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100'
              }`}
            >
              🔄 Возврат {returnCount > 0 && `(${returnCount})`}
            </button>
            <button
              id="type-filter-warranty"
              onClick={() => onFilterTypeChange(filterType === 'warranty' ? 'all' : 'warranty')}
              className={`px-2 py-0.5 rounded-md font-medium flex-shrink-0 transition-colors border ${
                filterType === 'warranty'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              🛡️ Гарантия
            </button>
            <button
              id="type-filter-inquiry"
              onClick={() => onFilterTypeChange(filterType === 'inquiry' ? 'all' : 'inquiry')}
              className={`px-2 py-0.5 rounded-md font-medium flex-shrink-0 transition-colors border ${
                filterType === 'inquiry'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100'
              }`}
            >
              💬 Вопрос
            </button>
          </div>

          {/* Row 2: Product Series Filter & Unread Filter */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            {/* Series Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 font-medium text-[10px]">Серия:</span>
              <select
                id="series-filter-select"
                value={filterSeries}
                onChange={(e) => onFilterSeriesChange(e.target.value as FilterSeries)}
                className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-[11px] font-semibold rounded-md px-1.5 py-0.5 hover:border-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Все серии (Platinum, Jet, TAO...)</option>
                <option value="Platinum">👑 Platinum Series</option>
                <option value="Jet">⚡ Jet Series</option>
                <option value="TAO">🌿 TAO Series</option>
                <option value="Rainbow Chakra">🌈 Rainbow Chakra</option>
                <option value="InfraMat Pro">🔥 InfraMat Pro</option>
              </select>
            </div>

            {/* Read/Unread Filter Toggle */}
            <button
              id="toggle-unread-filter-btn"
              onClick={onToggleOnlyUnread}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors border text-[11px] ${
                onlyUnread
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              <CircleDot className={`w-3 h-3 ${onlyUnread ? 'text-white' : 'text-blue-600'}`} />
              <span>Непрочитанные</span>
              {unreadCount > 0 && (
                <span className={`text-[10px] px-1 py-0.1 rounded-full ${onlyUnread ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* List Header / Sort & Controls */}
      <div className="px-3.5 py-1.5 border-b border-zinc-100 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50/50">
        <span className="font-medium text-zinc-600 text-[11px]">
          {sortedConversations.length} {sortedConversations.length === 1 ? 'диалог' : 'диалогов'}
          {(searchQuery || filterType !== 'all' || filterSeries !== 'all' || onlyUnread) && ' найдено'}
        </span>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <SlidersHorizontal className="w-3 h-3 mr-1 text-zinc-400" />
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-[11px] text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer focus:outline-none pr-2"
            >
              <option value="updated">По активности</option>
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>

          <button
            id="refresh-conversations-btn"
            onClick={onRefresh}
            disabled={isLoading}
            title="Обновить список чатов"
            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Conversation List Scroll Area */}
      <div id="conversations-scroll-container" className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {sortedConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs font-medium text-zinc-600 mb-1">Нет диалогов по этим фильтрам</p>
            <p className="text-[11px] text-zinc-400 mb-4">
              Попробуйте сбросить поисковый запрос, категорию или фильтр серий.
            </p>
            {(searchQuery || filterStatus !== 'all' || filterType !== 'all' || filterSeries !== 'all' || onlyUnread) && (
              <button
                id="reset-filter-btn"
                onClick={() => {
                  onSearchChange('');
                  onFilterChange('all');
                  onFilterTypeChange('all');
                  onFilterSeriesChange('all');
                  if (onlyUnread) onToggleOnlyUnread();
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 shadow-xs"
              >
                Сбросить все фильтры
              </button>
            )}
          </div>
        ) : (
          sortedConversations.map((chat) => {
            const isSelected = chat.id === selectedId;
            const statusBadge = getStatusBadge(chat.status);
            const typeBadge = getTicketTypeBadge(chat.ticket_type);
            const seriesBadge = getSeriesBadge(chat.series);
            const avatarColor = getAvatarColor(chat.customer_name);
            const initials = getInitials(chat.customer_name);
            const formattedTime = formatRelativeTime(chat.last_message_at || chat.updated_at);

            return (
              <button
                key={chat.id}
                id={`conversation-item-${chat.id}`}
                onClick={() => onSelectConversation(chat.id)}
                className={`w-full text-left p-3 transition-all flex items-start gap-2.5 relative border-l-[3px] ${
                  isSelected
                    ? 'bg-zinc-100/90 hover:bg-zinc-100 border-l-zinc-900 pl-2.5'
                    : chat.unread
                    ? 'bg-blue-50/30 hover:bg-blue-50/60 border-l-blue-500'
                    : 'bg-white hover:bg-zinc-50/80 border-l-transparent'
                }`}
              >
                {/* Avatar with Initials */}
                <div
                  className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs border mt-0.5 ${avatarColor.bg} ${avatarColor.text} ${avatarColor.border}`}
                >
                  {initials}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: Name, Read / Unread Status Badge, Time */}
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-xs text-zinc-900 truncate">
                      {chat.customer_name}
                    </span>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Clear Read / Unread Indicator */}
                      {chat.unread ? (
                        <span 
                          className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs"
                          title="Новое сообщение не прочитано менеджером"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                          Не прочитано
                        </span>
                      ) : (
                        <span 
                          className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] text-zinc-400 font-medium"
                          title="Сообщение прочитано менеджером"
                        >
                          <CheckCheck className="w-3 h-3 text-emerald-600" />
                          <span>Прочитано</span>
                        </span>
                      )}

                      <span className="text-[10px] text-zinc-400 font-medium">
                        {formattedTime}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Customer Email */}
                  <div className="text-[11px] text-zinc-500 truncate mb-1 font-normal">
                    {chat.customer_email}
                  </div>

                  {/* Row 3: Product Series & Ticket Type (Category) Badges */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {/* Series Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${seriesBadge.classes}`}
                    >
                      {seriesBadge.label}
                    </span>

                    {/* Ticket Type (Category / Problem / Return) */}
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium border ${typeBadge.classes}`}
                    >
                      {typeBadge.label}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium border ${statusBadge.classes}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${statusBadge.dotColor}`} />
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Row 4: Problem / Issue Description */}
                  <div className="text-[11px] font-medium text-zinc-800 line-clamp-1 mb-1 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200/60">
                    <span className="text-zinc-500 font-normal">Тема: </span>
                    {chat.issue_description}
                  </div>

                  {/* Row 5: Last Message snippet */}
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal">
                    {chat.last_message || 'Нет сообщений'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-zinc-200/80 bg-zinc-50/80 text-[11px] text-zinc-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Radio
            className={`w-3.5 h-3.5 ${
              isRealtimeActive ? 'text-emerald-600 animate-pulse' : 'text-zinc-400'
            }`}
          />
          <span>{isRealtimeActive ? 'Realtime синхронизация' : 'Режим опроса'}</span>
        </div>
        <span className="text-zinc-400 font-medium">
          HealthyLine Support
        </span>
      </div>
    </aside>
  );
};
