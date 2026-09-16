CREATE TABLE "PrivateAsset" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "clientId" TEXT,
  "type" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PrivateAsset_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PrivateAsset_filename_key" UNIQUE ("filename")
);

CREATE INDEX "PrivateAsset_userId_type_createdAt_idx" ON "PrivateAsset"("userId", "type", "createdAt");
CREATE INDEX "PrivateAsset_clientId_type_createdAt_idx" ON "PrivateAsset"("clientId", "type", "createdAt");
