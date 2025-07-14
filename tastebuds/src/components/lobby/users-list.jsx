import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UsersList({ users, currentUserId }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(users).map(([userId, userData]) => (
        <div key={userId} className="flex flex-col items-center">
          <Avatar className="h-12 w-12 mb-1">
            <AvatarFallback className={userId === currentUserId ? "bg-primary text-primary-foreground" : ""}>
              {userData.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{userData.isHost === true ? `${userData.name} (Host)` : userData.name}</span>
        </div>
      ))}
    </div>
  )
}

