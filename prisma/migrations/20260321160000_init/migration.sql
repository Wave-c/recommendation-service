-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "userUuid" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reason" TEXT,
    "ranking" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_userUuid_subjectType_subjectId_key" ON "Recommendation"("userUuid", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "Recommendation_userUuid_subjectType_idx" ON "Recommendation"("userUuid", "subjectType");

-- CreateIndex
CREATE INDEX "Recommendation_score_idx" ON "Recommendation"("score");
