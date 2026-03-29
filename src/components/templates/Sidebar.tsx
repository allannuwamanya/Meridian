import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

/** SIDEBAR — Two-column with deep purple sidebar, modern & structured */
export default function SidebarTemplate({ resume }: { resume: ResumeData }) {
  const vis = Object.fromEntries(resume.sectionOrder.map((s) => [s.id, s.visible]));

  const sidebarBg = "#4c1d95";
  const sidebarAccent = "#a78bfa";
  const sidebarText = "#ede9fe";
  const sidebarMuted = "#c4b5fd";

  return (
    <div
      style={{
        fontFamily: "'Inter', Arial, sans-serif",
        fontSize: "9.5px",
        lineHeight: "1.5",
        color: "#1f2937",
        background: "#ffffff",
        width: "794px",
        minHeight: "1123px",
        display: "flex",
        boxSizing: "border-box",
      }}
    >
      {/* Left sidebar */}
      <div style={{ width: "220px", background: sidebarBg, flexShrink: 0, padding: "32px 20px", color: sidebarText }}>

        {/* Name on sidebar */}
        <h1 style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", margin: "0 0 4px", lineHeight: 1.15, letterSpacing: "-0.3px" }}>
          {resume.contact.fullName}
        </h1>
        <div style={{ height: "2px", width: "40px", background: sidebarAccent, borderRadius: "1px", marginBottom: "16px" }} />

        {/* Contact */}
        <SidebarSection title="Contact" accent={sidebarAccent}>
          {[
            resume.contact.email,
            resume.contact.phone,
            resume.contact.location,
            resume.contact.linkedin,
            resume.contact.github,
            resume.contact.website,
          ].filter(Boolean).map((v, i) => (
            <div key={i} style={{ color: sidebarMuted, marginBottom: "4px", fontSize: "8.5px", wordBreak: "break-all" }}>{v}</div>
          ))}
        </SidebarSection>

        {/* Skills */}
        {vis.skills && resume.skills.length > 0 && (
          <SidebarSection title="Skills" accent={sidebarAccent}>
            {resume.skills.map((sk) => (
              <div key={sk} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ width: "4px", height: "4px", background: sidebarAccent, borderRadius: "50%", flexShrink: 0 }} />
                <span style={{ color: sidebarMuted, fontSize: "9px" }}>{sk}</span>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Education */}
        {vis.education && resume.education.length > 0 && (
          <SidebarSection title="Education" accent={sidebarAccent}>
            {resume.education.map((ed) => (
              <div key={ed.id} style={{ marginBottom: "10px" }}>
                <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "9px" }}>{ed.institution}</div>
                <div style={{ color: sidebarMuted, fontSize: "8.5px" }}>{ed.degree} {ed.field}</div>
                <div style={{ color: sidebarAccent, fontSize: "8px", marginTop: "2px" }}>{formatDateRange(ed.startDate, ed.endDate, false)}</div>
                {ed.gpa && <div style={{ color: sidebarMuted, fontSize: "8px" }}>GPA: {ed.gpa}</div>}
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Languages */}
        {vis.languages && resume.languages.length > 0 && (
          <SidebarSection title="Languages" accent={sidebarAccent}>
            {resume.languages.map((l) => (
              <div key={l.id} style={{ marginBottom: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#ffffff", fontWeight: "600", fontSize: "9px" }}>{l.name}</span>
                  <span style={{ color: sidebarMuted, fontSize: "8px" }}>{l.proficiency}</span>
                </div>
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Certifications */}
        {vis.certifications && resume.certifications.length > 0 && (
          <SidebarSection title="Certifications" accent={sidebarAccent}>
            {resume.certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: "6px" }}>
                <div style={{ fontWeight: "600", color: "#ffffff", fontSize: "8.5px" }}>{c.name}</div>
                <div style={{ color: sidebarMuted, fontSize: "8px" }}>{c.issuer} · {c.date}</div>
              </div>
            ))}
          </SidebarSection>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "32px 32px 32px 28px", overflow: "hidden" }}>

        {/* Summary */}
        {vis.summary && resume.summary && (
          <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", color: "#4c1d95", margin: "0 0 6px" }}>Profile</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.65, fontSize: "9.5px" }}>{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {vis.experience && resume.experience.length > 0 && (
          <MainSection title="Experience" accent="#4c1d95">
            {resume.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "10.5px", color: "#111827" }}>{exp.role}</div>
                    <div style={{ color: "#4c1d95", fontWeight: "600", fontSize: "9px" }}>{exp.company}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "8.5px", color: "#6b7280" }}>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                    {exp.location && <div style={{ fontSize: "8px", color: "#9ca3af" }}>{exp.location}</div>}
                  </div>
                </div>
                {exp.bullets.filter(b => b.content).map((b) => (
                  <div key={b.id} style={{ display: "flex", gap: "6px", marginBottom: "3px", fontSize: "9px", color: "#374151" }}>
                    <span style={{ color: "#7c3aed", flexShrink: 0, fontWeight: "bold" }}>•</span>
                    {b.content}
                  </div>
                ))}
                {exp.skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                    {exp.skills.map((sk) => (
                      <span key={sk} style={{ background: "#f5f3ff", color: "#4c1d95", border: "1px solid #ddd6fe", borderRadius: "3px", padding: "1px 5px", fontSize: "7.5px", fontWeight: "600" }}>{sk}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {vis.projects && resume.projects.length > 0 && (
          <MainSection title="Projects" accent="#4c1d95">
            {resume.projects.map((p) => (
              <div key={p.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: "700", fontSize: "10px", color: "#111827" }}>{p.name}</div>
                  {p.url && <div style={{ color: "#4c1d95", fontSize: "8px" }}>{p.url}</div>}
                </div>
                {p.bullets.filter(b => b.content).map((b) => (
                  <div key={b.id} style={{ display: "flex", gap: "6px", marginBottom: "2px", fontSize: "9px", color: "#374151" }}>
                    <span style={{ color: "#7c3aed", flexShrink: 0, fontWeight: "bold" }}>•</span>
                    {b.content}
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        )}

        {/* Awards & Volunteering */}
        {vis.awards && resume.awards.length > 0 && (
          <MainSection title="Awards" accent="#4c1d95">
            {resume.awards.map((a) => (
              <div key={a.id} style={{ marginBottom: "7px" }}>
                <div style={{ fontWeight: "700", fontSize: "9.5px", color: "#111827" }}>{a.title}</div>
                <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{a.issuer} · {a.date}</div>
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SidebarSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h3 style={{ fontSize: "7.5px", fontWeight: "800", letterSpacing: "1.8px", textTransform: "uppercase", color: accent, margin: "0 0 8px", borderBottom: `1px solid ${accent}30`, paddingBottom: "4px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function MainSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{ fontSize: "8.5px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", color: accent, margin: "0 0 8px", display: "flex", alignItems: "center", gap: "8px" }}>
        {title}
        <span style={{ flex: 1, height: "1px", background: "#e5e7eb", display: "inline-block" }} />
      </h2>
      {children}
    </div>
  );
}
