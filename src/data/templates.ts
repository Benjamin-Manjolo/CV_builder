import { CVTemplate } from "@/types/cv";

const defaultContent = {
  header: {
    name: "Your Full Name",
    title: "Professional Title",
    email: "email@example.com",
    phone: "+1 (555) 000-0000",
    location: "City, Country",
    linkedin: "linkedin.com/in/yourname",
  },
  summary:
    "A motivated professional with 5+ years of experience in delivering results-driven solutions. Passionate about innovation and committed to continuous improvement.",
  experience: [
    {
      id: "exp1",
      company: "Company Name",
      role: "Senior Position",
      startDate: "Jan 2021",
      endDate: "Present",
      bullets: [
        "Led a team of 8 to deliver a key product feature, increasing revenue by 25%",
        "Streamlined internal workflows, reducing processing time by 40%",
      ],
    },
    {
      id: "exp2",
      company: "Previous Company",
      role: "Mid-Level Position",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      bullets: [
        "Managed cross-functional projects with budgets exceeding $500K",
        "Implemented new quality assurance processes adopted company-wide",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "University Name",
      degree: "Bachelor of Science",
      field: "Computer Science",
      year: "2018",
    },
  ],
  skills: [
    "Project Management",
    "Strategic Planning",
    "Data Analysis",
    "Team Leadership",
    "Communication",
    "Problem Solving",
  ],
};

export const templates: CVTemplate[] = [
  {
    id: "executive-pro",
    name: "Executive Pro",
    description: "A polished, corporate template ideal for senior professionals and executives.",
    category: "Professional",
    isPremium: false,
    thumbnailColor: "hsl(348, 55%, 30%)",
    sections: ["header", "summary", "experience", "education", "skills"],
    defaultContent: { ...defaultContent },
    theme: {
      primaryColor: "#7c2d36",
      accentColor: "#2d2926",
      fontHeading: "Playfair Display",
      fontBody: "DM Sans",
    },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "A clean, minimalist design that lets your experience speak for itself.",
    category: "Minimalist",
    isPremium: false,
    thumbnailColor: "hsl(20, 10%, 15%)",
    sections: ["header", "summary", "experience", "education", "skills"],
    defaultContent: { ...defaultContent },
    theme: {
      primaryColor: "#2d2926",
      accentColor: "#7c2d36",
      fontHeading: "DM Sans",
      fontBody: "DM Sans",
    },
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    description: "Stand out with a bold layout designed for creative professionals.",
    category: "Creative",
    isPremium: false,
    thumbnailColor: "hsl(38, 70%, 55%)",
    sections: ["header", "summary", "experience", "education", "skills"],
    defaultContent: { ...defaultContent },
    theme: {
      primaryColor: "#b8860b",
      accentColor: "#2d2926",
      fontHeading: "Playfair Display",
      fontBody: "DM Sans",
    },
  },
  {
    id: "modern-slate",
    name: "Modern Slate",
    description: "A contemporary two-column layout with a sleek sidebar for skills and contact info.",
    category: "Professional",
    isPremium: true,
    price: 4.99,
    thumbnailColor: "hsl(210, 15%, 25%)",
    sections: ["header", "summary", "experience", "education", "skills"],
    defaultContent: { ...defaultContent },
    theme: {
      primaryColor: "#374151",
      accentColor: "#7c2d36",
      fontHeading: "Playfair Display",
      fontBody: "DM Sans",
    },
  },
  {
    id: "academic-classic",
    name: "Academic Classic",
    description: "Perfect for researchers, academics, and PhD candidates with publication sections.",
    category: "Academic",
    isPremium: true,
    price: 4.99,
    thumbnailColor: "hsl(220, 30%, 20%)",
    sections: ["header", "summary", "experience", "education", "skills"],
    defaultContent: { ...defaultContent },
    theme: {
      primaryColor: "#1e3a5f",
      accentColor: "#7c2d36",
      fontHeading: "Playfair Display",
      fontBody: "DM Sans",
    },
  },
  {
    id: "warm-elegance",
    name: "Warm Elegance",
    description: "An elegant design with warm tones, perfect for hospitality and client-facing roles.",
    category: "Creative",
    isPremium: true,
    price: 6.99,
    thumbnailColor: "hsl(348, 45%, 45%)",
    sections: ["header", "summary", "experience", "education", "skills"],
    defaultContent: { ...defaultContent },
    theme: {
      primaryColor: "#7c2d36",
      accentColor: "#b8860b",
      fontHeading: "Playfair Display",
      fontBody: "DM Sans",
    },
  },
];

export const getTemplate = (id: string) => templates.find((t) => t.id === id);
