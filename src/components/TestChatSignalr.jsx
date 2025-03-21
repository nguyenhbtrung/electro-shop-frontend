import React, { useState, useEffect } from "react";
import signalRService from "../services/signalRService";

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [user] = useState("User" + Math.floor(Math.random() * 1000)); // Ví dụ người dùng ngẫu nhiên
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Mở kết nối khi component được mount
        signalRService.startConnection();

        // Lắng nghe sự kiện "ReceiveMessage"
        signalRService.connection.on("ReceiveMessage", (sender, msg) => {
            setMessages((prevMessages) => [...prevMessages, { sender, msg }]);
        });

        // Dọn dẹp listener khi component unmount
        return () => {
            signalRService.connection.off("ReceiveMessage");
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            signalRService.sendMessage(user, message);
            setMessage("");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat Room</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    height: "300px",
                    overflowY: "auto",
                }}
            >
                {messages.map((m, index) => (
                    <div key={index}>
                        <strong>{m.sender}:</strong> {m.msg}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    style={{ width: "70%" }}
                />
                <button onClick={handleSendMessage} style={{ marginLeft: "10px" }}>
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
