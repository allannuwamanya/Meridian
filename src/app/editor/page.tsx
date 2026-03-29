"use client";
import LeftNav from "@/components/editor/LeftNav";
import CenterEditor from "@/components/editor/CenterEditor";
import RightPreview from "@/components/editor/RightPreview";
import TopBar from "@/components/editor/TopBar";
import { motion } from "framer-motion";

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col bg-[#f7f7f8] overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel — Section Navigation */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[220px] flex-shrink-0 border-r border-gray-200 overflow-y-auto bg-white"
        >
          <LeftNav />
        </motion.aside>

        {/* Center Panel — Editor */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex-1 overflow-y-auto bg-[#f7f7f8]"
        >
          <CenterEditor />
        </motion.main>

        {/* Right Panel — Live Preview */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[42%] flex-shrink-0 border-l border-gray-200 overflow-hidden bg-white"
          id="right-preview-panel"
        >
          <RightPreview />
        </motion.aside>

      </div>
    </div>
  );
}
