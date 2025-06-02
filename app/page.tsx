"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [birthday, setBirthday] = useState<string>("")
  const [weeksLeft, setWeeksLeft] = useState<number | null>(null)
  const [totalWeeks, setTotalWeeks] = useState<number | null>(null)
  const [weeksLived, setWeeksLived] = useState<number | null>(null)

  useEffect(() => {
    const savedBirthday = localStorage.getItem("birthday")

    if (savedBirthday) {
      setBirthday(savedBirthday)
      // Calculate weeks after a short delay to ensure state is updated
      setTimeout(() => calculateWeeksLeft(savedBirthday), 100)
    }
  }, [])

  const calculateWeeksLeft = (birthdayInput?: string) => {
    const birthdayToUse = birthdayInput || birthday

    if (!birthdayToUse) return

    const birthDate = new Date(birthdayToUse)
    const today = new Date()

    // Calculate 80th birthday
    const eightiethBirthday = new Date(birthDate)
    eightiethBirthday.setFullYear(birthDate.getFullYear() + 80)

    // If they're already past 80, don't show visualization
    if (today > eightiethBirthday) {
      return
    }

    // Calculate weeks lived (from birth to today)
    const millisecondsLived = today.getTime() - birthDate.getTime()
    const weeksLivedCalc = Math.floor(millisecondsLived / (7 * 24 * 60 * 60 * 1000))

    // Calculate total weeks in 80 years (from birth to 80th birthday)
    const totalMilliseconds = eightiethBirthday.getTime() - birthDate.getTime()
    const totalWeeksCalc = Math.floor(totalMilliseconds / (7 * 24 * 60 * 60 * 1000))

    // Calculate weeks remaining
    const remaining = totalWeeksCalc - weeksLivedCalc

    // Save to localStorage
    localStorage.setItem("birthday", birthdayToUse)

    setTotalWeeks(totalWeeksCalc)
    setWeeksLived(weeksLivedCalc)
    setWeeksLeft(remaining)
  }

  // Calculate max date (today)
  const today = new Date()
  const maxDate = today.toISOString().split("T")[0]

  // Calculate min date (120 years ago, reasonable limit)
  const minDate = new Date()
  minDate.setFullYear(today.getFullYear() - 120)
  const minDateString = minDate.toISOString().split("T")[0]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-white text-gray-900">
      <div className="max-w-3xl w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Memento Vivere</h1>
          <p className="text-lg md:text-xl text-gray-600 font-light">Make each day your masterpiece.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="relative w-full md:w-64">
            <Input
              type="date"
              placeholder="Your birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="h-12 text-lg"
              min={minDateString}
              max={maxDate}
            />
          </div>
          <Button
            onClick={() => calculateWeeksLeft()}
            className="w-full md:w-auto h-12 px-6 bg-gray-900 hover:bg-gray-800"
          >
            Visualize <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {weeksLeft !== null && (
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("birthday")
                setBirthday("")
                setWeeksLeft(null)
                setTotalWeeks(null)
                setWeeksLived(null)
              }}
              className="w-full md:w-auto h-12"
            >
              Reset
            </Button>
          )}
        </div>

        {weeksLeft !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-light">Your life in weeks</h2>
              <p className="text-3xl font-light mt-2">{weeksLeft?.toLocaleString()} weeks left</p>
            </div>

            <div className="grid grid-cols-52 gap-1">
              {totalWeeks &&
                Array.from({ length: totalWeeks }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: index * 0.0005,
                      duration: 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                    className={`aspect-square rounded-sm ${index < (weeksLived || 0) ? "bg-gray-300" : "bg-gray-900"}`}
                  />
                ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 pt-2">
              <span>Birth</span>
              <span>40 years</span>
              <span>80 years</span>
            </div>

            <div className="text-center text-gray-600 italic pt-8">
              "The proper function of man is to live, not to exist." — Jack London
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
