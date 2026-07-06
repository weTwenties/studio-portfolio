-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "sourceLocale" TEXT NOT NULL DEFAULT 'vi',
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "cvUrl" TEXT,
    "socials" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "translations" TEXT,
    "translationHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "sourceLocale" TEXT NOT NULL DEFAULT 'vi',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "coverUrl" TEXT,
    "demoUrl" TEXT,
    "tags" TEXT,
    "caseStudy" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "translations" TEXT,
    "translationHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MemberProject" (
    "memberId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roleLabel" TEXT,

    PRIMARY KEY ("memberId", "projectId"),
    CONSTRAINT "MemberProject_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MemberProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "sourceLocale" TEXT NOT NULL DEFAULT 'vi',
    "brand" TEXT,
    "navLinks" TEXT,
    "footerText" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "contactEmail" TEXT,
    "translations" TEXT,
    "translationHash" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_slug_key" ON "Member"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
