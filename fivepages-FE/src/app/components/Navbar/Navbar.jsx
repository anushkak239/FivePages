"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "register") {
      router.push("/login");
    }

    if (selectedValue === "profile") {
      router.push("/profile");
    }
  };

  return (
    <nav className="flex items-center justify-between lg:px-31 px-10 bg-white shadow-md mb-2">
      {/* Logo */}
      <div className="">
        {/* <p className="text-3xl font-bold">FivePages</p> */}
        <img
          src="/fivepagelogo.png"
          alt="Logo"
          className="w-36 h-auto"
        />
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-4 list-none ">
        <li>
          <Link href="/" className="text-black font-medium hover:text-blue-700">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/popularbooks"
            className="text-black font-medium hover:text-blue-700"
          >
            Popular
          </Link>
        </li>
        <li>
          <Link
            href="/new-releases-page"
            className="text-black font-medium hover:text-blue-700"
          >
            New Release
          </Link>
        </li>
        <li>
          <Link
            href="/allnovels"
            className="text-black font-medium hover:text-blue-700"
          >
            Novels
          </Link>
        </li>
      </ul>

      {/* Right Section */}
      <div className="flex items-center lg:gap-8 gap-4 ">
        {/* Search Box */}
        <div className="flex items-center border border-gray-400 rounded-md px-3 py-[0.32rem]">
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm text-gray-700 px-2 w-[8rem]"
          />
          <FaSearch className="text-blue-700" />
        </div>

        {/* Profile Icon */}
        <div className="flex ">
          <FaUserCircle className="text-2xl text-black cursor-pointer hover:text-700 transition s" />
          <select
            name="Profile"
            id="profile-dropdown"
            className="focus:outline-none "
            onChange={handleSelectChange}
          >
            <option value="profile" className="bg-white">
              Profile
            </option>
            <option value="register" className="bg-white">
              Register
            </option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
