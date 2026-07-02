export type SkillCategory =
  | "Artificial Intelligence"
  | "Flutter"
  | "Frontend"
  | "Backend"
  | "Cloud"
  | "Automation"
  | "Python"
  | "Data Analytics"
  | "Power BI"
  | "Firebase"
  | "UI/UX"
  | "Leadership";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // percentage (0 - 100)
}

export const INITIAL_SKILLS: Skill[] = [
  // Artificial Intelligence
  { id: "ai-1", name: "Computer Vision & YOLO", category: "Artificial Intelligence", level: 95 },
  { id: "ai-2", name: "Deep Learning (TensorFlow/PyTorch)", category: "Artificial Intelligence", level: 90 },
  { id: "ai-3", name: "NLP & Large Language Models", category: "Artificial Intelligence", level: 88 },
  { id: "ai-4", name: "Predictive Analytics & Forecasting", category: "Artificial Intelligence", level: 92 },
  
  // Flutter
  { id: "fl-1", name: "Flutter Cross-Platform Dev", category: "Flutter", level: 96 },
  { id: "fl-2", name: "Dart & State Management (Bloc/Provider)", category: "Flutter", level: 94 },
  { id: "fl-3", name: "Custom RenderObjects & Animations", category: "Flutter", level: 90 },
  
  // Frontend
  { id: "fe-1", name: "Next.js 15 / React 19", category: "Frontend", level: 92 },
  { id: "fe-2", name: "TypeScript", category: "Frontend", level: 93 },
  { id: "fe-3", name: "Tailwind CSS & Shadcn/UI", category: "Frontend", level: 95 },
  { id: "fe-4", name: "Framer Motion & GSAP", category: "Frontend", level: 88 },

  // Backend
  { id: "be-1", name: "Node.js & Express", category: "Backend", level: 90 },
  { id: "be-2", name: "FastAPI & Flask", category: "Backend", level: 92 },
  { id: "be-3", name: "REST APIs & GraphQL", category: "Backend", level: 89 },

  // Cloud
  { id: "cl-1", name: "Google Cloud Platform (GCP)", category: "Cloud", level: 87 },
  { id: "cl-2", name: "Docker & Containerization", category: "Cloud", level: 85 },

  // Automation
  { id: "aut-1", name: "Workflow Automation (n8n/Make)", category: "Automation", level: 91 },
  { id: "aut-2", name: "CI/CD Pipelines (GitHub Actions)", category: "Automation", level: 88 },

  // Python
  { id: "py-1", name: "Python Scripting", category: "Python", level: 97 },
  { id: "py-2", name: "Pandas & NumPy & Scikit-Learn", category: "Python", level: 92 },

  // Data Analytics
  { id: "da-1", name: "Data Warehousing & SQL", category: "Data Analytics", level: 89 },
  { id: "da-2", name: "Pandas & NumPy & Scikit-Learn", category: "Data Analytics", level: 92 },

  // Power BI
  { id: "pbi-1", name: "Power BI Dashboards", category: "Power BI", level: 94 },
  { id: "pbi-2", name: "ETL & DAX Expressions", category: "Power BI", level: 88 },

  // Firebase
  { id: "fb-1", name: "Firebase Firestore Database", category: "Firebase", level: 95 },
  { id: "fb-2", name: "Firebase Authentication & Auth", category: "Firebase", level: 94 },
  { id: "fb-3", name: "Cloud Functions & Storage", category: "Firebase", level: 90 },

  // UI/UX
  { id: "ui-1", name: "Figma UI/UX Prototyping", category: "UI/UX", level: 90 },
  { id: "ui-2", name: "Digital Product Design", category: "UI/UX", level: 88 },

  // Leadership
  { id: "ld-1", name: "Digital Transformation Strategy", category: "Leadership", level: 92 },
  { id: "ld-2", name: "Innovation Management", category: "Leadership", level: 94 },
  { id: "ld-3", name: "Technical Project Leadership", category: "Leadership", level: 91 },
];
