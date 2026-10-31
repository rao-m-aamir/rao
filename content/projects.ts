export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  stack: string[];
  accent: "mint" | "wood";
  problem: string;
  features: { title: string; description: string }[];
  notes: string[];
  flow: string[];
  collaborators?: string[];
  contribution?: string;
  lessons?: string[];
  sourceUrl?: string;
  demoUrl?: string;
  media?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  }[];
};
export const projects: Project[] = [
  {
    slug: "ustad-e-karigar",
    title: "Ustad-e-Karigar",
    category: "ANDROID · AI · EVERYDAY IMPACT",
    accent: "mint",
    sourceUrl: "https://github.com/M-Aamir-Rao/Ustad-e-Karigar",
    summary:
      "A digital ustad for the real world. Helping Pakistani repair workers and households diagnose, learn, and keep track of their work.",
    stack: ["Kotlin", "Jetpack Compose", "Gemini", "Room"],
    problem:
      "Repair knowledge should be easier to reach. Ustad-e-Karigar brings diagnosis, practical learning and repair history into an Android companion built around the needs of Pakistani repair workers and households.",
    features: [
      {
        title: "More than a text box",
        description:
          "Describe an appliance problem with text, voice or a photograph. Structured answers bring follow-up questions, tools, troubleshooting steps and warnings together.",
      },
      {
        title: "Useful beyond connectivity",
        description:
          "Lessons, repair records and history live on the device. A scripted Demo Mode keeps the experience usable without an API key; live AI answers require connectivity.",
      },
      {
        title: "Learn in your own language",
        description:
          "English, Roman Urdu and Urdu, including right-to-left layouts and Nastaliq typography. Seekho lessons use quizzes and a Shagird → Karigar → Ustad learning progression.",
      },
      {
        title: "A separate safety layer",
        description:
          "Rule-based checks merge and escalate warnings and guard low-confidence responses. Safety information has its own visual treatment.",
      },
    ],
    notes: [
      "A DiagnosticEngine coordinates memory, knowledge, AI responses and safety checks, keeping orchestration separate from the interface.",
      "Room stores sessions, repairs and learning progress; DataStore holds preferences. WorkManager retries pending repair synchronization.",
      "Ghar and Karigar modes have distinct mint and orange palettes. Jobs and apprenticeships use local listings, not a live marketplace.",
    ],
    flow: [
      "Text · voice · photo",
      "Memory + knowledge",
      "Gemini diagnosis",
      "Safety checks",
      "Saved session",
    ],
  },
  {
    slug: "meadow-and-wood",
    title: "Meadow & Wood",
    category: "WEB · DATABASES · CRAFT",
    accent: "wood",
    sourceUrl: "https://github.com/M-Aamir-Rao/MeadowAndWood",
    summary:
      "A quieter kind of storefront. Cottagecore furniture meets a practical sales and inventory management system.",
    stack: ["PHP", "MySQL", "JavaScript", "CSS"],
    problem:
      "A furniture collection needs more than a beautiful shop window. Meadow & Wood connects the public catalogue to the everyday work of managing products, recording sales and tracking stock.",
    features: [
      {
        title: "A living collection",
        description:
          "Product listings come from a MySQL database, with materials, dimensions, prices and available stock.",
      },
      {
        title: "Behind the storefront",
        description:
          "Administrators can create, view, update and delete inventory records and record sales with automatic stock updates.",
      },
      {
        title: "Different roles, different access",
        description:
          "Session-based authentication separates admin and customer permissions. The project includes registration and expiring password-reset tokens.",
      },
      {
        title: "Designed for slower living",
        description:
          "Forest green, warm taupe and cream create a cottagecore identity around furniture and craftsmanship.",
      },
    ],
    notes: [
      "The data model connects sales to users and products, keeping inventory and sales records related.",
      "The application uses PHP, MySQL and a responsive HTML/CSS/JavaScript frontend.",
      "Cart, payments, reset-email notifications and customer order history are listed as future enhancements.",
    ],
    flow: [
      "Product catalogue",
      "Admin inventory",
      "Recorded sale",
      "Updated stock",
    ],
    collaborators: [
      "Muhammad Aamir Saifi",
      "Fatima Asad",
      "Abdullah Khan Niazi",
    ],
  },
];
