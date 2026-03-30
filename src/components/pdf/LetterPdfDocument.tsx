import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { LetterContent } from "@/types/letter";
import { CVPageSize, CVMargins } from "@/types/cv";

interface LetterPdfDocumentProps {
  content: LetterContent;
  themeColor: string;
  spacing?: "compact" | "comfortable" | "spacious";
  pageSize?: CVPageSize;
  margins?: CVMargins;
  fontSize?: number;
}

const SPACING_MAP = {
  compact: { sectionMb: 8, fontSize: 9 },
  comfortable: { sectionMb: 14, fontSize: 10 },
  spacious: { sectionMb: 20, fontSize: 10 },
};

const LetterPdfDocument = ({
  content,
  themeColor,
  spacing = "comfortable",
  pageSize = "letter",
  margins = { top: 1.02, bottom: 1.52, left: 1.52, right: 1.52 },
  fontSize: fontSizeProp,
}: LetterPdfDocumentProps) => {
  const sp = SPACING_MAP[spacing];
  const baseFontSize = fontSizeProp ?? sp.fontSize;
  const format = pageSize === "letter" ? "LETTER" : "A4";

  const styles = StyleSheet.create({
    page: { paddingTop: margins.top * 28.3465, paddingBottom: margins.bottom * 28.3465, paddingLeft: margins.left * 28.3465, paddingRight: margins.right * 28.3465, fontSize: baseFontSize, color: "#333333", lineHeight: 1.6 },
    senderName: { fontSize: 20, fontWeight: "bold", color: themeColor, marginBottom: 2 },
    senderTitle: { fontSize: 9, color: "#666666", marginBottom: 4 },
    senderContact: { flexDirection: "row", gap: 12, marginBottom: 10 },
    senderContactText: { fontSize: 8, color: "#666666" },
    headerBorder: { borderBottomWidth: 2, borderBottomColor: themeColor, paddingBottom: 10, marginBottom: sp.sectionMb },
    date: { fontSize: baseFontSize, color: "#666666", marginBottom: sp.sectionMb },
    recipientName: { fontSize: baseFontSize, fontWeight: "bold", color: "#111111" },
    recipientText: { fontSize: baseFontSize, color: "#666666" },
    section: { marginBottom: sp.sectionMb },
    subject: { fontSize: baseFontSize + 1, fontWeight: "bold", color: "#111111", marginBottom: sp.sectionMb },
    greeting: { fontSize: baseFontSize, color: "#111111", marginBottom: sp.sectionMb },
    bodyParagraph: { fontSize: baseFontSize, color: "#666666", marginBottom: 8 },
    closingSection: { marginTop: 24 },
    closing: { fontSize: baseFontSize, color: "#111111", marginBottom: 18 },
    signature: { fontSize: baseFontSize + 1, fontWeight: "bold", color: themeColor },
  });

  return (
    <Document>
      <Page size={format as any} style={styles.page}>
        {/* Sender */}
        <View style={styles.headerBorder}>
          <Text style={styles.senderName}>{content.sender.name || "Your Name"}</Text>
          <Text style={styles.senderTitle}>{content.sender.title || "Professional Title"}</Text>
          <View style={styles.senderContact}>
            {content.sender.email ? <Text style={styles.senderContactText}>{content.sender.email}</Text> : null}
            {content.sender.phone ? <Text style={styles.senderContactText}>{content.sender.phone}</Text> : null}
            {content.sender.address ? <Text style={styles.senderContactText}>{content.sender.address}</Text> : null}
          </View>
        </View>

        {/* Date */}
        <Text style={styles.date}>{content.date}</Text>

        {/* Recipient */}
        <View style={styles.section}>
          <Text style={styles.recipientName}>{content.recipient.name}</Text>
          <Text style={styles.recipientText}>{content.recipient.title}</Text>
          <Text style={styles.recipientText}>{content.recipient.company}</Text>
          <Text style={styles.recipientText}>{content.recipient.address}</Text>
        </View>

        {/* Subject */}
        {content.subject ? <Text style={styles.subject}>Re: {content.subject}</Text> : null}

        {/* Greeting */}
        <Text style={styles.greeting}>{content.greeting}</Text>

        {/* Body */}
        <View style={styles.section}>
          {content.body.map((paragraph, i) => (
            <Text key={i} style={styles.bodyParagraph}>{paragraph}</Text>
          ))}
        </View>

        {/* Closing */}
        <View style={styles.closingSection}>
          <Text style={styles.closing}>{content.closing}</Text>
          <Text style={styles.signature}>{content.signature}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default LetterPdfDocument;
