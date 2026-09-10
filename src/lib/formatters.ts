import { ConversationStatus, TicketType, ProductSeries } from '../types';

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (isNaN(date.getTime())) return '';

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 45) return 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatExactTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatFullDateTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string): { bg: string; text: string; border: string } {
  const colors = [
    { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getStatusBadge(status: ConversationStatus) {
  switch (status) {
    case 'open':
      return {
        label: 'Открыт',
        classes: 'bg-blue-50 text-blue-700 border-blue-200/80',
        dotColor: 'bg-blue-500',
      };
    case 'pending':
      return {
        label: 'Ожидает',
        classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dotColor: 'bg-amber-500',
      };
    case 'resolved':
      return {
        label: 'Решён',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dotColor: 'bg-emerald-500',
      };
    case 'closed':
      return {
        label: 'Закрыт',
        classes: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        dotColor: 'bg-zinc-400',
      };
  }
}

export function getTicketTypeBadge(type: TicketType) {
  switch (type) {
    case 'problem':
      return {
        label: 'Проблема',
        classes: 'bg-rose-50 text-rose-700 border-rose-200',
        iconType: 'alert',
      };
    case 'return':
      return {
        label: 'Возврат',
        classes: 'bg-purple-50 text-purple-700 border-purple-200',
        iconType: 'rotate',
      };
    case 'warranty':
      return {
        label: 'Гарантия',
        classes: 'bg-amber-50 text-amber-800 border-amber-200',
        iconType: 'shield',
      };
    case 'shipping':
      return {
        label: 'Доставка',
        classes: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        iconType: 'truck',
      };
    case 'inquiry':
    default:
      return {
        label: 'Вопрос',
        classes: 'bg-sky-50 text-sky-700 border-sky-200',
        iconType: 'help',
      };
  }
}

export function getSeriesBadge(series: ProductSeries) {
  switch (series) {
    case 'Platinum':
      return {
        label: 'Platinum Series',
        classes: 'bg-zinc-900 text-amber-300 border-zinc-700',
        shortLabel: 'Platinum',
      };
    case 'Jet':
      return {
        label: 'Jet Series',
        classes: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
        shortLabel: 'Jet',
      };
    case 'TAO':
      return {
        label: 'TAO Series',
        classes: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        shortLabel: 'TAO',
      };
    case 'Rainbow Chakra':
      return {
        label: 'Rainbow Chakra',
        classes: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
        shortLabel: 'Rainbow',
      };
    case 'InfraMat Pro':
      return {
        label: 'InfraMat Pro',
        classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        shortLabel: 'InfraMat',
      };
    case 'Accessories':
    default:
      return {
        label: 'Аксессуары',
        classes: 'bg-zinc-100 text-zinc-700 border-zinc-200',
        shortLabel: 'Аксессуар',
      };
  }
}
