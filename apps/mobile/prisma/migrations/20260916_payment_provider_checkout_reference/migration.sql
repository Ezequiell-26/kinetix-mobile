ALTER TABLE "Payment" ADD COLUMN "providerCheckoutId" TEXT;

CREATE INDEX "Payment_providerCheckoutId_idx"
  ON "Payment"("providerCheckoutId");
