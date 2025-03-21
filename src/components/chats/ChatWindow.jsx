import React, { useState, useRef, useEffect } from "react";
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
import { CreateMessage, GetUserMessages } from "../../services/SupportMessageService";

const ChatWindow = ({ onClose, signalRService }) => {
    // Khởi tạo danh sách tin nhắn với timestamp là đối tượng Date
    const [messages, setMessages] = useState([
        {
            id: -1,
            isFromAdmin: true,
            message: "Chào bạn! Tôi có thể giúp gì cho bạn.",
            sentAt: new Date(), // thời điểm hiện tại
        },
    ]);
    const [newMessage, setNewMessage] = useState("");

    // Tạo một ref để nhắm đến phần cuối danh sách tin nhắn
    const messagesEndRef = useRef(null);

    let id = -2;

    useEffect(() => {
        const FetchData = async () => {
            const res = await GetUserMessages();
            if (res?.status === 200 && res?.data) {
                setMessages(res?.data);
            } else {
                alert("Lỗi khi tải tin nhắn");
            }
        };

        FetchData();
    }, []);

    useEffect(() => {
        // signalRService.startConnection();

        signalRService.connection.on("ReceiveAdminMessage", (message) => {
            setMessages((prev) => [...prev, {
                id: id--,
                isFromAdmin: true,
                message: message,
                sentAt: new Date()
            }]);
        });

        // Dọn dẹp listener khi component unmount
        return () => {
            signalRService.connection.off("ReceiveAdminMessage");
        };
    }, []);

    // Hàm cuộn xuống cuối danh sách tin nhắn
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Mỗi khi 'messages' thay đổi, tự động cuộn xuống cuối
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim() !== "") {
            const data = {
                message: newMessage,
                isFromAdmin: false,
            };
            const res = await CreateMessage(data);
            if (res?.status === 200 && res?.data) {
                const message = {
                    id: res.data.id,
                    isFromAdmin: res.data.isFromAdmin,
                    message: res.data.message,
                    sentAt: new Date(res.data.sentAt),
                };
                setMessages([...messages, message]);
                signalRService.sendUserMessage(res.data?.message);
                setNewMessage("");
                // scrollToBottom();
            } else {
                alert("Không thể gửi tin nhắn, xin vui lòng thử lại.");
            }
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
                            alignItems: !msg.isFromAdmin ? "flex-end" : "flex-start",
                            mb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: !msg.isFromAdmin ? "#1976d2" : "#e0e0e0",
                                color: !msg.isFromAdmin ? "#fff" : "#000",
                                padding: 1.5,
                                borderRadius: 2,
                                maxWidth: "80%",
                            }}
                        >
                            {msg.message}
                        </Box>
                        <Typography variant="caption" sx={{ mt: 0.25, color: "gray" }}>
                            {formatTimestamp(msg.sentAt)}
                        </Typography>
                    </Box>
                ))}
                {/* Thẻ này dùng để cuộn cuối */}
                <div ref={messagesEndRef} />
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
