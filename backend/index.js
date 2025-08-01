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

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // This is the user model (database table) from the Prisma schema
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to create a new user
app.post("/users", async (req, res) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });

    res.status(201).json(user); // 201 Created status code indicates that the request has been fulfilled and a new resource has been created
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    res.status(200).json(user); // 200 OK status code indicates that the request has succeeded
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Route to delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // 404 Not Found status code indicates that the requested resource could not be found
    }
    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ message: "User deleted successfully", user }); // 200 OK status code indicates that the request has succeeded
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Start the server on port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
