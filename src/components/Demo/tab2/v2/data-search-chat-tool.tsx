import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DataTable } from './data-table';
import { ChatComponent } from './chat';
import { UserSelector } from './chat-user-selector';
import { HomeMenu } from './home-menu';
import { CreatePostDialog } from './create-post-dialog';
import { mockApi } from './lib/mockApi';

type Message = {
  id: number;
  content: string;
  senderId: string;
  createdAt: Date;
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

export default function DataSearchChatToolV2() {
  const [menu, setMenu] = useState<string>('home');
  const [data, setData] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const [usersData, productsData] = await Promise.all([mockApi.getUsers(), mockApi.getProducts()]);
      setUsers(usersData);
      setData(productsData);
      if (usersData.length > 0) {
        setCurrentUserId(usersData[0].id);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      mockApi.getChats(currentUserId).then(setChats);
    }
  }, [currentUserId]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const onSendMessage = async (chatId: string, content: string) => {
    if (currentUserId) {
      const newMessage = await mockApi.sendMessage(chatId, content, currentUserId);
      if (newMessage) {
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat))
        );
      }
    }
  };

  const handleSelectProduct = (productId: string, isSelected: boolean) => {
    setSelectedProducts((prev) => (isSelected ? [...prev, productId] : prev.filter((id) => id !== productId)));
  };

  const handleCreateChat = async () => {
    if (currentUserId) {
      const newChat = await mockApi.createChat(`New Chat ${chats.length + 1}`, [currentUserId]);
      setChats((prevChats) => [...prevChats, newChat]);
      setSelectedChatId(newChat.id);
      setIsChatPanelOpen(true);
    }
  };

  const handleUserChange = (userId: string) => {
    setCurrentUserId(userId);
    setSelectedChatId(null);
  };

  return (
    <>
      <header className="flex justify-between">
        <div>My tool</div>
        <div>
          <Button
            variant="ghost"
            onClick={() => {
              setMenu('home');
              setIsChatPanelOpen(false);
            }}
          >
            Home Menu
          </Button>
        </div>
      </header>
      {menu === 'home' ? (
        <HomeMenu
          setMenu={setMenu}
          setData={setData}
          setIsChatPanelOpen={setIsChatPanelOpen}
          chats={chats}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
          currentUserId={currentUserId}
        />
      ) : (
        <div className="flex flex-col h-screen">
          <header className="p-4 border-b">
            <h1 className="text-2xl font-bold">チャット & データ アプリ</h1>
          </header>
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={isChatPanelOpen ? 60 : 100}>
              <Card className="w-full h-full flex flex-col rounded-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>商品データ</CardTitle>
                  <Button onClick={handleCreateChat} disabled={selectedProducts.length === 0}>
                    <Plus className="mr-2 h-4 w-4" />
                    チャットグループ作成
                  </Button>
                </CardHeader>
                <CardContent>
                  <DataTable data={data} selectedProducts={selectedProducts} onSelectProduct={handleSelectProduct} />
                </CardContent>
              </Card>
            </ResizablePanel>
            <ResizableHandle />
            {isChatPanelOpen && (
              <ResizablePanel defaultSize={isChatPanelOpen ? 40 : 0}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel>
                    <div className="flex flex-col h-full">
                      <UserSelector users={users} currentUserId={currentUserId} onSelectUser={handleUserChange} />
                      <div className="h-full">
                        {selectedChat ? (
                          <ChatComponent
                            chat={selectedChat}
                            onSendMessage={onSendMessage}
                            currentUserId={currentUserId}
                            users={users}
                            onOpenCreatePostDialog={() => setIsCreatePostDialogOpen(true)}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            チャットを選択してください
                          </div>
                        )}
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
          <CreatePostDialog
            isOpen={isCreatePostDialogOpen}
            onClose={() => setIsCreatePostDialogOpen(false)}
            onCreatePost={(to, title, content) => {
              if (selectedChat) {
                onSendMessage(selectedChat.id, content);
              }
              setIsCreatePostDialogOpen(false);
            }}
            users={users}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </>
  );
}
