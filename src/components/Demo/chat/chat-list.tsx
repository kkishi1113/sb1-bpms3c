import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
};

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
};

export function ChatList({
  chats,
  onSelectChat,
  selectedChatId,
}: ChatListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <nav aria-label="チャット一覧">
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                className={`w-full flex items-center space-x-4 p-4 hover:bg-accent cursor-pointer ${
                  selectedChatId === chat.id ? "bg-accent" : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
                aria-selected={selectedChatId === chat.id}
              >
                <Avatar>
                  <AvatarImage src={chat.avatar} alt="" />
                  <AvatarFallback>
                    {chat.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 text-left">
                  <p className="text-sm font-medium leading-none">
                    {chat.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {chat.lastMessage}
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
