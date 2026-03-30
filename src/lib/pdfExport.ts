import { ResumeData } from "@/types/resume";

// ─── Colour helper ────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function formatDate(d: string): string {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return m ? `${months[parseInt(m) - 1]} ${y}` : y;
}

function formatRange(start: string, end: string, isCurrent?: boolean): string {
  if (!start) return "";
  return `${formatDate(start)} – ${isCurrent ? "Present" : formatDate(end)}`;
}

// ─── Main export function ─────────────────────────────────────────────────────
export async function downloadResumePDF(resume: ResumeData): Promise<void> {
  const jsPDF = (await import("jspdf")).default;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PW = 210;
  const PH = 297;
  const ML = 18; // margin left
  const MR = 18; // margin right
  const MT = 18; // margin top
  const MB = 15; // margin bottom
  const CW = PW - ML - MR; // content width: 174mm

  const accent = resume.design?.accentColor || "#ef4444";
  const [ar, ag, ab] = hexToRgb(accent);

  let y = MT;

  function checkBreak(needed = 8) {
    if (y + needed > PH - MB) {
      doc.addPage();
      y = MT;
    }
  }

  function setColor(r: number, g: number, b: number) {
    doc.setTextColor(r, g, b);
  }

  function setAccent() { setColor(ar, ag, ab); }
  function setDark()   { setColor(17, 24, 39); }   // gray-900
  function setGray()   { setColor(100, 116, 139); } // slate-500
  function setMid()    { setColor(51, 65, 85); }    // slate-700

  // ── Name ──────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setDark();
  doc.text(resume.contact.fullName || "Your Name", ML, y);
  y += 8;

  // ── Contact line ──────────────────────────────────────────────────────────
  const { email, phone, location, website, linkedin, github } = resume.contact;
  const contactParts = [email, phone, location, website, linkedin, github].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setGray();
    const contactLine = contactParts.join("  |  ");
    const lines = doc.splitTextToSize(contactLine, CW);
    doc.text(lines, ML, y);
    y += lines.length * 4 + 2;
  }

  // ── Accent divider ────────────────────────────────────────────────────────
  doc.setDrawColor(ar, ag, ab);
  doc.setLineWidth(0.8);
  doc.line(ML, y, PW - MR, y);
  y += 6;

  const { sectionOrder } = resume;
  const visible = (id: string) => sectionOrder.find((s) => s.id === id)?.visible !== false;

  // ── Section heading helper ─────────────────────────────────────────────────
  function sectionHeading(title: string) {
    checkBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setAccent();
    doc.text(title.toUpperCase(), ML, y);
    // rule
    const tw = (doc as any).getTextWidth(title.toUpperCase()) + 3;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(ML + tw, y - 0.5, PW - MR, y - 0.5);
    y += 5;
  }

  // ── Text block helper ──────────────────────────────────────────────────────
  function addWrappedText(text: string, indent = 0, fontSize = 9, bold = false, color: "dark" | "mid" | "gray" = "mid") {
    if (!text) return;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    if (color === "dark") setDark();
    else if (color === "gray") setGray();
    else setMid();
    const lines = doc.splitTextToSize(text, CW - indent);
    checkBreak(lines.length * 4.5 + 1);
    doc.text(lines, ML + indent, y);
    y += lines.length * 4.5;
  }

  function addKeyValue(key: string, value: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setDark();
    doc.text(key, ML, y);
    const kw = (doc as any).getTextWidth(key) + 2;
    doc.setFont("helvetica", "normal");
    setMid();
    const lines = doc.splitTextToSize(value, CW - kw - 2);
    checkBreak(lines.length * 4.5 + 1);
    doc.text(lines, ML + kw, y);
    y += lines.length * 4.5;
  }

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  if (visible("summary") && resume.summary) {
    sectionHeading("Professional Summary");
    addWrappedText(resume.summary, 0, 9, false, "mid");
    y += 4;
  }

  // ── EXPERIENCE ────────────────────────────────────────────────────────────
  if (visible("experience") && resume.experience.length > 0) {
    sectionHeading("Work Experience");
    resume.experience.forEach((exp, i) => {
      checkBreak(14);
      // Role + Company
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setDark();
      doc.text(exp.role || "Role", ML, y);
      const roleW = (doc as any).getTextWidth(exp.role || "Role") + 3;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setAccent();
      const companyFit = doc.splitTextToSize(exp.company || "", CW - roleW - 30);
      doc.text(companyFit[0] || "", ML + roleW, y);

      // Date on right
      const dateStr = formatRange(exp.startDate, exp.endDate, exp.isCurrent);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setGray();
      doc.text(dateStr, PW - MR, y, { align: "right" });
      y += 4.5;

      // Location
      if (exp.location) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setGray();
        doc.text(exp.location, ML, y);
        y += 4;
      }

      // Bullets
      exp.bullets.filter((b) => b.content.trim()).forEach((b) => {
        checkBreak(6);
        doc.setFontSize(8.5);
        setMid();
        const bLines = doc.splitTextToSize(`• ${b.content}`, CW - 3);
        checkBreak(bLines.length * 4.2 + 0.5);
        doc.setFont("helvetica", "normal");
        doc.text(bLines, ML + 2, y);
        y += bLines.length * 4.2;
      });

      if (i < resume.experience.length - 1) y += 4;
    });
    y += 2;
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  if (visible("education") && resume.education.length > 0) {
    sectionHeading("Education");
    resume.education.forEach((edu) => {
      checkBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setDark();
      doc.text(edu.institution || "", ML, y);
      // Date
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setGray();
      doc.text(formatRange(edu.startDate, edu.endDate), PW - MR, y, { align: "right" });
      y += 4.5;

      let degLine = [edu.degree, edu.field ? `in ${edu.field}` : ""].filter(Boolean).join(" ");
      if (edu.gpa) degLine += ` · GPA ${edu.gpa}`;
      if (edu.honors) degLine += ` · ${edu.honors}`;
      addWrappedText(degLine, 0, 9, false, "mid");
      y += 3;
    });
    y += 2;
  }

  // ── SKILLS ────────────────────────────────────────────────────────────────
  if (visible("skills") && resume.skills.length > 0) {
    sectionHeading("Skills");
    addWrappedText(resume.skills.join("  ·  "), 0, 9, false, "mid");
    y += 4;
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  if (visible("projects") && resume.projects.length > 0) {
    sectionHeading("Projects");
    resume.projects.forEach((proj) => {
      checkBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setDark();
      doc.text(proj.name || "", ML, y);
      if (proj.role) {
        const nw = (doc as any).getTextWidth(proj.name || "") + 3;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setGray();
        doc.text(`— ${proj.role}`, ML + nw, y);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setGray();
      doc.text(formatRange(proj.startDate, proj.endDate), PW - MR, y, { align: "right" });
      y += 4.5;

      if (proj.url) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setAccent();
        doc.text(proj.url, ML, y);
        y += 4;
      }

      proj.bullets.filter((b) => b.content.trim()).forEach((b) => {
        checkBreak(5);
        doc.setFontSize(8.5);
        setMid();
        const bLines = doc.splitTextToSize(`• ${b.content}`, CW - 3);
        doc.setFont("helvetica", "normal");
        doc.text(bLines, ML + 2, y);
        y += bLines.length * 4.2;
      });
      y += 3;
    });
    y += 1;
  }

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  if (visible("certifications") && resume.certifications.length > 0) {
    sectionHeading("Certifications");
    resume.certifications.forEach((cert) => {
      checkBreak(6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setDark();
      doc.text(cert.name || "", ML, y);
      doc.setFont("helvetica", "normal");
      setGray();
      doc.text(cert.date || "", PW - MR, y, { align: "right" });
      y += 4;
      if (cert.issuer) addWrappedText(cert.issuer, 0, 8.5, false, "gray");
      y += 1;
    });
    y += 2;
  }

  // ── LANGUAGES ─────────────────────────────────────────────────────────────
  if (visible("languages") && resume.languages.length > 0) {
    sectionHeading("Languages");
    const langLine = resume.languages.map((l) => `${l.name} (${l.proficiency})`).join("   ·   ");
    addWrappedText(langLine, 0, 9, false, "mid");
    y += 4;
  }

  // ── VOLUNTEERING ──────────────────────────────────────────────────────────
  if (visible("volunteering") && resume.volunteering.length > 0) {
    sectionHeading("Volunteering");
    resume.volunteering.forEach((vol) => {
      checkBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setDark();
      doc.text(`${vol.role} — ${vol.organization}`, ML, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setGray();
      doc.text(formatRange(vol.startDate, vol.endDate), PW - MR, y, { align: "right" });
      y += 4.5;
      if (vol.description) addWrappedText(vol.description, 0, 9, false, "mid");
      y += 3;
    });
  }

  // ── PUBLICATIONS ──────────────────────────────────────────────────────────
  if (visible("publications") && resume.publications.length > 0) {
    sectionHeading("Publications");
    resume.publications.forEach((pub, i) => {
      checkBreak(8);
      const line = `${i + 1}. ${pub.title}. ${pub.publisher}, ${pub.date}.${pub.url ? ` ${pub.url}` : ""}`;
      addWrappedText(line, 0, 9, false, "mid");
      if (pub.description) addWrappedText(pub.description, 3, 8.5, false, "gray");
      y += 2;
    });
    y += 2;
  }

  // ── AWARDS ────────────────────────────────────────────────────────────────
  if (visible("awards") && resume.awards.length > 0) {
    sectionHeading("Awards & Honors");
    resume.awards.forEach((award) => {
      checkBreak(7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      setDark();
      doc.text(award.title || "", ML, y);
      doc.setFont("helvetica", "normal");
      setGray();
      doc.text(award.date || "", PW - MR, y, { align: "right" });
      y += 4;
      if (award.issuer) addWrappedText(award.issuer, 0, 8.5, false, "gray");
      if (award.description) addWrappedText(award.description, 0, 8.5, false, "mid");
      y += 2;
    });
  }

  // ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
  resume.customSections?.forEach((cs) => {
    const secEntry = sectionOrder.find((s) => s.id === cs.id);
    if (!secEntry?.visible) return;
    sectionHeading(cs.title);
    cs.bullets.filter((b) => b.content.trim()).forEach((b) => {
      checkBreak(5);
      const bLines = doc.splitTextToSize(`• ${b.content}`, CW - 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setMid();
      doc.text(bLines, ML + 2, y);
      y += bLines.length * 4.2;
    });
    y += 4;
  });

  // ── Download ──────────────────────────────────────────────────────────────
  const fileName = `${(resume.contact.fullName || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
  doc.save(fileName);
}
