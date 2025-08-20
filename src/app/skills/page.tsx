"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { TrendingUp, Target, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SkillForge() {
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
          Please sign in to access Skill Forge.
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
          <TrendingUp className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Skill Forge</h1>
          <p className="text-gray-300 text-lg">
            Master new abilities and level up your expertise!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-md border-indigo-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Technical Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Programming, design, and development
            </p>
            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Star className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-green-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Soft Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Communication, leadership, teamwork
            </p>
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Star className="w-4 h-4 mr-2" />
              Develop Skills
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-yellow-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Industry-recognized credentials
            </p>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Star className="w-4 h-4 mr-2" />
              Get Certified
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
