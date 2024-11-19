import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

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

type ChatComponentProps = {
  chat: Chat | null;
  onSendMessage: (chatId: string, content: string) => void;
  currentUserId: string;
  users: User[];
};

export function ChatComponent({ chat, onSendMessage, currentUserId, users }: ChatComponentProps) {
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
