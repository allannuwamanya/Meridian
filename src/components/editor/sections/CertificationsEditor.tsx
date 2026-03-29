"use client";
import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2 } from "lucide-react";
import SmartField from "../SmartField";

export default function CertificationsEditor() {
  const { resume, addCertification, updateCertification, removeCertification } = useResumeStore();
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Certifications</h2>
          <p className="text-sm text-gray-500">Only list those directly relevant to your target role.</p>
        </div>
        <button onClick={addCertification} className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-gray-900 px-3 py-1.5 rounded-xl transition-all font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {resume.certifications.map((cert) => (
          <div key={cert.id} className="glass rounded-2xl p-4 grid grid-cols-2 gap-3 border border-gray-200 group">
            <SmartField label="Name" value={cert.name} onChange={(v) => updateCertification(cert.id, { name: v })} placeholder="AWS Solutions Architect" />
            <SmartField label="Issuer" value={cert.issuer} onChange={(v) => updateCertification(cert.id, { issuer: v })} placeholder="Amazon Web Services" />
            <SmartField label="Date" value={cert.date} onChange={(v) => updateCertification(cert.id, { date: v })} placeholder="2023-06" type="month" />
            <SmartField label="URL (optional)" value={cert.url ?? ""} onChange={(v) => updateCertification(cert.id, { url: v })} placeholder="https://credly.com/…" />
            <button onClick={() => removeCertification(cert.id)} className="col-span-2 flex items-center justify-end gap-1.5 text-xs text-red-600/50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
