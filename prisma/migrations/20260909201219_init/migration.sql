-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "goal" TEXT,
    "experience" TEXT,
    "availability" INTEGER,
    "equipment" TEXT,
    "notes" TEXT,
    "weight" REAL,
    "height" REAL,
    "bio" TEXT,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "specialty" TEXT,
    CONSTRAINT "TrainerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
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
    CONSTRAINT "Client_assignedProgramId_fkey" FOREIGN KEY ("assignedProgramId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "pattern" TEXT,
    "equipment" TEXT,
    "level" TEXT NOT NULL DEFAULT 'Intermedio',
    "image" TEXT,
    "video" TEXT,
    "instructions" TEXT,
    "errors" TEXT,
    "variants" TEXT,
    "substitutions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationWeeks" INTEGER NOT NULL DEFAULT 4,
    "frequency" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProgramWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    CONSTRAINT "ProgramWeek_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estimatedMin" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "Workout_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "ProgramWeek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutExercise" (
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
    CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "clientId" TEXT,
    "workoutId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMin" INTEGER,
    "comment" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkoutLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkoutLog_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseSetLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "weight" REAL,
    "reps" INTEGER,
    "rir" INTEGER,
    "rpe" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ExerciseSetLog_logId_fkey" FOREIGN KEY ("logId") REFERENCES "WorkoutLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressMeasurement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "clientId" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" REAL,
    "chest" REAL,
    "waist" REAL,
    "arm" REAL,
    "leg" REAL,
    "bodyFat" REAL,
    CONSTRAINT "ProgressMeasurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProgressMeasurement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "clientId" TEXT,
    "url" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ProgressPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProgressPhoto_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "clientId" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "energia" INTEGER,
    "sueno" INTEGER,
    "estres" INTEGER,
    "entrenos" INTEGER,
    "rendimiento" INTEGER,
    "molestias" TEXT,
    "alimentacion" TEXT,
    "progreso" INTEGER,
    "comentario" TEXT,
    "fotos" TEXT,
    "trainerReply" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CheckIn_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "clientId" TEXT,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'PERSONALIZADO',
    "status" TEXT NOT NULL DEFAULT 'ACTIVA',
    "nextPayment" DATETIME,
    "price" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT,
    "email" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "method" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerProfile_userId_key" ON "TrainerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramWeek_programId_weekNumber_key" ON "ProgramWeek"("programId", "weekNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_clientId_key" ON "Subscription"("clientId");
