import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utills/axios";
import { useSelector } from "react-redux";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("isDark");
        const token = localStorage.getItem("token"); // Check for token
        return token && savedTheme !== null ? JSON.parse(savedTheme) : false;
    });
    

    const { user, token } = useSelector((state) => state.user); // Access user and token from Redux

    // Fetch theme from the server if the user is logged in
    useEffect(() => {
        if (!token || !user?.userId) {
            console.warn("User not logged in, skipping theme fetch");
            return; // Skip theme fetch if user is not logged in
        }

        const userId = user.userId;

        // Fetch the theme from the server when logged in
        axiosInstance
            .get(`/theme/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const theme = response.data.isDark;
                setIsDark(theme); // Update the theme state

                // Sync with localStorage to prevent conflicts
                localStorage.setItem("isDark", JSON.stringify(theme));
            })
            .catch((error) => {
                console.error("Error fetching theme preference:", error);
            });
    }, [user, token]);

    // Update the theme on the DOM and server
    useEffect(() => {
        if (!token || !user?.userId) {
            console.warn("User not logged in, skipping theme update.");
            return; // Prevent theme update if user isn't logged in
        }
    
        const userId = user.userId;
        const body = document.body;
    
        // Apply the theme to the DOM
        if (isDark) {
            body.classList.add("bg-gray-800", "text-white");
            body.classList.remove("bg-white", "text-black");
        } else {
            body.classList.add("bg-white", "text-black");
            body.classList.remove("bg-gray-800", "text-white");
        }
    
        // Save theme preference to localStorage
        localStorage.setItem("isDark", JSON.stringify(isDark));
    
        // Update the server with the current theme
        const payload = { userId, isDark };
        axiosInstance
            .post("/theme", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => console.log("Theme preference updated successfully."))
            .catch((error) => {
                console.error("Error saving theme preference:", error);
            });
    }, [isDark, token, user]);
    

    // Toggle theme function
    const toggleTheme = () => {
        setIsDark((prev) => !prev); // Toggle the theme
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeProvider;
