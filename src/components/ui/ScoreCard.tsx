"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, TrendingUp, Target, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { useResumeScore, useKeywordScan } from "@/hooks/useAI";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-800">{score}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? "from-emerald-500 to-emerald-400"
    : value >= 50 ? "from-amber-500 to-amber-400"
    : "from-red-500 to-red-400";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-700 font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard() {
  const { resume } = useResumeStore();
  const { evaluate, isScoring, score, error } = useResumeScore();
  const { scan, isScanning, result: scanResult, error: scanError } = useKeywordScan();

  const hasJD = !!(resume.jobDescription?.trim());

  return (
    <div className="space-y-4">
      {/* Resume Score */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Resume Score</span>
          </div>
          <button
            onClick={evaluate}
            disabled={isScoring}
            className="text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-all border border-rose-200 flex items-center gap-1 font-semibold"
          >
            {isScoring ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
            {isScoring ? "Scoring…" : score ? "Re-score" : "Score now"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!score && !isScoring && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-4 text-gray-400 text-xs"
            >
              Click "Score now" to get your resume rated by AI
            </motion.div>
          )}
          {isScoring && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-6"
            >
              <div className="shimmer w-full h-16 rounded-xl" />
            </motion.div>
          )}
          {score && !isScoring && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-4">
                <ScoreRing score={score.overall} size={72} />
                <div className="flex-1 space-y-2">
                  <ScoreBar label="Impact" value={score.breakdown.impact} />
                  <ScoreBar label="Clarity" value={score.breakdown.clarity} />
                  <ScoreBar label="ATS Match" value={score.breakdown.ats} />
                  <ScoreBar label="Complete" value={score.breakdown.completeness} />
                </div>
              </div>
              {score.topIssues.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top Issues</p>
                  {score.topIssues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
              )}
              {score.quickWins.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quick Wins</p>
                  {score.quickWins.map((win, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                      {win}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyword Scanner */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-900 block">Keyword Match</span>
              {!hasJD && <span className="text-[10px] text-gray-400">Set job target first</span>}
            </div>
          </div>
          <button
            onClick={scan}
            disabled={isScanning || !hasJD}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded-lg transition-all border flex items-center gap-1",
              hasJD
                ? "text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200 font-semibold"
                : "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
            )}
          >
            {isScanning ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Zap className="w-2.5 h-2.5" />}
            {isScanning ? "Scanning…" : scanResult ? "Re-scan" : "Scan"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!scanResult && !isScanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-3 text-gray-400 text-xs"
            >
              {hasJD ? "Click Scan to check keyword alignment" : "Add a job description in Job Target settings"}
            </motion.div>
          )}
          {scanResult && !isScanning && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center gap-3">
                <ScoreRing score={scanResult.score} size={56} />
                <div style={{ fontSize: "inherit" }} className="text-xs text-gray-500">
                  <span className="text-emerald-600 font-semibold">{scanResult.matched.length}</span> keywords matched ·{" "}
                  <span className="text-amber-500 font-semibold">{scanResult.missing.length}</span> missing
                </div>
              </div>
              {scanResult.missing.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.missing.map((kw) => (
                      <span key={kw} className="text-[10px] px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {scanResult.suggestions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suggestions</p>
                  {scanResult.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                      <span className="text-rose-500 shrink-0">→</span> {s}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
