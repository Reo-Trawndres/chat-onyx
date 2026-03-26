import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import SettingsSheet from '@/components/SettingsSheet';

const Index = () => {
  const { messages, isStreaming, sendMessage, clearChat, storytellerMode, setStorytellerMode, endpoint, setEndpoint } = useChat();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-dvh bg-background">
      <ChatHeader
        storytellerMode={storytellerMode}
        onStorytellerToggle={setStorytellerMode}
        onSettingsOpen={() => setSettingsOpen(true)}
        onClear={clearChat}
      />
      <ChatMessages messages={messages} isStreaming={isStreaming} />
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} endpoint={endpoint} onEndpointChange={setEndpoint} />
    </div>
  );
};

export default Index;
