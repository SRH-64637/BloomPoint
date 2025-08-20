"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignOutButton } from "@clerk/nextjs";
import {
  Home,
  Target,
  Trophy,
  Activity,
  Users,
  X,
  Star,
  Zap,
  Calendar,
  TrendingUp,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Default user stats for new users
const DEFAULT_USER_STATS = {
  level: 1,
  xp: 0,
  xpToNext: 100, // XP needed for level 2
  dailyStreak: 0,
  avatar: "🎮",
  username: "New Player",
  achievements: 0,
  totalXP: 0,
  rank: "Novice",
  hasCompletedSignup: false,
};

export default function Camp() {
  const { user, isLoaded } = useUser();
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userStats, setUserStats] = useState(DEFAULT_USER_STATS);
  const [xpProgress, setXpProgress] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user has existing stats in localStorage
      const existingStats = localStorage.getItem(`userStats_${user.id}`);

      if (existingStats) {
        const stats = JSON.parse(existingStats);
        setUserStats(stats);
      } else {
        // New user - give them signup bonus
        const newUserStats = {
          ...DEFAULT_USER_STATS,
          username: user.firstName || user.username || "Player",
          avatar: "🎮",
          xp: 50, // Signup bonus XP
          totalXP: 50,
          hasCompletedSignup: true,
        };

        setUserStats(newUserStats);
        localStorage.setItem(
          `userStats_${user.id}`,
          JSON.stringify(newUserStats)
        );
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // Animate XP progress bar
    const progress = (userStats.xp / userStats.xpToNext) * 100;
    setXpProgress(progress);
  }, [userStats.xp, userStats.xpToNext]);

  const addXP = (amount: number) => {
    if (!user) return;

    const newXP = userStats.xp + amount;
    const newTotalXP = userStats.totalXP + amount;

    // Check if user leveled up
    let newLevel = userStats.level;
    let newXpToNext = userStats.xpToNext;
    let newRank = userStats.rank;

    if (newXP >= userStats.xpToNext) {
      newLevel += 1;
      newXpToNext = newLevel * 100; // Each level requires level * 100 XP

      // Update rank based on level
      if (newLevel >= 10) newRank = "Elite Warrior";
      else if (newLevel >= 5) newRank = "Veteran";
      else if (newLevel >= 2) newRank = "Apprentice";
    }

    const updatedStats = {
      ...userStats,
      level: newLevel,
      xp: newXP >= userStats.xpToNext ? newXP - userStats.xpToNext : newXP,
      xpToNext: newXpToNext,
      totalXP: newTotalXP,
      rank: newRank,
    };

    setUserStats(updatedStats);
    localStorage.setItem(`userStats_${user.id}`, JSON.stringify(updatedStats));
  };

  const featureCards = [
    {
      title: "Job Portal",
      description: "Find your next adventure",
      icon: Target,
      href: "/jobs",
      color: "from-red-500 to-pink-500",
      xpReward: 150,
    },
    {
      title: "Wellness Hub",
      description: "Mind & body balance",
      icon: Activity,
      href: "/wellness",
      color: "from-green-500 to-emerald-500",
      xpReward: 100,
    },
    {
      title: "Planner",
      description: "Organize your quests",
      icon: Calendar,
      href: "/planner",
      color: "from-blue-500 to-cyan-500",
      xpReward: 75,
    },
    {
      title: "Forums",
      description: "Connect with allies",
      icon: Users,
      href: "/forums",
      color: "from-purple-500 to-violet-500",
      xpReward: 50,
    },
    {
      title: "Quests",
      description: "Daily challenges",
      icon: Trophy,
      href: "/quests",
      color: "from-yellow-500 to-orange-500",
      xpReward: 200,
    },
    {
      title: "Skill Forge",
      description: "Master new abilities",
      icon: TrendingUp,
      href: "/skills",
      color: "from-indigo-500 to-purple-500",
      xpReward: 175,
    },
  ];

  const dailyChallenge = {
    title: "Daily Quest: Skill Mastery",
    description: "Complete 3 tasks in any category to earn bonus XP",
    reward: 300,
    progress: 1,
    total: 3,
  };

  const achievements = [
    { name: "First Steps", icon: "🥇", unlocked: userStats.hasCompletedSignup },
    { name: "Week Warrior", icon: "🔥", unlocked: userStats.dailyStreak >= 7 },
    { name: "Task Master", icon: "⚡", unlocked: userStats.totalXP >= 1000 },
    { name: "Social Butterfly", icon: "🦋", unlocked: false },
    { name: "Wellness Guru", icon: "🧘", unlocked: false },
  ];

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
        <div className="text-white text-xl">Please sign in to access Camp.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 pt-24">
      {/* Welcome Banner with Profile Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-black/20 backdrop-blur-md border-red-500/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="text-4xl cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setShowProfile(true)}
                >
                  {userStats.avatar}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Welcome to Camp, {userStats.username}!
                  </h1>
                  <p className="text-gray-300">Your game home base awaits</p>
                  {!userStats.hasCompletedSignup && (
                    <p className="text-green-400 text-sm mt-1">
                      🎉 +50 XP for joining BloomPoint!
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Level & XP */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    Level {userStats.level}
                  </div>
                  <div className="text-sm text-gray-400">
                    XP: {userStats.xp}/{userStats.xpToNext}
                  </div>
                  <Progress value={xpProgress} className="w-32 h-2 mt-1" />
                </div>

                {/* Daily Streak */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-xl font-bold text-yellow-400">
                      {userStats.dailyStreak}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>

                {/* Profile Button */}
                <Button
                  onClick={() => setShowProfile(true)}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featureCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="bg-black/20 backdrop-blur-md border-red-500/20 shadow-lg hover:shadow-red-500/20 transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white group-hover:text-red-400 transition-colors">
                    {card.title}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-red-500/20 text-red-400 border-red-500/30"
                  >
                    +{card.xpReward} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${card.color} shadow-lg`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-300 text-sm">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Challenge Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-center"
      >
        <Button
          onClick={() => setShowDailyChallenge(true)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
        >
          <Star className="w-5 h-5 mr-2" />
          View Daily Challenge
        </Button>
      </motion.div>

      {/* Daily Challenge Popup */}
      <AnimatePresence>
        {showDailyChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDailyChallenge(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/90 backdrop-blur-md border border-red-500/30 rounded-lg p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Daily Challenge</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDailyChallenge(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {dailyChallenge.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {dailyChallenge.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {dailyChallenge.progress}/{dailyChallenge.total}
                    </span>
                  </div>
                  <Progress
                    value={
                      (dailyChallenge.progress / dailyChallenge.total) * 100
                    }
                    className="h-2"
                  />
                </div>

                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    Reward: {dailyChallenge.reward} XP
                  </span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  onClick={() => {
                    addXP(dailyChallenge.reward);
                    setShowDailyChallenge(false);
                  }}
                >
                  Accept Challenge
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Popup */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/90 backdrop-blur-md border border-red-500/30 rounded-lg p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <User className="w-5 h-5 text-red-400" />
                  <span>Player Profile</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfile(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{userStats.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {userStats.username}
                    </h3>
                    <p className="text-red-400 font-semibold">
                      {userStats.rank}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Level {userStats.level}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {userStats.totalXP}
                    </div>
                    <div className="text-sm text-gray-400">Total XP</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {userStats.achievements}
                    </div>
                    <div className="text-sm text-gray-400">Achievements</div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Recent Achievements
                  </h4>
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-2 rounded ${
                          achievement.unlocked
                            ? "bg-green-500/20"
                            : "bg-gray-500/20"
                        }`}
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <span
                          className={`text-sm ${
                            achievement.unlocked
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          {achievement.name}
                        </span>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <SignOutButton>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </SignOutButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
