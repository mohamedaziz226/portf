import type { ChatMessage } from "@/types";

export type ChatMode = "local" | "rag";

export const chatAssistant = {
  name: "Aziz AI",
  tagline: "Ask me about Mohamed Aziz Zairi",
  availabilityNote: "Online · answers from the portfolio",
  suggestedQuestions: [
    "Who is Mohamed Aziz Zairi?",
    "What are his AI skills?",
    "Tell me about his projects",
    "How can I contact him?",
  ],
  fallbackMessage:
    "I don't have that information in the portfolio. Try asking about his projects, skills, education, experience, certifications or contact.",
  ragFallbackMessage:
    "I couldn't find anything relevant in the portfolio for that question. Try asking about his projects, AI skills, education, experience or contact.",
  rateLimitMessage:
    "You're sending messages a bit too fast — please wait a few seconds and try again.",
} as const;

export const chatGreeting: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm Aziz AI — ask me anything about Mohamed Aziz Zairi: his projects, AI skills, experience, education, certifications or how to contact him.",
};
