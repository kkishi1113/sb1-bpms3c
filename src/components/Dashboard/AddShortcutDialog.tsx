import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Shortcut } from '@/types/shortcut';

interface AddShortcutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newShortcut: Omit<Shortcut, 'id'>;
  onShortcutChange: (shortcut: Omit<Shortcut, 'id'>) => void;
  onAdd: () => void;
  faviconUrl: string;
  onFaviconUrlChange: (url: string) => void;
}

export const AddShortcutDialog = ({
  open,
  onOpenChange,
  newShortcut,
  onShortcutChange,
  onAdd,
  faviconUrl,
  onFaviconUrlChange,
}: AddShortcutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいショートカットを追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="URL"
            value={newShortcut.url}
            onChange={(e) => onShortcutChange({ ...newShortcut, url: e.target.value })}
          />
          <Input
            placeholder="Favicon URL"
            value={faviconUrl}
            onChange={(e) => {
              onFaviconUrlChange(e.target.value);
              const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${e.target.value}&size=128`;
              onShortcutChange({
                ...newShortcut,
                favicon: faviconUrl,
              });
            }}
          />
          <Input
            placeholder="テキスト"
            value={newShortcut.text}
            onChange={(e) => onShortcutChange({ ...newShortcut, text: e.target.value })}
          />
          <Input
            placeholder="カテゴリ"
            value={newShortcut.category}
            onChange={(e) => onShortcutChange({ ...newShortcut, category: e.target.value })}
          />
        </div>
        <DialogClose asChild>
          <Button onClick={onAdd} type="button">
            追加
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
