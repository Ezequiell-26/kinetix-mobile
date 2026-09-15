ALTER TABLE "Program" ADD COLUMN "trainerId" TEXT;

CREATE INDEX "Program_trainerId_idx" ON "Program"("trainerId");
CREATE INDEX "Program_updatedAt_idx" ON "Program"("updatedAt");

ALTER TABLE "Program"
ADD CONSTRAINT "Program_trainerId_fkey"
FOREIGN KEY ("trainerId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
