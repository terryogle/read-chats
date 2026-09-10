import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Link as LinkIcon, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { Conversation, KnowledgeBaseSubmission, KnowledgeBaseLink } from '../types';

interface SendToKBModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  onConfirm: (submission: KnowledgeBaseSubmission) => void;
}

export const SendToKBModal: React.FC<SendToKBModalProps> = ({
  isOpen,
  onClose,
  conversation,
  onConfirm,
}) => {
  const [comment, setComment] = useState('');
  const [links, setLinks] = useState<KnowledgeBaseLink[]>([
    {
      id: 'link-init-1',
      url: '',
      title: '',
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddLink = () => {
    setLinks((prev) => [
      ...prev,
      {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        url: '',
        title: '',
      },
    ]);
  };

  const handleRemoveLink = (id: string) => {
    if (links.length <= 1) {
      setLinks([{ id: 'link-init-1', url: '', title: '' }]);
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateLink = (id: string, field: 'url' | 'title', value: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!comment.trim()) {
      setErrorMsg('Please add a short comment explaining what should be improved or added.');
      return;
    }

    // Filter valid links
    const validLinks = links.filter((l) => l.url.trim().length > 0);

    setIsSubmitting(true);

    const submission: KnowledgeBaseSubmission = {
      id: `kb-${Date.now()}`,
      submitted_at: new Date().toISOString(),
      comment: comment.trim(),
      links: validLinks,
      category: 'Knowledge Base Improvement',
      submitted_by: 'Support Admin',
      status: 'pending_review',
    };

    setTimeout(() => {
      onConfirm(submission);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      id="send-to-kb-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="send-to-kb-modal-content"
        className="bg-white rounded-2xl max-w-xl w-full border border-zinc-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>Send to AI Knowledge Base</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {conversation.session_id || conversation.id}
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Submit this conversation as an AI training & knowledge-base improvement request
              </p>
            </div>
          </div>
          <button
            id="close-kb-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* User Comment: What should be improved or added */}
          <div>
            <label 
              htmlFor="kb-comment-input"
              className="block text-xs font-semibold text-zinc-700 mb-1.5"
            >
              What should be improved or added? <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="kb-comment-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              placeholder="Explain what was missing, incorrect, or how the AI could have handled this conversation better..."
              className="w-full text-xs bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-zinc-900 rounded-lg border border-zinc-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-zinc-400 resize-none leading-relaxed"
            />
          </div>

          {/* Links to Relevant Materials, Documents, Pages or Sources */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-700">
                Links to Relevant Materials & Sources
              </label>
              <button
                type="button"
                id="add-kb-link-btn"
                onClick={handleAddLink}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Link</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mb-2">
              Add links to relevant documentation, pages, PDFs, or internal articles where correct information can be found:
            </p>

            <div className="space-y-2">
              {links.map((item, index) => (
                <div 
                  key={item.id} 
                  className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                        placeholder="https://example.com/docs/manual.pdf or page URL"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white text-zinc-900 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 font-mono placeholder:font-sans placeholder:text-zinc-400"
                      />
                    </div>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                      placeholder="Source title or note (e.g. 'Manual Section 4.2', 'Returns FAQ')"
                      className="w-full px-2.5 py-1 text-[11px] bg-white text-zinc-700 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-zinc-400"
                    />
                  </div>
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-center cursor-pointer"
                      title="Remove link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              id="cancel-kb-modal-btn"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-send-to-kb-btn"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit to Knowledge Base</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
