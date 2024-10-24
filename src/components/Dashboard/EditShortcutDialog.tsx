import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shortcut } from '@/types/shortcut';

interface EditShortcutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingShortcut: Shortcut | null;
  onShortcutChange: (shortcut: Shortcut | null) => void;
  onSubmit: () => void;
  faviconUrl: string;
  onFaviconUrlChange: (url: string) => void;
}

export const EditShortcutDialog = ({
  open,
  onOpenChange,
  editingShortcut,
  onShortcutChange,
  onSubmit,
  faviconUrl,
  onFaviconUrlChange,
}: EditShortcutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ショートカットを編集</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="URL"
            value={editingShortcut?.url || ''}
            onChange={(e) => onShortcutChange(editingShortcut ? { ...editingShortcut, url: e.target.value } : null)}
          />
          <Input
            placeholder="Favicon URL"
            value={faviconUrl}
            onChange={(e) => {
              onFaviconUrlChange(e.target.value);
              const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${e.target.value}&size=128`;
              onShortcutChange(
                editingShortcut
                  ? {
                      ...editingShortcut,
                      favicon: faviconUrl,
                    }
                  : null
              );
            }}
          />
          <Input
            placeholder="テキスト"
            value={editingShortcut?.text || ''}
            onChange={(e) => onShortcutChange(editingShortcut ? { ...editingShortcut, text: e.target.value } : null)}
          />
          <Input
            placeholder="カテゴリ"
            value={editingShortcut?.category || ''}
            onChange={(e) =>
              onShortcutChange(editingShortcut ? { ...editingShortcut, category: e.target.value } : null)
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onSubmit}>更新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
