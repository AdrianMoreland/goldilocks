-- Whole-page permissions, switchable per role in Roles & permissions. Additive: only inserts preset rows.
-- Everything not yet released (inventory, analytics, orders, import, customers, invoices, trade sheets, rules)
-- is left out on purpose, so it stays admin-only until an admin turns it on for a role.
INSERT INTO "role_permissions" ("role", "key") VALUES
  ('ADMIN', 'page.dashboard'), ('ADMIN', 'page.inventory'), ('ADMIN', 'page.analytics'), ('ADMIN', 'page.knowledge'),
  ('ADMIN', 'page.stocktake'), ('ADMIN', 'page.customer-orders'), ('ADMIN', 'page.orders'), ('ADMIN', 'page.import'),
  ('ADMIN', 'page.customers'), ('ADMIN', 'page.invoices'), ('ADMIN', 'page.tradesheets'), ('ADMIN', 'page.rules'),
  ('MANAGER', 'page.dashboard'), ('MANAGER', 'page.knowledge'), ('MANAGER', 'page.stocktake'), ('MANAGER', 'page.customer-orders'),
  ('SALES', 'page.dashboard'), ('SALES', 'page.knowledge'),
  ('ACCOUNTING', 'page.dashboard'), ('ACCOUNTING', 'page.knowledge'),
  ('AUDITOR', 'page.dashboard'), ('AUDITOR', 'page.knowledge')
ON CONFLICT DO NOTHING;
