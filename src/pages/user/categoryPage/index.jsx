import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ProductCard from "../../../components/products/ProductCard";
import { GetProductByCategoryId } from "../../../services/categoryService";
import { useParams } from "react-router-dom";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const res = await GetProductByCategoryId(categoryId);
        if (res?.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Error fetching products by category id:", error);
      }
    };

    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Sản phẩm của danh mục
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryProductsPage;
