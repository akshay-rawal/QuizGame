import React, { useState } from "react";
import { useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  //apply the correct class to the body based on isDark value

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div
      className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="mb-4 text-2xl">
          Current Theme: {isDark ? "Dark" : "Light"}
        </p>
        <button
          onClick={toggleTheme}
          className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
