// // client/src/components/Navbar.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { ThemeContext } from "../context/ThemeContext";
// import useAuth from "../hooks/useAuth";
// import { useContext, useEffect, useState } from "react";
// import LogoutButton from "./LogoutButton";

// export default function Navbar() {
//   const { user, toHome, setToHome }  = useAuth();
//   const navigate = useNavigate();
//   const { dark, setDark } = useContext(ThemeContext);

//   useEffect(() => {
//     if (toHome) navigate("/login");
//     setToHome(false);
//   }, [toHome]);

//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
//     <Link to="/" className="text-xl font-bold hover:text-blue-300">
//         MERN Blog
//     </Link>

//     <div className="flex items-center space-x-6">
//       <button
//         onClick={() => setDark(!dark)}
//         className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
//       >
//         {dark ? "Light" : "Dark"} Mode
//       </button>
//       <Link className="hover:text-blue-300" to="/">Home</Link>
//       <Link className="hover:text-blue-300" to="/create">Create Post</Link>
//       {user && <Link to="/categories">Categories</Link>}

//       {!user && (
//         <>
//           <Link className="hover:text-blue-300" to="/login">Login</Link>
//           <Link className="hover:text-blue-300" to="/register">Register</Link>
//         </>
//       )}

//       {user && (
//         <LogoutButton />
//       )}
//     </div>
//     </nav>
//   );
// }

import { Link, useNavigate } from "react-router-dom"; 
import { ThemeContext } from "../context/ThemeContext";
import useAuth from "../hooks/useAuth";
import { useContext, useEffect } from "react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { user, toHome, setToHome } = useAuth();
  const navigate = useNavigate();
  const { dark, setDark } = useContext(ThemeContext);

  useEffect(() => {
    if (toHome) navigate("/login");
    setToHome(false);
  }, [toHome]);

  return (
    <nav className="bg-blue-500 max-w-[98vw] mx-auto text-white px-6 py-6 flex justify-center items-center shadow">
      <div className="flex flex-col items-center gap-5">

        <Link to="/" className="text-4xl font-bold hover:text-blue-300">
          MediReach
        </Link>

        <div className="flex items-center flex-wrap gap-6 font-semibold justify-center">

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDark(!dark)}
            className="px-2 py-1 hover:text-blue-300 hidden sm:block"
          >
            {dark ? "Light" : "Dark"} Mode
          </button>

          {/* PUBLIC NAV */}
          <Link className="hover:text-blue-300 hover:underline" to="/">Home</Link>
          <Link className="hover:text-blue-300 hover:underline" to="/doctor/directory">Doctors</Link>
          <Link className="hover:text-blue-300 hover:underline" to="/posts">Blog</Link>

          {/* PATIENT MENU */}
          {user?.role === "patient" && (
            <Link to="/me/appointments" className="hover:text-blue-300 hover:underline">
              My Appointments
            </Link>
          )}

          {/* DOCTOR MENU */}
          {user?.role === "doctor" && (
            <>
              <Link className="hover:text-blue-300 hover:underline" to="/doctor/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-blue-300 hover:underline" to="/posts/create">
                Write Post
              </Link>
            </>
          )}

          {/* ADMIN MENU */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-blue-300 hover:underline">
                Admin
              </Link>
              <Link to="/admin/specialties" className="hover:text-blue-300 hover:underline">
                Specialties
              </Link>
              <Link to="/posts/create" className="hover:text-blue-300 hover:underline">
                Create Post
              </Link>
            </>
          )}

          {/* AUTH */}
          {!user && (
            <>
              <Link className="hover:text-blue-300" to="/login">Login</Link>
              <Link className="hover:text-blue-300" to="/register">Register</Link>
            </>
          )}

          {user && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
}

