import { Conversation, Message, ConversationStatus, TicketType, ProductSeries } from '../types';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../data/sampleData';

/**
 * n8n Backend-for-Frontend (BFF) API Gateway Client
 *
 * All requests are routed through n8n / Nginx API gateway:
 * - GET /api/chats
 * - GET /api/chat?id={conversation_id}
 *
 * Frontend has ZERO knowledge of Supabase, zero Supabase client code,
 * and zero database credentials.
 */

// API Base URL - should be relative to the application origin 
// or point to your n8n API gateway
const API_BASE_URL = '/api';

export const isGatewayConfigured = true;

/**
 * Normalize conversations returned from n8n
 */
function normalizeConversation(item: any): Conversation {
  const sessId = String(item.id || item.session_id || item.conversation_id || `ses-${Math.random().toString(36).slice(2, 8)}`);
  
  return {
    id: sessId,
    session_id: item.session_id || sessId,
    customer_name: item.customer_name || item.name || 'Customer',
    customer_email: item.customer_email || item.email || '',
    status: (item.status as ConversationStatus) || 'open',
    ticket_type: (item.ticket_type as TicketType) || 'inquiry',
    series: (item.series as ProductSeries) || 'Platinum',
    issue_description: item.issue_description || 'Support Chat Session',
    unread: item.unread !== undefined ? Boolean(item.unread) : false,
    read_at: item.read_at || null,
    last_message: item.last_message || '',
    last_message_at: item.last_message_at || item.updated_at || item.created_at || new Date().toISOString(),
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || item.created_at || new Date().toISOString(),
    category: item.category || 'General',
    tags: Array.isArray(item.tags) ? item.tags : [],
    messages_count: item.messages_count || 0
  };
}

/**
 * Fetch all conversations from n8n webhook: GET /api/chats
 */
export async function getConversations(): Promise<{
  data: Conversation[];
  source: 'n8n' | 'sample';
  error?: string;
}> {
  try {
    const url = `${API_BASE_URL}/chats`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`n8n Gateway responded with HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawList = json.chats || json.data || [];

    if (!Array.isArray(rawList)) {
      throw new Error('Invalid response format from n8n');
    }

    const formatted = rawList.map(normalizeConversation);
    return { data: formatted, source: 'n8n' };
  } catch (err: any) {
    console.warn('n8n API fetch notice:', err.message);
    return {
      data: INITIAL_CONVERSATIONS,
      source: 'sample',
      error: `API: ${err.message}`,
    };
  }
}

/**
 * Fetch messages for a specific conversation:
 * GET /api/chat?id={conversation_id}
 */
/**
 * Fetch messages for a specific conversation:
 * GET /api/chat?id={conversation_id}
 */
export async function getMessages(
  conversationId: string
): Promise<{ data: Message[]; source: 'n8n' | 'sample'; error?: string }> {
  try {
    const url = `${API_BASE_URL}/chat?id=${encodeURIComponent(conversationId)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`n8n Gateway responded with HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawList = json.messages || json.data || [];

    if (!Array.isArray(rawList)) {
      throw new Error('Invalid response format from n8n');
    }

    const formatted: Message[] = rawList.map((item: any) => ({
      id: String(item.id),
      conversation_id: conversationId,
      sender_type: item.sender_type || 'customer',
      content: item.content || '',
      created_at: item.created_at || new Date().toISOString(),
      model_name: item.model_name || undefined,
    }));

    return { data: formatted, source: 'n8n' };
  } catch (err: any) {
    console.warn('n8n API fetch notice:', err.message);
    const fallbackMsgs = INITIAL_MESSAGES[conversationId] || [];
    return {
      data: fallbackMsgs,
      source: fallbackMsgs.length > 0 ? 'sample' : 'n8n',
      error: `Сообщения: ${err.message}`,
    };
  }
}

export async function updateConversationReadStatus(
  conversationId: string,
  unread: boolean
): Promise<{ success: boolean; error?: string }> {
  // Not implemented for READ-ONLY mode
  return { success: true };
}

export const N8N_API_BASE_URL = API_BASE_URL;
export const GATEWAY_AUTH_TOKEN = '';
