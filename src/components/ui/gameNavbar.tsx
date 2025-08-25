"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { User, LogOut, Bell, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function GameNavbar() {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/camp", label: "Camp" },
    { href: "/skills", label: "Skill Forge" },
    { href: "/jobs", label: "Quest Board" },
    { href: "/lounge", label: "Lounge" },
    { href: "/wellness", label: "Zen Den" },
  ];

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="flex absolute top-0 left-0 right-0 z-50 backdrop-blur-md items-center justify-between px-6 py-4 gap-12">
        <div className="text-base tracking-wider font-bold text-white">
          BloomPoint
        </div>
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 gap-4">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="text-sm tracking-wider font-mono text-white"
            >
              {link.label}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-20 h-8 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex absolute top-0 left-0 right-0 z-50 backdrop-blur-md items-center justify-between px-6 py-4 gap-12">
      {/* Left - Logo */}
      <Link
        href="/"
        className="text-base tracking-wider font-bold text-white hover:text-green-300 transition-colors hover:duration-200 z-50"
        aria-label="Home"
      >
        BloomPoint
      </Link>

      {/* Center - Navigation Links with exact spacing from example */}
      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm tracking-wider font-mono text-white hover:text-green-300 transition-colors hover:duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right - Auth Buttons and Quick Access */}
      <div className="flex items-center space-x-3">
        {isLoaded && (
          <>
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {/* Quick Access Icons */}
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Trophy className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <SignOutButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
