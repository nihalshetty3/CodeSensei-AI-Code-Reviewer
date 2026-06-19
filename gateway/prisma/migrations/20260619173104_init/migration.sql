-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "github_id" VARCHAR(255),
    "username" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "repository_name" TEXT NOT NULL,
    "pr_number" INTEGER,
    "review_type" VARCHAR(50),
    "review_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "bugs_found" INTEGER DEFAULT 0,
    "security_issues" INTEGER DEFAULT 0,
    "performance_issues" INTEGER DEFAULT 0,
    "code_quality_issues" INTEGER DEFAULT 0,
    "review_summary" TEXT,
    "full_review" JSONB,

    CONSTRAINT "review_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");

-- AddForeignKey
ALTER TABLE "review_history" ADD CONSTRAINT "review_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
