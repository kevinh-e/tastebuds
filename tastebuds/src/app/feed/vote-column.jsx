import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function VoteColumn({ isYes = true }) {
  return (
    <Card className={`border-2 w-24
      ${isYes ?
        "bg-green-100 border-green-500" :
        "bg-red-100 border-red-500"
      }`
    }>
      <CardHeader>
        <div className={`w-8 flex items-center justify-center rounded-full text-white aspect-square ${isYes ? 'bg-green-500' : 'bg-red-500'}`}>
          {isYes ? <Check size={24} /> : <X size={24} />}
        </div>
      </CardHeader>
      <CardContent>
        hello
      </CardContent>
    </Card>
  )
}