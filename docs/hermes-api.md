# SupplierHut Hermes API

এই API Hermes-কে website-এর problem record ও সীমিত aggregate metric **শুধু পড়তে** দেয়। এটি website-এর Clerk login/admin authorization-এর বিকল্প নয় এবং কোনো write operation দেয় না।

সম্পূর্ণ বর্তমান website/API capability inventory ও write-API blockers: [hermes-capability-inventory.md](./hermes-capability-inventory.md)।

## অনুমোদিত read

| Method | Path | অনুমতি | কাজ |
|---|---|---|---|
| `GET` | `/api/agent/v1/health` | Public | শুধু API status। Database বা secret-এর অবস্থা জানায় না। |
| `GET` | `/api/agent/v1/capabilities` | Bearer token | অনুমোদিত read endpoint এবং status policy জানায়। |
| `GET` | `/api/agent/v1/problems` | Bearer token | Paginated, allowlisted problem data। `limit` ১–১০০; `offset` ০–১০০০০০। |
| `GET` | `/api/agent/v1/problems/{id}` | Bearer token | ID বা slug দিয়ে অনুমোদিত একটি problem। |
| `GET` | `/api/agent/v1/analytics` | Bearer token | অনুমোদিত status-এর aggregate count। |
| `GET` | `/api/agent/v1/openapi.json` | Public | Machine-readable API schema। |

Hermes শুধু `Evidence Supported` ও `Validated` status-এর record পড়তে পারে। এই allowlist list/count SQL, server-memory fallback, detail lookup ও analytics—সবখানে enforce করা হয়। List-এ `status` filter-এ অন্য status দিলে `400` হয়; অনুমোদিত status-এর বাইরে থাকা detail record `404` হয়। Analytics-এ কেবল এই দুই status-এর key থাকে।

সব private endpoint-এ `Authorization: Bearer …` প্রয়োজন। Token না থাকলে/ভুল হলে `401`; server-এ token configure না থাকলে private call-এ `503`। Invalid query বা ID-তে `400`। কোনো database query ব্যর্থ হলে list, detail ও analytics fallback হিসেবে server seed data দিতে পারে; response-এর `data_source` হবে `seed_data`, আর Neon থেকে সফল query হলে `database`। ফলে fallback record-কে live Neon record বলে ভুল করা যাবে না। Error response-এ stack trace বা database details দেওয়া হয় না।

`data_source: "database"` মানে ওই response-এর রেকর্ড বা metric Neon query থেকে এসেছে; এটি website-এর সব data-র সঙ্গে synchronization বা authoritative website data হওয়া প্রমাণ করে না। `data_source: "seed_data"` মানে server-side seed fallback ব্যবহৃত হয়েছে—এটি live Neon বা authoritative website record নয়। Database configure না থাকলে বা query ব্যর্থ হলে list/detail/analytics seed fallback দিতে পারে। Detail lookup-এ database query সফল হলেও requested record না মিললে matching seed record থাকলে সেটিও `seed_data` হিসেবে ফেরে।

List ও analytics response-এ `data_source` থাকে। Detail response-এর format `{ "problem": { ...AgentProblem fields... }, "data_source": "database" | "seed_data" }`; `problem` সরাসরি record object, nested wrapper নয়।

## Token configuration

1. নিজের trusted terminal-এ token তৈরি করুন, যেমন `openssl rand -hex 32`। Token chat, source control, URL, browser code, screenshot বা log-এ দেবেন না।
2. Local Next.js development-এর জন্য repository-র ignored `.env.local`-এ `HERMES_API_TOKEN` রাখুন। এটি server-side variable; নামের আগে `NEXT_PUBLIC_` দেবেন না। Secret value chat-এ শেয়ার করবেন না।
3. Vercel-এ **Project → Settings → Environment Variables** থেকে একই নামের `HERMES_API_TOKEN` যোগ করুন। প্রয়োজনীয় Development, Preview বা Production environment নির্বাচন করুন। পরিবর্তন কার্যকর করতে Vercel deployment প্রয়োজন; এই repository থেকে deploy করা হয়নি।
4. Hermes-এর নিজস্ব private environment/secret storage-এ token configure করুন। Hermes বা FreeLLMAPI-এর অন্য setting এই কাজের অংশ নয়।

## Linux/Hermes local setup

পুরোনো integration guide-এর Linux path, permission ও testing ধারণা রাখা হয়েছে; নিচের নির্দেশনা কেবল বর্তমান read-only API-র জন্য। পুরোনো write/moderation নির্দেশনা ব্যবহার করবেন না।

```bash
mkdir -p ~/.hermes/instructions
install -m 600 /dev/null ~/.hermes/supplierhut.env
```

`~/.hermes/supplierhut.env` আপনার editor-এ খুলে `SUPPLIERHUT_BASE_URL`-এ আপনার API base URL এবং `HERMES_API_TOKEN`-এ আপনার secret দিন। File permission যাচাই করতে `stat -c '%a %n' ~/.hermes/supplierhut.env` চালান; permission `600` হওয়া উচিত। Token command history বা shared log-এ লিখবেন না।

Hermes instruction-এ শুধু HTTPS-এর base URL এবং read-only operation অনুমোদন করুন। Token-কে prompt, conversation বা tool output-এ বসাবেন না। Private request-এ `Authorization: Bearer <secret>` header ব্যবহার হবে; URL/query parameter-এ নয়। Hermes-কে write capability দেবেন না।

## Safe local tests

`.env.local`-এ server token configure করে `npm run dev` চালান। আলাদা terminal-এ interactive prompt দিয়ে test process-এ token দিন; value echo হবে না:

```bash
read -rsp "HERMES_API_TOKEN: " HERMES_API_TOKEN
printf '\n'
export HERMES_API_TOKEN
curl -i http://localhost:3000/api/agent/v1/health
curl -i http://localhost:3000/api/agent/v1/capabilities
curl -i -H "Authorization: Bearer $HERMES_API_TOKEN" \
  "http://localhost:3000/api/agent/v1/problems?limit=10&offset=0"
curl -i -H "Authorization: Bearer $HERMES_API_TOKEN" \
  http://localhost:3000/api/agent/v1/analytics
node scripts/test_hermes_auth.mjs
unset HERMES_API_TOKEN
```

Token ছাড়া private endpoint-এ `401` প্রত্যাশিত। Authenticated calls-এ `200` প্রত্যাশিত, যদি data source উপলভ্য থাকে। Automated script শুধু read request করে; কোনো record পরিবর্তন করে না। Test URL default local server; remote URL পরীক্ষা করতে `SUPPLIERHUT_API_URL` environment variable ব্যবহার করা যায়।

## Rotation, deploy ও verification

Token compromise হলে:

1. Trusted terminal-এ replacement তৈরি করুন (`openssl rand -hex 32`)।
2. Vercel-এর `HERMES_API_TOKEN` update করে স্বাভাবিক অনুমোদিত deployment করুন। Single-token configuration-এ নতুন token কার্যকর হলে পুরোনো token-ও অকার্যকর হবে।
3. Hermes-এর private environment-এ নতুন token দিন; Hermes/FreeLLMAPI-এর অন্য configuration বদলাবেন না।
4. নতুন token দিয়ে `/capabilities` ও একটি read endpoint পরীক্ষা করুন; পুরোনো token দিয়ে `401` নিশ্চিত করুন।

Deployment-এর পরে নিজের deployment URL-এ health, authenticated capabilities, problem list, একটি detail এবং analytics পরীক্ষা করুন। Public health সফল হওয়া database connectivity-এর প্রমাণ নয়। এই কাজের অংশ হিসেবে deploy বা production verification করা হয়নি।

## Removed/unsupported capabilities

পুরোনো guide-এ থাকা problem create/edit/delete, publish/unpublish/archive, proposal/report moderation, user listing, category/settings এবং audit-log operation এখন **unsupported**। সেগুলোর পুরোনো curl command, dry-run এবং moderation workflow ব্যবহার করবেন না। API-তে কোনো create, edit, publish, archive, delete বা moderation endpoint নেই; `writes_enabled` false।

## Data source, সীমাবদ্ধতা ও migration সতর্কতা

- Database configured থাকলে API Neon-এর `platform_problems` table পড়ে। Database query ব্যর্থ হলে list/detail/analytics server-side seeded data fallback-এ যেতে পারে, response-এ `data_source: "seed_data"` দিয়ে তা চিহ্নিত করে। Database configure না থাকলেও seed data source স্পষ্টভাবে ফেরত আসে।
- Website-এ browser-এর `localStorage` (`supplierhut_problems_v1`) এবং server-side seed/in-memory store ব্যবহৃত হয়; website submission/admin actions Neon-এ স্বয়ংক্রিয়ভাবে sync হয় না। Browser `localStorage` server API পড়তে পারে না। তাই website ও API-র record-set এক নয়/একই—এমন নিশ্চয়তা নেই।
- কোনো database migration, data import, cutover বা backup এই কাজের মধ্যে হয়নি। ভবিষ্যতে shared source of truth স্থাপনের আগে browser export, seed ও Neon-এর আলাদা backup নিয়ে records human-review করে duplicate reconciliation করতে হবে। Backup যাচাই ও লিখিত অনুমোদন ছাড়া কোনো import, overwrite বা delete নয়।
- Response-এ কেবল allowlisted problem fields থাকে; reporter identity ও proposal/report/user/audit data প্রকাশ করা হয় না। Text field সীমিত দৈর্ঘ্যে ফেরে।
- Rate limit প্রতি server process-এ best-effort; serverless instance-গুলোর মধ্যে shared নয়।
- এই API-র code লেখা মানে এটি deployed বা Hermes-এ connected—এমন নয়।
