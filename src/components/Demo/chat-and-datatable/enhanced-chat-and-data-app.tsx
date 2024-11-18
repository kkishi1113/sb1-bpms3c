import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  content: string;
  senderId: string;
};

type Chat = {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
};

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

type UserSelectorProps = {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
};

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  currentUserId: string;
};

type ChatComponentProps = {
  chat: Chat | null;
  onSendMessage: (chatId: string, content: string) => void;
  currentUserId: string;
  users: User[];
};

type DataTableProps = {
  data: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string, isSelected: boolean) => void;
};

type CreateGroupChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
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

function UserSelector({ users, currentUserId, onSelectUser }: UserSelectorProps) {
  const currentUser = users.find((user) => user.id === currentUserId);

  return (
    <div className="p-4 border-b">
      <Select value={currentUserId} onValueChange={onSelectUser}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={currentUser?.avatar} alt="" />
                <AvatarFallback>{currentUser?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{currentUser?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ChatList({ chats, onSelectChat, selectedChatId, currentUserId }: ChatListProps) {
  const filteredChats = chats.filter((chat) => chat.participants.includes(currentUserId));

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] w-full">
      <nav aria-label="チャット一覧">
        <ul className="space-y-2">
          {filteredChats.map((chat) => (
            <li key={chat.id}>
              <button
                className={`w-full flex items-center space-x-4 p-4 hover:bg-accent cursor-pointer ${
                  selectedChatId === chat.id ? 'bg-accent' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
                aria-selected={selectedChatId === chat.id}
              >
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="" />
                  <AvatarFallback>{chat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 text-left">
                  <p className="text-sm font-medium leading-none">{chat.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {chat.messages[chat.messages.length - 1]?.content || '新しいグループ'}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}

function ChatComponent({ chat, onSendMessage, currentUserId, users }: ChatComponentProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chat?.messages]);

  const handleSend = () => {
    if (input.trim() && chat) {
      onSendMessage(chat.id, input);
      setInput('');
    }
  };

  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || 'Unknown';
  };

  const getUserAvatar = (userId: string) => {
    return users.find((user) => user.id === userId)?.avatar || '/placeholder.svg?height=40&width=40';
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">チャットを選択してください</div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{chat.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div role="log" aria-label="チャットメッセージ">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {message.senderId !== currentUserId && (
                  <Avatar className="mr-2">
                    <AvatarImage src={getUserAvatar(message.senderId)} alt="" />
                    <AvatarFallback>{getUserName(message.senderId).slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-2 rounded-lg ${
                    message.senderId === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-grow"
            aria-label="メッセージ入力"
          />
          <Button type="submit" size="icon" aria-label="メッセージを送信">
            <Send className="h-4 w-4" />
            <span className="sr-only">送信</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function DataTable({ data, selectedProducts, onSelectProduct }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">選択</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>商品名</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>価格</TableHead>
          <TableHead>在庫</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={(checked) => onSelectProduct(product.id, checked as boolean)}
              />
            </TableCell>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.price.toLocaleString()}円</TableCell>
            <TableCell>{product.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CreateGroupChatDialog({
  isOpen,
  onClose,
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
export default function ChatAndDataApp() {
  const mockUsers: User[] = [
    { id: '1', name: 'Alice', avatar: '/placeholder.svg?height=40&width=40' },
    { id: '2', name: 'Bob', avatar: '/placeholder.svg?height=40&width=40' },
    { id: '3', name: 'Charlie', avatar: '/placeholder.svg?height=40&width=40' },
  ];

  const mockProducts: Product[] = [
    { id: '1', name: 'スマートフォン', category: '電子機器', price: 80000, stock: 50 },
    { id: '2', name: 'ノートパソコン', category: '電子機器', price: 150000, stock: 30 },
    { id: '3', name: 'コーヒーメーカー', category: '家電', price: 15000, stock: 100 },
    { id: '4', name: 'ヘッドフォン', category: 'オーディオ', price: 25000, stock: 80 },
    { id: '5', name: 'デジタルカメラ', category: 'カメラ', price: 70000, stock: 40 },
  ];

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>(mockUsers[0].id);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const onSendMessage = (chatId: string, content: string) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          const newMessage = {
            id: chat.messages.length + 1,
            content,
            senderId: currentUserId,
          };
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      });
      return updatedChats;
    });
  };

  const handleSelectProduct = (productId: string, isSelected: boolean) => {
    setSelectedProducts((prev) => (isSelected ? [...prev, productId] : prev.filter((id) => id !== productId)));
  };

  const handleCreateGroup = (name: string, participants: string[]) => {
    const newChat: Chat = {
      id: `chat-${chats.length + 1}`,
      name,
      participants: [currentUserId, ...participants],
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setSelectedChatId(newChat.id);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">チャット & データ アプリ</h1>
      </header>
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60}>
          <div className="flex h-full">
            <aside className="w-1/3 border-r flex flex-col" aria-label="チャット一覧">
              <UserSelector users={mockUsers} currentUserId={currentUserId} onSelectUser={setCurrentUserId} />
              <ChatList
                chats={chats}
                onSelectChat={setSelectedChatId}
                selectedChatId={selectedChatId}
                currentUserId={currentUserId}
              />
            </aside>
            <main className="w-2/3">
              {selectedChat && (
                <ChatComponent
                  chat={selectedChat}
                  onSendMessage={onSendMessage}
                  currentUserId={currentUserId}
                  users={mockUsers}
                />
              )}
            </main>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40}>
          <Card className="w-full h-full flex flex-col rounded-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>商品データ</CardTitle>
              <Button onClick={() => setIsCreateGroupDialogOpen(true)} disabled={selectedProducts.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                チャットグループ作成
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={mockProducts}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
              />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
      <CreateGroupChatDialog
        isOpen={isCreateGroupDialogOpen}
        onClose={() => setIsCreateGroupDialogOpen(false)}
        onCreateGroup={handleCreateGroup}
        selectedProducts={mockProducts.filter((p) => selectedProducts.includes(p.id))}
        users={mockUsers}
        currentUserId={currentUserId}
      />
    </div>
  );
}
