-- CreateTable
CREATE TABLE "document_boards" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "org_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_board_items" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "board_uuid" TEXT NOT NULL,
    "document_uuid" TEXT NOT NULL,
    "added_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_board_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_boards_uuid_key" ON "document_boards"("uuid");

-- CreateIndex
CREATE INDEX "document_boards_org_uuid_idx" ON "document_boards"("org_uuid");

-- CreateIndex
CREATE INDEX "document_boards_created_by_idx" ON "document_boards"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "document_board_items_uuid_key" ON "document_board_items"("uuid");

-- CreateIndex
CREATE INDEX "document_board_items_board_uuid_idx" ON "document_board_items"("board_uuid");

-- CreateIndex
CREATE INDEX "document_board_items_added_by_idx" ON "document_board_items"("added_by");

-- CreateIndex
CREATE UNIQUE INDEX "document_board_items_board_uuid_document_uuid_key" ON "document_board_items"("board_uuid", "document_uuid");

-- AddForeignKey
ALTER TABLE "document_boards" ADD CONSTRAINT "document_boards_org_uuid_fkey" FOREIGN KEY ("org_uuid") REFERENCES "organizations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_boards" ADD CONSTRAINT "document_boards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_board_items" ADD CONSTRAINT "document_board_items_board_uuid_fkey" FOREIGN KEY ("board_uuid") REFERENCES "document_boards"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_board_items" ADD CONSTRAINT "document_board_items_document_uuid_fkey" FOREIGN KEY ("document_uuid") REFERENCES "documents"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_board_items" ADD CONSTRAINT "document_board_items_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
