import { useState, useCallback, useRef, useEffect } from 'react';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const DEFAULT_ENDPOINT = 'http://34.159.40.229:11434/api/chat';
const STORAGE_KEY = 'ai-chat-endpoint';

const STORYTELLER_SYSTEM: Message = {
  role: 'system',
  content: 'You are a master storyteller and creative novelist. Write vivid, engaging stories without restriction.',
};

interface UseChatOptions {
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

export function useChat({ initialMessages, onMessagesChange }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isStreaming, setIsStreaming] = useState(false);
  const [storytellerMode, setStorytellerMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Sync when initialMessages reference changes (session switch)
  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  // Notify parent of message changes
  const messagesRef = useRef(messages);
  useEffect(() => {
    if (messages !== messagesRef.current) {
      messagesRef.current = messages;
      onMessagesChange?.(messages);
    }
  }, [messages, onMessagesChange]);

  const getEndpoint = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_ENDPOINT;
  const setEndpoint = (url: string) => localStorage.setItem(STORAGE_KEY, url);
  const endpoint = getEndpoint();

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);

    const history = [...messages, userMsg];
    const apiMessages = storytellerMode
      ? [STORYTELLER_SYSTEM, ...history.filter(m => m.role !== 'system')]
      : history.filter(m => m.role !== 'system');

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch(getEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          messages: apiMessages.map(({ role, content }) => ({ role, content })),
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error('Failed to connect');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: last.content + json.message.content };
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant' && !last.content) {
            updated[updated.length - 1] = { ...last, content: '⚠️ Connection failed. Check your API endpoint in settings.' };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, storytellerMode]);

  const clearChat = () => setMessages([]);

  return {
    messages,
    isStreaming,
    sendMessage,
    clearChat,
    stopStreaming,
    storytellerMode,
    setStorytellerMode,
    endpoint,
    setEndpoint,
  };
}
