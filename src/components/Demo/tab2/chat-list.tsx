import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

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

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  currentUserId: string;
};

export function ChatList({ chats, onSelectChat, selectedChatId, currentUserId }: ChatListProps) {
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
