const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// json format for parsing
app.use(express.json()); // for parsing application/json

// CORS middleware which is necessary for the frontend to access the backend
// It allows requests from any origin to be handled by the backend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // This allows all origins, meaning it can be accessed from any domain i.e. *
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // This allows the specified HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // This allows the specified headers to be used in requests
  next();
});

// Test route to check if the backend is running
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "Test successful!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all students
app.get("/students", async (req, res) => {
  try {
    const users = await prisma.student.findMany(); // This is the user model (database table) from the Prisma schema
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to get user by ID
app.get("/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        studentId: Number(req.params.id),
      },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" }); // 404 Not Found status code indicates that the requested resource could not be found
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to create a new student
app.post("/students", async (req, res) => {
  try {
    const student = await prisma.student.create({
      data: {
        studentName: req.body.studentName,
        courseName: req.body.courseName,
      },
    });

    res.status(201).json(student); // 201 Created status code indicates that the request has been fulfilled and a new resource has been created
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to complete bulk student creation
app.post("/students/bulk", async (req, res) => {
  try {
    const studentsData = req.body; // Array of student objects

    // Run all creates in parallel for speed!
    const createdStudents = await Promise.all(
      studentsData.map(student =>
        prisma.student.create({
          data: {
            studentName: student.studentName,
            courseName: student.courseName,
          },
        })
      )
    );

    res.status(201).json(createdStudents);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});



// Route to update a student by ID
app.put("/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: {
        studentId: Number(req.params.id),
      },
      data: {
        studentName: req.body.studentName,
        courseName: req.body.courseName,
      },
    });
    res.status(200).json(student); // 200 OK status code indicates that the request has succeeded
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});


// Route to delete a student by ID
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        studentId: Number(req.params.id),
      },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" }); // 404 Not Found status code indicates that the requested resource could not be found
    }
    await prisma.student.delete({
      where: {
        studentId: Number(req.params.id),
      },
    });
    res.status(200).json({ message: "User deleted successfully", student }); // 200 OK status code indicates that the request has succeeded
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Start the server on port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
