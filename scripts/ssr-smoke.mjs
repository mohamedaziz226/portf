/**
 * Quick render smoke test (no browser needed).
 * Renders the whole application server-side through Vite's SSR pipeline to make
 * sure every component mounts without throwing, then checks key content.
 *
 * Usage: node scripts/ssr-smoke.mjs
 */
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const EXPECTED = [
  "Mohamed Aziz Zairi",
  "About Me",
  "who-am-i",
  "aziz@enetcom",
  "/profile.png",
  'alt="Portrait of Mohamed Aziz Zairi"',
  "Experience",
  "Featured Projects",
  "Toolkit & Skills",
  "Professional Skillset",
  "Education",
  "Hands On React JS From Beginner to Expert",
  "Certifications",
  "Let's Work Together",
  "Send Message",
  'name="_gotcha"',
  "Download CV",
  "/CV.pdf",
  "Open to Internship & AI Opportunities",
  "Sfax, Tunisia",
  "+216 29 864 722",
  "tel:+21629864722",
  "C&I Training",
  "07/2025 – 08/2025",
  "Kairouan, Tunisia",
  "Sousse, Tunisia",
  "ENET",
  ">AI & Machine Learning</h3>",
];

/** Removed on purpose — must not reappear in the rendered HTML. */
const REMOVED = [
  "Building with ambition.",
  "Portfolio RAG Chatbot",
  "Scroll to about section",
  "Add or reorder technologies",
  "Built with React, TypeScript",
  "Open to internships and AI",
  "The form opens your mail client",
  "Your mail client should open with the message prefilled.",
  "This form is not available right now",
  "VITE_CONTACT_ENDPOINT",
  ">AI Agents</span>",
];

/**
 * Removed from the "Toolkit & Skills" grid on purpose (they remain valid inside
 * a project/experience tech stack), so this check is scoped to the #skills section.
 */
const SKILLS_REMOVED = [">AI Agents</span>", ">BLE</span>", ">Redis</span>"];

/** Navbar links that must still be rendered in the header. */
const NAV_EXPECTED = ['href="#about"', 'href="#contact"'];

/** Removed from the navbar on purpose — the sections themselves are still there. */
const NAV_REMOVED = [">Home</a>", ">Education</a>"];

/** Hero right column: a plain static portrait, instead of the animated node graph. */
const HERO_EXPECTED = ['src="/profile.png"', "aspect-[4/5]", "object-position:center 20%"];

/** Animated "AI Core" node graph removed on purpose — must not come back. */
const HERO_REMOVED = ["AI Core", "node-float", "animate-dash-flow"];

/**
 * Experience section: the "Projet de fin d'étude" card provides a "LIVE DEMO" button
 * that triggers the interactive VideoModal for the project demo video.
 * Autoplay must never be present.
 */
const EXPERIENCE_EXPECTED = ["LIVE DEMO"];

/** A demo video must never start on its own. */
const EXPERIENCE_VIDEO_REMOVED = ["autoplay"];

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

let failed = false;

try {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const html = renderToString(createElement(App));
  // React escapes apostrophes and ampersands in markup — decode before asserting.
  const text = html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  console.log(`✓ App rendered — ${html.length} characters of HTML`);

  EXPECTED.forEach((needle) => {
    const found = text.includes(needle);
    if (!found) failed = true;
    console.log(`${found ? "✓" : "✗ MISSING"} ${needle}`);
  });

  REMOVED.forEach((needle) => {
    const found = text.includes(needle);
    if (found) failed = true;
    console.log(`${found ? "✗ STILL PRESENT" : "✓ removed"} ${needle}`);
  });

  const skillsHtml = text.slice(text.indexOf('id="skills"'), text.indexOf('id="education"'));
  SKILLS_REMOVED.forEach((needle) => {
    const found = skillsHtml.includes(needle);
    if (found) failed = true;
    console.log(`${found ? "✗ STILL PRESENT" : "✓ removed"} #skills ${needle}`);
  });

  const sections = ["home", "about", "experience", "projects", "skills", "education", "achievements", "contact"];
  sections.forEach((id) => {
    const found = text.includes(`id="${id}"`);
    if (!found) failed = true;
    console.log(`${found ? "✓" : "✗ MISSING"} section#${id}`);
  });

  const headerHtml = text.slice(text.indexOf("<header"), text.indexOf("</header>"));
  NAV_EXPECTED.forEach((needle) => {
    const found = headerHtml.includes(needle);
    if (!found) failed = true;
    console.log(`${found ? "✓" : "✗ MISSING"} navbar ${needle}`);
  });
  NAV_REMOVED.forEach((needle) => {
    const found = headerHtml.includes(needle);
    if (found) failed = true;
    console.log(`${found ? "✗ STILL PRESENT" : "✓ removed"} navbar ${needle}`);
  });

  const heroHtml = text.slice(text.indexOf('id="home"'), text.indexOf('id="about"'));
  HERO_EXPECTED.forEach((needle) => {
    const found = heroHtml.includes(needle);
    if (!found) failed = true;
    console.log(`${found ? "✓" : "✗ MISSING"} hero ${needle}`);
  });
  HERO_REMOVED.forEach((needle) => {
    const found = heroHtml.includes(needle);
    if (found) failed = true;
    console.log(`${found ? "✗ STILL PRESENT" : "✓ removed"} hero ${needle}`);
  });

  const experienceHtml = text.slice(text.indexOf('id="experience"'), text.indexOf('id="projects"'));
  EXPERIENCE_EXPECTED.forEach((needle) => {
    const found = experienceHtml.includes(needle);
    if (!found) failed = true;
    console.log(`${found ? "✓" : "✗ MISSING"} experience ${needle}`);
  });
  EXPERIENCE_VIDEO_REMOVED.forEach((needle) => {
    const found = experienceHtml.includes(needle);
    if (found) failed = true;
    console.log(`${found ? "✗ STILL PRESENT" : "✓ removed"} experience demo video ${needle}`);
  });
} catch (error) {
  failed = true;
  console.error("✗ SSR render failed:");
  console.error(error);
} finally {
  await vite.close();
}

console.log(failed ? "\nSMOKE TEST: FAILED" : "\nSMOKE TEST: PASSED");
process.exitCode = failed ? 1 : 0;
