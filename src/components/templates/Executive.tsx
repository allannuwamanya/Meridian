import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function ExecutiveTemplate({ 
  resume, isPreview, onSectionClick 
}: { 
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void; 
}) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, volunteering, awards, sectionOrder, design } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible ?? false;
  const accent = design?.accentColor || "#2d1b69";

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div 
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-black/5 transition-colors rounded-lg -mx-2 px-2 py-1 border border-transparent hover:border-black/10" : ""}
    >
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: design?.fontFamily || "'Inter', 'Helvetica Neue', Arial, sans-serif", minHeight: "297mm", color: "#1a1a2e", fontSize: "9.5pt", lineHeight: 1.55 }}>
      {/* Dark Header Band */}
      <div 
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
        style={{ background: `linear-gradient(135deg, #18185a 0%, ${accent} 50%, #1a3a5c 100%)`, padding: "36px 48px 28px", color: "white" }}
      >
        <h1 style={{ fontSize: "26pt", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px", lineHeight: 1.1 }}>
          {contact.fullName}
        </h1>
        {summary && visible("summary") && (
          <div onClick={(e) => {
            if (isPreview) { e.stopPropagation(); onSectionClick?.("summary"); }
          }}>
            <p className={isPreview ? "cursor-pointer hover:bg-white/10 rounded px-2 -mx-2 py-1 transition-colors" : ""} style={{ fontSize: "9.5pt", color: "rgba(255,255,255,0.75)", maxWidth: "560px", lineHeight: 1.6, marginTop: "10px" }}>
              {summary}
            </p>
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: "8pt", color: "rgba(255,255,255,0.6)", marginTop: "14px" }}>
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>☎ {contact.phone}</span>}
          {contact.location && <span>◎ {contact.location}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.website && <span>⬡ {contact.website}</span>}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", gap: 0 }}>
        {/* Main column */}
        <div style={{ flex: "1 1 60%", padding: "28px 32px 28px 48px" }}>
          {visible("experience") && experience.length > 0 && (
            <SectionWrapper id="experience">
              <ExecSection title="Professional Experience" accent={accent}>
                {experience.map((exp, i) => (
                  <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "16px" : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "10.5pt", color: "#111" }}>{exp.role}</div>
                        <div style={{ color: accent, fontWeight: 600, fontSize: "9pt" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                      </div>
                      <div style={{ fontSize: "8pt", color: "#64748b", whiteSpace: "nowrap", textAlign: "right" }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        {exp.employmentType !== "Full-time" && <div style={{ color: "#94a3b8" }}>{exp.employmentType}</div>}
                      </div>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul style={{ marginTop: "6px", paddingLeft: "14px" }}>
                        {exp.bullets.filter(b => b.content).map((b) => (
                          <li key={b.id} style={{ color: "#334155", marginBottom: "2px" }}>{b.content}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ExecSection>
            </SectionWrapper>
          )}

          {visible("projects") && projects.length > 0 && (
            <SectionWrapper id="projects">
              <ExecSection title="Key Projects" accent={accent}>
                {projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: "10px" }}>
                    <div style={{ fontWeight: 700, color: "#111" }}>{proj.name} <span style={{ fontWeight: 400, color: "#64748b" }}>— {proj.role}</span></div>
                    {proj.bullets.map((b) => <div key={b.id} style={{ color: "#334155", marginTop: "2px" }}>• {b.content}</div>)}
                  </div>
                ))}
              </ExecSection>
            </SectionWrapper>
          )}
        </div>

        {/* Side column */}
        <div style={{ flex: "0 0 38%", background: "#f8f7ff", borderLeft: "1px solid #e8e4f8", padding: "28px 28px 28px 24px" }}>
          {visible("skills") && skills.length > 0 && (
            <SectionWrapper id="skills">
              <SideSection title="Core Competencies" accent={accent}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {skills.map((skill) => (
                    <div key={skill} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "8.5pt", color: "#334155" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: accent, flexShrink: 0 }} />
                      {skill}
                    </div>
                  ))}
                </div>
              </SideSection>
            </SectionWrapper>
          )}

          {visible("education") && education.length > 0 && (
            <SectionWrapper id="education">
              <SideSection title="Education" accent={accent}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "10px" }}>
                    <div style={{ fontWeight: 700, fontSize: "9pt", color: "#111" }}>{edu.institution}</div>
                    <div style={{ color: "#334155", fontSize: "8.5pt" }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ""}</div>
                    {edu.honors && <div style={{ color: accent, fontSize: "8pt" }}>{edu.honors}</div>}
                    <div style={{ color: "#94a3b8", fontSize: "8pt" }}>{formatDateRange(edu.startDate, edu.endDate)}</div>
                  </div>
                ))}
              </SideSection>
            </SectionWrapper>
          )}

          {visible("certifications") && certifications.length > 0 && (
            <SectionWrapper id="certifications">
              <SideSection title="Certifications" accent={accent}>
                {certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: "6px" }}>
                    <div style={{ fontWeight: 600, fontSize: "8.5pt", color: "#111" }}>{cert.name}</div>
                    <div style={{ color: "#64748b", fontSize: "8pt" }}>{cert.issuer} · {cert.date}</div>
                  </div>
                ))}
              </SideSection>
            </SectionWrapper>
          )}

          {visible("languages") && languages.length > 0 && (
            <SectionWrapper id="languages">
              <SideSection title="Languages" accent={accent}>
                {languages.map((lang) => (
                  <div key={lang.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "8.5pt", marginBottom: "3px" }}>
                    <span style={{ fontWeight: 600, color: "#111" }}>{lang.name}</span>
                    <span style={{ color: "#94a3b8" }}>{lang.proficiency}</span>
                  </div>
                ))}
              </SideSection>
            </SectionWrapper>
          )}

          {visible("awards") && awards.length > 0 && (
            <SectionWrapper id="awards">
              <SideSection title="Awards" accent={accent}>
                {awards.map((award) => (
                  <div key={award.id} style={{ marginBottom: "6px" }}>
                    <div style={{ fontWeight: 600, fontSize: "8.5pt", color: "#111" }}>{award.title}</div>
                    <div style={{ color: "#64748b", fontSize: "8pt" }}>{award.issuer} · {award.date}</div>
                  </div>
                ))}
              </SideSection>
            </SectionWrapper>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecSection({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <h2 style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: accent || "#2d1b69" }}>{title}</h2>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>
      {children}
    </div>
  );
}

function SideSection({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: accent || "#2d1b69", marginBottom: "8px", paddingBottom: "4px", borderBottom: `1px solid ${accent ? accent+'40' : '#ddd8f8'}` }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
