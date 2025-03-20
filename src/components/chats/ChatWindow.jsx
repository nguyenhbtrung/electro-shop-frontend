// ChatWindow.jsx
import React, { useState } from "react";
import {
    Box,
    IconButton,
    Paper,
    Typography,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { formatTimestamp } from "../../utils/formatDatetime";

const ChatWindow = ({ onClose }) => {
    // Khởi tạo danh sách tin nhắn với timestamp là đối tượng Date
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "user",
            text: "Chào admin, tôi cần giúp đỡ về đơn hàng!",
            timestamp: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 giờ trước
        },
        {
            id: 2,
            sender: "admin",
            text: "Chào bạn, admin đây. Tôi đã thấy yêu cầu của bạn.",
            timestamp: new Date(), // thời điểm hiện tại
        },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (newMessage.trim() !== "") {
            const message = {
                id: messages.length + 1,
                sender: "user",
                text: newMessage,
                timestamp: new Date(),
            };
            setMessages([...messages, message]);
            setNewMessage("");
        }
    };

    return (
        <Paper
            elevation={4}
            sx={{
                position: "fixed",
                bottom: 80,
                right: 20,
                width: 350,
                maxHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                zIndex: 1300,
            }}
        >
            {/* Header của cửa sổ chat */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 1,
                    borderBottom: "1px solid #ccc",
                }}
            >
                <Typography variant="h6">Chat</Typography>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Danh sách tin nhắn */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 1,
                    backgroundColor: "#f9f9f9",
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                            mb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                                color: msg.sender === "user" ? "#fff" : "#000",
                                padding: 1.5,
                                borderRadius: 2,
                                maxWidth: "80%",
                            }}
                        >
                            {msg.text}
                        </Box>
                        <Typography variant="caption" sx={{ mt: 0.25, color: "gray" }}>
                            {formatTimestamp(msg.timestamp)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Phần nhập tin nhắn */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    borderTop: "1px solid #ccc",
                }}
            >
                <TextField
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    fullWidth
                    placeholder="Nhập tin nhắn..."
                    size="small"
                    variant="outlined"
                />
                <IconButton color="primary" onClick={handleSend}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default ChatWindow;
