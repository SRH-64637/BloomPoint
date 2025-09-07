"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Wind,
  PenLine,
  Sparkles,
  Timer,
  Shuffle,
} from "lucide-react";

export default function WellnessPage() {
  const { user } = useUser();
  // Breathing cycle
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  useEffect(() => {
    let isCancelled = false;
    const run = async () => {
      while (!isCancelled) {
        setPhase("inhale");
        await new Promise((r) => setTimeout(r, 4000));
        setPhase("hold");
        await new Promise((r) => setTimeout(r, 2000));
        setPhase("exhale");
        await new Promise((r) => setTimeout(r, 4000));
      }
    };
    run();
    return () => {
      isCancelled = true;
    };
  }, []);

  const scaleForPhase = phase === "inhale" || phase === "hold" ? 1.12 : 1.0;
  const durationForPhase = phase === "hold" ? 2 : 4;


  // Journaling
  const [entry, setEntry] = useState("");
  const [savedTick, setSavedTick] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/wellness");
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched logs:", data); // Debug log

          // Ensure logs is always an array
          if (Array.isArray(data)) {
            setLogs(data);
          } else {
            console.error("Expected array of logs, got:", data);
            setLogs([]);
          }
        } else {
          console.error("Failed to fetch logs, status:", res.status);
          setLogs([]);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const saveJournal = async () => {
    if (!entry.trim()) {
      alert("Please enter some text before saving.");
      return;
    }

    if (!user) {
      alert("Please sign in to save journal entries.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: entry.trim(),
        }),
      });

      const response = await res.json();
      console.log("Save response:", response); // Debug log

      if (res.ok) {
        // The API returns { message: "...", wellnessLog: {...} }
        const newLog = response.wellnessLog;
        if (newLog) {
          setEntry("");
          setLogs((prev) => [newLog, ...prev]);
          console.log("Journal entry saved successfully!");
        } else {
          console.error("No wellnessLog in response:", response);
          alert("Failed to save entry. Please try again.");
        }
      } else {
        console.error("Save failed:", response);
        alert(`Failed to save: ${response.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to save journal:", error);
      alert("Failed to save journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Affirmations
  const affirmations = useMemo(
    () => [
      "You are enough.",
      "You are safe here.",
      "Your feelings are valid.",
      "One breath at a time.",
      "Rest is productive.",
      "You are doing your best.",
    ],
    []
  );
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const shuffleAffirmation = () => {
    if (affirmations.length <= 1) return;
    let next = Math.floor(Math.random() * affirmations.length);
    if (next === affirmationIndex) next = (next + 1) % affirmations.length;
    setAffirmationIndex(next);
  };

  // One-minute timer
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft === 0) {
      setSecondsLeft(null);
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => (s ? s - 1 : 0)), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);
  const timerPct = secondsLeft === null ? 0 : (secondsLeft / 60) * 100;

  return (
    <div className="container mx-auto px-6 py-12 pt-28">
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-sky-200">
          Wellness Space
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Breathing */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wind className="w-5 h-5 text-emerald-300" />
                Breathing Exercise
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <motion.div
                className="w-40 h-40 rounded-full border-4 border-emerald-300/60 bg-emerald-300/10 shadow-inner"
                animate={{ scale: scaleForPhase }}
                transition={{ duration: durationForPhase, ease: "easeInOut" }}
              />
              <div className="mt-6 text-emerald-200/90 text-lg">
                {phase === "inhale" && "Inhale…"}
                {phase === "hold" && "Hold…"}
                {phase === "exhale" && "Exhale…"}
              </div>
              <div className="mt-2 text-gray-300 text-sm">
                Slowly. Gently. You are safe.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journaling */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PenLine className="w-5 h-5 text-sky-300" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write it out… this is your safe space."
                className="w-full min-h-40 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-[0_6px_30px_rgba(0,0,0,0.15)]"
              />
              <div className="mt-4 flex items-center gap-3">
                <Button
                  onClick={saveJournal}
                  disabled={isSaving || !entry.trim()}
                  className="bg-sky-600 hover:bg-sky-700 rounded-xl disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                {isSaving && (
                  <div className="text-sm text-gray-400">
                    Saving your entry...
                  </div>
                )}
              </div>

              {/* Display saved logs */}
              <div className="mt-6 space-y-2">
                {isLoading ? (
                  <div className="text-center text-gray-400 py-4">
                    Loading your wellness logs...
                  </div>
                ) : Array.isArray(logs) && logs.length > 0 ? (
                  logs.map((log) => (
                    <div
                      key={log._id}
                      className="p-3 bg-white/5 rounded-lg text-white/90"
                    >
                      <div className="text-sm">{log.entry}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `/api/wellness?id=${log._id}`,
                                { method: "DELETE" }
                              );
                              if (res.ok) {
                                setLogs((prev) =>
                                  prev.filter((l) => l._id !== log._id)
                                );
                              } else {
                                const e = await res.json();
                                alert(e.error || "Failed to delete");
                              }
                            } catch (e) {
                              console.error(e);
                              alert("Failed to delete");
                            }
                          }}
                          className="text-xs text-red-300 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    {isLoading
                      ? "Loading..."
                      : "Great job! You’ve completed all your chores for today!"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Affirmations */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-300" />
                Affirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="text-lg text-white/90">
                {affirmations[affirmationIndex]}
              </div>
              <Button
                variant="outline"
                className="border-white/20 rounded-xl hover:bg-white/10"
                onClick={shuffleAffirmation}
              >
                <Shuffle className="w-4 h-4 mr-2" /> Shuffle
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* One-minute timer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Timer className="w-5 h-5 text-emerald-300" />
                Take a Minute Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl tabular-nums text-white/90">
                  {secondsLeft === null
                    ? "01:00"
                    : `${String(Math.floor(secondsLeft / 60)).padStart(
                        2,
                        "0"
                      )}:${String(secondsLeft % 60).padStart(2, "0")}`}
                </div>
                {secondsLeft === null ? (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    onClick={() => setSecondsLeft(60)}
                  >
                    Start
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-white/20 rounded-xl hover:bg-white/10"
                    onClick={() => setSecondsLeft(null)}
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-300/70 to-teal-300/70"
                  initial={{ width: "100%" }}
                  animate={{
                    width: secondsLeft === null ? "0%" : `${timerPct}%`,
                  }}
                  transition={{ ease: "linear", duration: 0.2 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
