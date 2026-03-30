import { ResumeData } from "@/types/resume";
import { formatDateRange } from "@/lib/utils";

const SPACING = "16px";

export default function TimelineTemplate({ 
  resume, isPreview, onSectionClick 
}: { 
  resume: ResumeData; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  const { contact, summary, experience, education, skills, certifications, languages, sectionOrder, design } = resume;
  const accentColor = design?.accentColor || "#ef4444";

  // We only show sections that are marked visible in the store
  const visibleSections = sectionOrder.filter((s) => s.visible).map((s) => s.id);

  return (
    <div
      style={{
        fontFamily: design?.fontFamily || "'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: "48px 40px",
        minHeight: "297mm",
        fontSize: "10pt",
        color: "#000",
        lineHeight: 1.5,
        position: "relative",
      }}
    >
      {/* ─── HEADER ─── */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {/* Name with safe CSS brackets */}
        <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "12px", height: "56px" }}>
          {/* Left Bracket */}
          <div style={{ width: "12px", height: "100%", border: "4px solid #94a3b8", borderRight: "none", marginRight: "16px" }} />
          {/* Name */}
          <h1 style={{ fontSize: "30pt", fontWeight: 900, textTransform: "capitalize", letterSpacing: "0.5px", margin: 0, lineHeight: "56px" }}>
            {contact.fullName}
          </h1>
          {/* Right Bracket */}
          <div style={{ width: "12px", height: "100%", border: "4px solid #94a3b8", borderLeft: "none", marginLeft: "16px" }} />
        </div>

        {/* Contact info row */}
        <div style={{ fontSize: "8.5pt", color: "#333", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 16px" }}>
          {contact.location && <span><strong style={{ color: "#000" }}>Address:</strong> {contact.location}</span>}
          {contact.phone && <span><strong style={{ color: "#000" }}>Phone number:</strong> {contact.phone}</span>}
          {contact.email && <span><strong style={{ color: "#000" }}>Email address:</strong> {contact.email}</span>}
          {(contact.linkedin || contact.website) && <span><strong style={{ color: "#000" }}>Web:</strong> {contact.linkedin || contact.website}</span>}
        </div>
      </div>

      {/* Top horizontal divider line */}
      <div style={{ borderTop: "1px solid #cbd5e1", marginBottom: "-1px" }} />

      {/* ─── TWO-COLUMN TIMELINE BODY ─── */}
      <div style={{ display: "flex", position: "relative" }}>
        
        {/* The continuous vertical axis line */}
        <div
          style={{
            position: "absolute",
            left: "140px", // width of the left column
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: accentColor,
            zIndex: 0,
          }}
        />

        {/* Left Column (hidden visually, just structure, the actual headers are rendered locally to align with dots) */}
        <div style={{ width: "100%" }}>
          
          {visibleSections.includes("summary") && summary && (
            <TimelineSection id="summary" title="PROFILE" accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
              <p style={{ color: "#000", margin: 0 }}>{summary}</p>
            </TimelineSection>
          )}

          {visibleSections.includes("experience") && experience.length > 0 && (
            <TimelineSection id="experience" title="PROFESSIONAL EXPERIENCE" accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: i === experience.length - 1 ? 0 : "16px" }}>
                  <div style={{ fontWeight: 800, fontSize: "11pt" }}>{exp.role}</div>
                  <div style={{ fontWeight: 800, fontSize: "10pt", textTransform: "uppercase" }}>{exp.company}</div>
                  <div style={{ fontSize: "8pt", color: "#333", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    {exp.location && ` \u00A0 \u00A0 ${exp.location}`}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "16px", color: "#000" }}>
                    {exp.bullets.filter(b => b.content).map(b => (
                      <li key={b.id} style={{ marginBottom: "2px" }}>{b.content}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </TimelineSection>
          )}

          {visibleSections.includes("education") && education.length > 0 && (
            <TimelineSection id="education" title="EDUCATION" accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
              {education.map((edu, i) => (
                <div key={edu.id} style={{ marginBottom: i === education.length - 1 ? 0 : "12px" }}>
                  <div style={{ fontWeight: 800, fontSize: "11pt" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                  <div style={{ fontWeight: 800, fontSize: "10pt" }}>{edu.institution}</div>
                  <div style={{ fontSize: "8pt", color: "#333", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </div>
                  {edu.gpa && <div style={{ color: "#000", fontSize: "9pt" }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </TimelineSection>
          )}

          {visibleSections.includes("certifications") && certifications.length > 0 && (
            <TimelineSection id="certifications" title="CERTIFICATES" accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
              {certifications.map((cert, i) => (
                <div key={cert.id} style={{ marginBottom: i === certifications.length - 1 ? 0 : "12px" }}>
                  <div style={{ fontWeight: 800, fontSize: "11pt" }}>{cert.name}</div>
                  <div style={{ fontWeight: 800, fontSize: "10pt" }}>{cert.issuer}</div>
                  {cert.date && <div style={{ fontSize: "8pt", color: "#333", textTransform: "uppercase", letterSpacing: "0.5px" }}>{cert.date}</div>}
                </div>
              ))}
            </TimelineSection>
          )}

          {/* Languages feature horizontal sliders */}
          {visibleSections.includes("languages") && languages.length > 0 && (
            <TimelineSection id="languages" title="LANGUAGES" accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {languages.map(lang => {
                  let pct = 20;
                  const profLower = lang.proficiency?.toLowerCase() || "";
                  if (profLower.includes("native") || profLower.includes("bilingual")) pct = 90;
                  else if (profLower.includes("fluent")) pct = 75;
                  else if (profLower.includes("advanced") || profLower.includes("proficient")) pct = 60;
                  else if (profLower.includes("intermediate")) pct = 40;
                  
                  return (
                    <div key={lang.id}>
                      <div style={{ fontSize: "9.5pt", color: "#000", marginBottom: "4px", fontWeight: 600 }}>{lang.name}</div>
                      <div style={{ position: "relative", height: "2px", backgroundColor: "#cbd5e1", marginTop: "10px" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, backgroundColor: "#000" }} />
                        <div style={{ 
                          position: "absolute", left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)",
                          width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accentColor
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TimelineSection>
          )}

          {visibleSections.includes("skills") && skills.length > 0 && (
            <TimelineSection id="skills" title="SKILLS / INTERESTS" accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
              {/* Approximating the clustered horizontal list of interests/skills from the image */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", color: "#000" }}>
                {skills.map(s => <span key={s} style={{ fontWeight: 500 }}>{s}</span>)}
              </div>
            </TimelineSection>
          )}

          {/* Optionally show custom sections (like Projects or Publications) if they have data and are visible */}
          {visibleSections.map(sId => {
            if (["contact", "summary", "experience", "education", "certifications", "languages", "skills"].includes(sId)) return null;
            const dataArr = (resume as any)[sId];
            if (!Array.isArray(dataArr) || dataArr.length === 0) return null;
            
            // Generic renderer for extra sections
            return (
              <TimelineSection key={sId} id={sId} title={sId.toUpperCase()} accentColor={accentColor} isPreview={isPreview} onSectionClick={onSectionClick}>
                {dataArr.map((item: any, i) => (
                  <div key={item.id} style={{ marginBottom: i === dataArr.length - 1 ? 0 : "12px" }}>
                    <div style={{ fontWeight: 800, fontSize: "10.5pt" }}>{item.name || item.title || item.organization}</div>
                    {item.role && <div style={{ fontSize: "10pt", fontWeight: 600 }}>{item.role}</div>}
                    {(item.date || item.startDate) && (
                      <div style={{ fontSize: "8pt", color: "#333", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        {item.date || formatDateRange(item.startDate, item.endDate)}
                      </div>
                    )}
                    {item.description && <div style={{ color: "#000", fontSize: "9pt", marginTop: "4px" }}>{item.description}</div>}
                    {item.bullets && Array.isArray(item.bullets) && item.bullets.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: "16px", color: "#000", marginTop: "4px" }}>
                        {item.bullets.filter((b: any) => b.content).map((b: any) => <li key={b.id} style={{ marginBottom: "2px" }}>{b.content}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </TimelineSection>
            );
          })}

        </div>
      </div>
    </div>
  );
}

// Helper component for a section with the timeline layout
function TimelineSection({ 
  id, title, children, accentColor, isPreview, onSectionClick 
}: { 
  id?: string; title: string; children: React.ReactNode; 
  accentColor: string; isPreview?: boolean; onSectionClick?: (id: string) => void;
}) {
  return (
    <div 
      onClick={() => isPreview && id && onSectionClick?.(id)}
      className={isPreview ? "cursor-pointer hover:bg-slate-50/50 transition-colors rounded-xl -mx-4 px-4 py-1 border border-transparent hover:border-slate-100" : ""}
      style={{ position: "relative", borderBottom: "1px solid #cbd5e1", display: "flex" }}
    >
      {/* Left Column Area: 140px width */}
      <div style={{ width: "140px", flexShrink: 0, padding: "16px 0", paddingRight: "16px" }}>
        <h2 style={{ fontSize: "11pt", fontWeight: 900, color: "#000", letterSpacing: "0.5px", margin: 0 }}>
          {title}
        </h2>
      </div>

      {/* The Timeline Dot exactly on the separator axis */}
      <div
        style={{
          position: "absolute",
          left: "140px", // Align right on the vertical line
          top: "22px", // align with the vertical center of the title text roughly
          transform: "translate(-50%, -50%)",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: accentColor,
          zIndex: 10,
        }}
      />

      {/* Right Column Content Area */}
      <div style={{ flex: 1, padding: "16px 0", paddingLeft: "24px" }}>
        {children}
      </div>
    </div>
  );
}
