import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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

export const ChatComponent = ({ chat, onSendMessage, currentUserId, users }: ChatComponentProps) => {
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

  const getUserName = (userId: string) => users.find((user) => user.id === userId)?.name || 'Unknown';

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">チャットを選択してください</div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col rounded-none">
      <CardHeader>
        <CardTitle>{chat.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className="p-2 rounded-lg bg-secondary">{message.content}</div>
            </div>
          ))}
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
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
