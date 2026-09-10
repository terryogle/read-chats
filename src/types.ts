export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed';

export type TicketType = 'problem' | 'return' | 'inquiry' | 'warranty' | 'shipping';

export type ProductSeries = 'Platinum' | 'Jet' | 'TAO' | 'Rainbow Chakra' | 'InfraMat Pro' | 'Accessories';

export type SenderType = 'customer' | 'ai' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  created_at: string;
  model_name?: string;
  is_read?: boolean;
  read_at?: string | null;
  metadata?: {
    sentiment?: 'positive' | 'neutral' | 'frustrated';
    category?: string;
    tokens?: number;
    latency_ms?: number;
  };
}

export interface KnowledgeBaseLink {
  id: string;
  url: string;
  title?: string;
}

export interface KnowledgeBaseSubmission {
  id: string;
  submitted_at: string;
  comment: string;
  links: KnowledgeBaseLink[];
  category?: string;
  submitted_by?: string;
  status: 'pending_review' | 'integrated' | 'rejected';
}

export interface GorgiasHandoff {
  ticket_id: string;
  forwarded_at: string;
  forwarded_by: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  department: string;
  internal_note?: string;
}

export interface Conversation {
  id: string; // Session / Conversation ID (e.g. ses_89104 or gor_chat_4019)
  session_id: string; // Display Session ID
  customer_name: string;
  customer_email: string;
  customer_avatar?: string;
  status: ConversationStatus;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  category: string;
  ticket_type: TicketType;
  series?: ProductSeries;
  issue_description: string;
  tags?: string[];
  messages_count?: number;
  unread: boolean;
  read_at?: string | null;
  // Gorgias forwarding status
  gorgias_handoff?: GorgiasHandoff;
  // AI Knowledge Base submission status
  kb_submission?: KnowledgeBaseSubmission;
}

export type GorgiasFilter = 'all' | 'unread' | 'pending_action' | 'sent_to_gorgias' | 'sent_to_kb';

export type FilterStatus = 'all' | 'open' | 'pending' | 'resolved';
export type FilterType = 'all' | 'problem' | 'return' | 'inquiry' | 'warranty';
export type FilterSeries = 'all' | 'Platinum' | 'Jet' | 'TAO' | 'Rainbow Chakra' | 'InfraMat Pro';
export type SortOption = 'newest' | 'oldest' | 'updated';

export interface SupabaseConfigState {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
  realtimeActive: boolean;
  lastRealtimeEvent?: {
    table: string;
    type: string;
    timestamp: string;
  };
}

export interface AdminUser {
  username: string;
  email: string;
  role: 'superadmin' | 'support_manager' | 'agent';
  authenticated_at: string;
  auth_method: 'master_credentials' | 'supabase_auth';
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expires_at: number;
}
