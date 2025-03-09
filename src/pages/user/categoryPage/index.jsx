// pages/user/CategoryPage.js
import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";

const CategoryPage = () => {
    const { categoryId } = useParams();

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Danh mục: {categoryId}
            </Typography>
            {/* Render thêm nội dung, sản phẩm hoặc thông tin cho danh mục */}
        </Box>
    );
};

export default CategoryPage;
