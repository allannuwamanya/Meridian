import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function CreativeTemplate({
  resume, isPreview, onSectionClick
}: {
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, volunteering, awards, customSections, sectionOrder, design } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible !== false;
  const accent = design?.accentColor || "#e11d48";

  // Skills split for creative showcase
  const skillGroups = skills.reduce((acc: string[][], s, i) => {
    const gi = Math.floor(i / 4);
    if (!acc[gi]) acc[gi] = [];
    acc[gi].push(s);
    return acc;
  }, []);

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-rose-50/20 rounded transition-colors" : ""}
    >
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: design?.fontFamily || "'Inter', sans-serif", minHeight: "297mm", fontSize: "9.5pt", color: "#1a1a2e", lineHeight: 1.55, display: "flex" }}>

      {/* LEFT SIDEBAR */}
      <div style={{ width: "190px", flexShrink: 0, background: "#0f172a", color: "white", display: "flex", flexDirection: "column", padding: "0" }}>
        {/* Accent bar at top */}
        <div style={{ height: "6px", background: accent, width: "100%" }} />

        {/* Name block */}
        <div
          onClick={() => isPreview && onSectionClick?.("contact")}
          className={isPreview ? "cursor-pointer" : ""}
          style={{ padding: "24px 18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h1 style={{ fontSize: "15pt", fontWeight: 800, color: "white", letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: "4px" }}>{contact.fullName}</h1>
          <div style={{ height: "2px", width: "32px", background: accent, margin: "8px 0" }} />
          <div style={{ fontSize: "7.5pt", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
            {contact.email && <div style={{ wordBreak: "break-all" }}>{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {contact.location && <div>{contact.location}</div>}
            {contact.website && <div style={{ color: accent }}>{contact.website}</div>}
            {contact.linkedin && <div style={{ color: "rgba(255,255,255,0.5)" }}>{contact.linkedin}</div>}
            {contact.github && <div style={{ color: "rgba(255,255,255,0.5)" }}>{contact.github}</div>}
          </div>
        </div>

        {/* SKILLS as clusters */}
        {visible("skills") && skills.length > 0 && (
          <div
            onClick={() => isPreview && onSectionClick?.("skills")}
            className={isPreview ? "cursor-pointer" : ""}
            style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ fontSize: "7pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "10px" }}>Skills</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {skills.map((s) => (
                <span key={s} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${accent}55`, color: "rgba(255,255,255,0.85)", fontSize: "7.5pt", padding: "2px 8px", borderRadius: "4px" }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {visible("certifications") && certifications.length > 0 && (
          <div
            onClick={() => isPreview && onSectionClick?.("certifications")}
            className={isPreview ? "cursor-pointer" : ""}
            style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ fontSize: "7pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "10px" }}>Certifications</p>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: "8px" }}>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "8pt", fontWeight: 600 }}>{cert.name}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "7.5pt" }}>{cert.issuer}</div>
                <div style={{ color: accent, fontSize: "7pt" }}>{cert.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* LANGUAGES */}
        {visible("languages") && languages.length > 0 && (
          <div
            onClick={() => isPreview && onSectionClick?.("languages")}
            className={isPreview ? "cursor-pointer" : ""}
            style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ fontSize: "7pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "10px" }}>Languages</p>
            {languages.map((l) => (
              <div key={l.id} style={{ marginBottom: "6px" }}>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "8.5pt", fontWeight: 600 }}>{l.name}</div>
                <div style={{ color: accent, fontSize: "7.5pt" }}>{l.proficiency}</div>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION */}
        {visible("education") && education.length > 0 && (
          <div
            onClick={() => isPreview && onSectionClick?.("education")}
            className={isPreview ? "cursor-pointer" : ""}
            style={{ padding: "16px 18px" }}
          >
            <p style={{ fontSize: "7pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "10px" }}>Education</p>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "10px" }}>
                <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: "8.5pt" }}>{edu.institution}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "7.5pt" }}>{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</div>
                <div style={{ color: accent, fontSize: "7pt" }}>{formatDateRange(edu.startDate, edu.endDate)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "32px 36px" }}>
        {/* Summary */}
        {visible("summary") && summary && (
          <SectionWrapper id="summary">
            <div style={{ marginBottom: "22px" }}>
              <p style={{ color: "#475569", lineHeight: 1.75, fontSize: "9.5pt", borderLeft: `3px solid ${accent}`, paddingLeft: "12px" }}>{summary}</p>
            </div>
          </SectionWrapper>
        )}

        {/* PROJECTS — Elevated for creative roles */}
        {visible("projects") && projects.length > 0 && (
          <SectionWrapper id="projects">
            <CreativeSection title="Portfolio & Projects" accent={accent}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "10.5pt", color: "#111" }}>{proj.name}</span>
                      {proj.role && <span style={{ color: "#64748b", fontSize: "8.5pt", marginLeft: "8px" }}>— {proj.role}</span>}
                    </div>
                    <span style={{ fontSize: "8pt", color: "#64748b" }}>{formatDateRange(proj.startDate, proj.endDate)}</span>
                  </div>
                  {proj.url && <div style={{ fontSize: "8.5pt", color: accent, marginTop: "2px", fontWeight: 600 }}>↗ {proj.url}</div>}
                  {proj.skills.length > 0 && (
                    <div style={{ display: "flex", gap: "4px", marginTop: "5px" }}>
                      {proj.skills.map((s) => (
                        <span key={s} style={{ background: `${accent}15`, color: accent, fontSize: "7.5pt", fontWeight: 600, padding: "1px 7px", borderRadius: "99px" }}>{s}</span>
                      ))}
                    </div>
                  )}
                  {proj.bullets.filter((b) => b.content).map((b) => (
                    <div key={b.id} style={{ color: "#334155", marginTop: "3px", paddingLeft: "12px" }}>• {b.content}</div>
                  ))}
                </div>
              ))}
            </CreativeSection>
          </SectionWrapper>
        )}

        {/* EXPERIENCE */}
        {visible("experience") && experience.length > 0 && (
          <SectionWrapper id="experience">
            <CreativeSection title="Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "14px" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{exp.role}</span>
                      <span style={{ color: accent, fontWeight: 600, marginLeft: "8px" }}>{exp.company}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>
                      <div>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                      {exp.location && <div>{exp.location}</div>}
                    </div>
                  </div>
                  {exp.bullets.filter((b) => b.content).map((b) => (
                    <div key={b.id} style={{ color: "#334155", marginTop: "3px", paddingLeft: "12px" }}>• {b.content}</div>
                  ))}
                </div>
              ))}
            </CreativeSection>
          </SectionWrapper>
        )}

        {/* AWARDS */}
        {visible("awards") && awards.length > 0 && (
          <SectionWrapper id="awards">
            <CreativeSection title="Awards & Recognition" accent={accent}>
              {awards.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span><strong>{a.title}</strong> — {a.issuer}</span>
                  <span style={{ color: "#64748b", fontSize: "8.5pt" }}>{a.date}</span>
                </div>
              ))}
            </CreativeSection>
          </SectionWrapper>
        )}

        {visible("volunteering") && volunteering.length > 0 && (
          <SectionWrapper id="volunteering">
            <CreativeSection title="Volunteering" accent={accent}>
              {volunteering.map((v) => (
                <div key={v.id} style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: 700 }}>{v.role}</span>
                  <span style={{ color: accent, marginLeft: "8px" }}>{v.organization}</span>
                  {v.description && <div style={{ color: "#475569", marginTop: "2px" }}>{v.description}</div>}
                </div>
              ))}
            </CreativeSection>
          </SectionWrapper>
        )}

        {customSections?.filter((cs) => sectionOrder.find((s) => s.id === cs.id)?.visible).map((cs) => (
          <SectionWrapper key={cs.id} id={cs.id}>
            <CreativeSection title={cs.title} accent={accent}>
              {cs.bullets.filter((b) => b.content).map((b) => (
                <div key={b.id} style={{ color: "#334155", paddingLeft: "12px", marginBottom: "3px" }}>• {b.content}</div>
              ))}
            </CreativeSection>
          </SectionWrapper>
        ))}
      </div>
    </div>
  );
}

function CreativeSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ width: "20px", height: "2px", background: accent }} />
        <h2 style={{ fontSize: "9.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#111" }}>{title}</h2>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>
      {children}
    </div>
  );
}
