"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

const content = [
  {
    title: "Solo Interview Practice",
    description:
      "Practice coding questions solo, in a timed environment, and get real-time feedback on your performance for maximum improvement.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Practice Interview Questions
      </div>
    ),
  },
  {
    title: "Instant Feedback on Each Interview",
    description:
      "Instant Feedback on Every Attempt No need to wait! Get real-time evaluations and insights on your coding solutions, allowing you to iterate and improve faster.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
       Instant Feedback
      </div>
    ),
  },
  {
    title: "Real World Interview Questions",
    description: "Tackle coding challenges designed to mimic real-world frontend tasks, preparing you for interviews with top tech companies.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Realistic Frontend Scenarios
      </div>
    ),
  },
  {
    title: "Progress Tracking",
    description:"Monitor your performance over time, track improvements, and identify areas to focus on, helping you consistently level up your skills.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
       Progress Tracking
      </div>
    ),
  },
];
export function HowItWorks() {
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
