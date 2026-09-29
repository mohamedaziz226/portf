# Mohamed Aziz Zairi — Portfolio

Portfolio personnel de **Mohamed Aziz Zairi**, étudiant en 3ème année Génie Télécommunications à
**ENET'Com** (Sfax), spécialisé en **Intelligence Artificielle**, **Machine Learning / Deep Learning**,
**Computer Vision**, **LLM / RAG**, **IoT** et **développement Full-Stack**.

Thème sombre premium, glassmorphism léger, animations Framer Motion sobres, 100 % responsive.

---

## Stack

| Outil          | Rôle                                   |
| -------------- | -------------------------------------- |
| React 18       | UI                                     |
| TypeScript     | Typage strict (`strict: true`)         |
| Vite 5         | Build & dev server                     |
| Tailwind CSS 3 | Design system (dark theme, glass)      |
| Framer Motion  | Animations (scroll reveal, filtres...) |
| Lucide React   | Icônes                                 |
| react-icons    | Logos officiels des technos (Simple Icons, VS Code icons) |

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build  → dist/
npm run preview    # prévisualiser le build
npm run ts:check   # vérification TypeScript seule
npm run smoke      # rendu SSR de l'app complète (valide que tout monte sans erreur)
npm run format     # Prettier
```

---

## Structure du projet

```
src/
├── App.tsx                    # Assemblage des sections
├── main.tsx
├── index.css                  # Tailwind + thème global + reduced-motion
├── components/
│   ├── layout/                # Navbar (sticky + menu mobile), Footer
│   ├── hero/                  # Hero, HeroPortrait (photo de profil statique, sans animation), ParticleField
│   ├── projects/              # ProjectCard + ProjectVisual (illustration générée)
│   ├── sections/              # About, Experience, Projects, Skills, Education, Achievements, Contact
│   └── ui/                    # Reveal, Section, Button/ActionLink/IconLink, Chip, StatCard, Timeline, TechIcon
├── data/                      # ⭐ TOUT LE CONTENU (voir ci-dessous)
├── hooks/                     # useTypewriter, useActiveSection, useCopyToClipboard, useScrolled, usePhotoSrc
├── lib/                       # cn(), gestion des placeholders de liens
└── types/                     # Types partagés du contenu
```

---

## Où modifier le contenu

| Fichier                    | Contenu                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `src/data/profile.ts`      | Nom, rôles animés, disponibilité, **email / téléphone / GitHub / LinkedIn / CV**, localisation, **portrait** (`photos`, `photoHint`, `photoPosition`) — affiché dans le Hero **et** dans la carte About |
| `src/data/about.ts`        | Intro « About Me » (segments surlignés), 4 axes de focus, sortie du terminal `who-am-i` |
| `src/data/experience.ts`   | Expériences (YouR OS, Indoor Tracker, IoT avicole, Ridex)     |
| `src/data/projects.ts`     | Projets + filtres (All / AI-ML / Web / IoT)                   |
| `src/data/skills.ts`       | Groupes « Toolkit & Skills » (langages, front/back, IA, BD, IoT, outils) |
| `src/data/education.ts`    | ENET'Com, ISITCom, Baccalauréat                              |
| `src/data/achievements.ts` | Certifications / compétitions réelles (5 badges vérifiables — images dans `public/certificates/`) |
| `src/data/navigation.ts`   | Liens de la navbar (les `id` doivent correspondre aux sections) |

Aucune donnée n'est inventée : statistiques, expériences, diplômes, dates et localisations sont
strictement reprises du CV fourni.

Les images des certificats (badges Cisco, certificats Udemy, attestation AI Night Challenge) sont
dans `public/certificates/` et référencées via le champ `image` de `src/data/achievements.ts`.
Chaque entrée peut aussi afficher un numéro de credential (copiable en un clic) et un lien officiel
de vérification.

Les **démos vidéo** sont déposées dans `public/` et référencées par le champ `video` des entrées
correspondantes de `src/data/projects.ts` (et de `src/data/experience.ts` pour le PFE) :

| Fichier | Projet | Champ |
| --- | --- | --- |
| `public/Media1.mp4` | Système IoT de surveillance avicole (PFE) | `video` de l'entrée `aviculture-iot` de `src/data/experience.ts` (timeline) |
| `public/Media2.mp4` | Prédiction de la QoS et de la couverture 4G par IA | `video` de `4g-qos-coverage-prediction` |
| `public/Media3.mp4` | MedSecretariat | `video` de `medsecretariat` |

Un bouton doré **« LIVE DEMO »** permet d'ouvrir la vidéo dans une modale interactive plein écran
(16:9, lecteur HTML5 avec `controls`, **jamais d'autoplay**, et `preload="metadata"`).
Le champ `videoTitle` (optionnel) personnalise le titre affiché dans la modale. Pour changer de
vidéo : remplacez le fichier et/ou mettez à jour `video`.

Les cartes projets n'affichent que les boutons correspondant à des données réelles :

- **« LIVE DEMO »** (doré) apparaît uniquement si l'entrée possède une vidéo (`video`) ;
- **« GitHub »** apparaît uniquement si l'entrée possède un dépôt public réel (`github`) — plus
  aucun placeholder `[PROJECT_GITHUB_URL]`, donc plus aucun bouton gris désactivé.

Aujourd'hui : `github` est renseigné pour `smartstudent-ai`, `e-commerce-app` et `indoor-tracker` ;
`video` pour `4g-qos-coverage-prediction` et `medsecretariat` (les deux autres n'ont volontairement
aucun bouton).

### Section « About Me »

La section est composée de deux cartes : à gauche le portrait, l'intro (faits clés surlignés) et
4 axes de focus ; à droite une fenêtre de terminal qui rejoue la sortie de la commande `who-am-i`
(les valeurs `name`, `location` et `availability` sont tirées de `src/data/profile.ts`, donc jamais
dupliquées).

- **Portrait** : déposez votre photo dans `public/` sous l'un des noms acceptés — `profile.png`,
  `profile.jpg`, `profile.webp` ou `profile.jpeg` (essayés dans cet ordre, définis par `profile.photos`).
  Placez en premier l'extension que vous utilisez réellement : les entrées du haut sont demandées en
  premier, un fichier absent ne coûte donc qu'un 404 inutile à chaque chargement. Tant qu'aucun de ces
  fichiers n'existe, la carte affiche vos initiales (`profile.initials`) au lieu d'une image cassée.
- **Emplacement / cadrage** : `profile.photoPosition` (CSS `object-position`, par défaut `"center 20%"`)
  place la photo dans le cadre 3:4 de la carte **et** dans le cadre 4:5 du Hero —
  augmentez la valeur si le visage est rogné en haut, baissez-la s'il est rogné en bas.
- **Texte, axes de focus et terminal** : `src/data/about.ts`.

### Portrait du Hero

Le Hero (`src/components/hero/HeroPortrait.tsx`) affiche la **même photo**, en **statique** (aucune
animation) : `usePhotoSrc(profile.photos)` (dans `src/hooks/`) essaie les extensions dans l'ordre et
retombe sur vos initiales (`profile.initials`) si aucun fichier n'existe. L'image est chargée
au-dessus de la ligne de flottaison (`loading="eager"`) : privilégiez un portrait bien cadré au centre
et un fichier léger (une photo de plusieurs Mo ralentit le premier affichage).

---

## ⚠️ Placeholders à remplacer

Tant qu'une valeur garde le format `[...]`, le bouton correspondant s'affiche **désactivé** avec une
infobulle explicative (aucun lien cassé). Remplacez-les puis le lien devient actif automatiquement.

| Placeholder            | Où                                                            |
| ---------------------- | ------------------------------------------------------------- |
| `[SITE_URL]`           | `index.html` (canonical, Open Graph)                            |

Détection des placeholders : `src/lib/links.ts` (`isPlaceholder`, `linkProps`).

✅ Déjà renseignés dans `src/data/profile.ts` : `contact.email` (`azizzeiri7@mail.com`),
`contact.phone` (`+216 29 864 722`), `contact.github`, `contact.linkedin` et `cvUrl` (`/CV.pdf`, le PDF
est déposé dans `public/`) — les boutons *Download CV* (Navbar + Hero), GitHub / LinkedIn / Email /
Téléphone sont donc actifs (Navbar, Hero, Footer, section Contact) et le formulaire envoie réellement
les messages via `/api/contact` (voir « Formulaire de contact »).

### SEO / Open Graph

- `index.html` : `<title>`, meta description, Open Graph, Twitter Card, `<link rel="canonical">`
  et données structurées **Person** (schema.org).
- Ajoutez `public/og-image.png` (1200×630) puis décommentez les balises `og:image`.

### Formulaire de contact

Le formulaire envoie un `POST` JSON à `VITE_CONTACT_ENDPOINT` — par défaut `/api/contact`, la fonction
serverless fournie (`api/contact.ts`) qui relaie le message dans votre boîte mail via
[Resend](https://resend.com). Aucun secret dans le frontend : `RESEND_API_KEY` et `CONTACT_EMAIL`
sont lus **uniquement côté serveur**.

1. `cp .env.example .env` puis renseignez `RESEND_API_KEY` (https://resend.com/api-keys) et
   `CONTACT_EMAIL`. `CONTACT_FROM_EMAIL` est optionnel (expéditeur vérifié — sans domaine vérifié,
   Resend n'autorise l'envoi que vers l'adresse propriétaire du compte).
2. `npm run dev` → le plugin `scripts/vite-plugin-contact-api.ts` monte le même handler sur
   `/api/contact` : le formulaire fonctionne en local sans second serveur. Idem avec `npm run preview`.
3. Tests : `npm run test:api` (Resend simulé) — validation, succès, erreurs, honeypot, rate limiting.

Côté serveur : validation + longueurs maximales, honeypot anti-spam, 5 envois / 10 min / IP,
codes HTTP explicites (400 · 405 · 413 · 415 · 429 · 500 · 502), `Reply-To` = email du visiteur et
horodatage inclus dans l'email. Sur un hébergeur 100 % statique (GitHub Pages…), pointez
`VITE_CONTACT_ENDPOINT` vers un service externe (Formspree…).

#### Déploiement sur Vercel (les 2 étapes obligatoires)

Le fichier `.env` est **git-ignoré** : il n'est jamais poussé sur GitHub, donc Vercel ne reçoit
**aucune** variable d'environnement et le formulaire répond `500 server_misconfigured`
 (« Unable to send your message ») même si tout fonctionne en local.

1. **Renseigner les variables dans Vercel** (indispensable) :
   `vercel.com` → votre projet → **Settings → Environment Variables** → ajoutez :
   - `RESEND_API_KEY` = votre clé (https://resend.com/api-keys)
   - `CONTACT_EMAIL` = la boîte qui reçoit les messages
   - `CONTACT_FROM_EMAIL` *(optionnel)* = `Portfolio <contact@votre-domaine.com>`

   Cochez **Production**, **Preview** et **Development**, puis **redéployez** (les variables ne
   s'appliquent qu'aux déploiement suivants). Ne mettez **jamais** de `VITE_` devant ces noms :
   elles resteraient visibles dans le bundle.

2. **Vérifier le déploiement** : ouvrez `https://<votre-domaine>/api/health`.
   - `200` + `"configured": true` → la configuration est bonne, le formulaire fonctionne.
   - `503` + la liste des variables manquantes → ajoutez-les puis redéployez.
   - `404` → la fonction n'est pas déployée : vérifiez que le dossier `api/` est bien à la racine
     du dépôt et que le projet est configuré sur le preset **Vite**.

Si `/api/health` renvoie `200` mais que l'envoi échoue encore, ouvrez **Vercel → Logs** et
cherchez `[contact] Resend responded …` : le code HTTP de Resend y est indiqué (401 = clé
invalide, 403 = `onboarding@resend.dev` utilisé vers une adresse qui n'est pas celle du compte →
vérifiez un domaine sur https://resend.com/domains puis renseignez `CONTACT_FROM_EMAIL`).

`vercel.json` (racine) fixe le runtime Node des fonctions, le dossier de sortie `dist` et une
réécriture SPA qui **exclut `/api/`** — sans elle, la route peut être renvoyée vers `index.html`
et produire un 404 au lieu de la réponse JSON.


---

## Fonctionnalités

- **Navbar** sticky glassy, logo `AZ`, scroll-spy (`aria-current`), boutons *Download CV* / GitHub /
  LinkedIn, menu hamburger animé (fermeture avec `Échap`, scroll verrouillé).
- **Hero** : titre tapé en boucle (*typewriter*), badge *Open to Internship & AI Opportunities*,
  fond de particules canvas (léger, en pause quand l'onglet est inactif) et **portrait statique**
  (`src/components/hero/HeroPortrait.tsx`, aucune animation).
- **Projets** : filtres animés (All / AI-ML / Web / IoT) avec compteurs, cartes glass premium,
  illustrations générées (pas de fausses captures d'écran) et **aucun bouton GitHub** — seul le bouton
  doré *LIVE DEMO* est rendu, et uniquement pour les projets qui fournissent un champ `video`.
- **Skills** : section « Toolkit & Skills » — un groupe par domaine, chaque techno affichée comme une
  carte logo **officiel** (Simple Icons via `react-icons`, teinté de sa couleur de marque) avec son
  nom dessous. **Aucun pourcentage de maîtrise inventé**. Icônes : `src/components/ui/TechIcon.tsx`,
  contenu : `src/data/skills.ts`.
- **Experience / Education** : timeline avec barre de progression liée au scroll ; la carte du
  **Projet de fin d'étude** embarque sa **démo vidéo** (`public/Media1.mp4`).
- **Certifications & Achievements** : cartes avec badge/certificat (`public/certificates/`), date/durée,
  **numéro de credential copiable en un clic** et bouton *View credential* (Udemy, Cisco/CCNA, AI Night
  Challenge) ; la structure « 4 catégories à remplir » reste affichée si la liste est vide.
- **Contact** : coordonnées, copie de l'email en un clic, formulaire validé côté client avec `aria-live`.
- **Accessibilité** : `prefers-reduced-motion` respecté (animations et typewriter neutralisés), focus
  visibles, rôles/labels ARIA, lien « Skip to content ».
- **Responsive** : Desktop / Laptop / Tablet / Mobile (navbar, hero, cartes projets, timeline, skills,
  formulaire).

---

## Déploiement

Le build est statique (`dist/`) : Netlify, Vercel, GitHub Pages, Cloudflare Pages…
Renseignez le domaine final dans `index.html` (canonical / OG) et, si besoin, un `sitemap.xml`.

---

## Licence

Contenu personnel — © 2026 Mohamed Aziz Zairi. All rights reserved.
