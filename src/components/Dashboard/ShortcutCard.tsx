import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shortcut } from '@/types/shortcut';

interface ShortcutCardProps {
  shortcut: Shortcut;
  onEdit: (shortcut: Shortcut) => void;
  onDelete: (id: string) => void;
}

export const ShortcutCard = ({ shortcut, onEdit, onDelete }: ShortcutCardProps) => {
  return (
    <div className="relative">
      <a
        href={shortcut.url}
        className="flex flex-col items-center p-4 bg-card hover:bg-accent rounded-lg transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={shortcut.favicon} alt={shortcut.text} className="w-12 h-12 mb-2" />
        <span className="text-sm text-center">{shortcut.text}</span>
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onEdit(shortcut)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>編集</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(shortcut.id)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
