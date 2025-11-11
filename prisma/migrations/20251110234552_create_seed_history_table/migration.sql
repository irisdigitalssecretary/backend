-- CreateTable
CREATE TABLE "SeedHistory" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeedHistory_filename_key" ON "SeedHistory"("filename");
