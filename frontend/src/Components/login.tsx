import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("student");
    const navigate = useNavigate();

    // function to store username and role in session and navigate to chat page
    const joinChat = () => {

        if (!username.trim()) return;

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("role", role);

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

                {/*dropdown for role selection*/}
                <select
                    className="login-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                <button className="login-button" onClick={joinChat}>
                    Join Room
                </button>

            </div>

        </div>
    );
};

export default Login;