-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inboxes" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "alias" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "ip_created_from" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inboxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL,
    "inbox_id" TEXT NOT NULL,
    "from_address" TEXT NOT NULL,
    "from_name" TEXT,
    "subject" TEXT NOT NULL DEFAULT '(no subject)',
    "body_html" TEXT,
    "body_text" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "burn_after_read" BOOLEAN NOT NULL DEFAULT false,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inboxes_address_key" ON "inboxes"("address");

-- CreateIndex
CREATE INDEX "inboxes_address_idx" ON "inboxes"("address");

-- CreateIndex
CREATE INDEX "inboxes_expires_at_idx" ON "inboxes"("expires_at");

-- CreateIndex
CREATE INDEX "inboxes_ip_created_from_idx" ON "inboxes"("ip_created_from");

-- CreateIndex
CREATE INDEX "emails_inbox_id_idx" ON "emails"("inbox_id");

-- CreateIndex
CREATE INDEX "emails_received_at_idx" ON "emails"("received_at");

-- AddForeignKey
ALTER TABLE "inboxes" ADD CONSTRAINT "inboxes_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_inbox_id_fkey" FOREIGN KEY ("inbox_id") REFERENCES "inboxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
