import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function AcademicTemplate({
  resume, isPreview, onSectionClick
}: {
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, volunteering, publications, awards, customSections, sectionOrder, design } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible !== false;
  const accent = design?.accentColor || "#1e40af";

  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      onClick={() => isPreview && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-blue-50/30 transition-colors rounded -mx-2 px-2" : ""}
    >
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: design?.fontFamily || "'Georgia', serif", padding: "44px 52px", minHeight: "297mm", fontSize: "9.5pt", color: "#1a1a2e", lineHeight: 1.6 }}>
      {/* CV Header — two column */}
      <div
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer hover:bg-blue-50/30 transition-colors -mx-2 px-2" : ""}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "16px", marginBottom: "18px", borderBottom: `3px double ${accent}` }}
      >
        <div>
          <h1 style={{ fontSize: "22pt", fontWeight: 700, color: "#111", fontFamily: "'Georgia', serif", marginBottom: "3px" }}>{contact.fullName}</h1>
          {summary && <p style={{ fontSize: "9.5pt", color: accent, fontStyle: "italic", maxWidth: "340px" }}>{summary.split(".")[0]}.</p>}
        </div>
        <div style={{ textAlign: "right", fontSize: "8.5pt", color: "#475569", lineHeight: 1.8 }}>
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {contact.location && <div>{contact.location}</div>}
          {contact.website && <div style={{ color: accent }}>{contact.website}</div>}
          {contact.linkedin && <div>{contact.linkedin}</div>}
        </div>
      </div>

      {/* RESEARCH INTERESTS / SUMMARY */}
      {visible("summary") && summary && (
        <SectionWrapper id="summary">
          <CVSection title="Research Interests / Profile" accent={accent}>
            <p style={{ color: "#334155", fontStyle: "italic", lineHeight: 1.7 }}>{summary}</p>
          </CVSection>
        </SectionWrapper>
      )}

      {/* EDUCATION — First in academic CVs */}
      {visible("education") && education.length > 0 && (
        <SectionWrapper id="education">
          <CVSection title="Education" accent={accent}>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                  <span style={{ fontSize: "8.5pt", color: "#64748b" }}>{formatDateRange(edu.startDate, edu.endDate)}</span>
                </div>
                <div style={{ color: accent, fontWeight: 600, fontSize: "9pt" }}>{edu.institution}</div>
                {edu.honors && <div style={{ fontSize: "8.5pt", color: "#475569" }}>Distinction: {edu.honors}</div>}
                {edu.gpa && <div style={{ fontSize: "8.5pt", color: "#475569" }}>GPA: {edu.gpa}</div>}
                {edu.description && <div style={{ fontSize: "8.5pt", color: "#64748b", marginTop: "3px" }}>{edu.description}</div>}
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* PUBLICATIONS — Prominent in academic CVs */}
      {visible("publications") && publications.length > 0 && (
        <SectionWrapper id="publications">
          <CVSection title="Publications" accent={accent}>
            {publications.map((pub, i) => (
              <div key={pub.id} style={{ marginBottom: "10px", paddingLeft: "18px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, fontWeight: 700, color: accent }}>{i + 1}.</span>
                <span style={{ fontWeight: 600, color: "#111" }}>{pub.title}. </span>
                <span style={{ color: "#475569" }}>{pub.publisher}, {pub.date}.</span>
                {pub.url && <span style={{ color: accent, fontSize: "8.5pt" }}> {pub.url}</span>}
                {pub.description && <div style={{ fontSize: "8.5pt", color: "#64748b", marginTop: "2px" }}>{pub.description}</div>}
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* RESEARCH / ACADEMIC EXPERIENCE */}
      {visible("experience") && experience.length > 0 && (
        <SectionWrapper id="experience">
          <CVSection title="Academic & Research Experience" accent={accent}>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "14px" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{exp.role}</span>
                  <span style={{ fontSize: "8.5pt", color: "#64748b" }}>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div style={{ color: accent, fontWeight: 600, fontSize: "9pt", marginBottom: "4px" }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                {exp.bullets.filter((b) => b.content).map((b) => (
                  <div key={b.id} style={{ color: "#334155", marginBottom: "2px", paddingLeft: "14px" }}>– {b.content}</div>
                ))}
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* PROJECTS / RESEARCH PROJECTS */}
      {visible("projects") && projects.length > 0 && (
        <SectionWrapper id="projects">
          <CVSection title="Research Projects" accent={accent}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{proj.name}</span>
                  <span style={{ fontSize: "8.5pt", color: "#64748b" }}>{formatDateRange(proj.startDate, proj.endDate)}</span>
                </div>
                {proj.role && <div style={{ fontSize: "8.5pt", color: "#475569", fontStyle: "italic" }}>{proj.role}</div>}
                {proj.url && <div style={{ fontSize: "8pt", color: accent }}>{proj.url}</div>}
                {proj.bullets.filter((b) => b.content).map((b) => (
                  <div key={b.id} style={{ color: "#334155", marginBottom: "2px", paddingLeft: "14px" }}>– {b.content}</div>
                ))}
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* SKILLS */}
      {visible("skills") && skills.length > 0 && (
        <SectionWrapper id="skills">
          <CVSection title="Methods & Skills" accent={accent}>
            <p style={{ color: "#334155" }}>{skills.join(" · ")}</p>
          </CVSection>
        </SectionWrapper>
      )}

      {/* CERTIFICATIONS */}
      {visible("certifications") && certifications.length > 0 && (
        <SectionWrapper id="certifications">
          <CVSection title="Certifications & Training" accent={accent}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span><span style={{ fontWeight: 600 }}>{cert.name}</span> — {cert.issuer}</span>
                <span style={{ color: "#64748b", fontSize: "8.5pt" }}>{cert.date}</span>
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* AWARDS */}
      {visible("awards") && awards.length > 0 && (
        <SectionWrapper id="awards">
          <CVSection title="Awards & Honours" accent={accent}>
            {awards.map((a) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span><span style={{ fontWeight: 600 }}>{a.title}</span> — {a.issuer}</span>
                <span style={{ color: "#64748b", fontSize: "8.5pt" }}>{a.date}</span>
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* VOLUNTEERING */}
      {visible("volunteering") && volunteering.length > 0 && (
        <SectionWrapper id="volunteering">
          <CVSection title="Service & Outreach" accent={accent}>
            {volunteering.map((v) => (
              <div key={v.id} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>{v.role}</span>
                  <span style={{ fontSize: "8.5pt", color: "#64748b" }}>{formatDateRange(v.startDate, v.endDate)}</span>
                </div>
                <div style={{ color: accent }}>{v.organization}</div>
                {v.description && <div style={{ color: "#475569", fontSize: "8.5pt" }}>{v.description}</div>}
              </div>
            ))}
          </CVSection>
        </SectionWrapper>
      )}

      {/* LANGUAGES */}
      {visible("languages") && languages.length > 0 && (
        <SectionWrapper id="languages">
          <CVSection title="Languages" accent={accent}>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {languages.map((l) => (
                <span key={l.id}><strong>{l.name}</strong> <span style={{ color: "#64748b" }}>({l.proficiency})</span></span>
              ))}
            </div>
          </CVSection>
        </SectionWrapper>
      )}

      {/* CUSTOM SECTIONS */}
      {customSections?.filter((cs) => sectionOrder.find((s) => s.id === cs.id)?.visible).map((cs) => (
        <SectionWrapper key={cs.id} id={cs.id}>
          <CVSection title={cs.title} accent={accent}>
            {cs.bullets.filter((b) => b.content).map((b) => (
              <div key={b.id} style={{ color: "#334155", marginBottom: "3px", paddingLeft: "14px" }}>– {b.content}</div>
            ))}
          </CVSection>
        </SectionWrapper>
      ))}
    </div>
  );
}

function CVSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
