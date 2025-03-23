// App.js
import React, { useState, useEffect, createContext, useContext } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ColorModeContext, useMode } from "../../theme";
import Navbar from "./layout/navbar";
import SideBar from "./layout/sidebar";
import { GetCategoryTree } from "../../services/categoryService";
import ChatButton from "../../components/chats/ChatButton";
import ChatWindow from "../../components/chats/ChatWindow";
import signalRService from "../../services/signalR/signalRService";
import { AuthContext } from "../../contexts/AuthContext";

export const ToggledContext = createContext(null);
export const ChatContext = createContext();

function App() {
    const [theme, colorMode] = useMode();
    const [toggled, setToggled] = useState(false);
    const values = { toggled, setToggled };
    const [categoryTree, setCategoryTree] = useState([]);
    const [openChat, setOpenChat] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const GetTree = async () => {
            const res = await GetCategoryTree();
            if (res?.status === 200 && res?.data) {
                setCategoryTree(res?.data);
            }
        };
        GetTree();
    }, []);

    useEffect(() => {
        // Mở kết nối khi component được mount
        signalRService.startConnection();

        // Lắng nghe sự kiện "ReceiveAdminMessage"
        signalRService.connection.on("ReceiveAdminMessage", (message) => {
            // Nếu chat đóng, hiển thị thông báo
            if (!openChat) {
                setHasNewMessage(true);
            }
            // Nếu cần, bạn có thể xử lý thêm nội dung message
        });

        // Dọn dẹp listener khi component unmount
        return () => {
            signalRService.connection.off("ReceiveAdminMessage");
        };
    }, [openChat]); // thêm openChat vào dependency để luôn nhận đúng trạng thái

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ToggledContext.Provider value={values}>
                    <ChatContext.Provider value={{ setOpenChat, setHasNewMessage }}>
                        <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
                            <SideBar categories={categoryTree} />
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    maxWidth: "100%",
                                }}
                            >
                                <Navbar />
                                <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                                    <Outlet />
                                </Box>
                            </Box>
                        </Box>
                        {isLoggedIn && (
                            <ChatButton
                                // Truyền props hasNotification dựa trên sự kết hợp của tin nhắn mới và trạng thái openChat 
                                hasNotification={hasNewMessage && !openChat}
                                onClick={() => {
                                    // Nếu người dùng mở chat, hãy xóa cảnh báo
                                    if (!openChat) {
                                        setHasNewMessage(false);
                                    }
                                    setOpenChat(!openChat);
                                }}
                            />

                        )}
                        {/* Hiển thị chat khi openChat = true */}
                        {openChat && (
                            <ChatWindow
                                onClose={() => {
                                    setOpenChat(false);
                                }}
                                signalRService={signalRService}
                            />
                        )}
                    </ChatContext.Provider>
                </ToggledContext.Provider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
