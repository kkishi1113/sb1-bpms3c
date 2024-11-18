import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type User = {
  id: string
  name: string
  avatar: string
}

type UserSelectorProps = {
  users: User[]
  currentUserId: string
  onSelectUser: (userId: string) => void
}

export function UserSelector({ users, currentUserId, onSelectUser }: UserSelectorProps) {
  const currentUser = users.find(user => user.id === currentUserId)

  return (
    <div className="p-4 border-b">
      <Select value={currentUserId} onValueChange={onSelectUser}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={currentUser?.avatar} alt="" />
                <AvatarFallback>{currentUser?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{currentUser?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}