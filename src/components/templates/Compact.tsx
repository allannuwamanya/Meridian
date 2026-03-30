import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

/** COMPACT — Dense layout, charcoal & amber, ideal for experienced professionals */
export default function CompactTemplate({ 
  resume, isPreview, onSectionClick 
}: { 
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { design } = resume;
  const vis = Object.fromEntries(resume.sectionOrder.map((s) => [s.id, s.visible]));
  const accent = design?.accentColor || "#d97706";

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div 
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-black/5 transition-colors rounded-lg -mx-2 px-2 py-1 border border-transparent hover:border-black/10" : ""}
    >
      {children}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: design?.fontFamily || "'Helvetica Neue', Arial, sans-serif",
        fontSize: "9.5px",
        lineHeight: "1.45",
        color: "#1a1a2e",
        background: "#ffffff",
        width: "794px",
        minHeight: "1123px",
        padding: "36px 40px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div 
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer hover:bg-black/5 transition-colors rounded-lg -mx-2 px-2 py-1" : ""}
        style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "12px", marginBottom: "14px" }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0, lineHeight: 1.1 }}>
          {resume.contact.fullName}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px", color: "#4b5563", fontSize: "8.5px" }}>
          {[resume.contact.email, resume.contact.phone, resume.contact.location, resume.contact.linkedin, resume.contact.github, resume.contact.website]
            .filter(Boolean)
            .map((v, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                {i > 0 && <span style={{ color: accent, marginRight: "7px" }}>·</span>}
                {v}
              </span>
            ))}
        </div>
      </div>

      {/* Summary */}
      {vis.summary && resume.summary && (
        <SectionWrapper id="summary">
          <div style={{ marginBottom: "12px" }}>
            <p style={{ color: "#374151", lineHeight: 1.55, fontSize: "9px" }}>{resume.summary}</p>
          </div>
        </SectionWrapper>
      )}

      {/* Two column layout */}
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Left — main content */}
        <div style={{ flex: "1 1 0" }}>

          {vis.experience && resume.experience.length > 0 && (
            <SectionWrapper id="experience">
              <Section title="Experience" accent={accent}>
                {resume.experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: "700", color: "#1a1a2e", fontSize: "9.5px" }}>{exp.role}</div>
                        <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                      </div>
                      <div style={{ color: accent, fontSize: "8px", fontWeight: "600", whiteSpace: "nowrap", marginLeft: "8px" }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                      </div>
                    </div>
                    {exp.bullets.filter(b => b.content).map((b) => (
                      <div key={b.id} style={{ display: "flex", gap: "5px", marginTop: "3px" }}>
                        <span style={{ color: accent, flexShrink: 0, marginTop: "1px" }}>▸</span>
                        <span style={{ color: "#374151" }}>{b.content}</span>
                      </div>
                    ))}
                    {exp.skills.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                        {exp.skills.map((sk) => (
                          <span key={sk} style={{ background: `${accent}20`, color: accent, fontSize: "7.5px", padding: "1px 6px", borderRadius: "3px", fontWeight: "500" }}>{sk}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Section>
            </SectionWrapper>
          )}

          {vis.projects && resume.projects.length > 0 && (
            <SectionWrapper id="projects">
              <Section title="Projects" accent={accent}>
                {resume.projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "700", color: "#1a1a2e", fontSize: "9.5px" }}>{p.name}</span>
                      {p.url && <span style={{ color: "#6b7280", fontSize: "8px" }}>{p.url}</span>}
                    </div>
                    {p.bullets.filter(b => b.content).map((b) => (
                      <div key={b.id} style={{ display: "flex", gap: "5px", marginTop: "2px" }}>
                        <span style={{ color: accent, flexShrink: 0 }}>▸</span>
                        <span style={{ color: "#374151" }}>{b.content}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            </SectionWrapper>
          )}
        </div>

        {/* Right — sidebar */}
        <div style={{ width: "180px", flexShrink: 0 }}>

          {vis.skills && resume.skills.length > 0 && (
            <SectionWrapper id="skills">
              <Section title="Skills" accent={accent}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {resume.skills.map((sk) => (
                    <div key={sk} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "4px", height: "4px", background: accent, borderRadius: "50%", flexShrink: 0 }} />
                      <span style={{ color: "#374151" }}>{sk}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </SectionWrapper>
          )}

          {vis.education && resume.education.length > 0 && (
            <SectionWrapper id="education">
              <Section title="Education" accent={accent}>
                {resume.education.map((ed) => (
                  <div key={ed.id} style={{ marginBottom: "7px" }}>
                    <div style={{ fontWeight: "700", color: "#1a1a2e" }}>{ed.institution}</div>
                    <div style={{ color: "#6b7280" }}>{ed.degree} {ed.field}</div>
                    <div style={{ color: accent, fontSize: "8px" }}>{formatDateRange(ed.startDate, ed.endDate, false)}</div>
                    {ed.gpa && <div style={{ color: "#6b7280" }}>GPA: {ed.gpa}</div>}
                  </div>
                ))}
              </Section>
            </SectionWrapper>
          )}

          {vis.certifications && resume.certifications.length > 0 && (
            <SectionWrapper id="certifications">
              <Section title="Certifications" accent={accent}>
                {resume.certifications.map((c) => (
                  <div key={c.id} style={{ marginBottom: "6px" }}>
                    <div style={{ fontWeight: "600", color: "#1a1a2e" }}>{c.name}</div>
                    <div style={{ color: "#6b7280" }}>{c.issuer} · {c.date}</div>
                  </div>
                ))}
              </Section>
            </SectionWrapper>
          )}

          {vis.languages && resume.languages.length > 0 && (
            <SectionWrapper id="languages">
              <Section title="Languages" accent={accent}>
                {resume.languages.map((l) => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontWeight: "600", color: "#1a1a2e" }}>{l.name}</span>
                    <span style={{ color: "#6b7280" }}>{l.proficiency}</span>
                  </div>
                ))}
              </Section>
            </SectionWrapper>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
        <span style={{ fontSize: "8px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", color: "#1a1a2e" }}>{title}</span>
        <div style={{ flex: 1, height: "1px", background: accent, opacity: 0.35 }} />
      </div>
      <div style={{ fontSize: "9px" }}>{children}</div>
    </div>
  );
}
