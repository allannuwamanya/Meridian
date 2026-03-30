"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap, FileText, Brain, Target, TrendingUp, Shield,
  ArrowRight, Sparkles, Star, CheckCircle, ChevronRight
} from "lucide-react";

const features = [
  { icon: Brain,      label: "AI Bullet Enhancer",  desc: "Transform weak duties into achievement-framed impact statements with STAR framework." },
  { icon: Target,     label: "Keyword Scanner",     desc: "Match your resume to any job description and get an ATS score in seconds." },
  { icon: TrendingUp, label: "Career Trajectory",   desc: "Discover pivot opportunities and stretch roles you qualify for." },
  { icon: Zap,        label: "Streaming AI",        desc: "Every AI response streams token by token — watch it write in real time." },
  { icon: Shield,     label: "Honest Feedback",     desc: "Blunt critique mode. Know exactly why you'd be rejected." },
  { icon: FileText,   label: "7 Templates",         desc: "From ATS-safe classic to bold executive — each crafted for maximum impact." },
];

const stats = [
  { value: "3×",  label: "More interviews" },
  { value: "6s",  label: "Recruiter attention span" },
  { value: "95%", label: "ATS pass rate" },
];

const testimonials = [
  { quote: "Got 4 interviews in 2 weeks after rebuilding my resume with Meridian.", name: "Sarah K.", role: "Product Manager" },
  { quote: "The AI bullet enhancer turned my job duties into a story. Landed a 40% pay rise.", name: "James L.", role: "Software Engineer" },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden flex flex-col">

      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="dot-pattern absolute inset-0 opacity-60" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-rose-100 opacity-40 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-pink-50 opacity-60 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-rose-100/60 bg-white/80 backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-brand">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Meridian</span>
          <span className="hidden sm:block text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full ml-1">AI-Native</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden md:block">Build your best resume, for free</span>
          <button
            id="nav-cta"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-brand hover:shadow-brand-lg"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold mb-8 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            Intelligence-first resume builder
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-gray-900 mb-6">
            Your resume,{" "}
            <span className="gradient-text">rewritten</span>
            <br />
            by AI that{" "}
            <span className="relative inline-block">
              cares.
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-60" />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Meridian is not a form with a PDF export. It is an active career intelligence system that rewrites,
            repositions, and critiques your professional narrative in real time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <motion.button
              id="hero-cta-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-brand-lg hover:shadow-[0_12px_48px_rgba(225,29,72,0.45)] transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Build my resume — free
              <ChevronRight className="w-4 h-4 opacity-80" />
            </motion.button>
            <button
              id="hero-cta-secondary"
              className="text-gray-500 hover:text-rose-600 text-sm font-medium transition-colors flex items-center gap-1"
            >
              See how it works <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-12 mb-24 w-full"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full mb-20"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="bg-white rounded-2xl p-6 text-left border border-gray-100 shadow-card hover:shadow-[0_8px_32px_rgba(225,29,72,0.1)] hover:border-rose-100 transition-all duration-300 group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                <f.icon className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-2">{f.label}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl w-full mb-16"
        >
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-br from-rose-600 to-pink-600 rounded-3xl px-12 py-14 max-w-2xl w-full shadow-brand-lg"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Ready to stand out?</h2>
          <p className="text-rose-100 text-base mb-8">Start building in seconds. No account required.</p>
          <button
            id="footer-cta"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-white text-rose-600 font-semibold px-8 py-3.5 rounded-xl mx-auto hover:bg-rose-50 transition-all duration-200 shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            Build my resume free
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-gray-400 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-medium text-gray-600">Meridian</span>
        </div>
        <p>AI-native resume intelligence · Built for career growth</p>
      </footer>
    </div>
  );
}
