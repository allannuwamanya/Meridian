"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  lines = 1,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseClasses = "skeleton bg-gray-200/50";
  
  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4 rounded";
      case "circular":
        return "rounded-full";
      case "rectangular":
        return "rounded-lg";
      case "card":
        return "rounded-2xl";
      default:
        return "rounded-lg";
    }
  };

  const style = {
    width: width || (variant === "circular" ? height : "100%"),
    height: height || (variant === "circular" ? "40px" : "20px"),
  };

  if (lines > 1 && variant === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              width: i === 0 ? "60%" : i === lines - 1 ? "80%" : "100%",
              height: "16px",
            }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-modern p-6 space-y-4">
      <Skeleton variant="rectangular" height="24px" width="40%" />
      <Skeleton variant="text" lines={3} />
      <div className="flex justify-end">
        <Skeleton variant="circular" width="32px" height="32px" />
      </div>
    </div>
  );
}

export function ResumeCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-start">
        <Skeleton variant="circular" width="48px" height="48px" />
        <Skeleton variant="rectangular" width="60px" height="24px" />
      </div>
      <Skeleton variant="text" height="20px" width="60%" />
      <Skeleton variant="text" height="16px" width="40%" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width="80px" height="24px" />
        <Skeleton variant="rectangular" width="60px" height="24px" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton variant="rectangular" height="32px" />
        <Skeleton variant="rectangular" height="32px" />
      </div>
    </div>
  );
}
