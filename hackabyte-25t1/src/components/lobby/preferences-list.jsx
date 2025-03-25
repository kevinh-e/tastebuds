import { Badge } from "@/components/ui/badge"

export default function PreferencesList({ users, preferenceType }) {
  // Get all unique preferences
  const allPreferences = Object.values(users).flatMap((user) => user[preferenceType])
  const uniquePreferences = [...new Set(allPreferences)]

  // Count occurrences of each preference
  const preferenceCounts = uniquePreferences.map((pref) => {
    const count = Object.values(users).filter((user) => user[preferenceType].includes(pref)).length
    return { preference: pref, count }
  })

  // Sort by count (descending)
  preferenceCounts.sort((a, b) => b.count - a.count)

  if (preferenceCounts.length === 0) {
    return <p className="text-sm text-muted-foreground">No preferences added yet</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {preferenceCounts.map(({ preference, count }) => (
        <Badge key={preference} variant="outline" className="flex items-center gap-1">
          {preference}
          <span className="ml-1 bg-muted text-muted-foreground rounded-full text-xs px-1.5">{count}</span>
        </Badge>
      ))}
    </div>
  )
}

