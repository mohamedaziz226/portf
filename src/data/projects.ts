import type { Project, ProjectCategory } from "@/types";

/** Filters displayed above the project grid. */
export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI / ML" },
  { id: "web", label: "Web" },
  { id: "iot", label: "IoT" },
];

/**
 * Featured projects.
 * - `github` : n'est renseigné que pour les projets ayant un dépôt public réel (bouton affiché).
 * - `video`  : le bouton doré « LIVE DEMO » n'apparaît que si l'entrée possède une vidéo.
 */
export const projects: Project[] = [
  {
    id: "alzheimer-3d-cnn",
    title: "Early Alzheimer's Detection using 3D CNN",
    subtitle: "Medical imaging · Deep Learning pipeline",
    description:
      "Développement d'un pipeline d'intelligence artificielle pour la détection précoce de la maladie d'Alzheimer à partir d'images IRM.",
    features: [
      "Segmentation des régions d'intérêt du lobe temporal",
      "FastSurfer",
      "MRI / NIfTI",
      "3D CNN",
      "Classification AD/CN",
      "Classification PMCI/SMCI",
    ],
    tech: ["Python", "TensorFlow", "Keras", "FastSurfer", "Docker", "Computer Vision", "Deep Learning"],
    categories: ["ai"],
    accent: "violet",
    icon: "brain",
    featured: true,
  },
  {
    id: "smartstudent-ai",
    title: "SmartStudent AI",
    subtitle: "LLM · RAG assistant for students",
    description:
      "Application web intelligente destinée à aider les étudiants dans la planification des études, la gestion du budget et la réduction du stress académique.",
    features: [
      "Assistant IA",
      "RAG",
      "Chatbot",
      "Gestion du budget",
      "Planification des études",
      "Support de plusieurs LLM",
    ],
    tech: ["React", "FastAPI", "RAG", "LLM", "OpenAI", "Groq", "Gemini"],
    categories: ["ai", "web"],
    accent: "sky",
    icon: "graduationCap",
    github: "https://github.com/mohamedaziz226/AI-for-Daily-Life-Transformation-Challenge",
    featured: true,
  },
  {
    id: "4g-qos-coverage-prediction",
    title: "Prédiction de la QoS et de la couverture 4G par IA",
    subtitle: "Telecom networks · LSTM, XGBoost & RAG chatbot",
    description:
      "Solution d'intelligence artificielle au service des opérateurs télécoms : passer d'une gestion réactive à une gestion proactive des réseaux 4G, en prédisant la qualité de service (RSRP, SINR, débit, latence) et la couverture à partir de données réseau réelles.",
    features: [
      "Prédiction de la QoS et de la couverture réseau",
      "LSTM (TensorFlow/Keras) pour les séries temporelles",
      "XGBoost & Scikit-learn sur données tabulaires",
      "Analyse du handover et continuité de service",
      "Dashboard de visualisation et d'aide à la décision",
      "Chatbot RAG (LangChain + FAISS + LLM)",
    ],
    tech: [
      "Python",
      "TensorFlow",
      "LSTM",
      "XGBoost",
      "Scikit-learn",
      "LangChain",
      "FAISS",
      "FastAPI",
      "React",
    ],
    categories: ["ai", "web"],
    accent: "cyan",
    icon: "signal",
    /** Démo vidéo du projet (fichier `public/Media2.mp4`). */
    video: "/Media2.mp4",
    videoTitle: "Prédiction de la QoS et de la couverture 4G — Démo Vidéo",
    featured: true,
  },
  {
    id: "medsecretariat",
    title: "MedSecretariat",
    subtitle: "Intelligent medical secretariat platform",
    description:
      "Plateforme intelligente de gestion du secrétariat médical avec automatisation des processus.",
    tech: ["React", "FastAPI", "PostgreSQL", "Redis", "MinIO", "n8n", "Docker"],
    categories: ["web"],
    accent: "cyan",
    icon: "stethoscope",
    /** Démo vidéo du projet (fichier `public/Media3.mp4`, renommé depuis « demo vf.mp4 »). */
    video: "/Media3.mp4",
    videoTitle: "MedSecretariat — Démo Vidéo",
  },
  {
    id: "e-commerce-app",
    title: "E-Commerce Web Application",
    subtitle: "Full-stack storefront · React, TypeScript, Express & MongoDB",
    description:
      "Application e-commerce full-stack en TypeScript : vitrine produit, panier, commandes et back-office administrateur, adossés à une API REST Express et une base MongoDB.",
    features: [
      "Catalogue produits avec catégories, produits mis en avant et promotions hebdomadaires",
      "Panier, suivi des commandes et liste d'envies",
      "Espace client : inscription/connexion, profil et service client",
      "Back-office administrateur pour la gestion du catalogue",
      "API REST Express + MongoDB (Mongoose), mots de passe hachés (bcrypt)",
      "Recherche d'adresses et géolocalisation via Google Maps",
    ],
    tech: ["TypeScript", "React", "Vite", "Tailwind CSS", "React Router", "Express", "MongoDB", "Node.js"],
    categories: ["web"],
    accent: "emerald",
    icon: "shoppingCart",
    github: "https://github.com/mohamedaziz226/e-commerce-app",
  },
  {
    id: "indoor-tracker",
    title: "Indoor Tracker",
    subtitle: "Real-time indoor localization (IoT)",
    description:
      "Solution IoT de localisation indoor en temps réel basée sur ESP32, BLE/iBeacon et MQTT.",
    tech: ["ESP32", "BLE", "MQTT", "React", "Node.js", "MySQL"],
    categories: ["iot", "web"],
    accent: "indigo",
    icon: "radioTower",
    github: "https://github.com/mohamedaziz226/Tracking-indoor",
  },
];
