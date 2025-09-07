"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Edit,
  Settings,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  Flame,
  HandHeart,
  BookOpen,
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  completed: boolean;
  progress: number;
  target: number;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "Location not set",
    bio: "Bio not set",
    phone: "Phone not set",
    github: "",
    linkedin: "",
    website: "",
  });
  const [userXP, setUserXP] = useState({
    xp: 0,
    level: 1,
    totalXP: 0,
    xpToNextLevel: 100,
    xpProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  const [badges] = useState<Badge[]>([
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first task",
      icon: "Target",
      color: "bg-blue-500",
      unlockedAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: "Flame",
      color: "bg-orange-500",
      unlockedAt: "2024-01-15",
    },
    {
      id: "3",
      name: "Community Helper",
      description: "Help 10 other users",
      icon: "HandHeart",
      color: "bg-green-500",
      unlockedAt: "2024-01-20",
    },
    {
      id: "4",
      name: "Knowledge Seeker",
      description: "Complete 50 learning modules",
      icon: "BookOpen",
      color: "bg-purple-500",
      unlockedAt: "2024-01-25",
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      name: "Task Master",
      description: "Complete 100 tasks",
      xp: 500,
      completed: false,
      progress: 67,
      target: 100,
    },
    {
      id: "2",
      name: "Wellness Champion",
      description: "Track mood for 30 days",
      xp: 300,
      completed: false,
      progress: 23,
      target: 30,
    },
    {
      id: "3",
      name: "Social Butterfly",
      description: "Make 50 forum posts",
      xp: 400,
      completed: false,
      progress: 31,
      target: 50,
    },
  ]);

  // Use real XP data from state

  const totalBadges = badges.length;
  const unlockedBadges = badges.length;
  const totalAchievements = achievements.length;
  const completedAchievements = achievements.filter((a) => a.completed).length;

  // Fetch user data and XP
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;

      try {
        // Fetch user profile from our API
        const profileResponse = await fetch("/api/me");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile((prev) => ({
            ...prev,
            name:
              profileData.name ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "User",
            email:
              profileData.email || user.emailAddresses[0]?.emailAddress || "",
          }));
        }

        // Fetch user XP
        const xpResponse = await fetch("/api/me/xp");
        if (xpResponse.ok) {
          const xpData = await xpResponse.json();
          setUserXP(xpData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user]);

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to a database
  };

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
          Please sign in to view your profile.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Profile</h1>
        <p className="text-gray-300 text-lg">Your journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <CardTitle className="text-white text-xl">{profile.name}</CardTitle>
            <p className="text-gray-300 text-sm">
              Level {userXP.level} Developer
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* XP Progress */}
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {userXP.xp} XP
              </div>
              <div className="text-sm text-gray-300 mb-2">
                Level {userXP.level}
              </div>
              <Progress value={userXP.xpProgress} className="h-2 mb-2" />
              <div className="text-xs text-gray-400">
                {userXP.xpToNextLevel - userXP.xp} XP to next level
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {totalBadges}
                </div>
                <div className="text-xs text-gray-300">Badges</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {completedAchievements}
                </div>
                <div className="text-xs text-gray-300">Achievements</div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-blue-400" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      handleProfileUpdate("name", e.target.value)
                    }
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      handleProfileUpdate("location", e.target.value)
                    }
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={saveProfile}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{profile.phone}</span>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-white/20">
                  <h4 className="text-sm font-medium text-white mb-3">
                    Social Links
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        github.com/{profile.github}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        linkedin.com/in/{profile.linkedin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{profile.website}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges and Achievements */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Badges & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Badges */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Badges ({unlockedBadges}/{totalBadges})
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="text-center p-3 bg-white/5 rounded-lg border border-white/20"
                    title={badge.description}
                  >
                    <div className="text-2xl mb-2">
                      {badge.icon === "Target" && <Target className="w-6 h-6 text-blue-400 mx-auto" />}
                      {badge.icon === "Flame" && <Flame className="w-6 h-6 text-orange-400 mx-auto" />}
                      {badge.icon === "HandHeart" && <HandHeart className="w-6 h-6 text-green-400 mx-auto" />}
                      {badge.icon === "BookOpen" && <BookOpen className="w-6 h-6 text-purple-400 mx-auto" />}
                    </div>
                    <div className="text-xs font-medium text-white mb-1">
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {badge.unlockedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="pt-4 border-t border-white/20">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Achievements ({completedAchievements}/{totalAchievements})
              </h4>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {achievement.xp} XP
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (achievement.progress / achievement.target) * 100
                        }
                        className="flex-1 h-2"
                      />
                      <span className="text-xs text-gray-400">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
