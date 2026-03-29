export type CVLayout = "single-column" | "two-column" | "sidebar";
export type CVSpacing = "compact" | "comfortable" | "spacious";
export type CVPageSize = "letter" | "a4";

export interface CVMargins {
  top: number;    // in cm
  bottom: number; // in cm
  left: number;   // in cm
  right: number;  // in cm
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  price?: number;
  thumbnailColor: string;
  sections: string[];
  defaultContent: CVContent;
  theme: CVTheme;
}

export interface CVContent {
  header: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface CVTheme {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  layout?: CVLayout;
  spacing?: CVSpacing;
  pageSize?: CVPageSize;
}

export interface CVDocument {
  id: string;
  templateId: string;
  title: string;
  content: CVContent;
  lastSavedAt: string;
}
