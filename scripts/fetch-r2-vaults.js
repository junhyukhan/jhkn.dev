import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

// Vault configs: each defines where to fetch from and where to write locally.
// - prefix: only fetch objects under this R2 key prefix (null = fetch everything)
// - stripPrefix: remove the prefix from the local file path
// - outputDir: local directory to write files into
const VAULTS = {
  personal: {
    prefix: "01_public/notes/",
    outputDir: "src/content/notes",
    envKeys: {
      accessKeyId: "PERSONAL_VAULT_ACCESS_KEY_ID",
      secretAccessKey: "PERSONAL_VAULT_SECRET_ACCESS_KEY",
      bucket: "PERSONAL_VAULT_BUCKET_NAME",
    },
  },
  ai: {
    prefix: null, // fetch all files in the bucket
    outputDir: "src/content/ai",
    envKeys: {
      accessKeyId: "AI_VAULT_ACCESS_KEY_ID",
      secretAccessKey: "AI_VAULT_SECRET_ACCESS_KEY",
      bucket: "AI_VAULT_BUCKET_NAME",
    },
  },
};

function createClient(accessKeyId, secretAccessKey) {
  return new S3Client({
    region: process.env.REGION || "auto",
    endpoint: process.env.ENDPOINT_URL || `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function fetchVault(label, config) {
  const { prefix, outputDir, envKeys } = config;
  const accessKeyId = process.env[envKeys.accessKeyId];
  const secretAccessKey = process.env[envKeys.secretAccessKey];
  const bucket = process.env[envKeys.bucket];

  if (!accessKeyId || !secretAccessKey || !bucket) {
    console.log(`[${label}] Skipping — missing credentials or bucket name`);
    return;
  }

  console.log(`[${label}] Connecting to bucket "${bucket}"...`);
  if (prefix) console.log(`[${label}] Filtering by prefix "${prefix}"`);

  const client = createClient(accessKeyId, secretAccessKey);
  const objects = [];
  let continuationToken;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ...(prefix && { Prefix: prefix }),
        ContinuationToken: continuationToken,
      })
    );
    if (res.Contents) objects.push(...res.Contents);
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  const mdObjects = objects.filter(o => o.Key?.endsWith(".md"));
  const skipped = objects.length - mdObjects.length;

  console.log(`[${label}] Found ${objects.length} objects (${mdObjects.length} markdown, ${skipped} skipped)`);

  if (mdObjects.length === 0) {
    console.log(`[${label}] Nothing to fetch`);
    return;
  }

  let fetched = 0;
  for (const obj of mdObjects) {
    const relativePath = prefix ? obj.Key.slice(prefix.length) : obj.Key;
    const dest = resolve(join(outputDir, relativePath));

    if (!dest.startsWith(resolve(outputDir) + "/")) {
      console.warn(`[${label}] Skipping "${obj.Key}" — path escapes output directory`);
      continue;
    }

    const res = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: obj.Key })
    );
    const body = await res.Body.transformToString();

    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, body, "utf-8");
    fetched++;
  }

  console.log(`[${label}] Wrote ${fetched} files to ${outputDir}/`);
}

async function main() {
  console.log("--- R2 Vault Fetch ---");
  const start = Date.now();

  const tasks = Object.entries(VAULTS).map(([label, config]) => fetchVault(label, config));
  await Promise.all(tasks);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`--- Done in ${elapsed}s ---`);
}

main().catch((err) => {
  console.error("Failed to fetch R2 vaults:", err.message);
  process.exit(1);
});
