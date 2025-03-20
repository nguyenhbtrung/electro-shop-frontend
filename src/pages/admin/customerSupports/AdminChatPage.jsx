// AdminChatPage.jsx
import React, { useState } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Paper,
    TextField,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { formatTimestamp } from "../../../utils/formatDatetime";

const AdminChatPage = () => {
    // Danh sách tin nhắn với timestamp là đối tượng Date
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "user",
            text: "Chào admin, tôi cần hỗ trợ về đơn hàng.",
            timestamp: new Date(new Date().setHours(new Date().getHours() - 2)), // 2 giờ trước
        },
        {
            id: 2,
            sender: "admin",
            text: "Chào bạn, tôi đây. Cho tôi biết thêm chi tiết nhé.",
            timestamp: new Date(),
        },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (newMessage.trim() !== "") {
            const message = {
                id: messages.length + 1,
                sender: "admin",
                text: newMessage,
                timestamp: new Date(),
            };
            setMessages([...messages, message]);
            setNewMessage("");
        }
    };

    // Giả sử tên người dùng và trạng thái có thể được lấy từ API hoặc truyền vào dưới dạng props
    const userName = "Người dùng A";
    const userStatus = "Online";

    const handleBack = () => {
        console.log("Quay lại trang danh sách chat");
        // Ví dụ: sử dụng react-router-dom: navigate(-1);
    };

    const handleEndChat = () => {
        console.log("Kết thúc cuộc chat");
        // Xử lý kết thúc cuộc chat (gọi API, thay đổi trạng thái,...)
    };

    return (
        <Box sx={{ height: "87vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography variant="h6">{userName}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {userStatus}
                        </Typography>
                    </Box>
                    <IconButton color="inherit" onClick={handleEndChat}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Nội dung Chat */}
            <Paper
                square
                elevation={0}
                sx={{
                    flex: 1,
                    p: 2,
                    backgroundColor: "#f7f7f7",
                    overflowY: "auto",
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.sender === "admin" ? "flex-end" : "flex-start",
                            mb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: msg.sender === "admin" ? "#1976d2" : "#e0e0e0",
                                color: msg.sender === "admin" ? "#fff" : "#000",
                                p: 1.5,
                                borderRadius: 2,
                                maxWidth: "75%",
                                wordWrap: "break-word",
                            }}
                        >
                            {msg.text}
                        </Box>
                        <Typography variant="caption" sx={{ mt: 0.25, color: "gray" }}>
                            {formatTimestamp(msg.timestamp)}
                        </Typography>
                    </Box>
                ))}
            </Paper>

            {/* Footer: Phần nhập tin nhắn */}
            <Box
                sx={{
                    p: 2,
                    borderTop: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <TextField
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    fullWidth
                    placeholder="Nhập tin nhắn..."
                    variant="outlined"
                    size="small"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    sx={{ ml: 1 }}
                >
                    <SendIcon />
                </Button>
            </Box>
        </Box>
    );
};

export default AdminChatPage;
