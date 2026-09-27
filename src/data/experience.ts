import type { ExperienceItem } from "@/types";

/**
 * Work experience & engineering projects — most relevant first.
 * Aucun lien externe ici : les démos passent par `video` (bouton « LIVE DEMO »).
 */
export const experiences: ExperienceItem[] = [
  {
    id: "youros-medsecretariat",
    period: "2025 – 2026",
    role: "Stage d'été",
    company: "YouR OS",
    summary: "MedSecretariat — Plateforme Intelligente de Gestion du Secrétariat Médical.",
    description:
      "Conception et développement d'une plateforme intelligente destinée à moderniser la gestion d'un secrétariat médical.",
    tech: ["React.js", "FastAPI", "PostgreSQL", "Redis", "MinIO", "n8n", "Docker"],
    responsibilities: [
      "Développement du frontend avec React.js",
      "Développement du backend avec FastAPI",
      "Gestion des utilisateurs et des rôles",
      "Gestion des dossiers et documents médicaux",
      "Gestion des rendez-vous et du calendrier",
      "Développement des notifications",
      "Automatisation des processus avec n8n",
      "Mise en place de workflows pour les rappels de rendez-vous et les dettes",
      "Tests d'intégration",
      "Documentation et démonstration du projet",
    ],
  },
  {
    id: "indoor-tracker",
    period: "07/2025 – 08/2025",
    role: "Indoor Tracker",
    company: "C&I Training",
    location: "Sousse, Tunisia",
    summary: "Solution IoT de localisation indoor en temps réel pour le suivi des chariots.",
    description:
      "Conception et développement d'une solution IoT de localisation indoor en temps réel pour le suivi des chariots.",
    tech: ["ESP32", "BLE / iBeacon", "MQTT", "React.js", "Node.js", "MySQL"],
    responsibilities: [
      "Communication BLE",
      "Estimation de distance à partir du RSSI",
      "Développement backend",
      "Développement dashboard web",
      "Gestion des utilisateurs",
      "Visualisation des positions en temps réel",
    ],
  },
  {
    id: "aviculture-iot",
    period: "02/2024 – 06/2024",
    role: "Projet de fin d'étude",
    company: "Système IoT de surveillance avicole",
    location: "Sousse, Tunisia",
    summary: "Solution IoT de surveillance des conditions d'un élevage avicole.",
    description:
      "Développement d'une solution IoT permettant de surveiller les conditions d'un élevage avicole.",
    tech: ["ESP32", "Arduino", "IoT", "Sensors", "Web Development"],
    features: [
      "Température",
      "Humidité",
      "Détection de gaz",
      "Monitoring en temps réel",
      "Interface web responsive",
    ],
    /** Démo vidéo du projet (fichier `public/Media1.mp4`). */
    video: "/Media1.mp4",
  },
  {
    id: "ridex",
    period: "08/2023",
    role: "Ridex",
    company: "LAB-IT",
    location: "Sousse, Tunisia",
    summary: "Site web de location de voitures avec réservation en ligne.",
    description: "Développement d'un site web de location de voitures avec réservation en ligne.",
    tech: ["Web Development", "Reservation", "Online Payment"],
    features: [
      "Gestion des véhicules",
      "Gestion des disponibilités",
      "Gestion des tarifs",
      "Réservation",
      "Paiement",
    ],
  },
];
