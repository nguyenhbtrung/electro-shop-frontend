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
import { GetAllBrand } from "../../services/brandService";

export const ToggledContext = createContext(null);
export const ChatContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  // State riêng cho danh mục và thương hiệu
  const [categoryTree, setCategoryTree] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const [openChat, setOpenChat] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    // Lấy danh mục
    const fetchCategoryTree = async () => {
      const res = await GetCategoryTree();
      if (res?.status === 200 && res?.data) {
        setCategoryTree(res.data);
      }
    };
    // Lấy thương hiệu
    const fetchBrands = async () => {
      const res = await GetAllBrand();
      if (res?.status === 200 && res?.data) {
        setBrandList(res.data);
      }
    };
    fetchCategoryTree();
    fetchBrands();
  }, []);

  useEffect(() => {
    // Mở kết nối khi component được mount
    signalRService.startConnection();

    // Lắng nghe sự kiện "ReceiveAdminMessage"
    signalRService.connection.on("ReceiveAdminMessage", (message) => {
      if (!openChat) {
        setHasNewMessage(true);
      }
    });

    // Dọn dẹp listener khi component unmount
    return () => {
      signalRService.connection.off("ReceiveAdminMessage");
    };
  }, [openChat]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <ChatContext.Provider value={{ setOpenChat, setHasNewMessage }}>
            <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
              <SideBar categories={categoryTree} brands={brandList} />
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
                hasNotification={hasNewMessage && !openChat}
                onClick={() => {
                  if (!openChat) {
                    setHasNewMessage(false);
                  }
                  setOpenChat(!openChat);
                }}
              />
            )}
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
