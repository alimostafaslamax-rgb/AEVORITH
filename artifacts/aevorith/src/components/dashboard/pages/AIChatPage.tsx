import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Lightbulb, Wand2, PenTool, Plus, Trash2, MessageSquare, Copy, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

const INITIAL_ASSISTANT_MSG: Message = {
  id: 'init',
  role: 'assistant',
  content: "Hello! I'm AEVO, your AI creative assistant. I can help you craft perfect image prompts, brainstorm creative ideas, improve your writing, or just have a conversation. What would you like to create today?",
  time: 'Just now',
};

const SUGGESTIONS = [
  { icon: Wand2, label: 'Improve my prompt', prompt: 'Can you improve this image prompt for better results: "a dragon in a forest"' },
  { icon: Lightbulb, label: 'Creative ideas', prompt: 'Give me 5 unique and creative AI image ideas for a fantasy theme' },
  { icon: PenTool, label: 'Write a scene', prompt: 'Write a vivid description of a cyberpunk city at night for an AI image prompt' },
  { icon: Sparkles, label: 'Style suggestions', prompt: 'What art styles work best for creating realistic portraits with AI?' },
];

export default function AIChatPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([INITIAL_ASSISTANT_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user) {
      setLoadingHistory(false);
      return;
    }
    supabase
      .from('chats')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setChatHistory(data);
        setLoadingHistory(false);
      })
      .catch(() => setLoadingHistory(false));
  }, [user]);

  const createNewChat = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('chats')
      .insert({ title: 'New Chat' })
      .select('id, title, created_at')
      .single();
    if (error) { toast.error('Failed to create chat.'); return; }
    setChatHistory(prev => [data, ...prev]);
    setActiveChatId(data.id);
    setMessages([INITIAL_ASSISTANT_MSG]);
  };

  const loadChat = async (chatId: string) => {
    setActiveChatId(chatId);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (error) { toast.error('Failed to load chat.'); return; }
    if (data && data.length > 0) {
      setMessages(data.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      })));
    } else {
      setMessages([INITIAL_ASSISTANT_MSG]);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('chats').delete().eq('id', chatId);
    setChatHistory(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([INITIAL_ASSISTANT_MSG]);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    let chatId = activeChatId;

    if (!chatId && user) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      const { data, error } = await supabase
        .from('chats')
        .insert({ title })
        .select('id, title, created_at')
        .single();
      if (error) { toast.error('Failed to start chat.'); return; }
      chatId = data.id;
      setActiveChatId(chatId);
      setChatHistory(prev => [data, ...prev]);
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, time: 'Just now' };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    if (chatId) {
      supabase.from('chat_messages').insert({ chat_id: chatId, role: 'user', content }).catch(() => {});
    }

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', time: 'Just now' }]);

    const apiMessages = updatedMessages
      .filter(m => m.id !== 'init')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error ?? 'Request failed');
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.error) throw new Error(payload.error);
            if (payload.content) {
              fullResponse += payload.content;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: fullResponse } : m
              ));
            }
          } catch (_) {}
        }
      }

      if (chatId && fullResponse) {
        supabase.from('chat_messages').insert({ chat_id: chatId, role: 'assistant', content: fullResponse }).catch(() => {});
        const isNewChat = chatHistory.find(c => c.id === chatId)?.title === 'New Chat';
        if (isNewChat) {
          const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
          supabase.from('chats').update({ title, updated_at: new Date().toISOString() }).eq('id', chatId).catch(() => {});
          setChatHistory(prev => prev.map(c => c.id === chatId ? { ...c, title } : c));
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Failed to get AI response.';
      toast.error(msg);
      setMessages(prev => prev.filter(m => m.id !== aiMsgId));
    } finally {
      setLoading(false);
    }
  };

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex h-full min-h-0 animate-fade-in">
      {/* Sidebar: history */}
      <div className="w-64 flex-shrink-0 border-r border-white/8 bg-[#060810]/50 flex flex-col">
        <div className="p-4 border-b border-white/8">
          <button onClick={createNewChat} className="w-full btn-secondary justify-center text-sm gap-2">
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-2 mb-3">Recent Chats</p>
          {loadingHistory ? (
            <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /></div>
          ) : chatHistory.length === 0 ? (
            <p className="text-white/25 text-xs px-2">No chats yet. Start a conversation!</p>
          ) : chatHistory.map(chat => (
            <button
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`w-full text-left p-3 rounded-xl transition-colors group mb-1 ${activeChatId === chat.id ? 'bg-purple-500/15 border border-purple-500/30' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-start justify-between">
                <MessageSquare className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                <button
                  onClick={e => deleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/30 hover:text-red-400" />
                </button>
              </div>
              <p className="text-white/70 text-sm font-medium mt-2 truncate">{chat.title}</p>
              <p className="text-white/20 text-[11px] mt-1">{relativeTime(chat.created_at)}</p>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/8">
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-white">AEVO AI</span>
            </div>
            <p className="text-white/40 text-[11px]">Powered by Google Gemini</p>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  className="glass-card p-4 text-left hover:border-purple-500/30 transition-all"
                >
                  <s.icon className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-white text-sm font-medium">{s.label}</p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{s.prompt}</p>
                </button>
              ))}
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-purple-500 to-violet-700' : 'bg-white/10'}`}>
                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-white" /> : <span className="text-white text-xs font-bold">U</span>}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'glass text-white/85 rounded-tl-sm'}`}>
                  {msg.content === '' && msg.role === 'assistant' ? (
                    <div className="flex gap-1 items-center h-5">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    msg.content.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line.startsWith('**') && line.endsWith('**')
                          ? <strong className="text-white font-semibold">{line.slice(2, -2)}</strong>
                          : line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))
                  )}
                </div>
                {msg.role === 'assistant' && msg.content !== '' && (
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => { navigator.clipboard.writeText(msg.content); }}
                      className="w-6 h-6 hover:bg-white/8 rounded-md flex items-center justify-center transition-colors"
                    >
                      <Copy className="w-3 h-3 text-white/25 hover:text-white/50" />
                    </button>
                    <button className="w-6 h-6 hover:bg-white/8 rounded-md flex items-center justify-center transition-colors"><ThumbsUp className="w-3 h-3 text-white/25 hover:text-green-400" /></button>
                    <button className="w-6 h-6 hover:bg-white/8 rounded-md flex items-center justify-center transition-colors"><ThumbsDown className="w-3 h-3 text-white/25 hover:text-red-400" /></button>
                    <span className="text-white/20 text-[11px] ml-1">{msg.time}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/8 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 glass rounded-2xl border border-white/10 focus-within:border-purple-500/50 transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask me anything about AI creation, prompt engineering, or creative ideas..."
                rows={2}
                className="w-full bg-transparent text-white text-sm px-4 pt-3 pb-2 outline-none resize-none placeholder:text-white/30"
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-white/20 text-xs">Shift+Enter for new line</span>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="btn-primary text-xs py-1.5 px-3 gap-1.5 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
