"use client";
import { useEffect, useRef } from "react";
import LeftNav from "@/components/editor/LeftNav";
import CenterEditor from "@/components/editor/CenterEditor";
import RightPreview from "@/components/editor/RightPreview";
import TopBar from "@/components/editor/TopBar";
import { motion } from "framer-motion";

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Navigation */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-[240px] flex-shrink-0 border-r border-white/5 overflow-y-auto"
          style={{ background: "var(--bg-surface)" }}
        >
          <LeftNav />
        </motion.aside>

        {/* Center Panel — Editor */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--bg-base)" }}
        >
          <CenterEditor />
        </motion.main>

        {/* Right Panel — Live Preview */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-[45%] flex-shrink-0 border-l border-white/5 overflow-y-auto"
          style={{ background: "var(--bg-surface)" }}
        >
          <RightPreview />
        </motion.aside>
      </div>
    </div>
  );
}
