# KinetixFitt security-path instructions

Apply these rules to security-sensitive files and changes.

## Never weaken security to make tests pass

Do not remove or bypass authorization, CSRF, rate limits, input validation, secret checks, webhook signature verification, ownership checks, secure cookies, upload restrictions, or audit logging.

## Authorization checklist

For every protected resource confirm server-side ownership or role authorization. Test both allowed and denied tenants/roles where applicable.

## Payments

Never trust frontend success, amount, currency, plan or subscription state. Verify provider signatures, idempotency and persistent state transitions.

## Storage

Treat uploaded files as untrusted. Validate size/type/signature, path safety, ownership and private access. Do not expose raw storage credentials.

## Secrets

Never commit credentials or include sensitive values in logs, tests, fixtures or documentation.

## AI security

AI-generated output is untrusted input. Never allow it to bypass authorization or directly perform privileged/destructive actions without the existing application controls.

## Verification

Security-sensitive changes require targeted tests and broader security/release gates before being described as fixed or verified.
