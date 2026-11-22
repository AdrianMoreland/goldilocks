-- Three trades from the March 2026 sheet were imported on 2026-11-10 with the date 26/03/206, read as the year 206.
-- No period can show them (Analytics notes "impossible date"), so one invoiced sale was missing from March.
-- Data only, no schema change. Each row is matched by id AND its wrong date, so it changes nothing on a database
-- where those rows are absent or were already corrected. Re-running it is harmless.
UPDATE "trades"
SET "date" = DATE '2026-03-26'
WHERE "id" IN (7077, 7078, 7079)
  AND "date" = DATE '0206-03-26';
