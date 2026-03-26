import { Settings, BookOpen, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface ChatHeaderProps {
  storytellerMode: boolean;
  onStorytellerToggle: (val: boolean) => void;
  onSettingsOpen: () => void;
  onClear: () => void;
}

const ChatHeader = ({ storytellerMode, onStorytellerToggle, onSettingsOpen, onClear }: ChatHeaderProps) => (
  <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
    <div className="flex items-center gap-2">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <h1 className="text-lg font-medium tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
        Noir<span className="text-primary">AI</span>
      </h1>
    </div>

    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <BookOpen className={`h-4 w-4 transition-colors ${storytellerMode ? 'text-primary' : 'text-muted-foreground'}`} />
        <Switch checked={storytellerMode} onCheckedChange={onStorytellerToggle} className="scale-90" />
      </div>
      <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onSettingsOpen} className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  </header>
);

export default ChatHeader;
