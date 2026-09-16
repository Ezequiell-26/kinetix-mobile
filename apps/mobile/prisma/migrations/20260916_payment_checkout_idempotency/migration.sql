ALTER TABLE "Payment" ADD COLUMN "checkoutIdempotencyKey" TEXT;

CREATE UNIQUE INDEX "Payment_checkoutIdempotencyKey_key"
  ON "Payment"("checkoutIdempotencyKey");
