"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Zap, FileText, Brain, Target, TrendingUp, Shield,
  ArrowRight, Sparkles, Star,
  Play, Wand2, ArrowUpRight, Check
} from "lucide-react";

const stats = [
  { value: "3×",  label: "Interview Rate" },
  { value: "6s",  label: "Recruiter Scan Time" },
  { value: "95%", label: "ATS Pass Rate" },
];

const features = [
  { icon: Brain,      label: "AI Bullet Enhancer",  desc: "Transform weak duties into achievement-framed impact statements using the STAR framework.", size: "large" },
  { icon: Target,     label: "Keyword Scanner",     desc: "Match your resume to any job description and get an ATS score.", size: "small" },
  { icon: TrendingUp, label: "Career Trajectory",   desc: "Discover pivot opportunities and stretch roles.", size: "small" },
  { icon: Zap,        label: "Streaming AI Generation", desc: "Every AI response streams token by token. No waiting.", size: "wide" },
  { icon: Shield,     label: "Honest Feedback",     desc: "Blunt critique mode. Know exactly why you'd be rejected.", size: "small" },
  { icon: FileText,   label: "7+ Premium Templates",desc: "From ATS-safe classic to bold executive.", size: "small" },
];

const testimonials = [
  { quote: "Got 4 interviews in 2 weeks after rebuilding my resume with Meridian. The AI actually understands technical context.", name: "Sarah K.", role: "Senior Product Manager" },
  { quote: "The AI bullet enhancer turned my basic job duties into a compelling story. Landed a 40% pay rise.", name: "James L.", role: "Software Engineer" },
  { quote: "I was struggling to pivot. Meridian analyzed my skills and rewrote my resume to highlight transferable experience.", name: "Elena R.", role: "Data Analyst" },
];

const mockupScenarios = [
  {
    tool: "Auto-Tailor Engine",
    status: "Live Tailoring",
    role: "Senior Backend Engineer",
    company: "FinTech Platform",
    keywords: ["Microservices", "Kubernetes", "Cost Optimization", "CI/CD"],
    original:
      "Helped move our backend to services and made deployments faster.",
    rewritten:
      "Migrated 14 legacy services to Kubernetes microservices, cutting cloud spend by 38 percent and tripling deployment frequency.",
    delta: "+22 ATS Match",
    metricLabel: "Keyword alignment increased",
  },
  {
    tool: "Quantification Lab",
    status: "Metric Upgrade",
    role: "Product Marketing Manager",
    company: "B2B SaaS",
    keywords: ["Pipeline Growth", "SQLs", "Campaign ROI", "Launch Strategy"],
    original:
      "Ran cross-functional campaigns for product launches and demand generation.",
    rewritten:
      "Led six cross-functional launch campaigns that generated 3.4M pipeline and increased SQL conversion by 29 percent.",
    delta: "+31 Impact Score",
    metricLabel: "Quantified outcomes unlocked",
  },
  {
    tool: "ATS Keyword Scanner",
    status: "Scanner Active",
    role: "Data Analyst",
    company: "Healthcare Network",
    keywords: ["SQL", "Tableau", "Forecasting", "Stakeholder Reporting"],
    original:
      "Built dashboards and reports for teams across the organization.",
    rewritten:
      "Built SQL and Tableau reporting system used by 12 stakeholder teams, reducing decision latency by 41 percent.",
    delta: "+18 ATS Match",
    metricLabel: "Recruiter-ready phrasing",
  },
];

// Interactive Typing Mockup Component
const LiveTypingMockup = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [text, setText] = useState("");
  const scenario = mockupScenarios[scenarioIdx];

  useEffect(() => {
    setText("");
    let i = 0;
    const fullText = scenario.rewritten;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [scenarioIdx, scenario.rewritten]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setScenarioIdx((prev) => (prev + 1) % mockupScenarios.length);
    }, 7600);
    return () => clearTimeout(timeout);
  }, [scenarioIdx]);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0">
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur opacity-25 animate-pulse" />
      <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 ring-1 ring-black/5 rounded-3xl shadow-2xl overflow-hidden">
        {/* Mockup Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/40">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-semibold text-gray-800">Meridian Engine</span>
          </div>
          <div className="px-2 py-1 rounded bg-rose-50 text-rose-600 text-[10px] uppercase font-bold tracking-wider">
            {scenario.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 border-b border-gray-100/60 text-[10px]">
          <div className="px-6 py-2.5 border-r border-gray-100/60">
            <span className="text-gray-400 uppercase tracking-wider font-semibold">Target</span>
            <p className="text-gray-800 font-semibold mt-0.5 truncate">{scenario.role}</p>
          </div>
          <div className="px-6 py-2.5">
            <span className="text-gray-400 uppercase tracking-wider font-semibold">Tool</span>
            <p className="text-gray-800 font-semibold mt-0.5 truncate">{scenario.tool}</p>
          </div>
        </div>

        {/* Mockup Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">JD Keywords Matched</span>
            <div className="flex flex-wrap gap-1.5">
              {scenario.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Original */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Original Input</span>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100/50 text-sm text-gray-500 italic">
              {scenario.original}
            </div>
          </div>

          {/* AI Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 uppercase tracking-widest">Meridian Rewrite</span>
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100/50 relative overflow-hidden">
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                {text}
                <span className="inline-block w-1.5 h-4 ml-1 bg-rose-500 animate-pulse" />
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Why this works</p>
            <p className="text-xs text-blue-800">
              Mirrors the target role language, adds measurable impact, and keeps the claim factual.
            </p>
          </div>

          <div className="flex gap-2">
             <button className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
               <Check className="w-4 h-4" /> Apply to Resume
             </button>
             <button className="py-2.5 px-4 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors">
               Explain
             </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-12 top-20 bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{scenario.delta}</div>
            <div className="text-xs text-gray-500">{scenario.metricLabel}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-x-hidden flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">

      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200/40 blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-200/40 blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-orange-100/40 blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-12 py-5 bg-white/50 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Meridian</span>
          <span className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-widest ml-1">Beta</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500 hidden md:block hover:text-gray-900 transition-colors cursor-pointer">Manifesto</span>
          <span className="text-sm font-medium text-gray-500 hidden md:block hover:text-gray-900 transition-colors cursor-pointer">Features</span>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          >
            Start Building <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center">
        
        {/* Above the fold section */}
        <section className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 pt-20 pb-32 lg:pt-32 lg:pb-40 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-200/60 shadow-sm mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Meridian Engine 2.0 Live</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-bold tracking-tighter leading-[1.05] text-gray-900 mb-8">
              Write a resume that <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-300% animate-gradient">demands</span> 
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🚀
              </motion.span> attention.
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-xl">
              Stop fighting with Word templates and generic AI prompts. Meridian is an intelligent career system that architects, writes, and critiques your professional narrative in real time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                onClick={() => router.push("/dashboard")}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Build my resume — Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0"
                  initial={{ opacity: 0, x: -100 }}
                  whileHover={{ opacity: 0.1, x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <motion.button
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-600 font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5 fill-gray-600 transition-transform group-hover:scale-110" />
                See Demo
              </motion.button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm font-medium text-gray-500">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#fafafa] bg-gray-${(i+2)*100} shadow-sm z-${4-i} bg-gradient-to-br from-rose-100 to-pink-200`}></div>
                ))}
              </div>
              <p>Joined by <span className="text-gray-900 font-bold">10,000+</span> professionals</p>
            </div>
          </motion.div>

          {/* Right: Interactive Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-1000"
          >
            <LiveTypingMockup />
          </motion.div>
        </section>

        {/* Company Logos / Trust */}
        <section className="w-full border-y border-gray-200/50 bg-white/40 backdrop-blur-md py-10">
           <div className="max-w-7xl mx-auto px-6 text-center">
             <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Professionals hired at top companies</p>
             <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Dummy placeholder logos for visual impact */}
                {['Google', 'Meta', 'Stripe', 'Amazon', 'Netflix'].map(company => (
                  <div key={company} className="text-2xl font-black tracking-tighter text-gray-800">{company}</div>
                ))}
             </div>
           </div>
        </section>

        {/* Bento Grid Features */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Intelligence at every step.</h2>
            <p className="text-lg text-gray-500 font-medium">Meridian replaces 4 different tools. It is an editor, an AI copywriter, a resume scorer, and a formatting engine all in one seamless UI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                className={`group relative overflow-hidden rounded-3xl bg-white border border-gray-200/60 shadow-sm transition-all duration-500 ${
                  f.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                  f.size === 'wide' ? 'md:col-span-2' : ''
                }`}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-pink-50/0 group-hover:from-rose-50/50 group-hover:to-pink-50/50 transition-colors duration-500" />
                
                <div className="relative h-full p-8 flex flex-col">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center mb-6 shadow-sm ${f.size === 'large' ? 'w-16 h-16' : ''}`}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <f.icon className={`w-7 h-7 text-gray-700 group-hover:text-rose-600 transition-colors duration-500 ${f.size === 'large' ? 'w-8 h-8' : ''}`} />
                  </motion.div>
                  
                  <div className={`mt-auto ${f.size === 'large' ? 'pb-8' : ''}`}>
                    <h3 className={`font-bold text-gray-900 mb-2 ${f.size === 'large' ? 'text-3xl' : 'text-xl'}`}>{f.label}</h3>
                    <p className={`text-gray-500 font-medium leading-relaxed ${f.size === 'large' ? 'text-lg max-w-md' : 'text-sm'}`}>{f.desc}</p>
                  </div>

                  {/* Decorative Elements for larger cards */}
                  {f.size === 'large' && (
                     <motion.div 
                       className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[60%] opacity-20 pointer-events-none"
                       initial={{ opacity: 0.1, scale: 0.8 }}
                       whileInView={{ opacity: 0.2, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8, delay: 0.5 }}
                     >
                       <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 rounded-full blur-[80px]" />
                     </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats & Testimonials */}
        <section className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-32 rounded-[3rem] text-white relative overflow-hidden my-20 max-w-[95%] mx-auto">
          {/* Subtle dark mode background mesh */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-600 blur-[150px]" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600 blur-[150px]" />
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/30 via-transparent to-blue-900/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.h2 
                  className="text-4xl sm:text-5xl font-bold tracking-tight mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Do not guess what recruiters want. <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Know it.</span>
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-400 mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Meridian is trained on millions of successful resumes and ATS parsing logic. It formats, scores, and writes precisely to maximize your interview conversion rate.
                </motion.p>
                
                <motion.div
                  className="grid grid-cols-3 gap-8 border-t border-gray-700 pt-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {stats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="text-center"
                    >
                      <div className="text-4xl font-black text-white mb-2">{s.value}</div>
                      <div className="text-sm font-medium text-gray-400">{s.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="flex flex-col gap-6">
                 {testimonials.map((t, i) => (
                   <motion.div 
                     key={t.name}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.5, delay: i * 0.15 }}
                     className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8"
                   >
                     <div className="flex gap-1 mb-4">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 fill-rose-500 text-rose-500" />
                       ))}
                     </div>
                     <p className="text-lg text-gray-200 mb-6 antialiased leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                           {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{t.name}</div>
                          <div className="text-sm text-gray-400">{t.role}</div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-4xl mx-auto px-6 py-32 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
             className="relative"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-200 via-pink-200 to-orange-200 blur-3xl opacity-40 rounded-full" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-300/20 via-pink-300/20 to-orange-300/20 rounded-full" />
              <h2 className="relative text-5xl md:text-6xl font-black tracking-tighter text-gray-900 mb-8">Ready to skip the <br/> resume filter?</h2>
              <motion.button
                onClick={() => router.push("/dashboard")}
                className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold px-10 py-5 rounded-full text-xl mx-auto overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(225,29,72,0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start building for free
                  <motion.span
                    className="relative"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, type: "keyframes" }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: -100 }}
                  whileHover={{ x: 100 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <p className="mt-6 text-sm font-medium text-gray-500">No credit card required. Download your PDF instantly.</p>
           </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200/60 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">Meridian</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
             <span className="hover:text-gray-900 cursor-pointer transition-colors">Privacy</span>
             <span className="hover:text-gray-900 cursor-pointer transition-colors">Terms</span>
             <span className="hover:text-gray-900 cursor-pointer transition-colors">Contact</span>
          </div>
          <div className="text-sm font-medium text-gray-400">
            © {new Date().getFullYear()} Meridian AI. All rights reserved.
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-300\\% {
          background-size: 300% 300%;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      ` }} />
    </div>
  );
}
