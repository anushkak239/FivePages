"use client";

import { useState, useEffect } from "react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const defaultUser = {
    name: "Guest User",
    email: "guest@example.com",
    profilePic: "/default-avatar.png",
  };

  const getToken = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.token;
    } catch (err) {
      console.error("Error parsing user from localStorage", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No token found in localStorage");

        setToken(token);
        const response = await fetch("http://localhost:5000/api/v1/user/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        console.log("Fetched user data:", data);

        setUser(data);
        setNewName(data.name);
        setNewEmail(data.email);
      } catch (error) {
        console.warn("Error fetching user data, using default values:", error);
        setUser(defaultUser);
        setNewName(defaultUser.name);
        setNewEmail(defaultUser.email);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");

    if (!newName.trim() || !newEmail.trim()) {
      return setError("Name and email cannot be empty.");
    }

    setUpdatingProfile(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token not found");

      const response = await fetch("http://localhost:5000/api/v1/user/updateProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
        }),
      });

      const data = await response.json();
      console.log("Update profile response:", data);

      if (response.ok) {
        setUser((prev) => ({
          ...prev,
          name: newName,
          email: newEmail,
        }));
        setSuccess("Profile updated successfully!");
      } else {
        setError(data.message || "Error updating profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Something went wrong!");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword.trim() || !newPassword.trim()) {
      return setError("Both old and new passwords are required.");
    }

    if (oldPassword === newPassword) {
      return setError("New password must be different from the old password.");
    }

    setChangingPassword(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token not found");

      const response = await fetch("http://localhost:5000/api/v1/user/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      console.log("Change password response:", data);

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(data.message || "Error updating password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Something went wrong!");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4">Loading user...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-[#4A90E2] text-center">
          User Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex justify-center mt-6">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-gray-300 shadow-sm"
          />
        </div>

        {/* Feedback */}
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-4 text-center">{success}</p>}

        {/* Email */}
        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-medium">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={updatingProfile}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
        </div>

        {/* Name */}
        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-medium">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={updatingProfile}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
        </div>

        {/* Password Fields */}
        <div className="mt-4 relative">
          <label className="block text-gray-600 text-sm font-medium">
            Old Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            disabled={changingPassword}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] pr-10"
          />
        </div>

        <div className="mt-4 relative">
          <label className="block text-gray-600 text-sm font-medium">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={changingPassword}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            disabled={changingPassword || updatingProfile}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleUpdateProfile}
            disabled={updatingProfile}
            className={`w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition ${
              updatingProfile && "cursor-not-allowed opacity-70"
            }`}
          >
            {updatingProfile ? "Updating..." : "Update Profile"}
          </button>

          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className={`w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition ${
              changingPassword && "cursor-not-allowed opacity-70"
            }`}
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
