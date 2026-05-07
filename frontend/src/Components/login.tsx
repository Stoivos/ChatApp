import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

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
        <div className="login-container">

            <div className="login-box">

                <h2 className="login-title">Join Chat</h2>

                <input
                    className="login-input"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <button className="login-button" onClick={joinChat}>
                    Join Room
                </button>

            </div>

        </div>
    );
};

export default Login;