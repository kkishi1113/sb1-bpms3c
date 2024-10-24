import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  addShortcut,
  getShortcuts,
  updateShortcut,
  softDeleteShortcut,
  undoDeleteShortcut,
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Shortcut } from "@/types/shortcut";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";

const Dashboard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [newShortcut, setNewShortcut] = useState<Omit<Shortcut, "id">>({
    url: "",
    favicon: "",
    text: "",
    category: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), // これを追加
  });
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [editingFaviconUrl, setEditingFaviconUrl] = useState("");
  const [newFaviconUrl, setNewFaviconUrl] = useState("");

  useEffect(() => {
    const fetchShortcuts = async () => {
      try {
        const fetchedShortcuts = await getShortcuts();
        setShortcuts(fetchedShortcuts);
      } catch (error) {
        console.error("Error fetching shortcuts: ", error);
        toast({
          title: "エラー",
          description: "ショートカットの取得中にエラーが発生しました。",
          variant: "destructive",
        });
      }
    };

    fetchShortcuts();
  }, []);

  const handleAddShortcut = async () => {
    try {
      const id = await addShortcut(newShortcut);
      setShortcuts([
        ...shortcuts,
        { ...newShortcut, id, updatedAt: new Date().toISOString() },
      ]);
      setNewShortcut({
        url: "",
        favicon: "",
        text: "",
        category: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // これを追加
      });
      setNewFaviconUrl("");
      toast({
        title: "ショートカットが追加されました",
        description: "新しいショートカットがFirebaseに登録されました。",
      });
    } catch (error) {
      console.error("Error adding shortcut: ", error);
      toast({
        title: "エラー",
        description: "ショートカットの追中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleEditShortcut = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut);
    setEditingFaviconUrl(
      shortcut.favicon.split("url=")[1]?.split("&")[0] || ""
    );
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingShortcut) return;

    try {
      await updateShortcut(editingShortcut);
      setShortcuts(
        shortcuts.map((s) =>
          s.id === editingShortcut.id ? editingShortcut : s
        )
      );
      setIsEditDialogOpen(false);
      toast({
        title: "ショートカットが更新されました",
        description: "ショートカット編集が完了しました。",
      });
    } catch (error) {
      console.error("Error updating shortcut: ", error);
      toast({
        title: "エラー",
        description: "ショートカットの更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShortcut = async (shortcutId: string) => {
    try {
      await softDeleteShortcut(shortcutId);
      // ローカルの状態を更新
      setShortcuts(
        shortcuts.map((s) =>
          s.id === shortcutId ? { ...s, isDeleted: true } : s
        )
      );

      toast({
        title: "ショートカットが削除されました",
        description: "ショートカットが正常に削除されました。",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await undoDeleteShortcut(shortcutId);
                setShortcuts(
                  shortcuts.map((s) =>
                    s.id === shortcutId ? { ...s, isDeleted: false } : s
                  )
                );
              } catch (error) {
                console.error("Error undoing delete: ", error);
                toast({
                  title: "エラー",
                  description: "削除の取り消しに失敗しました。",
                  variant: "destructive",
                });
              }
            }}
          >
            元に戻す
          </Button>
        ),
      });
    } catch (error) {
      console.error("Error deleting shortcut: ", error);
      toast({
        title: "エラー",
        description: "ショートカットの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" type="text" placeholder="検索..." />
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" /> ショートカットを追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しいショートカットを追加</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="URL"
                  value={newShortcut.url}
                  onChange={(e) =>
                    setNewShortcut({ ...newShortcut, url: e.target.value })
                  }
                />
                <Input
                  placeholder="Favicon URL"
                  value={newFaviconUrl}
                  onChange={(e) => {
                    setNewFaviconUrl(e.target.value);
                    const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${e.target.value}&size=128`;
                    setNewShortcut({
                      ...newShortcut,
                      favicon: faviconUrl,
                    });
                  }}
                />
                <Input
                  placeholder="テキスト"
                  value={newShortcut.text}
                  onChange={(e) =>
                    setNewShortcut({ ...newShortcut, text: e.target.value })
                  }
                />
                <Input
                  placeholder="カテゴリ"
                  value={newShortcut.category}
                  onChange={(e) =>
                    setNewShortcut({ ...newShortcut, category: e.target.value })
                  }
                />
              </div>
              <DialogClose asChild>
                <Button onClick={handleAddShortcut} type="button">
                  追加
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {shortcuts
          .filter((shortcut) => !shortcut.isDeleted)
          .map((shortcut) => (
            <div key={shortcut.id} className="relative">
              <a
                href={shortcut.url}
                className="flex flex-col items-center p-4 bg-card hover:bg-accent rounded-lg transition-colors"
                target="_blank"
              >
                <img
                  src={shortcut.favicon}
                  alt={shortcut.text}
                  className="w-12 h-12 mb-2"
                />
                <span className="text-sm text-center">{shortcut.text}</span>
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full" // サイズを小さく
                  >
                    <MoreVertical className="h-5 w-5" />{" "}
                    {/* アイコンも小さく */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleEditShortcut(shortcut)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>編集</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteShortcut(shortcut.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>削除</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ショートカットを編集</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="URL"
              value={editingShortcut?.url || ""}
              onChange={(e) =>
                setEditingShortcut((prev) =>
                  prev ? { ...prev, url: e.target.value } : null
                )
              }
            />
            <Input
              placeholder="Favicon URL"
              value={editingFaviconUrl}
              onChange={(e) => {
                setEditingFaviconUrl(e.target.value);
                const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${e.target.value}&size=128`;
                setEditingShortcut((prev) =>
                  prev
                    ? {
                        ...prev,
                        favicon: faviconUrl,
                      }
                    : null
                );
              }}
            />
            <Input
              placeholder="テキスト"
              value={editingShortcut?.text || ""}
              onChange={(e) =>
                setEditingShortcut((prev) =>
                  prev ? { ...prev, text: e.target.value } : null
                )
              }
            />
            <Input
              placeholder="カテゴリ"
              value={editingShortcut?.category || ""}
              onChange={(e) =>
                setEditingShortcut((prev) =>
                  prev ? { ...prev, category: e.target.value } : null
                )
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button onClick={handleEditSubmit}>更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
