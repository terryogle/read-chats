import React, { useState, useEffect, useCallback } from 'react';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { SendToKBModal } from './components/SendToKBModal';
import { SecurityGuideModal } from './components/SecurityGuideModal';
import { AdminLoginGate } from './components/AdminLoginGate';
import { GatewaySetupModal } from './components/GatewaySetupModal';
import { 
  Conversation, 
  Message, 
  GorgiasFilter, 
  GorgiasHandoff, 
  KnowledgeBaseSubmission, 
  AuthSession 
} from './types';
import { 
  isGatewayConfigured, 
  getConversations, 
  getMessages, 
  updateConversationReadStatus as apiUpdateReadStatus,
  N8N_API_BASE_URL
} from './lib/api';
import { getActiveSession, logoutAdmin } from './lib/auth';
import { 
  Headphones, 
  Sparkles, 
  CheckCircle2,
  Radio,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export default function App() {
  // Session Authentication State
  const [session, setSession] = useState<AuthSession | null>(getActiveSession);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);

  // Conversations & Messages State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [dataSource, setDataSource] = useState<'n8n' | 'sample'>('sample');
  const [dbError, setDbError] = useState<string | null>(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState<GorgiasFilter>('all');

  // KB Modal State
  const [isKBModalOpen, setIsKBModalOpen] = useState(false);

  // Mobile View Navigation: 'list' (Window 1) or 'chat' (Window 2)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'gorgias' | 'kb' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'gorgias' | 'kb' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Load conversations
  const loadConversations = useCallback(async (selectFirst = false) => {
    setIsLoadingConversations(true);
    const { data, source, error } = await getConversations();
    setConversations(data);
    setDataSource(source);
    setDbError(error || null);
    setIsLoadingConversations(false);

    if (selectFirst && data.length > 0) {
      setSelectedId(data[0].id);
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadConversations(true);
    }
  }, [loadConversations, session]);

  // Load messages whenever selected conversation changes
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    let isCurrent = true;
    setIsLoadingMessages(true);

    getMessages(selectedId).then(({ data }) => {
      if (isCurrent) {
        setMessages(data);
        setIsLoadingMessages(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [selectedId]);

  // Select conversation handler
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setMobileView('chat');

    // Automatically mark as read when opened
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id && c.unread
          ? { ...c, unread: false, read_at: new Date().toISOString() }
          : c
      )
    );
    apiUpdateReadStatus(id, false);
  };

  // Toggle Read / Unread Status for a conversation
  const handleToggleReadStatus = (targetId?: string) => {
    const idToToggle = targetId || selectedId;
    if (!idToToggle) return;

    const targetConv = conversations.find((c) => c.id === idToToggle);
    if (!targetConv) return;

    const newUnreadState = !targetConv.unread;
    const nowIso = new Date().toISOString();

    setConversations((prev) =>
      prev.map((c) =>
        c.id === idToToggle
          ? {
              ...c,
              unread: newUnreadState,
              read_at: newUnreadState ? null : (c.read_at || nowIso),
            }
          : c
      )
    );

    apiUpdateReadStatus(idToToggle, newUnreadState);
    showToast(
      newUnreadState ? 'Диалог помечен как непрочитанный' : 'Диалог помечен как прочитанный',
      'info'
    );
  };

  const selectedConversation = conversations.find((c) => c.id === selectedId) || null;

  // Action 1: Forward directly to Gorgias without popup
  const handleDirectSendToGorgias = () => {
    if (!selectedConversation) return;
    if (selectedConversation.gorgias_handoff) return;

    const randomTicket = Math.floor(10000 + Math.random() * 90000);
    const handoff: GorgiasHandoff = {
      ticket_id: `GOR-${randomTicket}`,
      forwarded_at: new Date().toISOString(),
      department: 'Customer Support Team',
      priority: 'normal',
      forwarded_by: session?.user?.username || 'Support Admin',
    };

    // 1. Update conversation status & handoff details
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? {
              ...c,
              gorgias_handoff: handoff,
              status: 'pending',
              updated_at: new Date().toISOString(),
            }
          : c
      )
    );

    // 2. Add a system event message into the chat window
    const systemNotice: Message = {
      id: `sys-gorgias-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_type: 'system',
      content: `Forwarded to Gorgias Support • Ticket #${handoff.ticket_id} created`,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, systemNotice]);

    // 3. Show celebratory toast
    showToast(
      `Ticket #${handoff.ticket_id} created and sent to Gorgias support`,
      'gorgias'
    );
  };

  // Action 2: Submit to AI Knowledge Base Confirmation
  const handleConfirmSendToKB = (submission: KnowledgeBaseSubmission) => {
    if (!selectedConversation) return;

    // 1. Update conversation status & KB details
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? {
              ...c,
              kb_submission: submission,
              updated_at: new Date().toISOString(),
            }
          : c
      )
    );

    // 2. Add a system event message into the chat window
    const systemNotice: Message = {
      id: `sys-kb-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_type: 'system',
      content: `Submitted to AI Knowledge Base improvement queue (${submission.links.length} documentation references attached)`,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, systemNotice]);

    // 3. Show celebratory toast
    showToast(
      'Knowledge-base improvement request successfully submitted',
      'kb'
    );
  };

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
  };

  // If user is not authenticated, strictly show the Admin Login Gate
  // This guarantees client data is never accessible to unauthorized viewers
  if (!session) {
    return (
      <AdminLoginGate
        onLoginSuccess={(newSession) => {
          setSession(newSession);
        }}
        isSupabaseConfigured={isGatewayConfigured}
      />
    );
  }

  return (
    <div 
      id="gorgias-admin-app-root" 
      className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-100 text-zinc-900 font-sans antialiased"
    >
      {/* Top Application Bar */}
      <header
        id="admin-top-app-header"
        className="h-11 bg-white border-b border-zinc-200 px-3.5 flex items-center justify-between flex-shrink-0 select-none z-10"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.shopify.com/s/files/1/0639/6172/7028/files/HealthyLine_logo_909e00d5-5467-4ce1-9ba0-4fc038a1f537.png?v=1735050048"
              alt="HealthyLine"
              referrerPolicy="no-referrer"
              className="h-4.5 w-auto object-contain"
            />
            <span className="text-xs font-bold text-zinc-900 tracking-tight">Support Admin</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>GitHub-Safe (Session Lock)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* n8n / Nginx API Gateway Setup Button */}
          <button
            type="button"
            id="open-gateway-setup-btn"
            onClick={() => setIsGatewayModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
            title="Настройка n8n API шлюза (/webhook/chats)"
          >
            <Radio className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">n8n API Шлюз</span>
          </button>

          {/* Security Guide Modal Button */}
          <button
            type="button"
            id="open-security-guide-btn"
            onClick={() => setIsSecurityModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
            title="Защита данных клиентов и GitHub"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden md:inline">Безопасность данных</span>
          </button>

          {/* User profile & Logout */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200">
            <span className="text-[11px] font-medium text-zinc-600 px-1.5 py-0.5 rounded bg-zinc-100 hidden lg:inline">
              {session.user.username}
            </span>
            <button
              type="button"
              id="admin-logout-btn"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Выйти из сессии"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div 
          id="action-toast-notification"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className={`px-4 py-2 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border ${
            toastMessage.type === 'gorgias'
              ? 'bg-indigo-900 text-white border-indigo-700'
              : toastMessage.type === 'kb'
              ? 'bg-purple-900 text-white border-purple-700'
              : 'bg-zinc-900 text-white border-zinc-800'
          }`}>
            {toastMessage.type === 'gorgias' ? (
              <Headphones className="w-4 h-4 text-indigo-300" />
            ) : toastMessage.type === 'kb' ? (
              <Sparkles className="w-4 h-4 text-purple-300" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Two-Window Layout (Strict 2 Windows) */}
      <main 
        id="admin-two-windows-container"
        className="flex-1 flex overflow-hidden w-full h-full relative"
      >
        {/* Window 1: Conversation List (Feed with all conversation/session IDs) */}
        <section 
          id="window-1-column"
          className={`w-full md:w-[380px] lg:w-[420px] flex-shrink-0 h-full ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelectConversation={handleSelectConversation}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onToggleReadStatus={handleToggleReadStatus}
            dataSource={dataSource}
            dbError={dbError}
            onRefresh={() => loadConversations(false)}
          />
        </section>

        {/* Window 2: Chat Window (Complete conversation + bottom actions) */}
        <section 
          id="window-2-column"
          className={`flex-1 h-full min-w-0 ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            onSendToGorgias={handleDirectSendToGorgias}
            onOpenSendToKB={() => setIsKBModalOpen(true)}
            onBack={() => setMobileView('list')}
          />
        </section>
      </main>

      {/* Action Modal: Send to AI Knowledge Base */}
      {selectedConversation && (
        <SendToKBModal
          isOpen={isKBModalOpen}
          onClose={() => setIsKBModalOpen(false)}
          conversation={selectedConversation}
          onConfirm={handleConfirmSendToKB}
        />
      )}

      {/* Data Protection & GitHub Security Advisory */}
      <SecurityGuideModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentUser={session?.user || null}
        onLogout={handleLogout}
        isSupabaseConfigured={isGatewayConfigured}
      />

      {/* n8n / Nginx API Gateway Setup Modal */}
      <GatewaySetupModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
        isConfigured={isGatewayConfigured}
        onRefreshData={() => loadConversations(false)}
      />
    </div>
  );
}
