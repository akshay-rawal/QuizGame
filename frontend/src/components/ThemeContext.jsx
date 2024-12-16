import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
    };

    // Apply Tailwind classes to the body based on the theme
    useEffect(() => {
        const body = document.body;
        if (isDark) {
            body.classList.add("bg-gray-800", "text-white"); // Dark mode classes
           
        } else {
            body.classList.add("bg-white", "text-black"); // Light mode classes
          
        }
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
