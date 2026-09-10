import React, { useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  Headphones, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  User, 
  Bot, 
  ExternalLink, 
  FileText, 
  Tag, 
  Info,
  ChevronDown,
  AlertTriangle,
  BookmarkCheck,
  ArrowLeft
} from 'lucide-react';
import { Conversation, Message, GorgiasHandoff, KnowledgeBaseSubmission } from '../types';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  isLoadingMessages: boolean;
  onSendToGorgias: () => void;
  onOpenSendToKB: () => void;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  isLoadingMessages,
  onSendToGorgias,
  onOpenSendToKB,
  onBack,
}) => {
  const [copiedId, setCopiedId] = React.useState(false);
  const [showKBDetails, setShowKBDetails] = React.useState(false);
  const [showGorgiasDetails, setShowGorgiasDetails] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message on change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, conversation?.id]);

  if (!conversation) {
    return (
      <div 
        id="window-2-chat-empty"
        className="flex-1 h-full bg-white flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
          <Headphones className="w-7 h-7 text-zinc-400" />
        </div>
        <h3 className="text-sm font-bold text-zinc-800 mb-1">No conversation selected</h3>
        <p className="text-xs text-zinc-500 max-w-sm">
          Select a conversation from the feed on the left to review the full AI chat history and take action.
        </p>
      </div>
    );
  }

  const displaySessionId = conversation.session_id || conversation.id;

  const handleCopyId = () => {
    navigator.clipboard.writeText(displaySessionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  const formatMessageTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      id="window-2-chat-window"
      className="flex-1 flex flex-col h-full bg-zinc-50/50 overflow-hidden"
    >
      {/* 1. Chat Header */}
      <div 
        id="chat-window-header"
        className="px-5 py-3.5 bg-white border-b border-zinc-200 flex items-center justify-between gap-4 flex-shrink-0 shadow-2xs"
      >
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              id="chat-window-back-btn"
              onClick={onBack}
              className="md:hidden p-1.5 -ml-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
              title="Back to conversation list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Session ID Pill with 1-Click Copy */}
              <button
                type="button"
                id="copy-session-id-header-btn"
                onClick={handleCopyId}
                title="Click to copy Session ID"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer"
              >
                <span>{displaySessionId}</span>
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>

              {/* Series or Category tag */}
              {conversation.series && (
                <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 font-medium rounded-full border border-zinc-200">
                  {conversation.series}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side status indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {conversation.gorgias_handoff && (
            <button
              onClick={() => setShowGorgiasDetails(!showGorgiasDetails)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
              title="Click to view Gorgias ticket handoff info"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Gorgias: {conversation.gorgias_handoff.ticket_id}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showGorgiasDetails ? 'rotate-180' : ''}`} />
            </button>
          )}

          {conversation.kb_submission && (
            <button
              onClick={() => setShowKBDetails(!showKBDetails)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors cursor-pointer"
              title="Click to view Knowledge Base improvement details"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>KB Submitted</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showKBDetails ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Optional Expandable: Gorgias Handoff Info */}
      {showGorgiasDetails && conversation.gorgias_handoff && (
        <div className="px-5 py-3 bg-indigo-50/70 border-b border-indigo-100 text-xs text-indigo-950 animate-in slide-in-from-top-1">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gorgias Support Ticket Details: {conversation.gorgias_handoff.ticket_id}</span>
            </span>
            <span className="text-[10px] font-mono text-indigo-600">
              Forwarded {new Date(conversation.gorgias_handoff.forwarded_at).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-900 mt-1">
            <div>
              <span className="text-indigo-600">Department:</span> {conversation.gorgias_handoff.department}
            </div>
            <div>
              <span className="text-indigo-600">Priority:</span>{' '}
              <span className="capitalize font-semibold">{conversation.gorgias_handoff.priority}</span>
            </div>
          </div>
          {conversation.gorgias_handoff.internal_note && (
            <div className="mt-1.5 text-[11px] bg-white/80 p-2 rounded border border-indigo-200">
              <span className="font-semibold text-indigo-900">Escalation Note: </span>
              {conversation.gorgias_handoff.internal_note}
            </div>
          )}
        </div>
      )}

      {/* Optional Expandable: Knowledge Base Submission Details */}
      {showKBDetails && conversation.kb_submission && (
        <div className="px-5 py-3 bg-purple-50/70 border-b border-purple-100 text-xs text-purple-950 animate-in slide-in-from-top-1">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Knowledge Base Improvement Request</span>
            </span>
            <span className="text-[10px] font-mono text-purple-600">
              Submitted {new Date(conversation.kb_submission.submitted_at).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-purple-900 bg-white/80 p-2 rounded border border-purple-200 mt-1">
            <span className="font-semibold">Suggested Improvement: </span>
            {conversation.kb_submission.comment}
          </p>
          {conversation.kb_submission.links.length > 0 && (
            <div className="mt-1.5 space-y-1">
              <span className="text-[10px] font-semibold text-purple-700">Source References:</span>
              <div className="flex flex-wrap gap-1.5">
                {conversation.kb_submission.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-purple-700 text-[10px] rounded border border-purple-200 hover:underline"
                  >
                    <span>{link.title || link.url}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Messages Thread (Window 2 Main Body) */}
      <div 
        id="chat-messages-container"
        className="flex-1 overflow-y-auto p-5 space-y-4"
      >
        {/* Chronological Messages */}
        {isLoadingMessages ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin mx-auto mb-2" />
            <span>Loading conversation messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            <span>No messages found for this session.</span>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => {
              const isCustomer = msg.sender_type === 'customer';
              const isAi = msg.sender_type === 'ai';
              const isSystem = msg.sender_type === 'system';

              if (isSystem) {
                return (
                  <div 
                    key={msg.id}
                    className="flex justify-center my-3"
                  >
                    <div className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-[11px] text-zinc-600 flex items-center gap-1.5 font-medium">
                      <Info className="w-3 h-3 text-zinc-400" />
                      <span>{msg.content}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  id={`chat-message-${msg.id}`}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Name & Timestamp */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-zinc-400">
                    {isAi && (
                      <span className="inline-flex items-center gap-1 font-semibold text-zinc-700">
                        <Bot className="w-3 h-3 text-indigo-600" />
                        <span>{msg.model_name || 'Gorgias AI Support'}</span>
                      </span>
                    )}
                    {isCustomer && (
                      <span className="inline-flex items-center gap-1 font-semibold text-zinc-700">
                        <User className="w-3 h-3 text-zinc-500" />
                        <span>Customer</span>
                      </span>
                    )}
                    <span>•</span>
                    <span>{formatMessageTime(msg.created_at)}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-2xs ${
                      isCustomer
                        ? 'bg-zinc-900 text-zinc-50 rounded-tr-xs'
                        : 'bg-white text-zinc-800 border border-zinc-200/90 rounded-tl-xs'
                    }`}
                  >
                    <div className="prose prose-xs max-w-none text-inherit leading-relaxed">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Bottom Action Dock (The Two Main Actions) */}
      <div 
        id="chat-window-bottom-actions"
        className="p-4 bg-white border-t border-zinc-200 shadow-lg flex-shrink-0"
      >
        <div className="max-w-2xl mx-auto">
          {/* Main 2 Action Buttons: Side-by-side (Left: Gorgias, Right: KB) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Action 1: Send to Gorgias (Sends immediately without popup) */}
            <button
              type="button"
              id="send-to-gorgias-action-btn"
              onClick={onSendToGorgias}
              disabled={Boolean(conversation.gorgias_handoff)}
              className={`p-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-between gap-2 group shadow-xs min-w-0 ${
                conversation.gorgias_handoff
                  ? 'bg-indigo-50/90 border-indigo-200 text-indigo-900 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white border-transparent cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 text-left">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  conversation.gorgias_handoff ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white'
                }`}>
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold leading-tight truncate">
                    {conversation.gorgias_handoff ? 'Sent to Gorgias' : 'Send to Gorgias'}
                  </div>
                  <div className={`text-[11px] font-normal truncate ${
                    conversation.gorgias_handoff ? 'text-indigo-700' : 'text-indigo-100'
                  }`}>
                    {conversation.gorgias_handoff 
                      ? `Ticket #${conversation.gorgias_handoff.ticket_id}` 
                      : 'Forward to support'}
                  </div>
                </div>
              </div>

              {conversation.gorgias_handoff ? (
                <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              ) : (
                <Send className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
            </button>

            {/* Action 2: Send to AI Knowledge Base */}
            <button
              type="button"
              id="send-to-kb-action-btn"
              onClick={onOpenSendToKB}
              className={`p-3 rounded-xl border font-semibold text-xs transition-all flex items-center justify-between gap-2 group cursor-pointer shadow-xs min-w-0 ${
                conversation.kb_submission
                  ? 'bg-purple-50/80 border-purple-200 text-purple-900 hover:bg-purple-100'
                  : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 text-left">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  conversation.kb_submission ? 'bg-purple-600 text-white' : 'bg-white/20 text-white'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold leading-tight truncate">
                    {conversation.kb_submission ? 'Sent to KB' : 'Send to KB'}
                  </div>
                  <div className={`text-[11px] font-normal truncate ${
                    conversation.kb_submission ? 'text-purple-700' : 'text-purple-100'
                  }`}>
                    {conversation.kb_submission 
                      ? 'Queued (Click to edit)' 
                      : 'Submit request & doc links'}
                  </div>
                </div>
              </div>

              {conversation.kb_submission ? (
                <BookmarkCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
              ) : (
                <FileText className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
