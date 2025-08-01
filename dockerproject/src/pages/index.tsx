import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../components/Card";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ id: 0, name: "", email: "" });
  const [updateUser, setUpdateUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
  });
  const [createUserError, setCreateUserError] = useState<boolean>(false);
  const [createUserErrorMessage, setCreateUserErrorMessage] =
    useState<string>("");
  const [updateUserError, setUpdateUserError] = useState<boolean>(false);
  const [updateUserErrorMessage, setUpdateUserErrorMessage] =
    useState<string>("");

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data.reverse()); // Shows the newest user first
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // create user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateUserError(false);
    setCreateUserErrorMessage("");
    if (!newUser.name || !newUser.email) {
      setCreateUserError(true);
      setCreateUserErrorMessage("Name and Email are required.");
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/users`, newUser);
      setUsers([response.data, ...users]); // Add new user to the front of the list
      setNewUser({ id: 0, name: "", email: "" }); // Reset form
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          console.error("Conflict: User already exists.");
          setCreateUserError(true);
          setCreateUserErrorMessage("User already exists.");
        }
      }
      console.error("Error creating user:", error);
    }
  };

  // update user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateUserError(false);
    setUpdateUserErrorMessage("");
    if (!updateUser.id || !updateUser.name || !updateUser.email) {
      setUpdateUserError(true);
      setUpdateUserErrorMessage("ID, Name, and Email are required.");
      return;
    }
    try {
      await axios.put(`${apiUrl}/users/${updateUser.id}`, {
        name: updateUser.name,
        email: updateUser.email,
      });
      setUsers(
        users.map((user) => (user.id === updateUser.id ? updateUser : user))
      ); // Update the user in the list
      setUpdateUser({ id: 0, name: "", email: "" }); // Reset form
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // delete user
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Remove the deleted user from the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-4 bg-[#FAF9F6]">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-[#001212e2] text-center">
          User Manager
        </h1>
        {/* Create User Form */}
        <form
          onSubmit={createUser}
          className="flex flex-col space-y-4 bg-[#FAF9F6] p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#001212e2]">
            Create User
          </h2>
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            className="bg-[#005050] text-white px-4 py-2 rounded hover:bg-[#003a3a]"
          >
            Create User
          </button>
          {createUserError && (
            <p className="text-[#ffa49c]">{createUserErrorMessage}</p>
          )}
        </form>

        {/* Update User Form */}
        <form
          className="flex flex-col space-y-4 bg-[#FAF9F6] p-4 rounded-lg shadow-md"
          onSubmit={handleUpdateUser}
        >
          <h2 className="text-xl font-semibold text-[#001212e2]">
            Update User
          </h2>
          <input
            placeholder="User ID"
            value={updateUser.id}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, id: Number(e.target.value) })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <input
            placeholder="Name"
            value={updateUser.name}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, name: e.target.value })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <input
            placeholder="Email"
            value={updateUser.email}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, email: e.target.value })
            }
            className="mb-2 w-full border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            className="bg-[#005050] text-white px-4 py-2 rounded hover:bg-[#003a3a]"
          >
            Update User
          </button>
          {updateUserError && (
            <p className="text-[#ffa49c]">{updateUserErrorMessage}</p>
          )}
        </form>

        {/* Display  Users */}
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-[#FAF9F6] shadow-lg rounded-lg p-2 mb-2 hover:bg-[#487d7d]"
            >
              <CardComponent card={user} />
              <button
                onClick={() => deleteUser(user.id)}
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
