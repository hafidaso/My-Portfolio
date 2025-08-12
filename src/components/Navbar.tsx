"use client"

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import { Home, Briefcase, BookOpen, Globe, Palette, Database } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Websites", href: "/websites", icon: Globe },
  { name: "Graphics", href: "/graphics", icon: Palette },
  { name: "MY PLANET IN DATA", href: "/data-science", icon: Database },
  { name: "Blog", href: "/blog", icon: BookOpen },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-foreground">
              H ∩ B
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  <link.icon className="mr-2 h-5 w-5" />
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-primary group-hover:scale-x-100"
                    layoutId="underline"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ThemeToggle />
            </div>
          </div>

        </div>
      </nav>

      <MobileNavigation isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </header>
  );
}