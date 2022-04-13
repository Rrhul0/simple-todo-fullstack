-- CreateTable
CREATE TABLE "Cookies" (
    "id" SERIAL NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cookie" TEXT NOT NULL,
    "device" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cookies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cookies_cookie_key" ON "Cookies"("cookie");

-- AddForeignKey
ALTER TABLE "Cookies" ADD CONSTRAINT "Cookies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
