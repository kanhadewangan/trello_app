-- AlterTable
ALTER TABLE "card" ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "githubIssue" (
    "id" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "githubIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_cardTogithubIssue" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_cardTogithubIssue_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_cardTogithubIssue_B_index" ON "_cardTogithubIssue"("B");

-- AddForeignKey
ALTER TABLE "_cardTogithubIssue" ADD CONSTRAINT "_cardTogithubIssue_A_fkey" FOREIGN KEY ("A") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cardTogithubIssue" ADD CONSTRAINT "_cardTogithubIssue_B_fkey" FOREIGN KEY ("B") REFERENCES "githubIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
