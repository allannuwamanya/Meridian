import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function InternationalTemplate({
  resume, isPreview, onSectionClick
}: {
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, volunteering, publications, awards, customSections, sectionOrder, design } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible !== false;
  const accent = design?.accentColor || "#0f4c81";

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-blue-50/20 rounded transition-colors -mx-2 px-2" : ""}
    >
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: design?.fontFamily || "'Arial', sans-serif", minHeight: "297mm", fontSize: "9.5pt", color: "#1a1a2e", lineHeight: 1.55 }}>

      {/* EU-style header with name + address block */}
      <div
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer" : ""}
        style={{ background: accent, padding: "28px 48px", color: "white" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "26pt", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "2px" }}>{contact.fullName}</h1>
          </div>
          {/* Photo placeholder — Euro CV style */}
          <div style={{ width: "72px", height: "90px", background: "rgba(255,255,255,0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "8pt", color: "rgba(255,255,255,0.6)", textAlign: "center", border: "1px dashed rgba(255,255,255,0.4)" }}>
            Photo
          </div>
        </div>
      </div>

      {/* Address / Contact block (Euro-style beneath header) */}
      <div style={{ background: `${accent}11`, padding: "10px 48px", borderBottom: `1px solid ${accent}33`, fontSize: "8.5pt", color: "#475569", display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
        {contact.location && <span>📍 {contact.location}</span>}
        {contact.phone && <span>📞 {contact.phone}</span>}
        {contact.email && <span>✉ {contact.email}</span>}
        {contact.website && <span style={{ color: accent }}>🌐 {contact.website}</span>}
        {contact.linkedin && <span>in {contact.linkedin}</span>}
        {contact.github && <span>⌂ {contact.github}</span>}
      </div>

      <div style={{ padding: "28px 48px" }}>
        {/* PROFILE */}
        {visible("summary") && summary && (
          <SectionWrapper id="summary">
            <IntlSection title="Personal Profile" accent={accent}>
              <p style={{ color: "#334155", lineHeight: 1.7 }}>{summary}</p>
            </IntlSection>
          </SectionWrapper>
        )}

        {/* WORK EXPERIENCE */}
        {visible("experience") && experience.length > 0 && (
          <SectionWrapper id="experience">
            <IntlSection title="Work Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: i < experience.length - 1 ? "14px" : 0 }}>
                  {/* Date column */}
                  <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b", paddingTop: "2px" }}>
                    <div>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                    {exp.location && <div style={{ marginTop: "2px" }}>{exp.location}</div>}
                  </div>
                  {/* Content column */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{exp.role}</div>
                    <div style={{ color: accent, fontWeight: 600, marginBottom: "4px", fontSize: "9pt" }}>{exp.company}</div>
                    {exp.bullets.filter((b) => b.content).map((b) => (
                      <div key={b.id} style={{ color: "#334155", marginBottom: "2px", paddingLeft: "12px" }}>▸ {b.content}</div>
                    ))}
                  </div>
                </div>
              ))}
            </IntlSection>
          </SectionWrapper>
        )}

        {/* EDUCATION */}
        {visible("education") && education.length > 0 && (
          <SectionWrapper id="education">
            <IntlSection title="Education & Training" accent={accent}>
              {education.map((edu) => (
                <div key={edu.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>{formatDateRange(edu.startDate, edu.endDate)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#111" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                    <div style={{ color: accent, fontWeight: 600, fontSize: "9pt" }}>{edu.institution}</div>
                    {edu.gpa && <div style={{ fontSize: "8.5pt", color: "#64748b" }}>GPA: {edu.gpa}{edu.honors ? ` · ${edu.honors}` : ""}</div>}
                  </div>
                </div>
              ))}
            </IntlSection>
          </SectionWrapper>
        )}

        {/* LANGUAGES — Very prominent in International CVs */}
        {visible("languages") && languages.length > 0 && (
          <SectionWrapper id="languages">
            <IntlSection title="Languages" accent={accent}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {languages.map((l) => (
                  <div key={l.id} style={{ background: "#f8fafc", border: `1px solid ${accent}22`, borderRadius: "8px", padding: "8px 12px" }}>
                    <div style={{ fontWeight: 700, color: "#111", fontSize: "9.5pt" }}>{l.name}</div>
                    <div style={{ fontSize: "8pt", color: accent }}>{l.proficiency}</div>
                  </div>
                ))}
              </div>
            </IntlSection>
          </SectionWrapper>
        )}

        {/* SKILLS */}
        {visible("skills") && skills.length > 0 && (
          <SectionWrapper id="skills">
            <IntlSection title="Digital & Professional Skills" accent={accent}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {skills.map((s) => (
                  <span key={s} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "2px 10px", borderRadius: "4px", fontSize: "8.5pt", color: "#334155" }}>{s}</span>
                ))}
              </div>
            </IntlSection>
          </SectionWrapper>
        )}

        {/* PROJECTS */}
        {visible("projects") && projects.length > 0 && (
          <SectionWrapper id="projects">
            <IntlSection title="Projects" accent={accent}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>{formatDateRange(proj.startDate, proj.endDate)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#111" }}>{proj.name}</div>
                    {proj.url && <div style={{ fontSize: "8pt", color: accent }}>{proj.url}</div>}
                    {proj.bullets.filter((b) => b.content).map((b) => (
                      <div key={b.id} style={{ color: "#334155", paddingLeft: "12px" }}>▸ {b.content}</div>
                    ))}
                  </div>
                </div>
              ))}
            </IntlSection>
          </SectionWrapper>
        )}

        {/* CERTIFICATIONS */}
        {visible("certifications") && certifications.length > 0 && (
          <SectionWrapper id="certifications">
            <IntlSection title="Certifications" accent={accent}>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: "6px" }}>
                  <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>{cert.date}</div>
                  <div style={{ fontSize: "9pt" }}><strong>{cert.name}</strong> — {cert.issuer}</div>
                </div>
              ))}
            </IntlSection>
          </SectionWrapper>
        )}

        {visible("awards") && awards.length > 0 && (
          <SectionWrapper id="awards">
            <IntlSection title="Awards & Achievements" accent={accent}>
              {awards.map((a) => (
                <div key={a.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: "6px" }}>
                  <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>{a.date}</div>
                  <div style={{ fontSize: "9pt" }}><strong>{a.title}</strong> — {a.issuer}</div>
                </div>
              ))}
            </IntlSection>
          </SectionWrapper>
        )}

        {visible("volunteering") && volunteering.length > 0 && (
          <SectionWrapper id="volunteering">
            <IntlSection title="Voluntary Work" accent={accent}>
              {volunteering.map((v) => (
                <div key={v.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>{formatDateRange(v.startDate, v.endDate)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#111" }}>{v.role}</div>
                    <div style={{ color: accent }}>{v.organization}</div>
                    {v.description && <div style={{ color: "#475569", fontSize: "8.5pt" }}>{v.description}</div>}
                  </div>
                </div>
              ))}
            </IntlSection>
          </SectionWrapper>
        )}

        {customSections?.filter((cs) => sectionOrder.find((s) => s.id === cs.id)?.visible).map((cs) => (
          <SectionWrapper key={cs.id} id={cs.id}>
            <IntlSection title={cs.title} accent={accent}>
              {cs.bullets.filter((b) => b.content).map((b) => (
                <div key={b.id} style={{ color: "#334155", paddingLeft: "12px", marginBottom: "3px" }}>▸ {b.content}</div>
              ))}
            </IntlSection>
          </SectionWrapper>
        ))}
      </div>
    </div>
  );
}

function IntlSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "white", background: accent, display: "inline-block", padding: "3px 12px", borderRadius: "4px", marginBottom: "12px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
