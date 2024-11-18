import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  content: string;
  senderId: string;
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

type ChatComponentProps = {
  chatId: string;
  chatName: string;
  chatAvatar: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
  users: User[];
  participants: string[];
};

export function ChatComponent({
  // chatId,
  chatName,
  // chatAvatar,
  messages,
  onSendMessage,
  currentUserId,
  users,
  participants,
}: ChatComponentProps) {
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const getUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.name || "Unknown";
  };

  const getUserAvatar = (userId: string) => {
    return (
      users.find((user) => user.id === userId)?.avatar ||
      "/placeholder.svg?height=40&width=40"
    );
  };

  return (
    <Card className="w-full h-full flex flex-col rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="flex items-center">
            {participants.map((userId) => (
              <Avatar
                key={userId}
                className="-ml-2 first:ml-0 border-2 border-background"
              >
                <AvatarImage
                  src={getUserAvatar(userId)}
                  alt={getUserName(userId)}
                />
                <AvatarFallback>
                  {getUserName(userId).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="ml-2">{chatName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div role="log" aria-label="チャットメッセージ">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                } mb-4`}
              >
                {message.senderId !== currentUserId && (
                  <Avatar className="mr-2">
                    <AvatarImage src={getUserAvatar(message.senderId)} alt="" />
                    <AvatarFallback>
                      {getUserName(message.senderId).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
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
