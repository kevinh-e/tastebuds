import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Check } from "lucide-react"

export default function UsersList({ users, currentUserId }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {Object.entries(users).map(([userId, userData]) => {
        const isCurrentUser = userId === currentUserId
        const isHost = userData.isHost === true
        const isEditing = userData.isChoosingPreferences;

        return (
          <div key={userId} className="pt-1 w-16 flex flex-col items-center space-y-2">
            <div className="relative">
              <Avatar
                className={`size-14 transition-all duration-200 ${
                  isCurrentUser
                    ? "ring-2 ring-primary ring-offset-2"
                    : "ring-1 ring-border"
                }`}
              >
                <AvatarFallback
                  className={`text-sm font-semibold ${
                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {userData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {isHost && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Crown className="size-3 text-white" />
                </div>
              )}

              {!isEditing && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-1 max-w-full">
              <span
                className={`text-sm font-medium text-center leading-tight max-w-full truncate ${
                  isCurrentUser ? "text-primary" : "text-foreground"
                }`}
                title={userData.name}
              >
                {userData.name}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
