-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkoutLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "clientId" TEXT,
    "workoutId" TEXT,
    "workoutName" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMin" INTEGER,
    "comment" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkoutLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkoutLog_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutLog" ("clientId", "comment", "completed", "date", "durationMin", "id", "userId", "workoutId") SELECT "clientId", "comment", "completed", "date", "durationMin", "id", "userId", "workoutId" FROM "WorkoutLog";
DROP TABLE "WorkoutLog";
ALTER TABLE "new_WorkoutLog" RENAME TO "WorkoutLog";
CREATE INDEX "WorkoutLog_userId_idx" ON "WorkoutLog"("userId");
CREATE INDEX "WorkoutLog_clientId_idx" ON "WorkoutLog"("clientId");
CREATE INDEX "WorkoutLog_date_idx" ON "WorkoutLog"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
