"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DotCard() {
  const features = [
    {
      title: "Camp",
      description: "Your base for training and preparation",
      href: "/camp",
      icon: "🏕️",
      gradient: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
    },
    {
      title: "Skill Forge",
      description: "Master new abilities and upgrade your skills",
      href: "/skills",
      icon: "⚔️",
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Quest Board",
      description: "Accept challenges and earn rewards",
      href: "/quests",
      icon: "📜",
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
    },
    {
      title: "Lounge",
      description: "Connect with fellow adventurers",
      href: "/lounge",
      icon: "🍺",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            <div
              className={`relative h-full rounded-xl border ${feature.borderColor} bg-gradient-to-br ${feature.gradient} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20`}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground flex-grow leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Link */}
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300 group/link"
                >
                  <span className="mr-2">Explore</span>
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="w-8 h-8 bg-primary/20 transform rotate-45 translate-x-4 -translate-y-4" />
              </div>

              <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                <div className="w-6 h-6 bg-primary/10 transform rotate-45 -translate-x-3 translate-y-3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
