"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function Tooltip({
  text,
  children,
  position = "top",
  delay = 400,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [positionState, setPositionState] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Check if tooltip would go off screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    if (position === "top" && triggerRect.top - tooltipRect.height < 0) {
      newPosition = "bottom";
    } else if (position === "bottom" && triggerRect.bottom + tooltipRect.height > viewportHeight) {
      newPosition = "top";
    } else if (position === "left" && triggerRect.left - tooltipRect.width < 0) {
      newPosition = "right";
    } else if (position === "right" && triggerRect.right + tooltipRect.width > viewportWidth) {
      newPosition = "left";
    }

    setPositionState(newPosition);
  }, [isVisible, position]);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const getTooltipPosition = () => {
    switch (positionState) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  const getArrowPosition = () => {
    switch (positionState) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180";
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-90";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-90";
      default:
        return "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180";
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap ${getTooltipPosition()}`}
            role="tooltip"
          >
            {text}
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-gray-900 transform ${getArrowPosition()}`}
              style={{ borderRadius: "2px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
