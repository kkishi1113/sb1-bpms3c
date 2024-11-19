import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

type Todo = {
  id: string;
  label: string;
  menuId: string;
  data: { id: string }[];
  isChatOpen: boolean;
};

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

const mockProducts = [
  { id: '1', name: 'スマートフォン', category: '電子機器', price: 80000, stock: 50 },
  { id: '2', name: 'ノートパソコン', category: '電子機器', price: 150000, stock: 30 },
  { id: '3', name: 'コーヒーメーカー', category: '家電', price: 15000, stock: 100 },
  { id: '4', name: 'ヘッドフォン', category: 'オーディオ', price: 25000, stock: 80 },
  { id: '5', name: 'デジタルカメラ', category: 'カメラ', price: 70000, stock: 40 },
];

type HomeMenuProps = {
  setMenu: (menu: string) => void;
  setData: (data: object[]) => void;
  setIsChatPanelOpen: (isOpen: boolean) => void;
};

export function HomeMenu({ setMenu, setData, setIsChatPanelOpen }: HomeMenuProps) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '', label: '', menuId: '', data: [{ id: '' }], isChatOpen: false },
  ]);

  useEffect(() => {
    const newTodos: Todo[] = [...mockTodos];
    setTodos(newTodos);
    setIsChatPanelOpen(false);
  }, []);

  const handleClick = (menuId: string, data: { id: string }[], isOpen: boolean) => {
    setMenu(menuId);
    const newData = mockProducts.filter((product) => data.some((item) => item.id === product.id));
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
          {/* <Button onClick={() => setMenu('menu-1')}>Menu-1</Button> */}
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
    </div>
  );
}
