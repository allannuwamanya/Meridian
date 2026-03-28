"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import SmartField from "../SmartField";

export default function ContactEditor() {
  const { resume, updateContact } = useResumeStore();
  const c = resume.contact;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Contact Information</h2>
        <p className="text-sm text-slate-500">This appears at the top of your resume.</p>
      </div>

      <div className="space-y-3">
        <SmartField
          label="Full Name"
          value={c.fullName}
          onChange={(v) => updateContact({ fullName: v })}
          placeholder="e.g. Alex Rivera"
          icon={<User className="w-4 h-4" />}
          large
        />
        <div className="grid grid-cols-2 gap-3">
          <SmartField
            label="Email"
            value={c.email}
            onChange={(v) => updateContact({ email: v })}
            placeholder="alex@email.com"
            icon={<Mail className="w-4 h-4" />}
            type="email"
          />
          <SmartField
            label="Phone"
            value={c.phone}
            onChange={(v) => updateContact({ phone: v })}
            placeholder="+1 555 000 0000"
            icon={<Phone className="w-4 h-4" />}
            type="tel"
          />
        </div>
        <SmartField
          label="Location"
          value={c.location}
          onChange={(v) => updateContact({ location: v })}
          placeholder="San Francisco, CA"
          icon={<MapPin className="w-4 h-4" />}
        />
        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Online Profiles</p>
          <div className="space-y-3">
            <SmartField label="Website" value={c.website ?? ""} onChange={(v) => updateContact({ website: v })} placeholder="yoursite.dev" icon={<Globe className="w-4 h-4" />} />
            <SmartField label="LinkedIn" value={c.linkedin ?? ""} onChange={(v) => updateContact({ linkedin: v })} placeholder="linkedin.com/in/yourusername" icon={<Linkedin className="w-4 h-4" />} />
            <SmartField label="GitHub" value={c.github ?? ""} onChange={(v) => updateContact({ github: v })} placeholder="github.com/yourusername" icon={<Github className="w-4 h-4" />} />
          </div>
        </div>
      </div>
    </div>
  );
}
