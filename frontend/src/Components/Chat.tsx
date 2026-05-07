import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "./Chat.css";

const Chat = () => {

    const [message, setMessage] = useState("");
    const [announcement, setAnnouncement] = useState("");

    const [messages, setMessages] = useState<
        { user: string; message: string }[]
    >([]);

    const [announcements, setAnnouncements] = useState<
        { user: string; message: string }[]
    >([]);

    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("user");

    const [connection, setConnection] =
        useState<signalR.HubConnection | null>(null);

    const [isConnected, setIsConnected] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        let conn: signalR.HubConnection;

        const initConnection = async () => {

            try {

                const storedUsername =
                    sessionStorage.getItem("username");

                const storedRole =
                    sessionStorage.getItem("role") ?? "user";

                if (!storedUsername) {
                    setError("Username not found");
                    return;
                }

                setUsername(storedUsername);
                setRole(storedRole);

                conn = new signalR.HubConnectionBuilder()
                    .withUrl(`/chatHub?username=${storedUsername}`)
                    .withAutomaticReconnect()
                    .build();

                conn.on("ReceiveMessage",
                    (user: string, message: string) => {

                        setMessages((prev) => {

                            const updated = [
                                ...prev,
                                { user, message }
                            ];

                            return updated.slice(-50);
                        });
                    });

                conn.on("ReceiveAnnouncement",
                    (user: string, message: string) => {

                        setAnnouncements((prev) => {

                            const updated = [
                                ...prev,
                                { user, message }
                            ];

                            return updated.slice(-20);
                        });
                    });

                conn.on("ReceiveUserRole",
                    (serverRole: string) => {

                        setRole(serverRole);
                    });

                await conn.start();

                await conn.invoke(
                    "Join",
                    storedUsername,
                    storedRole
                );

                setConnection(conn);
                setIsConnected(true);

            } catch (err) {

                console.error(err);
                setError("Failed to connect");
            }
        };

        initConnection();

        return () => {

            if (!conn) return;

            conn.off("ReceiveMessage");
            conn.off("ReceiveAnnouncement");
            conn.off("ReceiveUserRole");

            conn.stop();
        };

    }, []);

    const sendMessage = async () => {

        if (!message.trim() || !connection) return;

        try {

            await connection.invoke(
                "SendMessage",
                username,
                message
            );

            setMessage("");

        } catch (err) {

            console.error(err);
        }
    };

    const sendAnnouncement = async () => {

        if (!announcement.trim() || !connection)
            return;

        try {

            await connection.invoke(
                "SendAnnouncement",
                announcement
            );

            setAnnouncement("");

        } catch (err) {

            console.error(err);
        }
    };

    return (

        <div className="chat-layout">

             {/*CHAT */}

            <div className="chat-container">

                <h2 className="chat-title">
                    Chat Room
                </h2>

                {error && (
                    <div className="chat-error">
                        {error}
                    </div>
                )}

                {!isConnected && (
                    <div className="chat-status">
                        Connecting...
                    </div>
                )}

                <div className="chat-box">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className="chat-message"
                        >

                            <strong>{msg.user}:</strong>
                            {msg.message}

                        </div>
                    ))}

                </div>

                <div className="chat-input-row">

                    <input
                        className="chat-input"
                        type="text"
                        placeholder="Write message"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        disabled={!isConnected}
                    />

                    <button
                        className="chat-button"
                        onClick={sendMessage}
                        disabled={!isConnected}
                    >
                        Send
                    </button>

                </div>

            </div>

             {/*ANNOUNCEMENTS */}

            <div className="announcement-container">

                <h2 className="chat-title">
                    Announcements
                </h2>

                <div className="chat-box">

                    {announcements.map((msg, index) => (

                        <div
                            key={index}
                            className="chat-message"
                        >

                            <strong>{msg.user}:</strong>
                            {msg.message}

                        </div>
                    ))}

                </div>

                {role === "teacher" && (

                    <div className="chat-input-row">

                        <input
                            className="chat-input"
                            type="text"
                            placeholder="Write announcement"
                            value={announcement}
                            onChange={(e) =>
                                setAnnouncement(e.target.value)
                            }
                        />

                        <button
                            className="chat-button"
                            onClick={sendAnnouncement}
                        >
                            Post
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};

export default Chat;