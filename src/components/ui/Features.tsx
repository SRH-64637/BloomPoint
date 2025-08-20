import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Briefcase,
  Star,
  Users,
  Gamepad,
  Trophy,
  Sparkles,
} from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: Briefcase,
      title: "Job Portal",
      description:
        "Discover curated job opportunities that match your skills and goals.",
    },
    {
      icon: Star,
      title: "Skill Development",
      description:
        "Access courses, challenges, and workshops to grow your abilities at your own pace.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Connect, share, and collaborate with others in a safe and engaging environment.",
    },
    {
      icon: Gamepad,
      title: "Gamified Progress",
      description:
        "Complete tasks, earn points, and level up as you interact with the platform.",
    },
    {
      icon: Trophy,
      title: "Achievements",
      description:
        "Showcase milestones, badges, and accomplishments to track your progress.",
    },
  ];

  return (
    <section id="features" className="relative py-12 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F87171] to-[#7F1D1D] rounded-full text-white text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Built for your
            <span className="block bg-gradient-to-r from-[#F87171] to-[#7F1D1D] bg-clip-text text-transparent">
              growth
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Tools to enhance your skills, explore opportunities, and engage with
            a vibrant community.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative h-full bg-black/20 backdrop-blur-sm border border-gray-800/30 hover:border-[#F87171]/50 transition-all duration-300 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F87171]/5 to-[#7F1D1D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#F87171] to-[#7F1D1D] flex items-center justify-center shadow-lg">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-800/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-3 h-3 text-[#F87171]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#F87171] transition-colors duration-300">
                    {feature.title}
                  </h3>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-[#F87171] to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#F87171] to-[#7F1D1D] rounded-full text-white font-medium hover:shadow-lg hover:shadow-[#F87171]/25 transition-all duration-300 cursor-pointer">
            <Sparkles className="w-4 h-4" />
            Start Your Journey
          </div>
        </motion.div>
      </div>
    </section>
  );
}
