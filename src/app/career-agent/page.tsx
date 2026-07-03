"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/store/useResumeStore";
import { useState, useCallback } from "react";
import {
  Mail, MessageSquare, DollarSign, Copy, Check, ChevronDown,
  ChevronUp, Loader2, Sparkles, ArrowLeft, Brain, RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { generateFollowUpEmails, generateInterviewPrep, estimateSalary } from "@/lib/careerAgent";
import { EmailSequence, InterviewPack, SalaryRange } from "@/types/resume";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

type Tab = "emails" | "interview" | "salary";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-all"
    >
      {copied ? <><Check className="w-3 h-3 text-emerald-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
    </button>
  );
}

function EmailCard({ day, email }: { day: string; email: { subject: string; body: string } }) {
  const [open, setOpen] = useState(day === "Day 1");
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{day} Follow-Up</p>
            <p className="text-xs text-gray-500 truncate max-w-[300px]">{email.subject}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100">
              <div className="mt-4 mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</p>
                <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-4 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{email.subject}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Body</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 px-3 py-3 rounded-lg border border-gray-100">{email.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionCard({ q, i }: { q: InterviewPack["questions"][0]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
        <p className="text-sm font-semibold text-gray-900 flex-1">{q.question}</p>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-gray-100 space-y-3">
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mt-3">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">What they&#39;re really testing</p>
                <p className="text-xs text-amber-800">{q.guidance}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Sample Answer Framework</p>
                  <CopyButton text={q.sampleAnswer} />
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">{q.sampleAnswer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareerAgentPage() {
  const router = useRouter();
  const { resume } = useResumeStore();
  const [activeTab, setActiveTab] = useState<Tab>("emails");

  // Email state
  const [emails, setEmails] = useState<EmailSequence | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Interview state
  const [pack, setPack] = useState<InterviewPack | null>(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Salary state
  const [salary, setSalary] = useState<SalaryRange | null>(null);
  const [salaryLoading, setSalaryLoading] = useState(false);

  const yearsExp = resume.experience.length >= 2
    ? Math.round(resume.experience.reduce((acc, e) => {
        const start = e.startDate ? new Date(e.startDate + "-01") : new Date();
        const end = e.isCurrent ? new Date() : (e.endDate ? new Date(e.endDate + "-01") : new Date());
        return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      }, 0))
    : 3;

  const handleGenerateEmails = useCallback(async () => {
    setEmailLoading(true);
    try {
      const result = await generateFollowUpEmails(resume);
      setEmails(result);
      toast.success("3 follow-up emails ready!", "Personalised to your application.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Generation failed", error?.message ?? "Try again.");
    } finally {
      setEmailLoading(false);
    }
  }, [resume]);

  const handleGenerateInterview = useCallback(async () => {
    setInterviewLoading(true);
    try {
      const result = await generateInterviewPrep(resume);
      setPack(result);
      toast.success("Interview pack ready!", `${result.questions.length} questions generated.`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Generation failed", error?.message ?? "Try again.");
    } finally {
      setInterviewLoading(false);
    }
  }, [resume]);

  const handleSalaryEstimate = useCallback(async () => {
    setSalaryLoading(true);
    try {
      const result = await estimateSalary(
        resume.targetRole || resume.experience[0]?.role || "Professional",
        resume.contact.location || "United States",
        resume.skills,
        yearsExp
      );
      setSalary(result);
      toast.success("Salary range estimated!", "Based on your role and location.");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Estimation failed", error?.message ?? "Try again.");
    } finally {
      setSalaryLoading(false);
    }
  }, [resume, yearsExp]);

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "emails", label: "Follow-Up Emails", icon: Mail },
    { id: "interview", label: "Interview Prep", icon: MessageSquare },
    { id: "salary", label: "Salary Insights", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/editor")}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Career Agent</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Powered by Gemini AI
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Context banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{resume.contact.fullName || "Your Resume"}</p>
            <p className="text-xs text-gray-500">
              {resume.targetRole ? `Targeting ${resume.targetRole}` : "No job target set"}
              {resume.targetCompany ? ` at ${resume.targetCompany}` : ""}
              {" · "}
              {resume.experience.length} roles · {resume.skills.length} skills
            </p>
          </div>
          <button
            onClick={() => router.push("/editor")}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
          >
            Edit Resume →
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 rounded-lg transition-all",
                activeTab === tab.id
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "emails" && (
            <motion.div key="emails" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">Follow-Up Email Sequence</h2>
                  <p className="text-xs text-gray-500 max-w-md">AI generates 3 strategically timed follow-up emails personalised to your resume and target company. Day 1, Day 7, and Day 14.</p>
                </div>
                <button
                  onClick={emails ? () => setEmails(null) : handleGenerateEmails}
                  disabled={emailLoading}
                  className="flex items-center gap-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl transition-all flex-shrink-0 shadow-sm disabled:opacity-60"
                >
                  {emailLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</> : emails ? <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</> : <><Sparkles className="w-3.5 h-3.5" /> Generate Emails</>}
                </button>
              </div>
              {emails && (
                <div className="space-y-3">
                  <EmailCard day="Day 1" email={emails.day1} />
                  <EmailCard day="Day 7" email={emails.day7} />
                  <EmailCard day="Day 14" email={emails.day14} />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "interview" && (
            <motion.div key="interview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">Interview Prep Pack</h2>
                  <p className="text-xs text-gray-500 max-w-md">8 personalised interview questions with AI guidance on what interviewers are really testing, plus model answer frameworks based on YOUR specific experience.</p>
                </div>
                <button
                  onClick={pack ? () => setPack(null) : handleGenerateInterview}
                  disabled={interviewLoading}
                  className="flex items-center gap-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all flex-shrink-0 shadow-sm disabled:opacity-60"
                >
                  {interviewLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</> : pack ? <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</> : <><Brain className="w-3.5 h-3.5" /> Generate Prep Pack</>}
                </button>
              </div>
              {pack && (
                <div className="space-y-3">
                  {pack.keyThemes.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Key Themes They&#39;ll Probe</p>
                      <div className="flex flex-wrap gap-2">
                        {pack.keyThemes.map((t) => (
                          <span key={t} className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {pack.redFlags.length > 0 && (
                    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">⚠ Proactively Address These</p>
                      <ul className="space-y-1">
                        {pack.redFlags.map((f) => (
                          <li key={f} className="text-xs text-amber-800">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pack.questions.map((q, i) => <QuestionCard key={i} q={q} i={i} />)}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "salary" && (
            <motion.div key="salary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">Market Salary Range</h2>
                  <p className="text-xs text-gray-500 max-w-md">AI-estimated compensation based on your role, location, skills, and ~{yearsExp} years of experience. Use this to negotiate with confidence.</p>
                </div>
                <button
                  onClick={salary ? () => setSalary(null) : handleSalaryEstimate}
                  disabled={salaryLoading}
                  className="flex items-center gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all flex-shrink-0 shadow-sm disabled:opacity-60"
                >
                  {salaryLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Estimating…</> : salary ? <><RefreshCw className="w-3.5 h-3.5" /> Refresh</> : <><DollarSign className="w-3.5 h-3.5" /> Estimate Salary</>}
                </button>
              </div>
              {salary && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Estimated Range · {salary.currency}</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Floor", value: salary.low, color: "text-gray-600" },
                      { label: "Median", value: salary.mid, color: "text-emerald-600" },
                      { label: "Top", value: salary.high, color: "text-blue-600" },
                    ].map((r) => (
                      <div key={r.label} className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{r.label}</p>
                        <p className={`text-2xl font-bold ${r.color}`}>{salary.currency === "USD" ? "$" : ""}{r.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  {/* Visual range bar */}
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-300 via-emerald-400 to-blue-500 rounded-full" style={{ width: "100%" }} />
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-sm" />
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-emerald-800 leading-relaxed">{salary.context}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
