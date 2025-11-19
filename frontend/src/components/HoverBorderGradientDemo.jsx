"use client";
import React from "react";
import { HoverBorderGradient } from "../components/hover-border-gradient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";


export function HoverBorderGradientDemo() {
  const isLogin = useAuth((s) => s.isLogin);

  const navigate = useNavigate();
    const handleClick = () => {
  if (isLogin) {
    navigate("/tools");   // logged in → go to tools
  } else {
    navigate("/login");   // not logged in → go to login page
  }
};

  return (
    <div className="mt-5 mx-40 mb-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        onClick={handleClick}
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3"
      >
        <AceternityLogo />
        <span>
  {isLogin ? "Get Started" : "Login"}
</span>
      </HoverBorderGradient>
    </div>
  );
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
