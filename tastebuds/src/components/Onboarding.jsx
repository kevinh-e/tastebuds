"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { HelpCircle } from "lucide-react"

export default function Onboarding() {
  const [step, setStep] = useState(1)

  const stepContent = [
    {
      title: "Welcome to Tastebuds",
      description:
        "Discover the best flavors for your group with Tastebuds. Let’s make dining decisions simple and fun.",
    },
    {
      title: "Host or join a room",
      description:
        "Start a new room as a host or join an existing one using a room code. It’s quick and collaborative.",
    },
    {
      title: "Set your preferences",
      description:
        "Select your favorite cuisines, preferred locations, budget, and rating filters to personalize your experience.",
    },
    {
      title: "See the group's preferences",
      description:
        "In the lobby, view everyone's combined preferences. Tastebuds will suggest restaurants that best match the group’s taste.",
    },
    {
      title: "Cast your votes",
      description:
        "Review restaurant options one by one. Swipe right to vote Yes, or left to vote No. Make sure to vote before time runs out!",
    },
    {
      title: "Bon appétit!",
      description:
        "Once all votes are in, check out the top picks and make dining plans with your group. Enjoy your meal!",
    },
  ];

  const totalSteps = stepContent.length

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1)
      }}
    >
      <DialogTrigger asChild>
        <div className="w-full flex">
          <Button variant="secondary" className="mx-auto border border-primary/50 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
            <HelpCircle /> How to Play
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white bg-white">
        <div className="p-2">
          <Image
            className="w-full max-h-[216px] rounded-md bg-accent"
            src="/burger-cheese-burger.gif"
            alt="Onboarding 1"
            width={382}
            height={216}
          />
        </div>
        <div className="space-y-6 px-6 pt-3 pb-6">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-primary size-1.5 rounded-full",
                    index + 1 === step ? "bg-primary" : "opacity-20"
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                >
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button type="button">Okay</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
