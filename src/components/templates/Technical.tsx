import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function TechnicalTemplate({ 
  resume, isPreview, onSectionClick 
}: { 
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, publications, awards, sectionOrder, design } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible ?? false;
  const accent = design?.accentColor || "#7c3aed";

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div 
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-black/5 transition-colors rounded-lg -mx-2 px-2 py-1 border border-transparent hover:border-black/10" : ""}
    >
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: design?.fontFamily || "'JetBrains Mono', 'Courier New', monospace", minHeight: "297mm", padding: "40px 44px", fontSize: "9pt", color: "#0f172a", lineHeight: 1.6, background: "#fff" }}>
      {/* Header */}
      <div 
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer hover:bg-black/5 transition-colors rounded-lg -mx-2 px-2 py-1 border border-transparent hover:border-black/10" : ""}
        style={{ borderBottom: "2px solid #0f172a", paddingBottom: "14px", marginBottom: "18px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "20pt", fontWeight: 900, letterSpacing: "-0.5px", color: "#0f172a", lineHeight: 1 }}>{contact.fullName}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: "7.5pt", color: "#475569", marginTop: "6px" }}>
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.location && <span>{contact.location}</span>}
              {contact.github && <span>github: {contact.github.replace("github.com/", "")}</span>}
              {contact.website && <span>web: {contact.website}</span>}
              {contact.linkedin && <span>li: {contact.linkedin.replace("linkedin.com/in/", "")}</span>}
            </div>
          </div>
          {skills.length > 0 && (
            <div style={{ textAlign: "right", maxWidth: "240px" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: "4px" }}>TECH STACK</div>
              <div style={{ fontSize: "7.5pt", color: "#334155", lineHeight: 1.7 }}>
                {skills.slice(0, 10).join(" · ")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {visible("summary") && summary && (
        <SectionWrapper id="summary">
          <TechSection title="// summary" accent={accent}>
            <p style={{ color: "#334155", fontStyle: "italic" }}>{summary}</p>
          </TechSection>
        </SectionWrapper>
      )}

      {/* Experience */}
      {visible("experience") && experience.length > 0 && (
        <SectionWrapper id="experience">
          <TechSection title="// experience" accent={accent}>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "14px" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{exp.role}</span>
                    <span style={{ color: "#64748b" }}> @ {exp.company}</span>
                    {exp.location && <span style={{ color: "#94a3b8", fontSize: "8pt" }}> ({exp.location})</span>}
                  </div>
                  <span style={{ fontSize: "8pt", color: "#64748b", fontFamily: "monospace" }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <div style={{ marginTop: "4px" }}>
                    {exp.bullets.filter(b => b.content).map((b) => (
                      <div key={b.id} style={{ color: "#334155", paddingLeft: "12px", marginBottom: "2px" }}>
                        <span style={{ color: accent, marginRight: "6px" }}>▸</span>{b.content}
                      </div>
                    ))}
                  </div>
                )}
                {exp.skills.length > 0 && (
                  <div style={{ marginTop: "4px", fontSize: "8pt", color: accent }}>
                    [{exp.skills.join(", ")}]
                  </div>
                )}
              </div>
            ))}
          </TechSection>
        </SectionWrapper>
      )}

      {/* Projects */}
      {visible("projects") && projects.length > 0 && (
        <SectionWrapper id="projects">
          <TechSection title="// projects" accent={accent}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>{proj.name}</span>
                  {proj.url && <span style={{ fontSize: "8pt", color: accent }}>{proj.url}</span>}
                </div>
                <span style={{ color: "#64748b", fontSize: "8.5pt" }}>{proj.role}</span>
                {proj.bullets.map((b) => (
                  <div key={b.id} style={{ color: "#334155", paddingLeft: "12px", marginTop: "2px" }}>
                    <span style={{ color: accent, marginRight: "6px" }}>▸</span>{b.content}
                  </div>
                ))}
              </div>
            ))}
          </TechSection>
        </SectionWrapper>
      )}

      {/* Skills — full detail */}
      {visible("skills") && skills.length > 0 && (
        <SectionWrapper id="skills">
          <TechSection title="// skills" accent={accent}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {skills.map((skill) => (
                <span key={skill} style={{ padding: "2px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "8pt", color: "#334155", background: "#f8fafc" }}>
                  {skill}
                </span>
              ))}
            </div>
          </TechSection>
        </SectionWrapper>
      )}

      {/* Education */}
      {visible("education") && education.length > 0 && (
        <SectionWrapper id="education">
          <TechSection title="// education" accent={accent}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{edu.institution}</span>
                  <span style={{ color: "#64748b" }}> — {edu.degree}{edu.field ? ` ${edu.field}` : ""}</span>
                  {edu.honors && <span style={{ color: accent, fontSize: "8.5pt" }}> · {edu.honors}</span>}
                </div>
                <span style={{ fontSize: "8pt", color: "#64748b" }}>{formatDateRange(edu.startDate, edu.endDate)}</span>
              </div>
            ))}
          </TechSection>
        </SectionWrapper>
      )}

      {/* Certifications */}
      {visible("certifications") && certifications.length > 0 && (
        <SectionWrapper id="certifications">
          <TechSection title="// certifications" accent={accent}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: "4px", fontSize: "8.5pt" }}>
                <span style={{ fontWeight: 600 }}>{cert.name}</span>
                <span style={{ color: "#64748b" }}> · {cert.issuer}</span>
                <span style={{ color: "#94a3b8" }}> · {cert.date}</span>
              </div>
            ))}
          </TechSection>
        </SectionWrapper>
      )}

      {/* Publications */}
      {visible("publications") && publications.length > 0 && (
        <SectionWrapper id="publications">
          <TechSection title="// publications" accent={accent}>
            {publications.map((pub) => (
              <div key={pub.id} style={{ marginBottom: "6px" }}>
                <span style={{ fontWeight: 600 }}>{pub.title}</span>
                <span style={{ color: "#64748b" }}> — {pub.publisher}, {pub.date}</span>
                {pub.url && <span style={{ color: accent, fontSize: "8pt" }}> [{pub.url}]</span>}
              </div>
            ))}
          </TechSection>
        </SectionWrapper>
      )}

      {/* Languages */}
      {visible("languages") && languages.length > 0 && (
        <SectionWrapper id="languages">
          <TechSection title="// languages" accent={accent}>
            <div style={{ display: "flex", gap: "16px" }}>
              {languages.map((lang) => (
                <span key={lang.id} style={{ fontSize: "8.5pt" }}>
                  <strong>{lang.name}</strong> <span style={{ color: "#94a3b8" }}>({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </TechSection>
        </SectionWrapper>
      )}
    </div>
  );
}

function TechSection({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "8.5pt", fontWeight: 700, color: accent || "#7c3aed", marginBottom: "8px", letterSpacing: "0.5px" }}>
        {title}
      </div>
      <div style={{ paddingLeft: "0" }}>{children}</div>
      <div style={{ borderBottom: "1px dashed #e2e8f0", marginTop: "12px" }} />
    </div>
  );
}
