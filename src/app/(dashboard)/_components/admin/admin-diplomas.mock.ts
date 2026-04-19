export const ADMIN_DIPLOMAS_PAGE_SIZE = 12;

export type AdminDiplomaMock = {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  createdAt: string;
};

const descriptions = [
  "Hands-on curriculum covering fundamentals through production patterns. Includes projects, code reviews, and career support.",
  "Industry-aligned syllabus with live sessions, assessments, and a capstone. Designed for developers leveling up fast.",
  "From zero to shipping: core concepts, tooling, testing, and deployment. Mentor feedback on every milestone.",
];

const categories = ["Immutability", "Web", "Data", "Mobile", "Cloud", "AI"];

function seedItems(): AdminDiplomaMock[] {
  const items: AdminDiplomaMock[] = [];
  const titles = [
    "AI & ML Development",
    "Back-End Web Development",
    "Flutter & Dart Mastery",
    "Data Analysis Fundamentals",
    "Cloud DevOps Essentials",
    "Cybersecurity Basics",
    "UI Engineering with React",
    "Node.js APIs at Scale",
    "PostgreSQL Deep Dive",
    "Kubernetes for Developers",
    "TypeScript Advanced Patterns",
    "GraphQL API Design",
    "Rust Systems Programming",
    "Go Microservices",
    "Python for Data Science",
    "Java Spring Boot",
    "C# & .NET Core",
    "Swift iOS Apps",
    "Kotlin Android",
    "Docker & Containers",
    "Terraform & IaC",
    "Elasticsearch & Search",
    "Redis Caching Strategies",
    "Kafka Event Streaming",
    "MongoDB Modeling",
  ];
  for (let i = 0; i < titles.length; i++) {
    items.push({
      id: `dip-${i + 1}`,
      title: titles[i] ?? `Diploma ${i + 1}`,
      description: descriptions[i % descriptions.length] ?? "",
      image: "",
      category: categories[i % categories.length] ?? "Web",
      createdAt: new Date(2024, (i % 12) + 1, (i % 27) + 1).toISOString(),
    });
  }
  return items;
}

/** Static mock list — replace with API later */
export const MOCK_ADMIN_DIPLOMAS: AdminDiplomaMock[] = seedItems();
