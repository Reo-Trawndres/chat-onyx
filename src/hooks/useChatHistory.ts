import { useState, useCallback, useEffect } from 'react';
import type { Message } from '@/hooks/useChat';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const STORAGE_KEY = 'noir-chat-history';

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const createChat = useCallback(() => {
    const id = crypto.randomUUID();
    const session: ChatSession = { id, title: 'New Chat', messages: [], updatedAt: Date.now() };
    setSessions(prev => [session, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setActiveId(prev => (prev === id ? null : prev));
  }, []);

  const updateChat = useCallback((id: string, messages: Message[]) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const firstUser = messages.find(m => m.role === 'user');
        const title = firstUser ? firstUser.content.slice(0, 40) + (firstUser.content.length > 40 ? '…' : '') : 'New Chat';
        return { ...s, messages, title, updatedAt: Date.now() };
      })
    );
  }, []);

  const switchChat = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const activeSession = sessions.find(s => s.id === activeId) || null;

  return { sessions, activeId, activeSession, createChat, deleteChat, updateChat, switchChat };
}
