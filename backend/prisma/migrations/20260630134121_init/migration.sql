-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('A_VENIR', 'SUCCES', 'ECHEC', 'REPORTE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lancement" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "agence" TEXT,
    "fusee" TEXT,
    "mission" TEXT,
    "lieu" TEXT,
    "imageUrl" TEXT,
    "dateLancement" TIMESTAMP(3),
    "statut" "Statut" NOT NULL DEFAULT 'A_VENIR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lancement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suivi" (
    "id" SERIAL NOT NULL,
    "rappel" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "lancementId" INTEGER NOT NULL,

    CONSTRAINT "Suivi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commentaire" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "lancementId" INTEGER NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lancement_ref_key" ON "Lancement"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "Suivi_userId_lancementId_key" ON "Suivi"("userId", "lancementId");

-- AddForeignKey
ALTER TABLE "Suivi" ADD CONSTRAINT "Suivi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suivi" ADD CONSTRAINT "Suivi_lancementId_fkey" FOREIGN KEY ("lancementId") REFERENCES "Lancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_lancementId_fkey" FOREIGN KEY ("lancementId") REFERENCES "Lancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
