import React, { createContext, useEffect, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";

import { Outlet } from "react-router-dom";
import { ColorModeContext, useMode } from "../../theme";
import Navbar from "./layout/navbar";
import SideBar from "./layout/sidebar";
import { GetCategoryTree } from "../../services/categoryService";

export const ToggledContext = createContext(null);

function App() {
    const [theme, colorMode] = useMode();
    const [toggled, setToggled] = useState(false);
    const values = { toggled, setToggled };
    const [categoryTree, setCategoryTree] = useState([]);

    useEffect(() => {
        const GetTree = async () => {
            const res = await GetCategoryTree();
            if (res?.status === 200 && res?.data) {
                setCategoryTree(res?.data);
            }
        };
        GetTree();
    }, []);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ToggledContext.Provider value={values}>
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
                </ToggledContext.Provider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
