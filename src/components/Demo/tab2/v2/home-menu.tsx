import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { ChatList } from './chat-list';
import { mockApi } from './lib/mockApi';

type Todo = {
  id: string;
  label: string;
  menuId: string;
  data: { id: string }[];
  isChatOpen: boolean;
};

type Chat = {
  id: string;
  name: string;
  participants: string[];
  messages: {
    id: number;
    content: string;
    senderId: string;
    createdAt: Date;
  }[];
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type HomeMenuProps = {
  setMenu: (menu: string) => void;
  setData: (data: Product[]) => void;
  setIsChatPanelOpen: (isOpen: boolean) => void;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  currentUserId: string;
};

export function HomeMenu({
  setMenu,
  setData,
  setIsChatPanelOpen,
  chats,
  onSelectChat,
  selectedChatId,
  currentUserId,
}: HomeMenuProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      // この部分は実際のAPIコールに置き換えることができます
      const mockTodos: Todo[] = [
        { id: 'todo-1', label: 'Todo-1', menuId: 'menu-1', data: [{ id: '1' }, { id: '2' }], isChatOpen: false },
        {
          id: 'todo-2',
          label: 'Todo-2',
          menuId: 'menu-1',
          data: [{ id: '1' }, { id: '2' }, { id: '3' }],
          isChatOpen: true,
        },
        { id: 'todo-3', label: 'Todo-3', menuId: 'menu-1', data: [{ id: '3' }, { id: '4' }], isChatOpen: true },
        { id: 'todo-4', label: 'Todo-4', menuId: 'menu-1', data: [{ id: '4' }], isChatOpen: false },
      ];
      setTodos(mockTodos);
    };
    fetchTodos();
    setIsChatPanelOpen(false);
  }, []);

  const handleClick = async (menuId: string, data: { id: string }[], isOpen: boolean) => {
    setMenu(menuId);
    const products = await mockApi.getProducts();
    const newData = products.filter((product) => data.some((item) => item.id === product.id));
    setData(newData);
    setIsChatPanelOpen(isOpen);
  };

  return (
    <div className="flex gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => handleClick('menu-1', [], false)}>Menu-1</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>ToDo</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {todos.map((todo) => (
              <Button
                key={todo.id}
                variant="ghost"
                onClick={() => handleClick(todo.menuId, todo.data, todo.isChatOpen)}
              >
                {todo.label}
                {`[${todo.menuId}[${todo.data.map((d) => d.id)}]]`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>チャット一覧</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <ChatList
            chats={chats}
            onSelectChat={(chatId) => {
              onSelectChat(chatId);
              setMenu('menu-1');
              setIsChatPanelOpen(true);
            }}
            selectedChatId={selectedChatId}
            currentUserId={currentUserId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
