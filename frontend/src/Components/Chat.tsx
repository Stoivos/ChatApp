import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Chat = () => {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<
        { user: string; message: string }[]
    >([]);
    const [username, setUsername] = useState<string>("");
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initConnection = async () => {
            try {
                // Get username from session storage 
                const storedUsername = sessionStorage.getItem("username");
                if (!storedUsername) {
                    setError("Username not found. Please login first.");
                    return;
                }
                setUsername(storedUsername);

                // Create SignalR connection
                const newConnection = new signalR.HubConnectionBuilder()
                    .withUrl(`/chatHub?Username=${storedUsername}`)
                    .withAutomaticReconnect()
                    .build();

                newConnection.on("ReceiveMessage", (user: string, message: string) => {
                    setMessages((prev) => [
                        ...prev,
                        { user, message }
                    ]);
                });

                // Handle username received from server
                newConnection.on("ReceiveUsername", (serverUsername: string) => {
                    setUsername(serverUsername);
                });

                await newConnection.start();
                setConnection(newConnection);
                setIsConnected(true);
            } catch (err) {
                setError("Failed to connect to chat server");
                console.error("Connection error:", err);
            }
        };

        initConnection();

        return () => {

            if (!connection) return;

            connection.off("ReceiveMessage");
            connection.off("ReceiveUsername");
        };

    }, []);

    const sendMessage = async () => {

        if (!message.trim() || !connection) return;

        try {

            await connection.invoke("SendMessage", username, message);

            setMessage("");

        } catch (err) {

            console.error(err);
            setError("Failed to send message");
        }
    };

    return (

        <div>

            <h2>Chat Room</h2>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {!isConnected && <div>Connecting...</div>}

            <div>

                {messages.map((msg, index) => (

                    <div key={index}>

                        <strong>{msg.user}:</strong> {msg.message}

                    </div>
                ))}

            </div>

            <input
                type="text"
                placeholder="Write message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!isConnected}
            />

            <button onClick={sendMessage} disabled={!isConnected}>
                Send
            </button>

        </div>
    );
};

export default Chat;