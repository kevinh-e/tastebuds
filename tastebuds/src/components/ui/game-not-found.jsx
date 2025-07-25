import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export default function GameNotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="shadow max-w-xl w-full px-8">
        <CardHeader className="flex flex-col items-center">
          <img
            src="/burger.gif"
            alt="Burger animation"
            className="w-32 h-32 mb-4 select-none object-contain"
          />
          <CardTitle className="text-3xl">Game not found!</CardTitle>
          <CardDescription className="text-lg">You must join or host a lobby before accessing this page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </CardContent>
      </Card>
    </div>
  );
} 