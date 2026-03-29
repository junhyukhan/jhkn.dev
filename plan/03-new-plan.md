### The Environment Variable Architecture (`.env`)

For the `@aws-sdk/client-s3` library to communicate with Cloudflare R2, these environment variables must be configured both locally (`.env`) and in the Cloudflare Workers & Pages project settings (Settings > Variables and Secrets) so the build pipeline can fetch content at build time:

```env
# Cloudflare R2 Base Config
ACCOUNT_ID="your_cloudflare_account_id"
REGION="auto"
ENDPOINT_URL="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

# Vault B: AI Research (Unencrypted)
AI_VAULT_BUCKET_NAME="your_ai_bucket_name"
AI_VAULT_ACCESS_KEY_ID="token_b_access_key"
AI_VAULT_SECRET_ACCESS_KEY="token_b_secret_key"

# Vault A: Personal Tinkering (Unencrypted for Web Build)
PERSONAL_VAULT_BUCKET_NAME="your_personal_bucket_name"
PERSONAL_VAULT_ACCESS_KEY_ID="token_a_access_key"
PERSONAL_VAULT_SECRET_ACCESS_KEY="token_a_secret_key"
```
*(Note on `REGION`: Cloudflare R2 is globally distributed, but the AWS SDK enforces a region parameter to instantiate the client. Setting it to `auto` fulfills the SDK requirement).*

---

### The Execution Plan (The Stateless Digital Garden)

**Phase 1: The Modern Foundation (Completed)**
* Astro v5 with Vite-powered Tailwind CSS v4.
* Cloudflare Pages deployment configured via `wrangler.json`.
* Single `notes` collection defined in `src/content/config.ts` with `created`, `edited`, `tags`, `title`, and `priority` fields.

**Phase 2: The Data Lake (Cloudflare R2 IAM)**
1. **Provision Storage:** Create two isolated R2 buckets in the Cloudflare dashboard.
2. **IAM Configuration:** Generate two strict "Object Read & Write" API tokens, scoped individually to each bucket.
3. **Local Environment:** Populate `.env` with the variables listed above. *(Done — credentials already present in `.env`.)*
4. **Cloudflare Build Environment:** Add the same variables as encrypted secrets in Cloudflare Workers & Pages project settings (Settings > Variables and Secrets > Production). This is required so the `prebuild` fetch script can access R2 during Cloudflare's build process.
5. **Client Sync:** Configure the `Remotely Save` Obsidian plugin on Mac and iPhone using the respective endpoint and token variables. **Crucial:** Disable end-to-end encryption so the build pipeline can read the raw Markdown files.

**Phase 3: The Cloudflare Build Pipeline (The Node Fetcher)**
1. **Install SDK:** Add `@aws-sdk/client-s3` to `dependencies` (not `devDependencies`) so it's available in the Cloudflare Pages build environment.
2. **The Fetch Script (`scripts/fetch-r2-vaults.js`):** Write a Node script using `@aws-sdk/client-s3`. The script instantiates **two** `S3Client` objects using the respective `AI_VAULT_*` and `PERSONAL_VAULT_*` environment variables.
3. **Data Routing:** The script pulls objects from both buckets, saving them locally into Astro's `src/content/notes/` directory before the build starts.
4. **Update `package.json`:** Add a `prebuild` script so the fetcher runs automatically before every build:
   ```json
   "scripts": {
     "prebuild": "node scripts/fetch-r2-vaults.js",
     "build": "astro build",
     "deploy": "wrangler pages deploy dist",
     "publish": "npm run clean && npm run build && npm run deploy"
   }
   ```

**Phase 4: The Digital Garden UI (Completed)**
* Wiki-link resolution via custom `remark-wiki-link` configuration in `astro.config.mjs` — maps `[[Obsidian links]]` to Astro permalinks with subdirectory support.
* Interactive D3 force-directed graph (`src/pages/graph.astro`) with zoom, pan, drag, mobile pinch, node coloring by group, and dynamic label visibility.
* Single-column layout (`max-w-2xl`) with `priority` frontmatter for featured notes on the home page.
* Backlinks with context snippets on each note page.
* Client-side search, sort (date/title/link count), and tag filtering on the notes index with URL state persistence.
* Quote of the day with deterministic daily rotation.

**Phase 5: The AI Swarm Integration (Upcoming)**
1. **The Write Tool:** Equip custom Python agents with a `boto3` tool. It loads the `AI_VAULT_*` environment variables and pushes Markdown directly to the R2 bucket.
2. **The Trigger Tool:** After upload, the Python daemon calls the Cloudflare Pages Deploy Hook URL to trigger a rebuild.
