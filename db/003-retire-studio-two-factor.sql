-- Retire CMS two-factor enrollment without changing staff accounts or passwords.
-- Fresh installations do not have the plugin's column/table.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='user' AND column_name='twoFactorEnabled') THEN
    DELETE FROM "session" WHERE "userId" IN (SELECT id FROM "user" WHERE "twoFactorEnabled"=true);
    UPDATE "user" SET "twoFactorEnabled"=false;
  END IF;
  IF to_regclass('"twoFactor"') IS NOT NULL THEN
    DELETE FROM "twoFactor";
  END IF;
END $$;
