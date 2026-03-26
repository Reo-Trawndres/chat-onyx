import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: string;
  onEndpointChange: (url: string) => void;
}

const SettingsSheet = ({ open, onOpenChange, endpoint, onEndpointChange }: SettingsSheetProps) => {
  const [url, setUrl] = useState(endpoint);

  useEffect(() => { setUrl(endpoint); }, [endpoint]);

  const handleSave = () => {
    onEndpointChange(url);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Settings</SheetTitle>
          <SheetDescription>Configure your AI chat connection.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint" className="text-sm text-muted-foreground">API Endpoint URL</Label>
            <Input
              id="endpoint"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="http://..."
              className="bg-secondary border-border"
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
