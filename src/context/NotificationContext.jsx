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

        const userId = user._id || user.id;
        if (!userId) return;

        const socketUrl = import.meta.env.VITE_API_URL
            ? new URL(import.meta.env.VITE_API_URL).origin
            : "http://127.0.0.1:5000";

        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.emit("join", userId);

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
