"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap, FileText, Brain, Target, TrendingUp, Shield, ArrowRight, Sparkles, Star, CheckCircle
} from "lucide-react";

const features = [
  { icon: Brain, label: "AI Bullet Enhancer", desc: "Transform weak duties into achievement-framed impact statements." },
  { icon: Target, label: "Keyword Scanner", desc: "Match your resume to any job description in seconds." },
  { icon: TrendingUp, label: "Career Trajectory", desc: "Discover pivot opportunities and stretch roles you qualify for." },
  { icon: Zap, label: "Streaming AI", desc: "Every AI response streams token by token — no waiting." },
  { icon: Shield, label: "Honest Feedback", desc: "Blunt critique mode. Know exactly why you'd be rejected." },
  { icon: FileText, label: "8 Templates", desc: "From ATS-safe classic to modern vision-board executive." },
];

const stats = [
  { value: "3×", label: "More interviews" },
  { value: "6s", label: "Recruiter attention" },
  { value: "95%", label: "ATS pass rate" },
];

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#7c3aed] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#06b6d4] opacity-[0.06] blur-[120px]" />
        <div className="dot-pattern absolute inset-0 opacity-40" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Meridian</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">AI-native career intelligence</span>
          <button
            onClick={() => router.push("/editor")}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            Start Building <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8">
            <Star className="w-3 h-3 fill-current" />
            Intelligence-first resume builder
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none mb-6">
            Your resume,{" "}
            <span className="gradient-text">rewritten</span>
            <br />
            by AI that cares.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Meridian is not a form with a PDF export. It is an active career intelligence system that rewrites,
            repositions, and critiques your professional narrative in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/editor")}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-[0_0_40px_rgba(124,58,237,0.35)] hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Build my resume — free
            </motion.button>
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              See how it works →
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-10 mt-16 mb-20"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="glass rounded-2xl p-5 text-left hover:border-violet-500/30 transition-all duration-300 group cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3 group-hover:bg-violet-500/25 transition-colors">
                <f.icon className="w-4.5 h-4.5 text-violet-400" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{f.label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
