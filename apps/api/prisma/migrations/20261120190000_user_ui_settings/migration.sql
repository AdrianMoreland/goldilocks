-- The look each person chose (light or dark, plus theme, font, text size and density), saved on their account so it
-- follows them to any browser. Null means they never chose: the app then uses its defaults (dark).
ALTER TABLE "users" ADD COLUMN "uiSettings" JSONB;
