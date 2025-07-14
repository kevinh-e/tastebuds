import { Badge } from "@/components/ui/badge"

export default function PreferencesList({ users, preferenceType }) {

  // Get all preferences from the nested preferences object
  const allPreferences = Object.values(users).flatMap((user) => {
    const prefs = user.preferences?.[preferenceType];
    return Array.isArray(prefs) ? prefs : prefs ? [prefs] : [];
  });

  const uniquePreferences = [...new Set(allPreferences)];

  const preferenceCounts = uniquePreferences.map((pref) => {
    const count = Object.values(users).filter((user) => {
      const prefs = user.preferences?.[preferenceType];
      return Array.isArray(prefs) ? prefs.includes(pref) : prefs === pref;
    }).length;
    return { preference: pref, count };
  });

  preferenceCounts.sort((a, b) => b.count - a.count);

  if (preferenceCounts.length === 0) {
    return <p className="text-sm text-muted-foreground">No preferences added yet</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {preferenceCounts.map(({ preference, count }) => (
        <Badge key={preference} variant="outline" className="flex items-center gap-1">
          {preference}
          <span className="ml-1 bg-muted text-muted-foreground rounded-full text-xs px-1.5">
            {count}
          </span>
        </Badge>
      ))}
    </div>
  );
}
