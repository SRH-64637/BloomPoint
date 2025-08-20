"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, MessageCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Lounge() {
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
          Please sign in to access Lounge.
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
          <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Community Lounge
          </h1>
          <p className="text-gray-300 text-lg">
            Connect, share, and grow with fellow BloomPoint members!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/20 backdrop-blur-md border-purple-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span>Discussion Forums</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Join conversations about career growth
            </p>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
              <Star className="w-4 h-4 mr-2" />
              Browse Topics
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-blue-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Study Groups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Collaborate with peers on learning goals
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Star className="w-4 h-4 mr-2" />
              Find Groups
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-green-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-green-400" />
              <span>Mentorship</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Connect with experienced professionals
            </p>
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Star className="w-4 h-4 mr-2" />
              Find Mentor
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
