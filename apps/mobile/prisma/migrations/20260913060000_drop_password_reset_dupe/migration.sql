-- Modelo muerto PasswordReset (duplicado del flujo vivo PasswordResetToken).
-- El store real hashea con sha256 en PasswordResetToken.token.
DROP TABLE IF EXISTS "PasswordReset";
