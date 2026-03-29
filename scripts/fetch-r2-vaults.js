import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const CONTENT_DIR = "src/content/notes";

// Only fetch from this prefix within each bucket, strip it from the local path.
// e.g. "01_public/notes/general/Foo.md" -> "src/content/notes/general/Foo.md"
const VAULT_PREFIX = "01_public/notes/";

function createClient(accessKeyId, secretAccessKey) {
  return new S3Client({
    region: process.env.REGION || "auto",
    endpoint: process.env.ENDPOINT_URL || `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function fetchBucket(client, bucket, label) {
  const objects = [];
  let continuationToken;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: VAULT_PREFIX,
        ContinuationToken: continuationToken,
      })
    );
    if (res.Contents) objects.push(...res.Contents);
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  console.log(`[${label}] Found ${objects.length} objects under "${VAULT_PREFIX}" in "${bucket}"`);

  let fetched = 0;
  for (const obj of objects) {
    if (!obj.Key || !obj.Key.endsWith(".md")) continue;

    const relativePath = obj.Key.slice(VAULT_PREFIX.length);
    const res = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: obj.Key })
    );
    const body = await res.Body.transformToString();
    const dest = join(CONTENT_DIR, relativePath);

    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, body, "utf-8");
    fetched++;
  }

  console.log(`[${label}] Wrote ${fetched} markdown files to ${CONTENT_DIR}/`);
}

async function main() {
  const tasks = [];

  if (process.env.PERSONAL_VAULT_ACCESS_KEY_ID) {
    const client = createClient(
      process.env.PERSONAL_VAULT_ACCESS_KEY_ID,
      process.env.PERSONAL_VAULT_SECRET_ACCESS_KEY
    );
    tasks.push(fetchBucket(client, process.env.PERSONAL_VAULT_BUCKET_NAME, "personal"));
  }

  if (process.env.AI_VAULT_ACCESS_KEY_ID) {
    const client = createClient(
      process.env.AI_VAULT_ACCESS_KEY_ID,
      process.env.AI_VAULT_SECRET_ACCESS_KEY
    );
    tasks.push(fetchBucket(client, process.env.AI_VAULT_BUCKET_NAME, "ai"));
  }

  if (tasks.length === 0) {
    console.log("No R2 vault credentials found, skipping fetch");
    return;
  }

  await Promise.all(tasks);
}

main().catch((err) => {
  console.error("Failed to fetch R2 vaults:", err.message);
  process.exit(1);
});
