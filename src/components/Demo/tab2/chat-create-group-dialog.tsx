import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type CreateGroupChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatPanel: () => void;
  onCreateGroup: (name: string, participants: string[]) => void;
  selectedProducts: Product[];
  users: User[];
  currentUserId: string;
};

type SelectBoxProps = {
  items: { label: string; value: string }[];
  selectedItems: string[];
  onSelect: (selectedItems: string[]) => void;
  className?: string;
};

function SelectBox({ items, selectedItems, onSelect, className }: SelectBoxProps) {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    onSelect(selectedOptions);
  };

  return (
    <div className={cn('w-full', className)}>
      <label htmlFor="select-box" className="sr-only">
        Select items
      </label>
      <select
        id="select-box"
        multiple
        value={selectedItems}
        onChange={handleSelectionChange}
        className="w-full h-32 p-2 border rounded focus:outline-none"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CreateGroupChatDialog({
  isOpen,
  onClose,
  onOpenChatPanel,
  onCreateGroup,
  selectedProducts,
  users,
  currentUserId,
}: CreateGroupChatDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setGroupName(`商品 ${selectedProducts.map((p) => p.id).join(', ')} に関するグループ`);
      setSelectedParticipants([]); // 確実に空配列で初期化
    }
  }, [isOpen, selectedProducts]);

  const availableUsers = users.filter((user) => user.id !== currentUserId);

  const handleCreateGroup = () => {
    onCreateGroup(groupName, selectedParticipants);
    setGroupName('');
    setSelectedParticipants([]);
    onClose();
    onOpenChatPanel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいチャットグループを作成</DialogTitle>
          <DialogDescription>グループ名と参加者を選択してください。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-name" className="text-right">
              グループ名
            </Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="participants" className="text-right">
              参加者
            </Label>

            <SelectBox
              items={availableUsers.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              selectedItems={selectedParticipants}
              onSelect={setSelectedParticipants}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button onClick={handleCreateGroup} disabled={selectedParticipants.length === 0}>
            グループを作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
