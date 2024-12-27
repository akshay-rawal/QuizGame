import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utills/axios";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("isDark");
        const userId = localStorage.getItem("userId");

        if (savedTheme !== null) {
            setIsDark(JSON.parse(savedTheme));
        } else if (userId) {
            axiosInstance
                .get(`/theme/${userId}`)
                .then((response) => {
                    const theme = response.data.isDark;
                    setIsDark(theme);
                })
                .catch((error) => {
                    console.error("Error fetching theme preference:", error);
                });
        }
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const body = document.body;

        if (isDark) {
            body.classList.add("bg-gray-800", "text-white");
            body.classList.remove("bg-white", "text-black");
        } else {
            body.classList.add("bg-white", "text-black");
            body.classList.remove("bg-gray-800", "text-white");
        }

        localStorage.setItem("isDark", JSON.stringify(isDark));

        if (userId) {
            const payload = { userId, isDark };
            console.log("Sending theme update payload:", payload);

            axiosInstance
                .post(
                    "/theme",
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                .then(() => console.log("Theme preference updated successfully."))
                .catch((error) => {
                    if (error.response?.status === 400) {
                        console.error("Invalid request: Check the payload or authorization token.");
                    } else {
                        console.error("Error saving theme preference:", error);
                    }
                });
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
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
