import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { addShortcut, getShortcuts, updateShortcut, softDeleteShortcut, undoDeleteShortcut } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Shortcut } from '@/types/shortcut';
import { SearchBar } from './SearchBar';
import { ShortcutCard } from './ShortcutCard';
import { AddShortcutDialog } from './AddShortcutDialog';
import { EditShortcutDialog } from './EditShortcutDialog';

// import VirtualTable from '../virtual-table';
// import DynamicTableApp from '../demo/dynamic-table-app';

const Dashboard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState<Omit<Shortcut, 'id'>>({
    url: '',
    favicon: '',
    text: '',
    category: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [newFaviconUrl, setNewFaviconUrl] = useState('');
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [editingFaviconUrl, setEditingFaviconUrl] = useState('');

  useEffect(() => {
    const fetchShortcuts = async () => {
      try {
        const fetchedShortcuts = await getShortcuts();
        setShortcuts(fetchedShortcuts);
      } catch (error) {
        console.error('Error fetching shortcuts: ', error);
        toast({
          title: 'エラー',
          description: 'ショートカットの取得中にエラーが発生しました。',
          variant: 'destructive',
        });
      }
    };

    fetchShortcuts();
  }, []);

  const handleAddShortcut = async () => {
    try {
      const id = await addShortcut(newShortcut);
      setShortcuts([...shortcuts, { ...newShortcut, id, updatedAt: new Date().toISOString() }]);
      setNewShortcut({
        url: '',
        favicon: '',
        text: '',
        category: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setNewFaviconUrl('');
      setIsAddDialogOpen(false);
      toast({
        title: 'ショートカットが追加されました',
        description: '新しいショートカットがFirebaseに登録されました。',
      });
    } catch (error) {
      console.error('Error adding shortcut: ', error);
      toast({
        title: 'エラー',
        description: 'ショートカットの追加中にエラーが発生しました。',
        variant: 'destructive',
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingShortcut) return;

    try {
      await updateShortcut(editingShortcut);
      setShortcuts(shortcuts.map((s) => (s.id === editingShortcut.id ? editingShortcut : s)));
      setIsEditDialogOpen(false);
      toast({
        title: 'ショートカットが更新されました',
        description: 'ショートカット編集が完了しました。',
      });
    } catch (error) {
      console.error('Error updating shortcut: ', error);
      toast({
        title: 'エラー',
        description: 'ショートカットの更新中にエラーが発生しました。',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteShortcut = async (shortcutId: string) => {
    try {
      await softDeleteShortcut(shortcutId);
      setShortcuts(shortcuts.map((s) => (s.id === shortcutId ? { ...s, isDeleted: true } : s)));

      toast({
        title: 'ショートカットが削除されました',
        description: 'ショートカットが正常に削除されました。',
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await undoDeleteShortcut(shortcutId);
                setShortcuts(shortcuts.map((s) => (s.id === shortcutId ? { ...s, isDeleted: false } : s)));
              } catch (error) {
                console.error('Error undoing delete: ', error);
                toast({
                  title: 'エラー',
                  description: '削除の取り消しに失敗しました。',
                  variant: 'destructive',
                });
              }
            }}
          >
            元に戻す
          </Button>
        ),
      });
    } catch (error) {
      console.error('Error deleting shortcut: ', error);
      toast({
        title: 'エラー',
        description: 'ショートカットの削除中にエラーが発生しました。',
        variant: 'destructive',
      });
    }
  };

  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      !shortcut.isDeleted &&
      (shortcut.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4">
          <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="outline" size="icon">
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="mt-2 md:mt-0">
            <PlusCircle className="mr-2" /> ショートカットを追加
          </Button>
        </div>
      </div>

      <div className="grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredShortcuts.map((shortcut) => (
          <ShortcutCard
            key={shortcut.id}
            shortcut={shortcut}
            onEdit={(shortcut) => {
              setEditingShortcut(shortcut);
              setEditingFaviconUrl(shortcut.favicon.split('url=')[1]?.split('&')[0] || '');
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteShortcut}
          />
        ))}
      </div>

      <AddShortcutDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newShortcut={newShortcut}
        onShortcutChange={setNewShortcut}
        onAdd={handleAddShortcut}
        faviconUrl={newFaviconUrl}
        onFaviconUrlChange={setNewFaviconUrl}
      />

      <EditShortcutDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingShortcut={editingShortcut}
        onShortcutChange={setEditingShortcut}
        onSubmit={handleEditSubmit}
        faviconUrl={editingFaviconUrl}
        onFaviconUrlChange={setEditingFaviconUrl}
      />

      {/* <VirtualTable /> */}
      {/* <DynamicTableApp /> */}
    </div>
  );
};

export default Dashboard;
