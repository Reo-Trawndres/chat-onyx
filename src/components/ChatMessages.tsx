import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '@/hooks/useChat';
import { Sparkles } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
}

const ChatMessages = ({ messages, isStreaming }: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const visible = messages.filter(m => m.role !== 'system');

  if (visible.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start a conversation
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Type a message below to begin chatting with the AI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {visible.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary text-secondary-foreground rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_pre]:bg-background/50 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-primary">
                  <ReactMarkdown>{msg.content || (isStreaming && i === visible.length - 1 ? '●' : '')}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
