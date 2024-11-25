import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

type Message = {
  id: number;
  content: string;
  senderId: string;
  title?: string;
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

type ChatComponentProps = {
  chat: Chat;
  onSendMessage: (chatId: string, content: string, title?: string) => void;
  currentUserId: string;
  users: User[];
  onOpenCreatePostDialog: () => void;
};

export function ChatComponent({ chat, onSendMessage, currentUserId, users, onOpenCreatePostDialog }: ChatComponentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chat.messages]);

  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || 'Unknown';
  };

  const getUserAvatar = (userId: string) => {
    return users.find((user) => user.id === userId)?.avatar || '/placeholder.svg?height=40&width=40';
  };

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
              <div key={message.id} className="mb-4">
                <div className="flex items-start space-x-2">
                  <Avatar>
                    <AvatarImage src={getUserAvatar(message.senderId)} alt="" />
                    <AvatarFallback>{getUserName(message.senderId).slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{getUserName(message.senderId)}</div>
                    {message.title && <div className="font-medium">{message.title}</div>}
                    <div className="text-sm text-gray-500">{message.createdAt.toLocaleString()}</div>
                    <div className="mt-1">{message.content}</div>
                  </div>
                </div>
                <div className="mt-2 ml-12">
                  <Button variant="ghost" size="sm" onClick={onOpenCreatePostDialog}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    返信
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button onClick={onOpenCreatePostDialog} className="w-full">
          Chat Start
        </Button>
      </CardFooter>
    </Card>
  );
}

