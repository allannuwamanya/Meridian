import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function ClassicTemplate({ 
  resume, isPreview, onSectionClick 
}: { 
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void; 
}) {
  const { contact, summary, experience, education, skills, certifications, languages, sectionOrder, design } = resume;
  const visibleSections = sectionOrder.filter((s) => s.visible).map((s) => s.id);

  return (
    <div style={{ fontFamily: design?.fontFamily || "'Times New Roman', Times, serif", padding: "52px 56px", minHeight: "297mm", fontSize: "10pt", color: "#000", lineHeight: 1.5 }}>
      {/* Header */}
      <div 
        onClick={() => isPreview && onSectionClick?.("contact")}
        className={isPreview ? "cursor-pointer hover:bg-slate-50/50 transition-colors rounded-xl -mx-4 px-4 py-2 border border-transparent hover:border-slate-100" : ""}
        style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "14px", marginBottom: "18px" }}
      >
        <h1 style={{ fontSize: "20pt", fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>{contact.fullName.toUpperCase()}</h1>
        <div style={{ fontSize: "9pt", color: "#333", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 12px" }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && <span>{contact.website}</span>}
        </div>
      </div>

      {visibleSections.includes("summary") && summary && (
        <ClassicSection id="summary" title="Summary" isPreview={isPreview} onSectionClick={onSectionClick}>
          <p>{summary}</p>
        </ClassicSection>
      )}

      {visibleSections.includes("experience") && experience.length > 0 && (
        <ClassicSection id="experience" title="Professional Experience" isPreview={isPreview} onSectionClick={onSectionClick}>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{exp.role}, {exp.company}{exp.location ? `, ${exp.location}` : ""}</strong>
                <span style={{ color: "#555" }}>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
              </div>
              <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
                {exp.bullets.filter(b => b.content).map((b) => (
                  <li key={b.id} style={{ marginBottom: "2px" }}>{b.content}</li>
                ))}
              </ul>
            </div>
          ))}
        </ClassicSection>
      )}

      {visibleSections.includes("education") && education.length > 0 && (
        <ClassicSection id="education" title="Education" isPreview={isPreview} onSectionClick={onSectionClick}>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <strong>{edu.institution}</strong> — {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? `, GPA: ${edu.gpa}` : ""}
              </div>
              <span style={{ color: "#555" }}>{formatDateRange(edu.startDate, edu.endDate)}</span>
            </div>
          ))}
        </ClassicSection>
      )}

      {visibleSections.includes("skills") && skills.length > 0 && (
        <ClassicSection id="skills" title="Skills" isPreview={isPreview} onSectionClick={onSectionClick}>
          <p>{skills.join(" · ")}</p>
        </ClassicSection>
      )}

      {visibleSections.includes("certifications") && certifications.length > 0 && (
        <ClassicSection id="certifications" title="Certifications" isPreview={isPreview} onSectionClick={onSectionClick}>
          {certifications.map((cert) => (
            <div key={cert.id}>{cert.name} — {cert.issuer}, {cert.date}</div>
          ))}
        </ClassicSection>
      )}

      {visibleSections.includes("languages") && languages.length > 0 && (
        <ClassicSection id="languages" title="Languages" isPreview={isPreview} onSectionClick={onSectionClick}>
          <p>{languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </ClassicSection>
      )}
    </div>
  );
}

function ClassicSection({ 
  id, title, children, isPreview, onSectionClick 
}: { 
  id?: string; title: string; children: React.ReactNode; 
  isPreview?: boolean; onSectionClick?: (id: string) => void; 
}) {
  return (
    <div 
      onClick={() => isPreview && id && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-slate-50/50 transition-colors rounded-xl -mx-4 px-4 py-2 border border-transparent hover:border-slate-100" : ""}
      style={{ marginBottom: "16px" }}
    >
      <h2 style={{ fontSize: "10.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #000", paddingBottom: "3px", marginBottom: "8px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
