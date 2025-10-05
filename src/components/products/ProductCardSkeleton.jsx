import { Box, Skeleton } from "@mui/material";

const ProductCardSkeleton = () => {
    return (
        <Box
            sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                p: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Ảnh sản phẩm */}
            <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "100%", mb: 1 }} />

            {/* Tên sản phẩm */}
            <Skeleton variant="text" width="90%" height={28} />
            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />

            {/* Đánh giá + giảm giá */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="rectangular" width={40} height={24} />
            </Box>

            {/* Giá */}
            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />

            {/* Nút */}
            <Skeleton variant="rectangular" width="100%" height={36} />
        </Box>
    );
};

export default ProductCardSkeleton;
