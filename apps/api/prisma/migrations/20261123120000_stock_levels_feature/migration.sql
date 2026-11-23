-- Stock levels in the pricing workbook, switchable per role. Additive: only inserts the admin preset row, so the
-- feature stays admin-only until an admin turns it on for a role in Roles & permissions.
INSERT INTO "role_permissions" ("role", "key") VALUES
  ('ADMIN', 'feature.stock-levels')
ON CONFLICT DO NOTHING;
