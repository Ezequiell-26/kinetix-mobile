-- CreateTable
CREATE TABLE "Phase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Phase_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProgramWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "phaseId" TEXT,
    "weekNumber" INTEGER NOT NULL,
    CONSTRAINT "ProgramWeek_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgramWeek_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProgramWeek" ("id", "programId", "weekNumber") SELECT "id", "programId", "weekNumber" FROM "ProgramWeek";
DROP TABLE "ProgramWeek";
ALTER TABLE "new_ProgramWeek" RENAME TO "ProgramWeek";
CREATE UNIQUE INDEX "ProgramWeek_programId_weekNumber_key" ON "ProgramWeek"("programId", "weekNumber");
CREATE TABLE "new_WorkoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "sets" INTEGER NOT NULL DEFAULT 3,
    "reps" TEXT NOT NULL DEFAULT '8-12',
    "rir" INTEGER,
    "rpe" INTEGER,
    "restSec" INTEGER NOT NULL DEFAULT 90,
    "tempo" TEXT,
    "load" TEXT,
    "notes" TEXT,
    "supersetGroup" TEXT,
    "isCircuit" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutExercise" ("exerciseId", "id", "load", "notes", "order", "reps", "restSec", "rir", "rpe", "sets", "tempo", "workoutId") SELECT "exerciseId", "id", "load", "notes", "order", "reps", "restSec", "rir", "rpe", "sets", "tempo", "workoutId" FROM "WorkoutExercise";
DROP TABLE "WorkoutExercise";
ALTER TABLE "new_WorkoutExercise" RENAME TO "WorkoutExercise";
CREATE INDEX "WorkoutExercise_workoutId_idx" ON "WorkoutExercise"("workoutId");
CREATE INDEX "WorkoutExercise_exerciseId_idx" ON "WorkoutExercise"("exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Phase_programId_idx" ON "Phase"("programId");
