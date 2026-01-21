import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;

        const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");
        setSocket(newSocket);

        newSocket.emit("join", user._id);

        newSocket.on("notification", (data) => {
            setNotifications((prev) => [data, ...prev]);
            // Play sound
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(e => console.log("Sound error:", e));
        });

        return () => newSocket.close();
    }, [user]);

    const clearNotifications = () => setNotifications([]);

    return (
        <NotificationContext.Provider value={{ socket, notifications, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
