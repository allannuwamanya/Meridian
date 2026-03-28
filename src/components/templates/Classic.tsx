import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function ClassicTemplate({ resume }: { resume: ResumeData }) {
  const { contact, summary, experience, education, skills, certifications, languages, sectionOrder } = resume;
  const visibleSections = sectionOrder.filter((s) => s.visible).map((s) => s.id);

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", padding: "52px 56px", minHeight: "297mm", fontSize: "10pt", color: "#000", lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "14px", marginBottom: "18px" }}>
        <h1 style={{ fontSize: "20pt", fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>{contact.fullName.toUpperCase()}</h1>
        <div style={{ fontSize: "9pt", color: "#333", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 12px" }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && <span>{contact.website}</span>}
        </div>
      </div>

      {visibleSections.includes("summary") && summary && (
        <ClassicSection title="Summary">
          <p>{summary}</p>
        </ClassicSection>
      )}

      {visibleSections.includes("experience") && experience.length > 0 && (
        <ClassicSection title="Professional Experience">
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
        <ClassicSection title="Education">
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
        <ClassicSection title="Skills">
          <p>{skills.join(" · ")}</p>
        </ClassicSection>
      )}

      {visibleSections.includes("certifications") && certifications.length > 0 && (
        <ClassicSection title="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id}>{cert.name} — {cert.issuer}, {cert.date}</div>
          ))}
        </ClassicSection>
      )}

      {visibleSections.includes("languages") && languages.length > 0 && (
        <ClassicSection title="Languages">
          <p>{languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </ClassicSection>
      )}
    </div>
  );
}

function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontSize: "10.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #000", paddingBottom: "3px", marginBottom: "8px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
