import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

export default function ModernMinimalTemplate({ resume }: { resume: ResumeData }) {
  const { contact, summary, experience, education, skills, projects, certifications, languages, volunteering, publications, awards, sectionOrder } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible ?? false;

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", padding: "48px 52px", minHeight: "297mm", fontSize: "9.5pt", color: "#1a1a2e", lineHeight: 1.55 }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #7c3aed", paddingBottom: "18px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24pt", fontWeight: 800, letterSpacing: "-0.5px", color: "#111", marginBottom: "4px", lineHeight: 1.1 }}>
          {contact.fullName}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: "8pt", color: "#5b5b7a", marginTop: "8px" }}>
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>☎ {contact.phone}</span>}
          {contact.location && <span>◎ {contact.location}</span>}
          {contact.website && <span>⬡ {contact.website}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.github && <span>⌂ {contact.github}</span>}
        </div>
      </div>

      {visible("summary") && summary && (
        <Section title="Professional Summary" accent="#7c3aed">
          <p style={{ color: "#334155", lineHeight: 1.65 }}>{summary}</p>
        </Section>
      )}

      {visible("experience") && experience.length > 0 && (
        <Section title="Experience" accent="#7c3aed">
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? "14px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "10pt", color: "#111" }}>{exp.role}</span>
                  <span style={{ color: "#7c3aed", fontWeight: 600, marginLeft: "6px", fontSize: "9pt" }}>{exp.company}</span>
                </div>
                <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b", whiteSpace: "nowrap", marginLeft: "8px" }}>
                  <div>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                  {exp.location && <div>{exp.location}</div>}
                </div>
              </div>
              {exp.bullets.length > 0 && (
                <ul style={{ marginTop: "5px", paddingLeft: "14px", listStyleType: "disc" }}>
                  {exp.bullets.filter(b => b.content).map((b) => (
                    <li key={b.id} style={{ color: "#334155", marginBottom: "2px" }}>{b.content}</li>
                  ))}
                </ul>
              )}
              {exp.skills.length > 0 && (
                <div style={{ marginTop: "5px", display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {exp.skills.map((s) => (
                    <span key={s} style={{ padding: "1px 7px", borderRadius: "99px", background: "#ede9fe", color: "#6d28d9", fontSize: "7.5pt", fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {visible("education") && education.length > 0 && (
        <Section title="Education" accent="#7c3aed">
          {education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#111" }}>{edu.institution}</div>
                <div style={{ color: "#334155", fontSize: "9pt" }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  {edu.honors ? ` · ${edu.honors}` : ""}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                </div>
              </div>
              <div style={{ fontSize: "8pt", color: "#64748b", textAlign: "right" }}>
                {formatDateRange(edu.startDate, edu.endDate)}
              </div>
            </div>
          ))}
        </Section>
      )}

      {visible("skills") && skills.length > 0 && (
        <Section title="Skills" accent="#7c3aed">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {skills.map((skill) => (
              <span key={skill} style={{ padding: "2px 10px", borderRadius: "99px", background: "#f1f5f9", color: "#1e293b", fontSize: "8.5pt", border: "1px solid #e2e8f0" }}>
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {visible("projects") && projects.length > 0 && (
        <Section title="Projects" accent="#7c3aed">
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: 700, color: "#111" }}>
                {proj.name} <span style={{ fontWeight: 400, color: "#64748b", fontSize: "9pt" }}>— {proj.role}</span>
              </div>
              {proj.url && <div style={{ fontSize: "8pt", color: "#7c3aed" }}>{proj.url}</div>}
              {proj.bullets.map((b) => <div key={b.id} style={{ color: "#334155", marginTop: "3px" }}>• {b.content}</div>)}
            </div>
          ))}
        </Section>
      )}

      {visible("certifications") && certifications.length > 0 && (
        <Section title="Certifications" accent="#7c3aed">
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div><span style={{ fontWeight: 600, color: "#111" }}>{cert.name}</span> · <span style={{ color: "#4b5563" }}>{cert.issuer}</span></div>
              <span style={{ color: "#64748b", fontSize: "8.5pt" }}>{cert.date}</span>
            </div>
          ))}
        </Section>
      )}

      {visible("volunteering") && volunteering.length > 0 && (
        <Section title="Volunteering" accent="#7c3aed">
          {volunteering.map((vol) => (
            <div key={vol.id} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#111" }}>{vol.role}</span>
                  <span style={{ color: "#7c3aed", fontWeight: 600, marginLeft: "6px" }}>{vol.organization}</span>
                </div>
                <span style={{ fontSize: "8pt", color: "#64748b" }}>{formatDateRange(vol.startDate, vol.endDate)}</span>
              </div>
              {vol.description && <p style={{ color: "#334155", marginTop: "3px" }}>{vol.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {visible("publications") && publications.length > 0 && (
        <Section title="Publications" accent="#7c3aed">
          {publications.map((pub) => (
            <div key={pub.id} style={{ marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, color: "#111" }}>{pub.title}</span>
              <span style={{ color: "#4b5563" }}> — {pub.publisher}, {pub.date}</span>
              {pub.description && <p style={{ color: "#64748b", fontSize: "8.5pt", marginTop: "2px" }}>{pub.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {visible("languages") && languages.length > 0 && (
        <Section title="Languages" accent="#7c3aed">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "9pt", color: "#334155" }}>
                <strong>{lang.name}</strong> <span style={{ color: "#94a3b8" }}>({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {visible("awards") && awards.length > 0 && (
        <Section title="Awards & Honors" accent="#7c3aed">
          {awards.map((award) => (
            <div key={award.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div>
                <span style={{ fontWeight: 600, color: "#111" }}>{award.title}</span>
                <span style={{ color: "#4b5563" }}> · {award.issuer}</span>
              </div>
              <span style={{ color: "#64748b", fontSize: "8.5pt" }}>{award.date}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div style={{ width: "3px", height: "16px", background: accent, borderRadius: "2px", flexShrink: 0 }} />
        <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#111" }}>{title}</h2>
        <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      </div>
      {children}
    </div>
  );
}
