// SearchPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";

const SearchPage = () => {
  const location = useLocation();
  const { results = [], keyword = "" } = location.state || {};
  const [sortOption, setSortOption] = useState("");

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedResults = [...results];
  if (sortOption === "priceAsc") {
    sortedResults.sort((a, b) => a.discountedPrice - b.discountedPrice);
  } else if (sortOption === "priceDesc") {
    sortedResults.sort((a, b) => b.discountedPrice - a.discountedPrice);
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,     // Giới hạn chiều rộng
        margin: "0 auto",   // Căn giữa nội dung
        p: 2,               // Padding
      }}
    >
      {/* Tiêu đề */}
      <Typography variant="h5" align="left" sx={{ mb: 2 }}>
        Tìm kiếm
      </Typography>
      <Typography align="left" sx={{ mb: 2 }}>
        Có {sortedResults.length} kết quả
      </Typography>

      {/* Combo box sắp xếp */}
      <Box sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortOption}
            label="Sắp xếp theo"
            onChange={handleSortChange}
          >
            <MenuItem value="">Mặc định</MenuItem>
            <MenuItem value="priceAsc">Giá thấp đến cao</MenuItem>
            <MenuItem value="priceDesc">Giá cao đến thấp</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Hiển thị danh sách sản phẩm (5 sản phẩm 1 hàng) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
        }}
      >
        {sortedResults.length > 0 ? (
          sortedResults.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        ) : (
          <Typography>Không tìm thấy sản phẩm nào</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
