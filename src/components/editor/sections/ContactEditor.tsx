"use client";
import { useResumeStore } from "@/store/useResumeStore";
import SmartField from "../SmartField";

export default function ContactEditor() {
  const { resume, updateContact } = useResumeStore();
  const c = resume.contact;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Information</h2>
        <p className="text-sm text-gray-500">This appears at the top of your resume.</p>
      </div>

      <div className="space-y-3">
        {/* Full name — bigger */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={c.fullName}
            onChange={(e) => updateContact({ fullName: e.target.value })}
            placeholder="e.g. Alex Rivera"
            className="w-full text-lg font-semibold text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 placeholder:text-gray-400 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SmartField label="Email" value={c.email} onChange={(v) => updateContact({ email: v })} placeholder="alex@email.com" type="email" />
          <SmartField label="Phone" value={c.phone} onChange={(v) => updateContact({ phone: v })} placeholder="+1 555 000 0000" type="tel" />
        </div>
        <SmartField label="Location" value={c.location} onChange={(v) => updateContact({ location: v })} placeholder="San Francisco, CA" />

        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Online Profiles</p>
          <div className="space-y-3">
            <SmartField label="Website" value={c.website ?? ""} onChange={(v) => updateContact({ website: v })} placeholder="yoursite.dev" type="url" />
            <SmartField label="LinkedIn" value={c.linkedin ?? ""} onChange={(v) => updateContact({ linkedin: v })} placeholder="linkedin.com/in/yourusername" />
            <SmartField label="GitHub" value={c.github ?? ""} onChange={(v) => updateContact({ github: v })} placeholder="github.com/yourusername" />
          </div>
        </div>
      </div>
    </div>
  );
}
