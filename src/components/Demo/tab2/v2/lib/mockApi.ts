// モックデータ
const mockUsers = [
  { id: '1', name: 'Alice', avatar: '/placeholder.svg?height=40&width=40' },
  { id: '2', name: 'Bob', avatar: '/placeholder.svg?height=40&width=40' },
  { id: '3', name: 'Charlie', avatar: '/placeholder.svg?height=40&width=40' },
];

const mockProducts = [
  { id: '1', name: 'スマートフォン', category: '電子機器', price: 80000, stock: 50 },
  { id: '2', name: 'ノートパソコン', category: '電子機器', price: 150000, stock: 30 },
  { id: '3', name: 'コーヒーメーカー', category: '家電', price: 15000, stock: 100 },
  { id: '4', name: 'ヘッドフォン', category: 'オーディオ', price: 25000, stock: 80 },
  { id: '5', name: 'デジタルカメラ', category: 'カメラ', price: 70000, stock: 40 },
];

const mockChats = [
  {
    id: 'chat-1',
    name: 'プロジェクトA',
    participants: ['1', '2'],
    messages: [
      { id: 1, content: 'こんにちは', senderId: '1', createdAt: new Date() },
      { id: 2, content: 'お疲れ様です', senderId: '2', createdAt: new Date() },
    ],
  },
  {
    id: 'chat-2',
    name: '営業チーム',
    participants: ['1', '3'],
    messages: [
      { id: 1, content: '今週の目標について', senderId: '1', createdAt: new Date() },
      { id: 2, content: '了解しました', senderId: '3', createdAt: new Date() },
    ],
  },
];

// モックAPI関数
export const mockApi = {
  getUsers: () => {
    return new Promise<typeof mockUsers>((resolve) => {
      setTimeout(() => resolve(mockUsers), 300);
    });
  },

  getProducts: () => {
    return new Promise<typeof mockProducts>((resolve) => {
      setTimeout(() => resolve(mockProducts), 300);
    });
  },

  getChats: (userId: string) => {
    return new Promise<typeof mockChats>((resolve) => {
      const filteredChats = mockChats.filter(chat => chat.participants.includes(userId));
      setTimeout(() => resolve(filteredChats), 300);
    });
  },

  createChat: (name: string, participants: string[]) => {
    return new Promise<typeof mockChats[0]>((resolve) => {
      const newChat = {
        id: `chat-${mockChats.length + 1}`,
        name,
        participants,
        messages: [],
      };
      mockChats.push(newChat);
      setTimeout(() => resolve(newChat), 300);
    });
  },

  sendMessage: (chatId: string, content: string, senderId: string) => {
    return new Promise<typeof mockChats[0]['messages'][0]>((resolve) => {
      const chat = mockChats.find(c => c.id === chatId);
      if (chat) {
        const newMessage = {
          id: chat.messages.length + 1,
          content,
          senderId,
          createdAt: new Date(),
        };
        chat.messages.push(newMessage);
        setTimeout(() => resolve(newMessage), 300);
      } else {
        setTimeout(() => resolve(null), 300);
      }
    });
  },
};

