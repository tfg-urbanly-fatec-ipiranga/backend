-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconColor" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaceTag" (
    "placeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceTag_pkey" PRIMARY KEY ("placeId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favorite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlacePhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "PlacePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_placeId_key" ON "public"."Review"("userId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_placeId_key" ON "public"."Favorite"("userId", "placeId");

-- AddForeignKey
ALTER TABLE "public"."Place" ADD CONSTRAINT "Place_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceTag" ADD CONSTRAINT "PlaceTag_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaceTag" ADD CONSTRAINT "PlaceTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlacePhoto" ADD CONSTRAINT "PlacePhoto_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
