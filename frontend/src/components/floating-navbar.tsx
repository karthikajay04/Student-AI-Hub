"use client";
import React, { JSX } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {

  // ✅ FIX: get logout from Zustand
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();


  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <Link
          key={`link=${idx}`}
          to={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </Link>
      ))}

      {/* Logout Button */}
      <button
  onClick={() => {
    logout();
    navigate("/");
  }}
  className="
    group border text-sm font-medium relative
    border-neutral-200 dark:border-white/20
    text-black dark:text-white
    px-4 py-2 rounded-full
    transition-all duration-300
  "
>
  <span className="block group-hover:opacity-0 transition-opacity duration-300">
    Student AI Hub
  </span>

  <span
    className="
      block absolute inset-0 flex items-center justify-center
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
    "
  >
    Logout
  </span>

  <span
    className="
      absolute inset-x-0 w-1/2 mx-auto -bottom-px
      bg-gradient-to-r from-transparent via-blue-500 to-transparent
      h-px
    "
  />
</button>
    </motion.div>
  );
};
