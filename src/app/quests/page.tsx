"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Trophy, Target, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuestBoard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">
          Please sign in to access Quest Board.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Quest Board</h1>
          <p className="text-gray-300 text-lg">
            Daily challenges and missions await!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-md border-yellow-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span>Daily Quest</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Complete 3 tasks to earn bonus XP
            </p>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Star className="w-4 h-4 mr-2" />
              Accept Quest
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-red-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-red-400" />
              <span>Weekly Challenge</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Maintain a 7-day streak</p>
            <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              <Star className="w-4 h-4 mr-2" />
              View Progress
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-blue-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-400" />
              <span>Special Event</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Limited time community challenge
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Star className="w-4 h-4 mr-2" />
              Join Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
