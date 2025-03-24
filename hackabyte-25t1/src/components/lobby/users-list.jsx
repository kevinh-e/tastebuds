import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UsersList({ users, currentUserId }) {
  return (
    <div className="flex flex-wrap gap-3">
      {users.map((user) => (
        <div key={user.id} className="flex flex-col items-center">
          <Avatar className="h-12 w-12 mb-1">
            <AvatarFallback className={user.id === currentUserId ? "bg-primary text-primary-foreground" : ""}>
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{user.id === currentUserId ? `${user.name} (You)` : user.name}</span>
        </div>
      ))}
    </div>
  )
}

