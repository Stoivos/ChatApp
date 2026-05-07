import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    // Redirect user to chat page after entering username
    const joinChat = async () => {

        if (!username.trim()) return;

        // Store username in session storage and navigate to chat
        sessionStorage.setItem("username", username);
        navigate("/chat");
    };

    return (

        <div>

            <h2>Join Chat</h2>

            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={joinChat}>
                Join Room
            </button>

        </div>
    );
};

export default Login;