import { useState } from "react";
import { ChatList } from "./chat-list";
import { ChatComponent } from "./chat-component";
import { UserSelector } from "./user-selector";

type Message = {
  id: number;
  content: string;
  senderId: string;
};

type Chat = {
  id: string;
  participants: string[];
  messages: Message[];
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

const mockUsers: User[] = [
  { id: "1", name: "Alice", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "2", name: "Bob", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "3", name: "Charlie", avatar: "/placeholder.svg?height=40&width=40" },
];

const mockChats: Chat[] = [
  {
    id: "1",
    participants: ["1", "2"],
    messages: [{ id: 1, content: "こんにちは、Bob!", senderId: "1" }],
  },
  {
    id: "2",
    participants: ["1", "3"],
    messages: [{ id: 1, content: "Charlie、元気？", senderId: "1" }],
  },
  {
    id: "3",
    participants: ["2", "3"],
    messages: [{ id: 1, content: "明日の予定は？", senderId: "2" }],
  },
];

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>(mockUsers[0].id);

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

  const getChatName = (chat: Chat) => {
    const otherParticipant = chat.participants.find((p) => p !== currentUserId);
    return mockUsers.find((u) => u.id === otherParticipant)?.name || "Unknown";
  };

  const getChatAvatar = (chat: Chat) => {
    const otherParticipant = chat.participants.find((p) => p !== currentUserId);
    return (
      mockUsers.find((u) => u.id === otherParticipant)?.avatar ||
      "/placeholder.svg?height=40&width=40"
    );
  };

  const getLastMessage = (chat: Chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage ? lastMessage.content : "";
  };

  const filteredChats = chats.filter((chat) =>
    chat.participants.includes(currentUserId)
  );

  return (
    <div className="flex h-screen">
      <aside className="w-1/3 border-r flex flex-col" aria-label="チャット一覧">
        <UserSelector
          users={mockUsers}
          currentUserId={currentUserId}
          onSelectUser={(userId) => {
            setCurrentUserId(userId);
            setSelectedChatId(null);
          }}
        />
        <ChatList
          chats={filteredChats.map((chat) => ({
            id: chat.id,
            name: getChatName(chat),
            lastMessage: getLastMessage(chat),
            avatar: getChatAvatar(chat),
          }))}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
        />
      </aside>
      <main className="w-2/3">
        {selectedChat ? (
          <ChatComponent
            chatId={selectedChat.id}
            chatName={getChatName(selectedChat)}
            chatAvatar={getChatAvatar(selectedChat)}
            messages={selectedChat.messages}
            onSendMessage={(content) => onSendMessage(selectedChat.id, content)}
            currentUserId={currentUserId}
            users={mockUsers}
            participants={selectedChat.participants}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            チャットを選択してください
          </div>
        )}
      </main>
    </div>
  );
}
