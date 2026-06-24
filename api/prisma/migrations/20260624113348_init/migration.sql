-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
