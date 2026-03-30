import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function CareerChangerTemplate({
  resume, isPreview, onSectionClick
}: {
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, volunteering, awards, customSections, sectionOrder, design } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible !== false;
  const accent = design?.accentColor || "#7c3aed";

  // Split skills into transferable (first half) and technical (rest)
  const transferable = skills.slice(0, Math.ceil(skills.length / 2));
  const technical = skills.slice(Math.ceil(skills.length / 2));

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-purple-50/30 transition-colors rounded -mx-2 px-2" : ""}
    >
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: design?.fontFamily || "'Inter', sans-serif", minHeight: "297mm", fontSize: "9.5pt", color: "#1a1a2e", lineHeight: 1.55 }}>

      {/* Header banner */}
      <div
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer" : ""}
        style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, padding: "32px 48px 28px", color: "white" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "24pt", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "4px" }}>{contact.fullName}</h1>
            {summary && (
              <p style={{ fontSize: "9.5pt", opacity: 0.85, maxWidth: "400px", lineHeight: 1.5, fontStyle: "italic" }}>
                {summary.split(".")[0] + "."}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: "8pt", opacity: 0.85, lineHeight: 1.8 }}>
            {contact.email && <div>{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {contact.location && <div>{contact.location}</div>}
            {contact.linkedin && <div>{contact.linkedin}</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 48px" }}>
        {/* CAREER NARRATIVE — Key for career changers */}
        {visible("summary") && summary && (
          <SectionWrapper id="summary">
            <div style={{ marginBottom: "22px", background: "#faf5ff", border: `1px solid ${accent}33`, borderRadius: "10px", padding: "16px 20px", borderLeft: `4px solid ${accent}` }}>
              <h2 style={{ fontSize: "8.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: accent, marginBottom: "8px" }}>Career Story</h2>
              <p style={{ color: "#334155", lineHeight: 1.7 }}>{summary}</p>
            </div>
          </SectionWrapper>
        )}

        {/* TRANSFERABLE SKILLS — FIRST for career changers */}
        {visible("skills") && skills.length > 0 && (
          <SectionWrapper id="skills">
            <CSSection title="Transferable Skills" accent={accent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {transferable.length > 0 && (
                  <div>
                    <p style={{ fontSize: "8pt", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Core</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {transferable.map((s) => (
                        <span key={s} style={{ background: `${accent}18`, color: accent, fontWeight: 600, fontSize: "8.5pt", padding: "3px 10px", borderRadius: "99px", border: `1px solid ${accent}33` }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {technical.length > 0 && (
                  <div>
                    <p style={{ fontSize: "8pt", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Technical</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {technical.map((s) => (
                        <span key={s} style={{ background: "#f1f5f9", color: "#475569", fontSize: "8.5pt", padding: "3px 10px", borderRadius: "99px", border: "1px solid #e2e8f0" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CSSection>
          </SectionWrapper>
        )}

        {/* RELEVANT EXPERIENCE — Relabelled */}
        {visible("experience") && experience.length > 0 && (
          <SectionWrapper id="experience">
            <CSSection title="Relevant Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "14px" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{exp.role}</span>
                      <span style={{ color: accent, fontWeight: 600, marginLeft: "8px", fontSize: "9pt" }}>{exp.company}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>
                      <div>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                      {exp.location && <div>{exp.location}</div>}
                    </div>
                  </div>
                  {exp.bullets.filter((b) => b.content).map((b) => (
                    <div key={b.id} style={{ color: "#334155", marginTop: "3px", paddingLeft: "14px" }}>• {b.content}</div>
                  ))}
                </div>
              ))}
            </CSSection>
          </SectionWrapper>
        )}

        {/* PROJECTS — Showcases new direction work */}
        {visible("projects") && projects.length > 0 && (
          <SectionWrapper id="projects">
            <CSSection title="Projects & Portfolio" accent={accent}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, color: "#111" }}>{proj.name}</span>
                    <span style={{ fontSize: "8pt", color: "#64748b" }}>{formatDateRange(proj.startDate, proj.endDate)}</span>
                  </div>
                  {proj.role && <div style={{ fontSize: "8.5pt", color: "#64748b" }}>{proj.role}</div>}
                  {proj.url && <div style={{ fontSize: "8pt", color: accent }}>{proj.url}</div>}
                  {proj.bullets.filter((b) => b.content).map((b) => (
                    <div key={b.id} style={{ color: "#334155", marginTop: "2px", paddingLeft: "14px" }}>• {b.content}</div>
                  ))}
                </div>
              ))}
            </CSSection>
          </SectionWrapper>
        )}

        {/* TWO-COLUMN FOOTER */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {visible("education") && education.length > 0 && (
            <SectionWrapper id="education">
              <CSSection title="Education" accent={accent}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: 700, color: "#111" }}>{edu.institution}</div>
                    <div style={{ color: "#334155", fontSize: "8.5pt" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                    <div style={{ color: "#64748b", fontSize: "8pt" }}>{formatDateRange(edu.startDate, edu.endDate)}</div>
                  </div>
                ))}
              </CSSection>
            </SectionWrapper>
          )}

          {visible("certifications") && certifications.length > 0 && (
            <SectionWrapper id="certifications">
              <CSSection title="Certifications" accent={accent}>
                {certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: "6px" }}>
                    <div style={{ fontWeight: 600, color: "#111", fontSize: "9pt" }}>{cert.name}</div>
                    <div style={{ color: "#64748b", fontSize: "8pt" }}>{cert.issuer} · {cert.date}</div>
                  </div>
                ))}
              </CSSection>
            </SectionWrapper>
          )}
        </div>

        {visible("languages") && languages.length > 0 && (
          <SectionWrapper id="languages">
            <CSSection title="Languages" accent={accent}>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {languages.map((l) => <span key={l.id}><strong>{l.name}</strong> ({l.proficiency})</span>)}
              </div>
            </CSSection>
          </SectionWrapper>
        )}

        {customSections?.filter((cs) => sectionOrder.find((s) => s.id === cs.id)?.visible).map((cs) => (
          <SectionWrapper key={cs.id} id={cs.id}>
            <CSSection title={cs.title} accent={accent}>
              {cs.bullets.filter((b) => b.content).map((b) => (
                <div key={b.id} style={{ color: "#334155", paddingLeft: "14px", marginBottom: "3px" }}>• {b.content}</div>
              ))}
            </CSSection>
          </SectionWrapper>
        ))}
      </div>
    </div>
  );
}

function CSSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <h2 style={{ fontSize: "9pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: accent, whiteSpace: "nowrap" }}>{title}</h2>
        <div style={{ flex: 1, height: "1px", background: `${accent}44` }} />
      </div>
      {children}
    </div>
  );
}
