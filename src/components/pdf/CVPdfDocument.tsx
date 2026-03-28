import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { CVContent, CVLayout, CVSpacing, CVPageSize } from "@/types/cv";

const tw = createTw({});

const SPACING: Record<CVSpacing, { sectionMb: number; innerGap: number; fontSize: number }> = {
  compact: { sectionMb: 8, innerGap: 6, fontSize: 9 },
  comfortable: { sectionMb: 14, innerGap: 10, fontSize: 10 },
  spacious: { sectionMb: 20, innerGap: 14, fontSize: 10 },
};

interface CVPdfDocumentProps {
  content: CVContent;
  themeColor: string;
  sectionOrder: string[];
  layout?: CVLayout;
  spacing?: CVSpacing;
  pageSize?: CVPageSize;
  fontHeading?: string;
  fontBody?: string;
}

const CVPdfDocument = ({
  content,
  themeColor,
  sectionOrder,
  layout = "single-column",
  spacing = "comfortable",
  pageSize = "letter",
}: CVPdfDocumentProps) => {
  const sp = SPACING[spacing];
  const format = pageSize === "letter" ? "LETTER" : "A4";

  const styles = StyleSheet.create({
    page: { padding: 40, fontSize: sp.fontSize, color: "#333333", lineHeight: 1.5 },
    sectionHeading: {
      fontSize: 8,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 2,
      color: themeColor,
      marginBottom: 6,
    },
    name: { fontSize: 22, fontWeight: "bold", color: themeColor, marginBottom: 2, textAlign: "center" },
    title: { fontSize: sp.fontSize, color: "#666666", marginBottom: 6, textAlign: "center" },
    contactRow: { flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 4 },
    contactText: { fontSize: 8, color: "#666666" },
    headerBorder: { borderBottomWidth: 2, borderBottomColor: themeColor, paddingBottom: 10, marginBottom: sp.sectionMb },
    section: { marginBottom: sp.sectionMb },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    expRole: { fontSize: sp.fontSize + 1, fontWeight: "bold", color: "#111111" },
    expCompany: { fontSize: 8, color: "#666666", marginBottom: 3 },
    expDate: { fontSize: 8, color: "#666666" },
    bullet: { flexDirection: "row", marginBottom: 2 },
    bulletDot: { width: 8, fontSize: sp.fontSize, color: "#666666" },
    bulletText: { flex: 1, fontSize: sp.fontSize, color: "#666666" },
    eduRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 },
    eduDegree: { fontSize: sp.fontSize + 1, fontWeight: "bold", color: "#111111" },
    eduInstitution: { fontSize: 8, color: "#666666" },
    skillBadge: {
      fontSize: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: themeColor + "20",
      color: themeColor,
    },
    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    summaryText: { fontSize: sp.fontSize, color: "#666666" },
    twoColContainer: { flexDirection: "row", gap: 20, marginTop: 10 },
    twoColHalf: { flex: 1 },
    sidebarContainer: { flexDirection: "row", gap: 16 },
    sidebarLeft: { width: "32%", borderRightWidth: 2, borderRightColor: themeColor + "30", paddingRight: 12 },
    sidebarRight: { flex: 1 },
    sidebarName: { fontSize: 16, fontWeight: "bold", color: themeColor, marginBottom: 2 },
    sidebarTitle: { fontSize: sp.fontSize, color: "#666666", marginBottom: sp.sectionMb },
  });

  const SectionHeading = ({ label }: { label: string }) => (
    <Text style={styles.sectionHeading}>{label}</Text>
  );

  const renderHeader = () => (
    <View style={styles.headerBorder}>
      <Text style={styles.name}>{content.header.name || "Your Name"}</Text>
      <Text style={styles.title}>{content.header.title || "Professional Title"}</Text>
      <View style={styles.contactRow}>
        {content.header.email ? <Text style={styles.contactText}>{content.header.email}</Text> : null}
        {content.header.phone ? <Text style={styles.contactText}>{content.header.phone}</Text> : null}
        {content.header.location ? <Text style={styles.contactText}>{content.header.location}</Text> : null}
        {content.header.linkedin ? <Text style={styles.contactText}>{content.header.linkedin}</Text> : null}
      </View>
    </View>
  );

  const renderSummary = () =>
    content.summary ? (
      <View style={styles.section}>
        <SectionHeading label="Professional Summary" />
        <Text style={styles.summaryText}>{content.summary}</Text>
      </View>
    ) : null;

  const renderExperience = () =>
    content.experience.length > 0 ? (
      <View style={styles.section}>
        <SectionHeading label="Experience" />
        {content.experience.map((exp, idx) => (
          <View key={idx} style={{ marginBottom: sp.innerGap }}>
            <View style={styles.expHeader}>
              <Text style={styles.expRole}>{exp.role || "Role"}</Text>
              <Text style={styles.expDate}>{exp.startDate} — {exp.endDate}</Text>
            </View>
            <Text style={styles.expCompany}>{exp.company || "Company"}</Text>
            {exp.bullets.filter(Boolean).map((b, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    ) : null;

  const renderEducation = () =>
    content.education.length > 0 ? (
      <View style={styles.section}>
        <SectionHeading label="Education" />
        {content.education.map((edu, idx) => (
          <View key={idx} style={styles.eduRow}>
            <View>
              <Text style={styles.eduDegree}>{edu.degree} in {edu.field}</Text>
              <Text style={styles.eduInstitution}>{edu.institution}</Text>
            </View>
            <Text style={styles.expDate}>{edu.year}</Text>
          </View>
        ))}
      </View>
    ) : null;

  const renderSkills = () =>
    content.skills.filter(Boolean).length > 0 ? (
      <View style={styles.section}>
        <SectionHeading label="Skills" />
        <View style={styles.skillsRow}>
          {content.skills.filter(Boolean).map((skill, i) => (
            <Text key={i} style={styles.skillBadge}>{skill}</Text>
          ))}
        </View>
      </View>
    ) : null;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "header": return layout === "sidebar" ? null : renderHeader();
      case "summary": return renderSummary();
      case "experience": return renderExperience();
      case "education": return renderEducation();
      case "skills": return renderSkills();
      default: return null;
    }
  };

  const renderSidebarLayout = () => (
    <View style={styles.sidebarContainer}>
      <View style={styles.sidebarLeft}>
        <Text style={styles.sidebarName}>{content.header.name || "Your Name"}</Text>
        <Text style={styles.sidebarTitle}>{content.header.title || "Professional Title"}</Text>
        <View style={styles.section}>
          <SectionHeading label="Contact" />
          {content.header.email ? <Text style={styles.contactText}>{content.header.email}</Text> : null}
          {content.header.phone ? <Text style={styles.contactText}>{content.header.phone}</Text> : null}
          {content.header.location ? <Text style={styles.contactText}>{content.header.location}</Text> : null}
          {content.header.linkedin ? <Text style={styles.contactText}>{content.header.linkedin}</Text> : null}
        </View>
        {renderSkills()}
      </View>
      <View style={styles.sidebarRight}>
        {sectionOrder.filter((s) => s !== "header" && s !== "skills").map((id) => (
          <View key={id}>{renderSection(id)}</View>
        ))}
      </View>
    </View>
  );

  const renderTwoColumnLayout = () => {
    const withoutHeader = sectionOrder.filter((s) => s !== "header");
    const midpoint = Math.ceil(withoutHeader.length / 2);
    const left = withoutHeader.slice(0, midpoint);
    const right = withoutHeader.slice(midpoint);
    return (
      <>
        {renderHeader()}
        <View style={styles.twoColContainer}>
          <View style={styles.twoColHalf}>{left.map((id) => <View key={id}>{renderSection(id)}</View>)}</View>
          <View style={styles.twoColHalf}>{right.map((id) => <View key={id}>{renderSection(id)}</View>)}</View>
        </View>
      </>
    );
  };

  return (
    <Document>
      <Page size={format as any} style={styles.page}>
        {layout === "sidebar"
          ? renderSidebarLayout()
          : layout === "two-column"
          ? renderTwoColumnLayout()
          : sectionOrder.map((id) => <View key={id}>{renderSection(id)}</View>)}
      </Page>
    </Document>
  );
};

export default CVPdfDocument;
