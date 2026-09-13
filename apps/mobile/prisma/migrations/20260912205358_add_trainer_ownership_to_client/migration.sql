-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "trainerId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "goal" TEXT NOT NULL DEFAULT 'HIPERTROFIA',
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "plan" TEXT NOT NULL DEFAULT 'PERSONALIZADO',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReview" DATETIME,
    "notes" TEXT,
    "trainerNotes" TEXT,
    "age" INTEGER,
    "weight" REAL,
    "height" REAL,
    "experience" TEXT,
    "availability" INTEGER,
    "equipment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "assignedProgramId" TEXT,
    CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Client_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Client_assignedProgramId_fkey" FOREIGN KEY ("assignedProgramId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("age", "assignedProgramId", "availability", "avatar", "createdAt", "email", "equipment", "experience", "goal", "height", "id", "name", "nextReview", "notes", "plan", "startDate", "status", "trainerNotes", "updatedAt", "userId", "weight") SELECT "age", "assignedProgramId", "availability", "avatar", "createdAt", "email", "equipment", "experience", "goal", "height", "id", "name", "nextReview", "notes", "plan", "startDate", "status", "trainerNotes", "updatedAt", "userId", "weight" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE INDEX "Client_email_idx" ON "Client"("email");
CREATE INDEX "Client_status_idx" ON "Client"("status");
CREATE INDEX "Client_plan_idx" ON "Client"("plan");
CREATE INDEX "Client_createdAt_idx" ON "Client"("createdAt");
CREATE INDEX "Client_trainerId_idx" ON "Client"("trainerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
