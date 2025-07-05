"use client"

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import { Home, Briefcase, BookOpen, Github, FileText } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
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
              ⵣ
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
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18L6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <MobileNavigation isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </header>
  );
}