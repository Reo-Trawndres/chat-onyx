import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { ChatSession } from '@/hooks/useChatHistory';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  onNewChat: () => void;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
}

const ChatSidebar = ({ sessions, activeId, onNewChat, onSwitch, onDelete }: ChatSidebarProps) => {
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <SidebarHeader className="p-3">
        <Button onClick={onNewChat} className="w-full gap-2 rounded-xl" size="sm">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {sessions.map(session => (
            <SidebarMenuItem key={session.id}>
              <SidebarMenuButton
                isActive={session.id === activeId}
                onClick={() => onSwitch(session.id)}
                className="group justify-between rounded-lg"
              >
                <span className="flex items-center gap-2 truncate">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{session.title}</span>
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
