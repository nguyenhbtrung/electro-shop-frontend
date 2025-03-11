import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("access_token", token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
