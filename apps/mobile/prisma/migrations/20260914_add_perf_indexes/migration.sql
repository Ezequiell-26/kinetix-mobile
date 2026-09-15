-- Add composite perf indexes
CREATE INDEX "WorkoutLog_clientId_date_idx" ON "WorkoutLog"("clientId", "date");
CREATE INDEX "CheckIn_clientId_date_idx" ON "CheckIn"("clientId", "date");
