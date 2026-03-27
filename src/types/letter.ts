export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  price?: number;
  thumbnailColor: string;
  defaultContent: LetterContent;
  theme: LetterTheme;
}

export interface LetterContent {
  sender: {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
  };
  recipient: {
    name: string;
    title: string;
    company: string;
    address: string;
  };
  date: string;
  subject: string;
  greeting: string;
  body: string[];
  closing: string;
  signature: string;
}

export interface LetterTheme {
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  spacing: "compact" | "comfortable" | "spacious";
}
