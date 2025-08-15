-- CreateTable
CREATE TABLE "public"."Student" (
    "studentId" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);
