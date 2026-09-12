-- CreateIndex
CREATE INDEX "Exercise_muscleGroup_idx" ON "Exercise"("muscleGroup");

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "ExerciseSetLog_logId_idx" ON "ExerciseSetLog"("logId");

-- CreateIndex
CREATE INDEX "Payment_clientId_idx" ON "Payment"("clientId");

-- CreateIndex
CREATE INDEX "Payment_date_idx" ON "Payment"("date");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Workout_weekId_idx" ON "Workout"("weekId");

-- CreateIndex
CREATE INDEX "WorkoutLog_workoutId_idx" ON "WorkoutLog"("workoutId");

-- CreateIndex
CREATE INDEX "WorkoutLog_completed_idx" ON "WorkoutLog"("completed");
