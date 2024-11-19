import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type UserSelectionProps = {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
};

export const UserSelection = ({ users, currentUserId, onSelectUser }: UserSelectionProps) => {
  const currentUser = users.find((user) => user.id === currentUserId);

  return (
    <div className="p-4 border-b">
      <Select value={currentUserId} onValueChange={onSelectUser}>
        <SelectTrigger>
          <SelectValue>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={currentUser?.avatar} alt="" />
                <AvatarFallback>{currentUser?.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{currentUser?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
