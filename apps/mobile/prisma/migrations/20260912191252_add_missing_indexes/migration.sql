-- CreateIndex
CREATE INDEX "CheckIn_userId_idx" ON "CheckIn"("userId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "ProgressMeasurement_userId_idx" ON "ProgressMeasurement"("userId");

-- CreateIndex
CREATE INDEX "ProgressMeasurement_clientId_idx" ON "ProgressMeasurement"("clientId");

-- CreateIndex
CREATE INDEX "ProgressMeasurement_date_idx" ON "ProgressMeasurement"("date");

-- CreateIndex
CREATE INDEX "ProgressPhoto_userId_idx" ON "ProgressPhoto"("userId");

-- CreateIndex
CREATE INDEX "ProgressPhoto_clientId_idx" ON "ProgressPhoto"("clientId");

-- CreateIndex
CREATE INDEX "ProgressPhoto_date_idx" ON "ProgressPhoto"("date");
