import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXsDevices = useMediaQuery("(max-width:466px)");

    return (
        <Box
            display="flex"
            alignItems="center"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
            sx={{
                display: "flex",
                width: {xs: 350, md: 400, xl: 550},
                flex: 1
            }}
        >
            <InputBase
                placeholder="Tìm kiếm"
                sx={{ ml: 2, flex: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }} onClick={() => onSearch(searchTerm)}>
                <SearchOutlined />
            </IconButton>
        </Box>
    );
};

export default SearchBar;