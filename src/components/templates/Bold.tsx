import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

/** BOLD — Emerald green header, dramatic typography, high visual impact */
export default function BoldTemplate({ resume }: { resume: ResumeData }) {
  const vis = Object.fromEntries(resume.sectionOrder.map((s) => [s.id, s.visible]));

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "10px",
        lineHeight: "1.55",
        color: "#1a1a1a",
        background: "#ffffff",
        width: "794px",
        minHeight: "1123px",
        boxSizing: "border-box",
      }}
    >
      {/* Bold emerald header */}
      <div style={{ background: "#065f46", padding: "36px 44px 28px" }}>
        <h1 style={{
          fontSize: "34px",
          fontWeight: "900",
          color: "#ffffff",
          margin: 0,
          letterSpacing: "-1px",
          lineHeight: 1.05,
          fontFamily: "'Georgia', serif",
        }}>
          {resume.contact.fullName}
        </h1>
        <div style={{ height: "3px", width: "60px", background: "#6ee7b7", borderRadius: "2px", margin: "10px 0 12px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", color: "#a7f3d0", fontSize: "9px", fontFamily: "Arial, sans-serif" }}>
          {[resume.contact.email, resume.contact.phone, resume.contact.location, resume.contact.linkedin, resume.contact.github]
            .filter(Boolean)
            .map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>

      <div style={{ padding: "28px 44px" }}>
        {/* Summary */}
        {vis.summary && resume.summary && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#374151", lineHeight: 1.7, fontSize: "10.5px", fontFamily: "Arial, sans-serif" }}>{resume.summary}</p>
          </div>
        )}

        {vis.experience && resume.experience.length > 0 && (
          <BoldSection title="Work Experience">
            {resume.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3px" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#111827", fontFamily: "Arial, sans-serif" }}>{exp.role}</div>
                    <div style={{ fontSize: "10px", color: "#065f46", fontWeight: "700", fontFamily: "Arial, sans-serif" }}>{exp.company}</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ fontSize: "9px", color: "#6b7280" }}>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                    {exp.location && <div style={{ fontSize: "8.5px", color: "#9ca3af" }}>{exp.location}</div>}
                  </div>
                </div>
                <div style={{ paddingLeft: "12px", borderLeft: "2px solid #d1fae5" }}>
                  {exp.bullets.filter(b => b.content).map((b) => (
                    <div key={b.id} style={{ display: "flex", gap: "6px", marginBottom: "4px", fontFamily: "Arial, sans-serif", fontSize: "9.5px", color: "#374151" }}>
                      <span style={{ color: "#065f46", fontWeight: "bold", flexShrink: 0 }}>→</span>
                      {b.content}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </BoldSection>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            {vis.education && resume.education.length > 0 && (
              <BoldSection title="Education">
                {resume.education.map((ed) => (
                  <div key={ed.id} style={{ marginBottom: "10px", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ fontWeight: "700", fontSize: "10px", color: "#111827" }}>{ed.institution}</div>
                    <div style={{ color: "#065f46", fontSize: "9.5px", fontWeight: "600" }}>{ed.degree} {ed.field}</div>
                    <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{formatDateRange(ed.startDate, ed.endDate, false)}</div>
                    {ed.gpa && <div style={{ color: "#6b7280", fontSize: "8.5px" }}>GPA: {ed.gpa}</div>}
                  </div>
                ))}
              </BoldSection>
            )}

            {vis.certifications && resume.certifications.length > 0 && (
              <BoldSection title="Certifications">
                {resume.certifications.map((c) => (
                  <div key={c.id} style={{ marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ fontWeight: "600", fontSize: "9.5px", color: "#111827" }}>{c.name}</div>
                    <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{c.issuer} · {c.date}</div>
                  </div>
                ))}
              </BoldSection>
            )}
          </div>

          <div>
            {vis.skills && resume.skills.length > 0 && (
              <BoldSection title="Skills">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {resume.skills.map((sk) => (
                    <span key={sk} style={{
                      background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0",
                      borderRadius: "4px", padding: "2px 8px", fontSize: "8.5px", fontWeight: "600",
                      fontFamily: "Arial, sans-serif"
                    }}>{sk}</span>
                  ))}
                </div>
              </BoldSection>
            )}

            {vis.projects && resume.projects.length > 0 && (
              <BoldSection title="Projects">
                {resume.projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                    <div style={{ fontWeight: "700", fontSize: "9.5px", color: "#111827" }}>{p.name}</div>
                    {p.url && <div style={{ color: "#065f46", fontSize: "8px" }}>{p.url}</div>}
                    {p.bullets.filter(b => b.content).slice(0,2).map((b) => (
                      <div key={b.id} style={{ color: "#374151", fontSize: "9px", marginTop: "2px" }}>· {b.content}</div>
                    ))}
                  </div>
                ))}
              </BoldSection>
            )}

            {vis.languages && resume.languages.length > 0 && (
              <BoldSection title="Languages">
                {resume.languages.map((l) => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", fontFamily: "Arial, sans-serif" }}>
                    <span style={{ fontWeight: "600", color: "#111827", fontSize: "9.5px" }}>{l.name}</span>
                    <span style={{ color: "#6b7280", fontSize: "8.5px" }}>{l.proficiency}</span>
                  </div>
                ))}
              </BoldSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoldSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <h3 style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", color: "#065f46", margin: 0, fontFamily: "Arial, sans-serif" }}>{title}</h3>
        <div style={{ flex: 1, height: "1.5px", background: "#d1fae5" }} />
      </div>
      {children}
    </div>
  );
}
