/**
 * Identity + contact information — SINGLE SOURCE OF TRUTH.
 *
 * ✅ Already configured: email, phone (+216), GitHub profile, LinkedIn profile
 *    and the CV PDF (public/CV.pdf).
 * As long as a value keeps the "[...]" format, every related button/link is
 * automatically rendered as "not configured" instead of producing a broken link.
 */
export const profile = {
  name: "Mohamed Aziz Zairi",
  initials: "AZ",
  /**
   * Portrait shown in the Hero (static image, no animation) AND in the "About" card.
   * Drop ONE of these files in `public/` — they are tried in this order, so the usual
   * extensions all work without touching the code:
   * `profile.png`, `profile.jpg`, `profile.webp`, `profile.jpeg`.
   * Put the extension you actually use FIRST: the entries at the top are requested
   * first, so a file that does not exist only costs a useless 404 on every load.
   * While none of them exists, both frames show `initials` instead of a broken image.
   */
  photos: ["/profile.png", "/profile.jpg", "/profile.webp", "/profile.jpeg"],
  /** Filenames advertised in the placeholder card while no portrait file exists. */
  photoHint: "public/profile.png (ou .jpg / .webp / .jpeg)",
  /** CSS `object-position` — crop inside both frames (Hero square + About 3:4). */
  photoPosition: "center 20%",
  role: "AI & Full-Stack Engineer",
  /** Rotating titles displayed with the typing animation in the Hero. */
  roles: [
    "AI & Full-Stack Engineer",
    "Machine Learning · Deep Learning",
    "LLM · RAG Engineer",
    "Computer Vision Engineer",
    "IoT & Telecommunications",
  ],
  hero: {
    greeting: "Hi, I'm Mohamed Aziz Zairi",
    subtitle:
      "Telecommunications Engineering Student passionate about Artificial Intelligence, Machine Learning, LLMs, Computer Vision, IoT and Full-Stack Development.",
    availability: "Open to Internship & AI Opportunities",
  },
  contact: {
    email: "azizzeiri7@mail.com",
    phone: "+216 29 864 722",
    github: "https://github.com/mohamedaziz226",
    linkedin: "https://www.linkedin.com/in/mohamed-aziz-zairi-3156b8278/",
    location: "Sousse, Tunisia",
  },
  /** Link to the PDF resume placed in `public/`. */
  cvUrl: "/CV.pdf",
} as const;

export type Profile = typeof profile;
