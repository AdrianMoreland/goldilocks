# Plan: row level security on every table

Status: for the owner's approval. **Nothing in this PR touches the database.** The SQL is inside this document on purpose: a file in `apps/api/prisma/migrations/` would be applied by Railway as soon as it merged.
Date: 2026-11-01.

## 1. What was found

Supabase's advisory tool reports **26 tables in `public` with row level security (RLS) off**, marked critical, with the warning that anyone holding the project's anon key could read and modify every row through Supabase's REST API.

That advisory is a general rule. Checked read-only against the live database on 2026-11-01, the actual position is better:

| Check | Result |
|---|---|
| Which role does the API connect as? | `postgres`, which has `BYPASSRLS` (so RLS never affects the app) |
| Is Supabase's REST API (PostgREST) running? | Yes (`authenticator` has a live connection) |
| Can `anon` or `authenticated` read or write any `public` table? | **No.** `has_table_privilege` is false for select, insert, update and delete on all 26 tables |
| Do tables created in future get grants for `anon` or `authenticated`? | **No.** `pg_default_acl` has no entry for the `public` schema |
| Is an anon key shipped to browsers? | No. The web app has no `supabase-js` and no Supabase key in its code; login goes through the API |
| Other advisory | Auth "leaked password protection" is off (warning, unrelated to tables) |

So today nothing is reachable through the REST API even without RLS: the missing privileges already stop it. RLS is the **second lock**: if anyone ever runs a `GRANT ... TO anon` (or changes the project's default privileges, or a Supabase update does), the tables are still closed.

## 2. What the change does

Enable RLS on all 26 tables, with **no policies**. With RLS on and no policy, the REST roles (`anon`, `authenticated`) see no rows and can write none. The API is unaffected because `postgres` bypasses RLS.

```sql
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."metal_spot_prices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."historic_spot_prices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."branches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."fetch_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."kb_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ai_question_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ai_answer_cache" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."roadmap_document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."market_mode_state" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."audit_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bc_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stocktakes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stocktake_lines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stocktake_discrepancies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stocktake_bars" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stocktake_coins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customer_order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customer_order_evidence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."import_batches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."trades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."purchase_lots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stock_units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."product_aliases" ENABLE ROW LEVEL SECURITY;
```

Rollback, per table: `ALTER TABLE "public"."<name>" DISABLE ROW LEVEL SECURITY;`. It changes no data and is instant.

`_prisma_migrations` is included because Supabase flags it, and Prisma runs as `postgres`. If you would rather leave Prisma's own table alone, drop that one line.

## 3. How it would be applied (after approval)

1. A Prisma migration containing the SQL above (so the history records it and a rebuilt database gets it), added in a PR of its own and approved first. Railway's pre-deploy step applies it.
2. Before it merges, run these read-only checks and keep the output (they are the "before"):
   - `select relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r';` (all false)
   - open `/dashboard`, `/stocktake`, `/customer-orders`, `/project`, `/project2` and `/admin` as an admin: all load.
3. After the deploy, repeat both. The query should show `true` for all 26, and every page should load and save as before. Supabase's advisory tool should no longer list the tables.
4. If any page fails, run the per-table rollback for the table named in the API error, then tell me.

## 4. Keeping it that way

- Add a rule to `docs/ENGINEERING.md`: **every migration that creates a table ends with `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.** (The slice 2 migration already does.)
- Optional: make the `migration-check` job in `post-merge.yml` fail when a new migration creates a table without that line. About 10 lines; say if you want it.
- Separate and small, in the Supabase dashboard: turn on Auth "leaked password protection" (Authentication, Providers or Policies, depending on the dashboard version).

## 5. Decisions needed

1. Approve enabling RLS on all 26 tables as one migration, with the test steps in section 3?
2. Include or leave out `_prisma_migrations`?
3. Add the "tables must enable RLS" line to `docs/ENGINEERING.md`, and the optional check in `migration-check`?
