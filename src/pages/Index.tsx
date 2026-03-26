import { useState, useCallback } from 'react';
import { useChat } from '@/hooks/useChat';
import { useChatHistory } from '@/hooks/useChatHistory';
import { SidebarProvider } from '@/components/ui/sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import ChatSidebar from '@/components/ChatSidebar';
import SettingsSheet from '@/components/SettingsSheet';

const Index = () => {
  const { sessions, activeId, activeSession, createChat, deleteChat, updateChat, switchChat } = useChatHistory();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleMessagesChange = useCallback(
    (msgs: import('@/hooks/useChat').Message[]) => {
      if (activeId) updateChat(activeId, msgs);
    },
    [activeId, updateChat]
  );

  const { messages, isStreaming, sendMessage, clearChat, stopStreaming, storytellerMode, setStorytellerMode, endpoint, setEndpoint, model, setModel } = useChat({
    initialMessages: activeSession?.messages,
    onMessagesChange: handleMessagesChange,
  });

  const handleSend = (content: string) => {
    if (!activeId) {
      const newId = createChat();
      // Small delay to let state settle, then send
      setTimeout(() => sendMessage(content), 0);
      return;
    }
    sendMessage(content);
  };

  const handleNewChat = () => {
    createChat();
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-dvh w-full">
        <ChatSidebar
          sessions={sessions}
          activeId={activeId}
          onNewChat={handleNewChat}
          onSwitch={switchChat}
          onDelete={deleteChat}
        />
        <div className="flex flex-col flex-1 h-dvh">
          <ChatHeader
            storytellerMode={storytellerMode}
            onStorytellerToggle={setStorytellerMode}
            onSettingsOpen={() => setSettingsOpen(true)}
            onClear={clearChat}
          />
          <ChatMessages messages={messages} isStreaming={isStreaming} />
          <ChatInput onSend={handleSend} onStop={stopStreaming} disabled={isStreaming} isStreaming={isStreaming} />
          <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} endpoint={endpoint} onEndpointChange={setEndpoint} model={model} onModelChange={setModel} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
