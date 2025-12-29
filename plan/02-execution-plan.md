Here is the step-by-step execution plan to build your minimalist, high-performance personal site using **Astro**.

### The Architecture: "The Digital Garden"

* **Framework:** Astro (Static Site Generation mode).
* **Styling:** Tailwind CSS (configured for typography).
* **Content Source:** Local Markdown (`.md`) & MDX (`.mdx`) files.
* **Database:** None (File-system based for now).

---

### Phase 1: The Foundation (Day 1)

**Goal:** Get a running site with the correct folder structure.

1. **Initialize Project:**
* Run `npm create astro@latest -- --template portfolio`.
* Select **TypeScript** (Strict) and **Install Dependencies**.


2. **Clean Up:**
* Delete the default "Work" and "About" placeholder pages provided by the template. We will rebuild them cleanly.


3. **Install Essential Integrations:**
* `npx astro add tailwind` (Styling).
* `npx astro add sitemap` (SEO).
* `npx astro add mdx` (For complex interactive notes).



### Phase 2: The Content Engine (Day 2)

**Goal:** strict type-safety for your Blog and Notes.

1. **Define Collections (`src/content/config.ts`):**
* Create two schemas: `blog` (strict title, date, draft status) and `notes` (looser schema, allows "fleeting" thoughts).


2. **Create Content Folders:**
* `src/content/blog/`: For polished articles.
* `src/content/notes/`: For TIL (Today I Learned) and code snippets.


3. **Build the Parser:**
* Astro handles this automatically. You just need to test it by creating one dummy file in each folder.



### Phase 3: The Minimalist UI (Day 3)

**Goal:** Implement the "Single-Column" layout.

1. **Typography Setup:**
* Configure `tailwind.config.mjs` to add the `@tailwindcss/typography` plugin.
* Set the base font stack to system fonts (San Francisco/Segoe UI).


2. **Global Layout (`src/layouts/Layout.astro`):**
* Create the centered container (`max-w-2xl mx-auto`).
* Add the simple "Nav" header and the copyright footer.


3. **The Index Page:**
* Design the "Hero" text (Hello, I am Jun Han...).
* Create a "Recent Posts" component that fetches the latest 3 items from the `blog` collection.



### Phase 4: Deployment (Day 4)

**Goal:** Live on the internet.

1. **Dockerize (Optional):**
* Create a `Dockerfile` that builds the static assets to `/dist` and serves them with a tiny Nginx image (5MB).


2. **CI/CD:**
* Push to GitHub. Connect to Netlify/Vercel (easiest) OR set up a GitHub Action to build the image and push to your k3s cluster.
