"use client";

import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Wind,
  Music2,
  PenLine,
  Sparkles,
  Timer,
  Shuffle,
  CloudRain,
  Leaf,
  Waves,
  Flame,
  Moon,
  Coffee,
} from "lucide-react";

export default function WellnessPage() {
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

  // Ambient sounds
  const [rainOn, setRainOn] = useState(false);
  const [forestOn, setForestOn] = useState(false);
  const [oceanOn, setOceanOn] = useState(false);
  const [windOn, setWindOn] = useState(false);
  const [nightOn, setNightOn] = useState(false);
  const [fireplaceOn, setFireplaceOn] = useState(false);
  const [cafeOn, setCafeOn] = useState(false);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const forestRef = useRef<HTMLAudioElement | null>(null);
  const oceanRef = useRef<HTMLAudioElement | null>(null);
  const windRef = useRef<HTMLAudioElement | null>(null);
  const nightRef = useRef<HTMLAudioElement | null>(null);
  const fireplaceRef = useRef<HTMLAudioElement | null>(null);
  const cafeRef = useRef<HTMLAudioElement | null>(null);

  const ensureAudio = (
    ref: MutableRefObject<HTMLAudioElement | null>,
    src: string
  ) => {
    if (!ref.current) {
      const el = new Audio(src);
      el.loop = true;
      el.volume = 0.2;
      el.crossOrigin = "anonymous";
      ref.current = el;
    }
    return ref.current!;
  };

  const toggleAudio = async (
    ref: MutableRefObject<HTMLAudioElement | null>,
    src: string,
    on: boolean,
    setOn: (v: boolean) => void
  ) => {
    const el = ensureAudio(ref, src);
    try {
      if (!on) {
        await el.play();
        setOn(true);
      } else {
        el.pause();
        setOn(false);
      }
    } catch (e) {
      // ignore play errors (e.g., autoplay restrictions)
    }
  };

  // Journaling
  const [entry, setEntry] = useState("");
  const [savedTick, setSavedTick] = useState(0);
  const saveJournal = () => {
    if (!entry.trim()) return;
    setEntry("");
    setSavedTick((n) => n + 1);
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

        {/* Ambient Sounds */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
        >
          <Card className="rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Music2 className="w-5 h-5 text-teal-300" />
                Ambient Sounds
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant={rainOn ? "default" : "outline"}
                className={`${
                  rainOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    rainRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3",
                    rainOn,
                    setRainOn
                  )
                }
              >
                <CloudRain className="w-4 h-4 mr-2" /> Rain
              </Button>
              <Button
                variant={forestOn ? "default" : "outline"}
                className={`${
                  forestOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    forestRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1211.mp3",
                    forestOn,
                    setForestOn
                  )
                }
              >
                <Leaf className="w-4 h-4 mr-2" /> Forest
              </Button>
              <Button
                variant={oceanOn ? "default" : "outline"}
                className={`${
                  oceanOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    oceanRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-loop-1195.mp3",
                    oceanOn,
                    setOceanOn
                  )
                }
              >
                <Waves className="w-4 h-4 mr-2" /> Ocean
              </Button>
              <Button
                variant={windOn ? "default" : "outline"}
                className={`${
                  windOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    windRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-strong-wind-noise-2462.mp3",
                    windOn,
                    setWindOn
                  )
                }
              >
                <Wind className="w-4 h-4 mr-2" /> Wind
              </Button>
              <Button
                variant={nightOn ? "default" : "outline"}
                className={`${
                  nightOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    nightRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-crickets-and-insects-in-the-night-ambience-2470.mp3",
                    nightOn,
                    setNightOn
                  )
                }
              >
                <Moon className="w-4 h-4 mr-2" /> Night
              </Button>
              <Button
                variant={fireplaceOn ? "default" : "outline"}
                className={`${
                  fireplaceOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    fireplaceRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-wood-fire-crackling-1333.mp3",
                    fireplaceOn,
                    setFireplaceOn
                  )
                }
              >
                <Flame className="w-4 h-4 mr-2" /> Fireplace
              </Button>
              <Button
                variant={cafeOn ? "default" : "outline"}
                className={`${
                  cafeOn
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 hover:bg-white/10"
                } rounded-xl justify-start`}
                onClick={() =>
                  toggleAudio(
                    cafeRef,
                    "https://assets.mixkit.co/sfx/preview/mixkit-crowd-outdoor-voices-ambience-364.mp3",
                    cafeOn,
                    setCafeOn
                  )
                }
              >
                <Coffee className="w-4 h-4 mr-2" /> Cafe
              </Button>
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
                Journaling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Let it out… this is your safe space."
                className="w-full min-h-40 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-[0_6px_30px_rgba(0,0,0,0.15)]"
              />
              <div className="mt-4 flex items-center gap-3">
                <Button
                  onClick={saveJournal}
                  className="bg-sky-600 hover:bg-sky-700 rounded-xl"
                >
                  Save
                </Button>
                {savedTick > 0 && (
                  <span className="text-sm text-gray-300">Saved.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Affirmations */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
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
          transition={{ duration: 0.8, delay: 0.2 }}
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
