// AdminChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { CreateMessage, GetMessagesByUserId } from "../../../services/SupportMessageService";

const AdminChatPage = () => {
    const { userId, userName } = useParams();

    // Danh sách tin nhắn với timestamp là đối tượng Date
    const [messages, setMessages] = useState([
        {
            id: -1,
            senderName: "user01",
            isFromAdmin: false,
            message: "Chào admin, tôi cần hỗ trợ về đơn hàng.",
            sentAt: new Date(new Date().setHours(new Date().getHours() - 2)), // 2 giờ trước
        },
        {
            id: -2,
            senderName: "admin01",
            isFromAdmin: true,
            message: "Chào bạn, tôi đây. Cho tôi biết thêm chi tiết nhé.",
            sentAt: new Date(),
        },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const FetchData = async () => {
            const res = await GetMessagesByUserId(userId);
            if (res?.status === 200 && res?.data) {
                setMessages(res?.data);
            } else {
                alert("Lỗi khi tải tin nhắn");
            }
        };

        FetchData();
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
                receiverId: userId,
                message: newMessage,
                isFromAdmin: true,
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
                setNewMessage("");
                // scrollToBottom();
            } else {
                alert("Không thể gửi tin nhắn, xin vui lòng thử lại.");
            }
        }
    };


    // Giả sử tên người dùng và trạng thái có thể được lấy từ API hoặc truyền vào dưới dạng props
    const userStatus = "Online";

    const handleBack = () => {
        // console.log("Quay lại trang danh sách chat");
        // Ví dụ: sử dụng react-router-dom: navigate(-1);
        navigate("/admin/chats");
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
                            alignItems: msg.isFromAdmin ? "flex-end" : "flex-start",
                            mb: 1,
                        }}
                    >
                        {/* Hiển thị dòng header gồm tên người gửi và thời gian */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                maxWidth: "75%",
                                mb: 0.5,
                            }}
                        >
                            <Typography variant="subtitle2">
                                <strong>{msg.senderName}</strong>
                            </Typography>
                            <Typography variant="caption" sx={{ color: "gray" }}>
                                - {formatTimestamp(msg.sentAt)}
                            </Typography>
                        </Box>

                        {/* Nội dung tin nhắn */}
                        <Box
                            sx={{
                                backgroundColor: msg.isFromAdmin ? "#1976d2" : "#e0e0e0",
                                color: msg.isFromAdmin ? "#fff" : "#000",
                                p: 1.5,
                                borderRadius: 2,
                                maxWidth: "75%",
                                wordWrap: "break-word",
                            }}
                        >
                            {msg.message}
                        </Box>
                    </Box>
                ))}

                <div ref={messagesEndRef} />
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
