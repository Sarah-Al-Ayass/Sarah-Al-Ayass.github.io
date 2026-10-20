# How to update your portfolio

All your text lives in **one file: `content.js`**. You never need to touch `index.html`, which holds the design.

## What's in the folder

| File / folder | What it is | Do you edit it? |
|---|---|---|
| `content.js` | All the text: profile, facts, projects, experience, skills, contact (EN + FR) | **Yes, this is the one** |
| `index.html` | The design and layout | No |
| `assets/projects/` | Project screenshots (card covers and pop-up gallery) | Add or replace images |
| `cv/` | Your two CVs: `Sarah_Al_Ayass_CV_EN.pdf` and `Sarah_Al_Ayass_CV_FR.pdf` | Replace when your CV changes |
| `mockups/` | The interactive demos behind "Try the interactive demo" (`demo-kit.js` holds the shared guide, pop-ups and tooltips; each demo has its own `*-demo.js`) | Only to add a new demo |
| `reports/` | (create it only if needed) Optional report PDFs for the "Read the report" button | Optional |

## The 3 rules when editing `content.js`

1. Keep the **quotes**: `"like this"`. If your text needs a quote mark, use curly ones (“ ” or « »), never a plain `"`.
2. Keep the **comma** at the end of each line and after each `}` block.
3. Every text has an `en:` and an `fr:` version, so change both.

If you break something, the page shows a **red message** at the bottom. Undo your last change, or look for a missing quote or comma near it.

To edit `content.js` on your computer, use any plain-text editor: TextEdit on Mac (Format → Make Plain Text), Notepad on Windows, or VS Code (free, and it colours mistakes). Don't use Word.

---

## Common changes

### Change a sentence
Open `content.js`, use Find (Cmd/Ctrl + F) to locate the sentence, change it in both `en` and `fr`, then save.

### Change the 4 boxes under your name
Section **2. KEY FACTS**. Each box has a `big` value (like `"RAG"` or `"0.89"`) and a `text`.

### Add a new project
1. In section **3. PROJECTS**, copy this template and paste it where you want the card to appear. Projects show in the order they're listed.

```js
  {
    id: "my-project",                       // short name, no spaces
    label: { en: "Aivancity × Company", fr: "Aivancity × Entreprise" },
    icon: "brain",                          // shown if there's no image yet
    images: ["assets/projects/my-project-1.png"],
    tools: ["Python", "Pandas"],
    links: { screen: "", report: "", code: "" },
    en: {
      title:   "Project title",
      date:    "School project · Jan – Mar 2027",
      team:    "",                          // e.g. "Team of 4" (leave "" if solo)
      summary: "One or two sentences shown on the card.",
      context: "Why the project existed.",
      did: [
        "First thing you did.",
        "Second thing you did.",
      ],
      result:  "What came out of it.",
    },
    fr: {
      title:   "Titre du projet",
      date:    "Projet école · janv. – mars 2027",
      team:    "",
      summary: "Une ou deux phrases affichées sur la carte.",
      context: "Pourquoi le projet existait.",
      did: [
        "Première chose réalisée.",
        "Deuxième chose réalisée.",
      ],
      result:  "Le résultat.",
    },
  },
```

2. Put its screenshot in `assets/projects/` with the exact name you wrote in `images`.
3. Available icons: `screen, music, bus, shield, art, chart, ball, brain, code`.

### Add or change a project image
- Put the image in `assets/projects/`. Wide screenshots work best (about 1440 × 900 px, PNG or JPG).
- List it in that project's `images: [...]`. The **first** image is the card cover, and the others appear as a gallery in the pop-up.
- Names are case-sensitive on the web: `Touch-1.PNG` is not `touch-1.png`.

### Add a report PDF or a GitHub link to a project
In that project's `links`:
```js
links: { screen: "mockups/transfers.html", report: "reports/transfer-analysis.pdf", code: "https://github.com/you/repo" },
```
If a demo is only animated (nothing to click), add `demo: "animated",` to that project so its button says "Watch the animated demo".
```js
```
Leave a value as `""` to hide its button. Only publish a report if your teammates (and the client company) agree.

### Remove a project
Delete its whole block, from `{` before `id:` to the matching `},`.

### Add an experience
Section **4. EXPERIENCE**: copy one `{ when: ..., title: ..., place: ..., points: [...] },` block and paste it in date order, newest first.

### Update your CV
Replace the files in `cv/`, keeping the **same names**: `Sarah_Al_Ayass_CV_EN.pdf` and `Sarah_Al_Ayass_CV_FR.pdf`.

### Add your GitHub profile
In **1. PROFILE**, paste your link in `github: ""`. A GitHub button appears automatically.

---

## Check before publishing
Double-click `index.html` to preview it in your browser, and switch between EN and FR. Open a few projects.

## Publish an update (once the site is on GitHub)

**Text changes: edit directly on GitHub, no upload needed**
1. Go to your repository on github.com and click `content.js`.
2. Click the pencil icon (Edit), make your change and click **Commit changes**.
3. Wait 1–2 minutes, then reload your site. If you don't see the change, force-reload with Cmd + Shift + R (Mac) or Ctrl + F5 (Windows).

**New images, CV or reports**
1. In the repository, open the folder (for example `assets/projects`).
2. Click **Add file → Upload files**, drag your files in and click **Commit changes**.
   A file with the same name replaces the old one.

## First-time setup (GitHub Pages)
1. Create a free account on github.com.
2. Create a new **public** repository named exactly `yourusername.github.io`.
3. Click "uploading an existing file" and drag in **everything inside this folder** (not the folder itself), then commit.
4. Go to **Settings → Pages → Deploy from a branch → main → / (root) → Save**.
5. Your site is live at `https://yourusername.github.io` within a couple of minutes.

## Getting help
Send Claude your `content.js` (and any new report or screenshot) with what you want to change, and you'll get an updated `content.js` back. Upload it to GitHub to replace the old one.
