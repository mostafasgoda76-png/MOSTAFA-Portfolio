export interface Project {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  image: string;
  liveLink: string;
  kpis?: string[];
  createdAt?: any;
}

export interface FileItem {
  id?: string;
  name: string;
  url: string;
  type: string;
  size?: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
}

export const fallbackProfile: Profile = {
  name: "Mostafa Amien",
  role: "AI Solutions Engineer & Flutter Developer",
  bio: "Bridging the gap between complex Deep Learning architectures and tangible business operations. Specialized in predictive transit modeling, computer vision pipelines (YOLOv8/TensorRT), and high-performance cross-platform Flutter systems that translate innovation into operational ROI.",
  avatar: "/avatar.png",
};

export const fallbackProjects: Project[] = [
  {
    id: "proj-1",
    title: "RTA Smart Crowd Management AI Platform",
    subtitle: "Real-time commuter density analytics and station flow optimization",
    description: "Enterprise computer vision platform designed for Dubai Metro stations to monitor, analyze, and forecast passenger crowd levels, optimizing train scheduling and passenger safety.",
    tags: ["Computer Vision", "YOLOv8", "TensorRT", "Next.js", "Power BI"],
    image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
    liveLink: "https://crowd-analytics.rta.ae/demo",
    kpis: [
      "Congestion Reduction: 22%",
      "Inference Latency: 42ms",
      "Alert Accuracy: 98.4%",
      "Station Clearance Rate: +15%"
    ],
    createdAt: new Date("2026-04-15T08:00:00.000Z"),
  },
  {
    id: "proj-2",
    title: "Autonomous Fleet Dispatcher",
    subtitle: "AI-driven demand prediction and routing optimizer",
    description: "Machine learning fleet manager designed to allocate autonomous transit shuttles dynamically based on passenger density patterns and smart scheduling constraints.",
    tags: ["Flutter", "TensorFlow", "FastAPI", "Three.js", "Python"],
    image: "https://images.unsplash.com/photo-1557425955-df376b5903c8?auto=format&fit=crop&w=800&q=80",
    liveLink: "https://fleet-dispatcher.dubai.ae",
    kpis: [
      "Wait Time Reduction: 18%",
      "Fleet Energy Savings: 14%",
      "Ride Demand Accuracy: 92.5%",
      "App Store Rating: 4.8/5"
    ],
    createdAt: new Date("2025-09-10T10:30:00.000Z"),
  },
  {
    id: "proj-3",
    title: "Flutter Dubai Tour Guide AI",
    subtitle: "Immersive tourist mobile app powered by Generative AI",
    description: "A premium Flutter application featuring a conversational LLM assistant and interactive AR maps to generate personalized itineraries for visitors in Dubai.",
    tags: ["Flutter", "Gemini API", "ARCore/ARKit", "Node.js"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    liveLink: "#",
    kpis: [
      "User Retention Rate: 68%",
      "Itinerary Gen Time: <2s",
      "API Reliability: 99.9%"
    ],
    createdAt: new Date("2025-01-20T14:45:00.000Z"),
  },
];

export const fallbackFiles: FileItem[] = [
  {
    id: "file-1",
    name: "RTA_Smart_Crowd_Pitch_Deck.pptx",
    url: "#",
    type: "pptx",
    size: "12.4 MB",
  },
  {
    id: "file-2",
    name: "AI_Crowd_Management_Technical_Specification.pdf",
    url: "#",
    type: "pdf",
    size: "4.8 MB",
  },
  {
    id: "file-3",
    name: "Autonomous_Fleet_Dispatcher_Proposal.pptx",
    url: "#",
    type: "pptx",
    size: "8.2 MB",
  },
  {
    id: "file-4",
    name: "Mostafa_Amien_Executive_CV.pdf",
    url: "#",
    type: "pdf",
    size: "1.8 MB",
  },
];
