import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../components/Card";
import { useAuth0 } from "@auth0/auth0-react";

interface Student {
  studentId: number;
  studentName: string;
  courseName: string;
  date: Date;
}

export default function Home() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState<Student>({
    studentId: 0,
    studentName: "",
    courseName: "",
    date: new Date(),
  });
  const [updateStudent, setUpdateStudent] = useState<Student>({
    studentId: 0,
    studentName: "",
    courseName: "",
    date: new Date(),
  });
  const [createStudentError, setCreateStudentError] = useState<boolean>(false);
  const [createStudentErrorMessage, setCreateStudentErrorMessage] =
    useState<string>("");
  const [updateStudentError, setUpdateStudentError] = useState<boolean>(false);
  const [updateStudentErrorMessage, setUpdateStudentErrorMessage] =
    useState<string>("");

  // fetch users
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/students`);
        setStudents(response.data.reverse()); // Shows the newest user first
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchStudents();
  }, [isAuthenticated]);

  // create user
  const createStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateStudentError(false);
    setCreateStudentErrorMessage("");
    if (!newStudent.studentName || !newStudent.courseName) {
      setCreateStudentError(true);
      setCreateStudentErrorMessage("Name and Course are required.");
      return;
    }
    try {
      // @ts-ignore
      const token = await getAccessTokenSilently();

      console.log("Token:", token); // Debugging line to check token
      const response = await axios.post(
        `${apiUrl}/students`,
        {
          studentName: newStudent.studentName,
          courseName: newStudent.courseName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents([response.data, ...students]); // Add new user to the front of the list
      setNewStudent({
        studentId: 0,
        studentName: "",
        courseName: "",
        date: new Date(),
      }); // Reset form
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      setCreateStudentError(true);
      setCreateStudentErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  // update user
  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateStudentError(false);
    setUpdateStudentErrorMessage("");
    if (
      !updateStudent.studentId ||
      !updateStudent.studentName ||
      !updateStudent.courseName
    ) {
      setUpdateStudentError(true);
      setUpdateStudentErrorMessage("ID, Name, and Course are required.");
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      await axios.put(
        `${apiUrl}/students/${updateStudent.studentId}`,
        {
          studentName: updateStudent.studentName,
          courseName: updateStudent.courseName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(
        students.map((student) =>
          student.studentId === updateStudent.studentId
            ? updateStudent
            : student
        )
      ); // Update the user in the list
      setUpdateStudent({
        studentId: 0,
        studentName: "",
        courseName: "",
        date: new Date(),
      }); // Reset form
    } catch (error) {
      console.error("Error updating user:", error);
      setUpdateStudentError(true);
      setUpdateStudentErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  // delete user
  const deleteStudent = async (id: number) => {
    try {
      const token = await getAccessTokenSilently();

      await axios.delete(`${apiUrl}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(students.filter((student) => student.studentId !== id)); // Remove the deleted user from the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!isAuthenticated)
    return (
      <button
        className="bg-[#005050] text-white px-4 py-2 rounded hover:bg-[#003a3a] absolute top-5 right-5"
        onClick={() => loginWithRedirect()}
      >
        Log In
      </button>
    );

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-4 bg-[#FAF9F6]">
      <button
        type="button"
        className="bg-[#005050] text-white px-4 py-2 rounded hover:bg-[#003a3a] absolute top-5 right-5"
        onClick={() => logout()}
      >
        Logout
      </button>
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-[#001212e2] text-center">
          Student Manager
        </h1>
        {/* Create User Form */}
        <form
          onSubmit={createStudent}
          className="flex flex-col space-y-4 bg-[#FAF9F6] p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#001212e2]">
            Create Student
          </h2>
          <input
            placeholder="Name"
            value={newStudent.studentName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, studentName: e.target.value })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <input
            placeholder="Course"
            value={newStudent.courseName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, courseName: e.target.value })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            className="bg-[#005050] text-white px-4 py-2 rounded hover:bg-[#003a3a]"
          >
            Create Student
          </button>
          {createStudentError && (
            <p className="text-[#ffa49c]">{createStudentErrorMessage}</p>
          )}
        </form>

        {/* Update User Form */}
        <form
          className="flex flex-col space-y-4 bg-[#FAF9F6] p-4 rounded-lg shadow-md"
          onSubmit={handleUpdateStudent}
        >
          <h2 className="text-xl font-semibold text-[#001212e2]">
            Update Student
          </h2>
          <input
            placeholder="Student ID"
            value={updateStudent.studentId}
            onChange={(e) =>
              setUpdateStudent({
                ...updateStudent,
                studentId: Number(e.target.value),
              })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <input
            placeholder="Name"
            value={updateStudent.studentName}
            onChange={(e) =>
              setUpdateStudent({
                ...updateStudent,
                studentName: e.target.value,
              })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <input
            placeholder="Course"
            value={updateStudent.courseName}
            onChange={(e) =>
              setUpdateStudent({ ...updateStudent, courseName: e.target.value })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            className="bg-[#005050] text-white px-4 py-2 rounded hover:bg-[#003a3a]"
          >
            Update Student
          </button>
          {updateStudentError && (
            <p className="text-[#ffa49c]">{updateStudentErrorMessage}</p>
          )}
        </form>

        {/* Display  Students */}
        <div>
          {students.map((student) => (
            <div
              key={student.studentId}
              className="flex items-center justify-between bg-[#FAF9F6] shadow-lg rounded-lg p-2 mb-2 hover:bg-[#487d7d]"
            >
              <CardComponent card={student} />
              <button
                onClick={() => deleteStudent(student.studentId)}
                className="bg-[#F88379] text-white px-4 py-2 rounded hover:bg-[#ffa49c] hover:border-4 hover:border-[#E26F66]"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
